"""SQLAlchemy database models."""

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.creator import CreatorProfile, CreatorSkill, CreatorCategory, PortfolioItem
from app.models.client import ClientProfile
from app.models.gig import Gig
from app.models.project import Project, Proposal, Contract
from app.models.transaction import Transaction
from app.models.message import Conversation, ConversationParticipant, Message
from app.models.review import Review
from app.models.notification import Notification

__all__ = [
    # User
    "User",
    # Creator
    "CreatorProfile",
    "CreatorSkill",
    "CreatorCategory",
    "PortfolioItem",
    # Client
    "ClientProfile",
    # Gig
    "Gig",
    # Project
    "Project",
    "Proposal",
    "Contract",
    # Transaction
    "Transaction",
    # Message
    "Conversation",
    "ConversationParticipant",
    "Message",
    # Review
    "Review",
    # Notification
    "Notification",
]
