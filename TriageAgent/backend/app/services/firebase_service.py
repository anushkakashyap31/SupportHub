"""
Firebase Service - Firestore Database Operations
Handles all database interactions with Firebase Firestore
"""

import firebase_admin
from firebase_admin import credentials, firestore
from app.config import settings
from app.utils import logger, log_info, log_error
from typing import Optional, Dict, List, Any
from datetime import datetime
import os


class FirebaseService:
    """Service for Firebase Firestore operations"""
    
    def __init__(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if already initialized
            if not firebase_admin._apps:
                # Initialize Firebase
                if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
                    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                    firebase_admin.initialize_app(cred)
                    log_info("✓ Firebase initialized", 
                            credentials=settings.FIREBASE_CREDENTIALS_PATH)
                else:
                    log_error(f"Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}")
                    raise FileNotFoundError(f"Firebase credentials file not found")
            
            # Get Firestore client
            self.db = firestore.client()
            
        except Exception as e:
            log_error(f"Failed to initialize Firebase: {str(e)}")
            raise
    
    # ============================================
    # TRIAGE RESULTS OPERATIONS
    # ============================================
    
    async def save_triage_result(self, triage_data: Dict[str, Any]) -> str:
        """
        Save triage result to Firestore
        
        Args:
            triage_data: Triage result data
        
        Returns:
            Document ID
        """
        try:
            # Add timestamp
            triage_data["created_at"] = datetime.utcnow()
            triage_data["updated_at"] = datetime.utcnow()
            
            # Save to Firestore
            doc_ref = self.db.collection("triage_results").document(triage_data["triage_id"])
            doc_ref.set(triage_data)
            
            log_info("Triage result saved", 
                    triage_id=triage_data["triage_id"],
                    urgency=triage_data.get("classification", {}).get("urgency"))
            
            return triage_data["triage_id"]
            
        except Exception as e:
            log_error(f"Failed to save triage result: {str(e)}")
            raise
    
    async def get_triage_result(self, triage_id: str) -> Optional[Dict[str, Any]]:
        """
        Get triage result by ID
        
        Args:
            triage_id: Triage result ID
        
        Returns:
            Triage data or None
        """
        try:
            doc_ref = self.db.collection("triage_results").document(triage_id)
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            else:
                return None
                
        except Exception as e:
            log_error(f"Failed to get triage result: {str(e)}")
            return None
    
    async def update_triage_status(
        self,
        triage_id: str,
        status: str,
        edited_response: Optional[str] = None,
        notes: Optional[str] = None
    ) -> bool:
        """
        Update triage result status
        
        Args:
            triage_id: Triage result ID
            status: New status
            edited_response: Human-edited response
            notes: Feedback notes
        
        Returns:
            Success boolean
        """
        try:
            doc_ref = self.db.collection("triage_results").document(triage_id)
            
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if edited_response:
                update_data["edited_response"] = edited_response
            
            if notes:
                update_data["feedback_notes"] = notes
            
            doc_ref.update(update_data)
            
            log_info("Triage status updated", 
                    triage_id=triage_id,
                    status=status)
            
            return True
            
        except Exception as e:
            log_error(f"Failed to update triage status: {str(e)}")
            return False
    
    async def get_triage_results(
        self,
        limit: int = 50,
        status: Optional[str] = None,
        urgency: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get triage results with optional filters
        
        Args:
            limit: Maximum number of results
            status: Filter by status
            urgency: Filter by urgency
        
        Returns:
            List of triage results
        """
        try:
            query = self.db.collection("triage_results").order_by("created_at", direction=firestore.Query.DESCENDING)
            
            # Apply filters
            if status:
                query = query.where("status", "==", status)
            
            if urgency:
                query = query.where("classification.urgency", "==", urgency)
            
            # Limit results
            query = query.limit(limit)
            
            # Execute query
            docs = query.stream()
            
            results = []
            for doc in docs:
                data = doc.to_dict()
                results.append(data)
            
            log_info(f"Retrieved {len(results)} triage results")
            
            return results
            
        except Exception as e:
            log_error(f"Failed to get triage results: {str(e)}")
            return []
    
    # ============================================
    # ANALYTICS OPERATIONS
    # ============================================
    
    async def get_analytics_stats(
        self,
        days: int = 7
    ) -> Dict[str, Any]:
        """
        Get analytics statistics
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Analytics data
        """
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Query results in date range
            query = self.db.collection("triage_results").where(
                "created_at", ">=", start_date
            ).where(
                "created_at", "<=", end_date
            )
            
            docs = query.stream()
            
            # Collect statistics
            total = 0
            by_urgency = {"critical": 0, "high": 0, "normal": 0, "low": 0}
            by_intent = {}
            by_status = {}
            
            for doc in docs:
                data = doc.to_dict()
                total += 1
                
                # Count by urgency
                urgency = data.get("classification", {}).get("urgency", "normal")
                by_urgency[urgency] = by_urgency.get(urgency, 0) + 1
                
                # Count by intent
                intent = data.get("classification", {}).get("intent", "other")
                by_intent[intent] = by_intent.get(intent, 0) + 1
                
                # Count by status
                status = data.get("status", "pending_review")
                by_status[status] = by_status.get(status, 0) + 1
            
            stats = {
                "total_processed": total,
                "by_urgency": by_urgency,
                "by_intent": by_intent,
                "by_status": by_status,
                "period_days": days,
            }
            
            log_info(f"Analytics stats calculated", total=total, period=f"{days} days")
            
            return stats
            
        except Exception as e:
            log_error(f"Failed to get analytics: {str(e)}")
            return {
                "total_processed": 0,
                "by_urgency": {},
                "by_intent": {},
                "by_status": {},
            }
    
    # ============================================
    # USER OPERATIONS
    # ============================================
    
    async def save_user_profile(self, user_data: Dict[str, Any]) -> bool:
        """
        Save or update user profile
        
        Args:
            user_data: User data
        
        Returns:
            Success boolean
        """
        try:
            doc_ref = self.db.collection("users").document(user_data["uid"])
            doc_ref.set(user_data, merge=True)
            
            log_info("User profile saved", uid=user_data["uid"])
            return True
            
        except Exception as e:
            log_error(f"Failed to save user profile: {str(e)}")
            return False
    
    async def get_user_profile(self, uid: str) -> Optional[Dict[str, Any]]:
        """
        Get user profile
        
        Args:
            uid: User ID
        
        Returns:
            User data or None
        """
        try:
            doc_ref = self.db.collection("users").document(uid)
            doc = doc_ref.get()
            
            if doc.exists:
                return doc.to_dict()
            else:
                return None
                
        except Exception as e:
            log_error(f"Failed to get user profile: {str(e)}")
            return None


# Import for timedelta
from datetime import timedelta

# Create singleton instance
firebase_service = FirebaseService()