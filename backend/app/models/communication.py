"""
Communication model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Communication(Base):
    """Communication model"""

    __tablename__ = "communications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shipment_id = Column(UUID(as_uuid=True), ForeignKey("shipments.id"), index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), index=True)

    channel = Column(String(20), nullable=False, index=True)  # EMAIL, WHATSAPP, SMS
    recipient = Column(String(255), nullable=False)
    subject = Column(String(255))
    body = Column(Text)

    sent_at = Column(DateTime)
    delivery_status = Column(String(50))  # PENDING, SENT, DELIVERED, FAILED

    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    shipment = relationship("Shipment", back_populates="communications")
    customer = relationship("Customer", back_populates="communications")
    creator = relationship("User", back_populates="communications")

    def __repr__(self):
        return f"<Communication {self.channel} to {self.recipient}>"
