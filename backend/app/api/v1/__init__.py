"""
API v1 router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, customers, shipments, documents, dashboard

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(shipments.router, prefix="/shipments", tags=["Shipments"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
