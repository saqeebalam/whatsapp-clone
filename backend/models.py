from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

# User Models
class UserCreate(BaseModel):
    username: str
    password: str
    displayName: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: Optional[str] = Field(alias="_id")
    username: str
    password: str
    displayName: str
    avatar: str = ""
    online: bool = False
    lastSeen: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserResponse(BaseModel):
    userId: str
    displayName: str
    avatar: str
    online: bool
    lastSeen: Optional[datetime] = None

# Message Models
class MessageCreate(BaseModel):
    text: str

class Message(BaseModel):
    id: Optional[str] = Field(alias="_id")
    conversationId: str
    senderId: str
    receiverId: str
    text: str
    status: str = "sent"  # sent, delivered, read
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class MessageResponse(BaseModel):
    messageId: str
    text: str
    senderId: str
    timestamp: str
    status: str

# Conversation Models
class Conversation(BaseModel):
    id: Optional[str] = Field(alias="_id")
    participants: List[str]
    lastMessage: str = ""
    lastMessageTime: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ConversationResponse(BaseModel):
    conversationId: str
    otherUser: UserResponse
    lastMessage: str
    timestamp: str
    unreadCount: int

# Auth Response
class AuthResponse(BaseModel):
    userId: str
    token: str
    displayName: str