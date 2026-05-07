# TikAnalytics

## Project Description

TikAnalytics is a full-stack web application that allows users to upload and analyze their TikTok data. The application provides insights into TikTok profile statistics, engagement metrics, and AI-powered analysis of user activity. Users can securely register, upload their TikTok JSON data files, and receive comprehensive analytics including personalized AI-generated insights.

## File Structure

```
TikTok_Analytics-main/
├── README.md
├── backend/
│   ├── main.py              # FastAPI application with API endpoints
│   ├── auth.py              # Authentication and user management
│   ├── models.py            # Database models
│   ├── parsers.py           # TikTok data parsing and processing
│   ├── ai_insights.py       # AI-powered analytics generation
│   ├── requirements.txt     # Python dependencies
│   ├── test_tiktok_data.json    # Sample TikTok data for testing
│   └── tiktok_analytics.db  # SQLite database
└── frontend/
    ├── README.md
    ├── package.json         # Node.js dependencies and scripts
    ├── package-lock.json
    ├── public/              # Static assets
    └── src/                 # React application source code
```

## Installation Process

### Prerequisites
- Python 3.7 or higher
- Node.js 14 or higher
- npm or yarn

### Security Setup (Required)

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Generate a secure secret key**:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Update your .env file** with the generated secret key and other settings.

4. **Install Ollama for AI insights**:
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.com/install.sh | sh
   
   # Start Ollama
   ollama serve
   
   # Download AI model
   ollama pull llama3.2
   ```

5. **Review security guidelines** in [SECURITY.md](./SECURITY.md)

6. **See Ollama setup guide** in [OLLAMA_SETUP.md](./OLLAMA_SETUP.md)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend application will be available at `http://localhost:3000`

### Usage

1. Register for a new account or login with existing credentials
2. Upload your TikTok JSON data file (obtained from TikTok's data download feature)
3. View your analytics dashboard with profile statistics and AI-generated insights
4. Access your data anytime through the "My Data" section
