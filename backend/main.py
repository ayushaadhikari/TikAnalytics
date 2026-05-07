from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
import json
from parsers import build_summary
from auth import (
    init_db, UserCreate, UserLogin, Token, create_user, authenticate_user, 
    create_access_token, get_current_user, save_user_tiktok_data, get_user_tiktok_data
)
from ai_insights import generate_ai_insights

app = FastAPI(title="TikAnalytics API")

# Temporary: Allow all origins for testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Authentication endpoints
@app.post("/register", response_model=dict)
async def register(user: UserCreate):
    created_user = create_user(user)
    if not created_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    return {"message": "User created successfully", "user": created_user}

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/upload")
async def upload_tiktok_json(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    contents = await file.read()
    raw_data = json.loads(contents)
    
    # Process the data
    processed_data = build_summary(raw_data)
    
    # Save to user profile
    save_user_tiktok_data(
        current_user["id"], 
        processed_data["profile"], 
        processed_data["stats"]
    )
    
    # Generate AI insights
    ai_insights = generate_ai_insights(processed_data["profile"], processed_data["stats"])
    
    return {
        **processed_data,
        "ai_insights": ai_insights
    }

@app.get("/my-data")
async def get_my_data(current_user: dict = Depends(get_current_user)):
    user_data = get_user_tiktok_data(current_user["id"])
    if not user_data:
        return {"message": "No data uploaded yet"}
    
    # Generate AI insights for existing data
    ai_insights = generate_ai_insights(user_data["profile"], user_data["stats"])
    
    return {
        **user_data,
        "ai_insights": ai_insights
    }
