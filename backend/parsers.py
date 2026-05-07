def build_summary(data: dict):
    # Handle real TikTok data structure
    profile_section = data.get("Profile And Settings", {}) or {}
    profile_info = profile_section.get("Profile Info", {}) or {}
    profile_map = profile_info.get("ProfileMap", {}) or {}
    
    # Extract profile data from real structure
    username = profile_map.get("userName")
    bio = profile_map.get("bioDescription", "")
    followers = profile_map.get("followerCount", 0)
    following = profile_map.get("followingCount", 0)
    likes = profile_map.get("likesReceived", 0)
    verified = profile_map.get("isVerified", False)
    profile_photo = profile_map.get("profilePhoto", "")
    
    # Handle likes and favorites from real structure
    likes_section = data.get("Likes and Favorites", {}) or {}
    like_list = likes_section.get("Like List", {}) or {}
    liked_videos = like_list.get("ItemFavoriteList", []) or []
    
    favorite_videos = likes_section.get("Favorite Videos", {}) or {}
    favorite_video_list = favorite_videos.get("FavoriteVideoList", []) or []
    
    # Handle comments from real structure
    comment_section = data.get("Comment", {}) or {}
    comments_list = comment_section.get("Comments", {}).get("CommentsList", []) or []
    
    # Handle messages (check various possible locations)
    messages = []
    if "Direct Message" in data:
        message_section = data.get("Direct Message", {})
        if "Direct Messages" in message_section:
            chat_history = message_section.get("Direct Messages", {}).get("ChatHistory", {}) or {}
            # Extract all messages from chat history
            for chat_key, chat_messages in chat_history.items():
                if isinstance(chat_messages, list):
                    messages.extend(chat_messages)
    
    # Handle profile views
    profile_views = profile_section.get("ProfileViews", {}).get("ProfileViewList", []) or []
    
    # Handle posts/videos from real structure
    posts = []
    if "Post" in data:
        post_section = data.get("Post", {})
        if "Posts" in post_section:
            posts = post_section.get("Posts", {}).get("VideoList", []) or []
    
    # Calculate total likes received on user's videos
    total_video_likes = 0
    if "Post" in data:
        post_section = data.get("Post", {})
        if "Posts" in post_section:
            video_list = post_section.get("Posts", {}).get("VideoList", []) or []
            for video in video_list:
                if "Likes" in video:
                    try:
                        total_video_likes += int(video.get("Likes", 0))
                    except (ValueError, TypeError):
                        pass

    return {
        "profile": {
            "username": username,
            "bio": bio,
            "followers": followers,
            "following": following,
            "likes": int(likes),  # likesReceived already includes total likes
            "verified": verified,
            "profile_photo": profile_photo,
        },
        "stats": {
            "liked_videos_count": len(liked_videos),
            "favorite_videos_count": len(favorite_video_list),
            "comments_count": len(comments_list),
            "messages_count": len(messages),
            "profile_views_count": len(profile_views),
            "posts_count": len(posts),
            "total_video_likes": total_video_likes,
        },
        "activity": {
            "liked_videos": liked_videos,
            "favorite_videos": favorite_video_list,
            "comments": comments_list,
            "messages": messages,
            "profile_views": profile_views,
            "posts": posts,
        }
    }
