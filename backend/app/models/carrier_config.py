"""
Carrier configuration model
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.core.database import Base


class CarrierConfig(Base):
    """Carrier configuration model for browser automation"""

    __tablename__ = "carrier_configs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(255), nullable=False, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)

    website_url = Column(String(500))
    login_url = Column(String(500))
    credentials = Column(JSONB, default={})  # Encrypted credentials
    scraping_config = Column(JSONB, default={})  # Selectors and rules

    is_active = Column(Boolean, default=True, nullable=False)
    last_scrape_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<CarrierConfig {self.name}>"
