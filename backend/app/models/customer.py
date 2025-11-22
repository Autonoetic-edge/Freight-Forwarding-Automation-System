"""
Customer model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class Customer(Base):
    """Customer model"""

    __tablename__ = "customers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(50), unique=True, index=True)
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(Text)
    contact_person = Column(String(255))
    communication_preferences = Column(JSONB, default={})

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    shipments = relationship("Shipment", back_populates="customer")
    communications = relationship("Communication", back_populates="customer")

    def __repr__(self):
        return f"<Customer {self.name}>"
