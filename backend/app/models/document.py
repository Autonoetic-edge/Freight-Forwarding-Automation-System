"""
Document models
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, Integer, BigInteger, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class Document(Base):
    """Document model"""

    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    shipment_id = Column(UUID(as_uuid=True), ForeignKey("shipments.id"), index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger)
    mime_type = Column(String(100))
    document_type = Column(String(50), index=True)  # BL, INVOICE, PACKING_LIST, etc.

    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    ocr_processed = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    shipment = relationship("Shipment", back_populates="documents")
    uploader = relationship("User", back_populates="documents")
    ocr_result = relationship("OCRResult", back_populates="document", uselist=False)

    def __repr__(self):
        return f"<Document {self.filename}>"


class OCRResult(Base):
    """OCR result model"""

    __tablename__ = "ocr_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False, index=True)

    extracted_text = Column(Text)
    extracted_fields = Column(JSONB, default={})  # Structured data
    confidence_score = Column(Numeric(5, 2))

    manual_review_needed = Column(Boolean, default=False, nullable=False)
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    reviewed_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    document = relationship("Document", back_populates="ocr_result")

    def __repr__(self):
        return f"<OCRResult for document {self.document_id}>"
