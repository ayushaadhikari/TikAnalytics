import json
import os
from typing import Dict, Any, List
from dotenv import load_dotenv
import ollama

# Load environment variables
load_dotenv()

# Ollama configuration
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# AI prompt templates
INSIGHTS_PROMPT_TEMPLATE = """
Analyze this TikTok user data and provide insights:

User Metrics:
- Followers: {followers}
- Following: {following}
- Posts: {posts}
- Comments: {comments}
- Liked Videos: {liked}
- Messages: {messages}
- Total Activity: {total_activity}
- Engagement Rate: {engagement_rate:.2f}

Provide a JSON response with these exact keys:
- user_type: One sentence describing the user type
- engagement_style: One sentence describing engagement patterns
- user_maturity: One sentence assessing user maturity
- activity_patterns: One sentence describing activity patterns
- content_preferences: One sentence analyzing content preferences
- behavioral_insights: One sentence with behavioral observations
- recommendations: Array of 3 specific, actionable recommendations

Format your response as valid JSON only.
"""

def calculate_metrics(profile_data: Dict[str, Any], stats_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate derived metrics from raw data"""
    posts = stats_data.get('posts_count', 0)
    comments = stats_data.get('comments_count', 0)
    liked = stats_data.get('liked_videos_count', 0)
    messages = stats_data.get('messages_count', 0)
    followers = profile_data.get('followers', 0)
    following = profile_data.get('following', 0)
    
    total_activity = posts + comments + liked + messages
    engagement_rate = (liked + comments) / max(posts, 1)
    
    return {
        'posts': posts,
        'comments': comments,
        'liked': liked,
        'messages': messages,
        'followers': followers,
        'following': following,
        'total_activity': total_activity,
        'engagement_rate': engagement_rate
    }

def get_ollama_insights(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Get AI insights from Ollama"""
    try:
        prompt = INSIGHTS_PROMPT_TEMPLATE.format(**metrics)
        
        response = ollama.generate(
            model=OLLAMA_MODEL,
            prompt=prompt,
            options={
                'temperature': 0.7,
                'max_tokens': 300
            }
        )
        
        # Parse JSON response
        insights_text = response['response'].strip()
        
        # Extract JSON from response (in case there's extra text)
        import re
        json_match = re.search(r'\{.*\}', insights_text, re.DOTALL)
        if json_match:
            insights_text = json_match.group()
        
        return json.loads(insights_text)
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse AI response as JSON: {e}")
    except Exception as e:
        raise ConnectionError(f"Ollama connection failed: {e}")

def create_fallback_insights(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """Create basic insights when AI is unavailable"""
    followers = metrics['followers']
    posts = metrics['posts']
    total_activity = metrics['total_activity']
    engagement_rate = metrics['engagement_rate']
    
    return {
        "user_type": f"User with {followers} followers and {posts} posts",
        "engagement_style": f"Engagement rate of {engagement_rate:.2f} with {total_activity} total activities",
        "user_maturity": f"{'Early-stage' if followers < 100 else 'Growing' if followers < 1000 else 'Established'} user",
        "activity_patterns": f"{'Content-focused' if metrics['liked'] > (metrics['posts'] + metrics['comments']) else 'Creator-focused'} behavior",
        "content_preferences": f"{'Interaction-focused' if metrics['messages'] > metrics['posts'] else 'Content creation'} preference",
        "behavioral_insights": f"{'Discovery-focused' if metrics['following'] > followers else 'Influence-focused'} profile",
        "recommendations": [
            "Create more consistent content to boost engagement",
            "Interact more with your audience through comments",
            "Use trending hashtags and participate in challenges"
        ]
    }

def generate_ai_insights(profile_data: Dict[str, Any], stats_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate personalized insights based on TikTok user data using Ollama AI
    """
    if not profile_data or not stats_data:
        return {
            "user_type": "No data available for analysis",
            "engagement_style": "Please upload your TikTok data to get insights",
            "user_maturity": "No data available",
            "activity_patterns": "No data available", 
            "content_preferences": "No data available",
            "behavioral_insights": "No data available",
            "recommendations": ["Upload your TikTok data to receive personalized insights"]
        }
    
    # Calculate metrics
    metrics = calculate_metrics(profile_data, stats_data)
    
    # Try to get AI insights first
    try:
        insights = get_ollama_insights(metrics)
        
        # Validate response format
        required_keys = ['user_type', 'engagement_style', 'user_maturity', 
                        'activity_patterns', 'content_preferences', 
                        'behavioral_insights', 'recommendations']
        
        for key in required_keys:
            if key not in insights:
                insights[key] = f"Analysis incomplete for {key}"
        
        # Ensure recommendations is a list
        if not isinstance(insights.get('recommendations'), list):
            insights['recommendations'] = ["Continue engaging with your audience"]
        
        return insights
        
    except (ConnectionError, ValueError, Exception) as e:
        # Fallback to basic insights if AI fails
        return create_fallback_insights(metrics)
