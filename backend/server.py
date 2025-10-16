from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from datetime import datetime
from bson import ObjectId

from models import (
    UserCreate, UserLogin, User, UserResponse, AuthResponse,
    MessageCreate, Message, MessageResponse,
    Conversation, ConversationResponse
)
from auth import verify_password, get_password_hash, create_access_token
from dependencies import get_current_user

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============= AUTH ROUTES =============
@api_router.post("/auth/register", response_model=AuthResponse)
async def register(user_data: UserCreate):

     # Log which DB we are connecting to
    logger.info(f"Connecting to DB: {db.name}, Collection: users")
    logger.info(f"Connecting to DB: {db.name}, user_data.username")

    # Check if username already exists
    existing_user = await db.users.find_one({"username": user_data.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    avatar_url = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.username}"
    
    user = {
        "username": user_data.username,
        "password": hashed_password,
        "displayName": user_data.displayName,
        "avatar": avatar_url,
        "online": True,
        "lastSeen": datetime.utcnow(),
        "createdAt": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user)
    user_id = str(result.inserted_id)
    
    # Create JWT token
    token = create_access_token(data={"sub": user_id})
    
    return AuthResponse(
        userId=user_id,
        token=token,
        displayName=user_data.displayName
    )

@api_router.post("/auth/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"username": credentials.username})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Update online status
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"online": True, "lastSeen": datetime.utcnow()}}
    )
    
    user_id = str(user["_id"])
    token = create_access_token(data={"sub": user_id})
    
    return AuthResponse(
        userId=user_id,
        token=token,
        displayName=user["displayName"]
    )

# ============= USER ROUTES =============
@api_router.get("/users", response_model=List[UserResponse])
async def get_users(current_user_id: str = Depends(get_current_user)):
    users = await db.users.find(
        {"_id": {"$ne": ObjectId(current_user_id)}}
    ).to_list(100)
    
    return [
        UserResponse(
            userId=str(user["_id"]),
            displayName=user["displayName"],
            avatar=user["avatar"],
            online=user.get("online", False),
            lastSeen=user.get("lastSeen")
        )
        for user in users
    ]

@api_router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str, current_user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        userId=str(user["_id"]),
        displayName=user["displayName"],
        avatar=user["avatar"],
        online=user.get("online", False),
        lastSeen=user.get("lastSeen")
    )

# ============= CONVERSATION ROUTES =============
@api_router.get("/conversations", response_model=List[ConversationResponse])
async def get_conversations(current_user_id: str = Depends(get_current_user)):
    # Get all conversations for current user
    conversations = await db.conversations.find(
        {"participants": current_user_id}
    ).sort("lastMessageTime", -1).to_list(100)
    
    result = []
    for conv in conversations:
        # Get other user details
        other_user_id = [p for p in conv["participants"] if p != current_user_id][0]
        other_user = await db.users.find_one({"_id": ObjectId(other_user_id)})
        
        if not other_user:
            continue
        
        # Count unread messages
        unread_count = await db.messages.count_documents({
            "conversationId": str(conv["_id"]),
            "receiverId": current_user_id,
            "status": {"$ne": "read"}
        })
        
        # Format timestamp
        timestamp = ""
        if conv.get("lastMessageTime"):
            msg_time = conv["lastMessageTime"]
            now = datetime.utcnow()
            if msg_time.date() == now.date():
                timestamp = msg_time.strftime("%H:%M")
            elif (now - msg_time).days == 1:
                timestamp = "Yesterday"
            else:
                timestamp = msg_time.strftime("%d/%m/%Y")
        
        result.append(ConversationResponse(
            conversationId=str(conv["_id"]),
            otherUser=UserResponse(
                userId=str(other_user["_id"]),
                displayName=other_user["displayName"],
                avatar=other_user["avatar"],
                online=other_user.get("online", False),
                lastSeen=other_user.get("lastSeen")
            ),
            lastMessage=conv.get("lastMessage", ""),
            timestamp=timestamp,
            unreadCount=unread_count
        ))
    
    return result

@api_router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_messages(
    conversation_id: str,
    current_user_id: str = Depends(get_current_user)
):
    # Verify user is part of conversation
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    if not conversation or current_user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get messages
    messages = await db.messages.find(
        {"conversationId": conversation_id}
    ).sort("createdAt", 1).to_list(1000)
    
    return [
        MessageResponse(
            messageId=str(msg["_id"]),
            text=msg["text"],
            senderId=msg["senderId"],
            timestamp=msg["createdAt"].strftime("%H:%M"),
            status=msg.get("status", "sent")
        )
        for msg in messages
    ]

@api_router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: str,
    message_data: MessageCreate,
    current_user_id: str = Depends(get_current_user)
):
    # Verify conversation exists and user is participant
    conversation = await db.conversations.find_one({"_id": ObjectId(conversation_id)})
    if not conversation or current_user_id not in conversation["participants"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get receiver ID
    receiver_id = [p for p in conversation["participants"] if p != current_user_id][0]
    
    # Create message
    message = {
        "conversationId": conversation_id,
        "senderId": current_user_id,
        "receiverId": receiver_id,
        "text": message_data.text,
        "status": "sent",
        "createdAt": datetime.utcnow()
    }
    
    result = await db.messages.insert_one(message)
    
    # Update conversation
    await db.conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {
            "$set": {
                "lastMessage": message_data.text,
                "lastMessageTime": datetime.utcnow()
            }
        }
    )
    
    return MessageResponse(
        messageId=str(result.inserted_id),
        text=message_data.text,
        senderId=current_user_id,
        timestamp=datetime.utcnow().strftime("%H:%M"),
        status="sent"
    )

@api_router.post("/conversations/start/{user_id}")
async def start_conversation(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    # Check if conversation already exists
    existing = await db.conversations.find_one({
        "participants": {"$all": [current_user_id, user_id]}
    })
    
    if existing:
        return {"conversationId": str(existing["_id"])}
    
    # Create new conversation
    conversation = {
        "participants": [current_user_id, user_id],
        "lastMessage": "",
        "lastMessageTime": None,
        "createdAt": datetime.utcnow()
    }
    
    result = await db.conversations.insert_one(conversation)
    return {"conversationId": str(result.inserted_id)}

@api_router.put("/conversations/{conversation_id}/read")
async def mark_as_read(
    conversation_id: str,
    current_user_id: str = Depends(get_current_user)
):
    # Mark all messages as read for current user
    await db.messages.update_many(
        {
            "conversationId": conversation_id,
            "receiverId": current_user_id,
            "status": {"$ne": "read"}
        },
        {"$set": {"status": "read"}}
    )
    
    return {"success": True}

# ============= POLLING ROUTE =============
@api_router.get("/messages/poll")
async def poll_messages(
    lastMessageId: str = None,
    current_user_id: str = Depends(get_current_user)
):
    query = {
        "$or": [
            {"senderId": current_user_id},
            {"receiverId": current_user_id}
        ]
    }
    
    if lastMessageId:
        query["_id"] = {"$gt": ObjectId(lastMessageId)}
    
    messages = await db.messages.find(query).sort("createdAt", 1).to_list(100)
    
    return [
        {
            "messageId": str(msg["_id"]),
            "conversationId": msg["conversationId"],
            "text": msg["text"],
            "senderId": msg["senderId"],
            "timestamp": msg["createdAt"].strftime("%H:%M")
        }
        for msg in messages
    ]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()