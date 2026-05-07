from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from pydantic import BaseModel
import sqlite3
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-for-development-only")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Argon2 configuration
ph = PasswordHasher(
    time_cost=3,        # Number of iterations
    memory_cost=65536,  # 64MB
    parallelism=4,      # Number of parallel threads
    hash_len=32,        # Hash length
    salt_len=16         # Salt length
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Database setup
def init_db():
    conn = sqlite3.connect('tiktok_analytics.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User data table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_tiktok_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            profile_data TEXT NOT NULL,
            stats_data TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Pydantic models
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Utility functions
def verify_password(plain_password, hashed_password):
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except VerifyMismatchError:
        return False

def get_password_hash(password):
    return ph.hash(password)

def get_user_by_email(email: str):
    conn = sqlite3.connect('tiktok_analytics.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {
            "id": user[0],
            "email": user[1], 
            "username": user[2],
            "hashed_password": user[3]
        }
    return None

def create_user(user: UserCreate):
    conn = sqlite3.connect('tiktok_analytics.db')
    cursor = conn.cursor()
    hashed_password = get_password_hash(user.password)
    try:
        cursor.execute(
            "INSERT INTO users (email, username, hashed_password) VALUES (?, ?, ?)",
            (user.email, user.username, hashed_password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"id": user_id, "email": user.email, "username": user.username}
    except sqlite3.IntegrityError:
        conn.close()
        return None

def authenticate_user(email: str, password: str):
    user = get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_email(username)
    if user is None:
        raise credentials_exception
    return user

def save_user_tiktok_data(user_id: int, profile_data: dict, stats_data: dict):
    conn = sqlite3.connect('tiktok_analytics.db')
    cursor = conn.cursor()
    
    # Check if user already has data and update it
    cursor.execute("SELECT id FROM user_tiktok_data WHERE user_id = ?", (user_id,))
    existing = cursor.fetchone()
    
    if existing:
        cursor.execute(
            "UPDATE user_tiktok_data SET profile_data = ?, stats_data = ?, uploaded_at = CURRENT_TIMESTAMP WHERE user_id = ?",
            (json.dumps(profile_data), json.dumps(stats_data), user_id)
        )
    else:
        cursor.execute(
            "INSERT INTO user_tiktok_data (user_id, profile_data, stats_data) VALUES (?, ?, ?)",
            (user_id, json.dumps(profile_data), json.dumps(stats_data))
        )
    
    conn.commit()
    conn.close()

def get_user_tiktok_data(user_id: int):
    conn = sqlite3.connect('tiktok_analytics.db')
    cursor = conn.cursor()
    cursor.execute(
        "SELECT profile_data, stats_data FROM user_tiktok_data WHERE user_id = ? ORDER BY uploaded_at DESC LIMIT 1",
        (user_id,)
    )
    result = cursor.fetchone()
    conn.close()
    
    if result:
        return {
            "profile": json.loads(result[0]),
            "stats": json.loads(result[1])
        }
    return None
