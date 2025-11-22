"""
Shipment models
"""
import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, DateTime, Date, ForeignKey, Text, Enum as SQLEnum, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class ShipmentMode(str, enum.Enum):
    """Shipment mode"""
    SEA = "sea"
    AIR = "air"
    ROAD = "road"
    RAIL = "rail"


class ShipmentType(str, enum.Enum):
    """Shipment type"""
    IMPORT = "import"
    EXPORT = "export"


class ShipmentStatus(str, enum.Enum):
    """Shipment status"""
    BOOKED = "booked"
    CONFIRMED = "confirmed"
    IN_TRANSIT = "in_transit"
    CUSTOMS_CLEARANCE = "customs_clearance"
    OUT_FOR_DELIVERY = "out_for_delivery"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ContainerType(str, enum.Enum):
    """Container type"""
    DRY = "dry"
    REEFER = "reefer"
    TANK = "tank"
    OPEN_TOP = "open_top"
    FLAT_RACK = "flat_rack"


class Shipment(Base):
    """Shipment model"""

    __tablename__ = "shipments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shipment_number = Column(String(100), unique=True, nullable=False, index=True)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("customers.id"), nullable=False, index=True)
    booking_date = Column(Date)
    mode = Column(SQLEnum(ShipmentMode), nullable=False, index=True)
    type = Column(SQLEnum(ShipmentType), nullable=False, index=True)

    origin_port = Column(String(100))
    destination_port = Column(String(100))
    carrier = Column(String(255), index=True)

    etd = Column(Date)  # Estimated Time of Departure
    eta = Column(Date)  # Estimated Time of Arrival
    actual_departure_date = Column(Date)
    actual_arrival_date = Column(Date)

    status = Column(SQLEnum(ShipmentStatus), nullable=False, default=ShipmentStatus.BOOKED, index=True)
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    remarks = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    customer = relationship("Customer", back_populates="shipments")
    assigned_user = relationship("User", back_populates="shipments", foreign_keys=[assigned_to])
    creator = relationship("User", back_populates="created_shipments", foreign_keys=[created_by])
    containers = relationship("Container", back_populates="shipment", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="shipment")
    tracking_events = relationship("TrackingEvent", back_populates="shipment", cascade="all, delete-orphan")
    communications = relationship("Communication", back_populates="shipment")

    def __repr__(self):
        return f"<Shipment {self.shipment_number}>"


class Container(Base):
    """Container model"""

    __tablename__ = "containers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shipment_id = Column(UUID(as_uuid=True), ForeignKey("shipments.id"), nullable=False, index=True)
    container_number = Column(String(20), nullable=False, index=True)
    size = Column(String(10))  # e.g., '20', '40', '40HC'
    type = Column(SQLEnum(ContainerType), default=ContainerType.DRY)
    seal_number = Column(String(50))
    weight_kg = Column(Numeric(10, 2))

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    shipment = relationship("Shipment", back_populates="containers")
    tracking_events = relationship("TrackingEvent", back_populates="container")

    def __repr__(self):
        return f"<Container {self.container_number}>"


class TrackingEvent(Base):
    """Tracking event model"""

    __tablename__ = "tracking_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shipment_id = Column(UUID(as_uuid=True), ForeignKey("shipments.id"), nullable=False, index=True)
    container_id = Column(UUID(as_uuid=True), ForeignKey("containers.id"), index=True)

    event_date = Column(DateTime, nullable=False, index=True)
    location = Column(String(255))
    status = Column(String(100), index=True)
    description = Column(Text)
    source = Column(String(50), default="MANUAL")  # MANUAL, AUTOMATED, API

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    shipment = relationship("Shipment", back_populates="tracking_events")
    container = relationship("Container", back_populates="tracking_events")

    def __repr__(self):
        return f"<TrackingEvent {self.status} at {self.event_date}>"
