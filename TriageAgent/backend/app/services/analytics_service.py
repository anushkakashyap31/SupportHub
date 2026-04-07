"""
Analytics Service
Provides analytics and statistics for triage operations
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from app.services.firebase_service import firebase_service
from app.utils import logger, log_info, log_error
from app.models.enums import UrgencyLevel, IntentCategory, TriageStatus


class AnalyticsService:
    """Analytics and reporting service"""
    
    def __init__(self):
        """Initialize analytics service"""
        log_info("✓ Analytics Service initialized")
    
    async def get_triage_stats(
        self,
        days: int = 7,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get triage statistics for a period
        
        Args:
            days: Number of days to analyze
            user_id: Optional user ID to filter by
        
        Returns:
            Statistics dictionary
        """
        try:
            # Get data from Firebase
            stats = await firebase_service.get_analytics_stats(days=days)
            
            # Calculate additional metrics
            total = stats.get("total_processed", 0)
            
            # Calculate percentages
            by_urgency_pct = {}
            for urgency, count in stats.get("by_urgency", {}).items():
                by_urgency_pct[urgency] = round((count / total * 100) if total > 0 else 0, 1)
            
            by_intent_pct = {}
            for intent, count in stats.get("by_intent", {}).items():
                by_intent_pct[intent] = round((count / total * 100) if total > 0 else 0, 1)
            
            # Compile results
            result = {
                "period_days": days,
                "total_messages": total,
                "by_urgency": {
                    "counts": stats.get("by_urgency", {}),
                    "percentages": by_urgency_pct,
                },
                "by_intent": {
                    "counts": stats.get("by_intent", {}),
                    "percentages": by_intent_pct,
                },
                "by_status": stats.get("by_status", {}),
            }
            
            log_info(f"Analytics stats calculated", 
                    total=total, 
                    period=f"{days} days")
            
            return result
            
        except Exception as e:
            log_error(f"Failed to get analytics stats: {str(e)}")
            return {
                "period_days": days,
                "total_messages": 0,
                "by_urgency": {"counts": {}, "percentages": {}},
                "by_intent": {"counts": {}, "percentages": {}},
                "by_status": {},
            }
    
    async def get_urgency_distribution(self, days: int = 30) -> Dict[str, int]:
        """
        Get distribution of messages by urgency level
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Dictionary of urgency levels and counts
        """
        try:
            stats = await firebase_service.get_analytics_stats(days=days)
            return stats.get("by_urgency", {
                "critical": 0,
                "high": 0,
                "normal": 0,
                "low": 0,
            })
        except Exception as e:
            log_error(f"Failed to get urgency distribution: {str(e)}")
            return {"critical": 0, "high": 0, "normal": 0, "low": 0}
    
    async def get_intent_distribution(self, days: int = 30) -> Dict[str, int]:
        """
        Get distribution of messages by intent
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Dictionary of intents and counts
        """
        try:
            stats = await firebase_service.get_analytics_stats(days=days)
            return stats.get("by_intent", {})
        except Exception as e:
            log_error(f"Failed to get intent distribution: {str(e)}")
            return {}
    
    async def get_response_time_stats(self, days: int = 7) -> Dict[str, float]:
        """
        Calculate average response times from metadata
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Response time statistics
        """
        try:
            # Get recent triage results
            results = await firebase_service.get_triage_results(limit=1000)
            
            if not results:
                return {
                    "avg_processing_time": 0.0,
                    "min_processing_time": 0.0,
                    "max_processing_time": 0.0,
                }
            
            # Extract processing times from metadata
            processing_times = []
            for result in results:
                metadata = result.get("metadata", {})
                processing_time = metadata.get("processing_time_seconds")
                
                # Only include valid processing times
                if processing_time and isinstance(processing_time, (int, float)) and processing_time > 0:
                    processing_times.append(processing_time)
            
            if not processing_times:
                return {
                    "avg_processing_time": 0.0,
                    "min_processing_time": 0.0,
                    "max_processing_time": 0.0,
                }
            
            return {
                "avg_processing_time": round(sum(processing_times) / len(processing_times), 2),
                "min_processing_time": round(min(processing_times), 2),
                "max_processing_time": round(max(processing_times), 2),
            }
            
        except Exception as e:
            log_error(f"Failed to calculate response times: {str(e)}")
            return {
                "avg_processing_time": 0.0,
                "min_processing_time": 0.0,
                "max_processing_time": 0.0,
            }
    
    async def get_approval_rate(self, days: int = 7) -> float:
        """
        Calculate human approval rate
        
        Args:
            days: Number of days to analyze
        
        Returns:
            Approval rate as percentage
        """
        try:
            # Get recent results
            results = await firebase_service.get_triage_results(limit=1000)
            
            if not results:
                return 0.0
            
            # Count approved vs total
            total = len(results)
            approved = sum(1 for r in results if r.get("status") == "approved")
            
            rate = (approved / total * 100) if total > 0 else 0.0
            
            return round(rate, 1)
            
        except Exception as e:
            log_error(f"Failed to calculate approval rate: {str(e)}")
            return 0.0
    
    async def get_trending_intents(
        self,
        days: int = 7,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Get trending message intents
        
        Args:
            days: Number of days to analyze
            limit: Number of top intents to return
        
        Returns:
            List of trending intents
        """
        try:
            intent_dist = await self.get_intent_distribution(days=days)
            
            # Sort by count
            sorted_intents = sorted(
                intent_dist.items(),
                key=lambda x: x[1],
                reverse=True
            )
            
            # Take top N
            trending = []
            for intent, count in sorted_intents[:limit]:
                trending.append({
                    "intent": intent,
                    "count": count,
                })
            
            return trending
            
        except Exception as e:
            log_error(f"Failed to get trending intents: {str(e)}")
            return []
    
    async def get_dashboard_summary(self) -> Dict[str, Any]:
        """
        Get complete dashboard summary
        
        Returns:
            Comprehensive dashboard data
        """
        try:
            # Gather all stats in parallel would be ideal,
            # but for simplicity we'll do sequential
            
            stats_7d = await self.get_triage_stats(days=7)
            stats_30d = await self.get_triage_stats(days=30)
            response_times = await self.get_response_time_stats(days=7)
            approval_rate = await self.get_approval_rate(days=7)
            trending = await self.get_trending_intents(days=7)
            
            summary = {
                "overview": {
                    "total_7d": stats_7d.get("total_messages", 0),
                    "total_30d": stats_30d.get("total_messages", 0),
                    "approval_rate": approval_rate,
                    "avg_processing_time": response_times.get("avg_processing_time", 0),
                },
                "urgency_distribution": stats_30d.get("by_urgency", {}),
                "intent_distribution": stats_30d.get("by_intent", {}),
                "trending_intents": trending,
                "response_times": response_times,
            }
            
            log_info("Dashboard summary generated")
            
            return summary
            
        except Exception as e:
            log_error(f"Failed to generate dashboard summary: {str(e)}")
            return {
                "overview": {
                    "total_7d": 0,
                    "total_30d": 0,
                    "approval_rate": 0,
                    "avg_processing_time": 0,
                },
                "urgency_distribution": {},
                "intent_distribution": {},
                "trending_intents": [],
                "response_times": {},
            }


# Create singleton instance
analytics_service = AnalyticsService()