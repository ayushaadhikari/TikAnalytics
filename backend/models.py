from pydantic import BaseModel
from typing import Optional, List


class Profile(BaseModel):
    username: Optional[str]
    bio: Optional[str]
    followers: Optional[int]
    following: Optional[int]
    likes: Optional[int]
    verified: Optional[bool]
    created_at: Optional[str]


class LikedVideo(BaseModel):
    video_id: Optional[str]
    timestamp: Optional[str]
    creator: Optional[str]


class DirectMessage(BaseModel):
    user: Optional[str]
    message: Optional[str]
    timestamp: Optional[str]
    direction: Optional[str]


class TikTokData(BaseModel):
    Profile: Optional[Profile]
    LikesAndFavourites: Optional[dict]
    DirectMessages: Optional[List[DirectMessage]]
    TikTokLive: Optional[dict]
    TikTokShop: Optional[dict]
    IncomeAndWallet: Optional[dict]
    Settings: Optional[dict]
