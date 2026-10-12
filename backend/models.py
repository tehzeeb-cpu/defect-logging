from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    code = Column(String(50), nullable=True)
    sou = Column(String(50), nullable=False) # e.g. "SOU 1", "SOU 2", "SOU 3"

class Division(Base):
    __tablename__ = "divisions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    sub_divisions = relationship("SubDivision", back_populates="division", cascade="all, delete-orphan")

class SubDivision(Base):
    __tablename__ = "sub_divisions"

    id = Column(Integer, primary_key=True, index=True)
    division_id = Column(Integer, ForeignKey("divisions.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    division = relationship("Division", back_populates="sub_divisions")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="Standard Quality Assured Construction Activity")
    created_at = Column(DateTime, default=datetime.utcnow)

    sub_activities = relationship("SubActivity", back_populates="activity", cascade="all, delete-orphan")

class SubActivity(Base):
    __tablename__ = "sub_activities"

    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="Operational Sub-Activity Specification")
    inspection_request_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="sub_activities")

class DefectThresholdMapping(Base):
    __tablename__ = "defect_threshold_mappings"

    id = Column(Integer, primary_key=True, index=True)
    defect_type = Column(String(255), nullable=False)
    defect_threshold = Column(Integer, nullable=False, default=50)
    sporadic_threshold = Column(Integer, nullable=False, default=5)
    chronic_threshold = Column(Integer, nullable=False, default=20)
    severity_index = Column(Integer, nullable=False, default=5) # 1 to 10
    control_index = Column(Integer, nullable=False, default=5)  # 1 to 10

    # Optional relational mapping filters
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="SET NULL"), nullable=True)
    division_id = Column(Integer, ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True)
    sub_division_id = Column(Integer, ForeignKey("sub_divisions.id", ondelete="SET NULL"), nullable=True)
    activity_id = Column(Integer, ForeignKey("activities.id", ondelete="SET NULL"), nullable=True)
    sub_activity_id = Column(Integer, ForeignKey("sub_activities.id", ondelete="SET NULL"), nullable=True)

class DefectReportLog(Base):
    __tablename__ = "defect_report_logs"

    id = Column(Integer, primary_key=True, index=True)
    sou = Column(String(50), nullable=False) # e.g. SOU 3
    project_name = Column(String(255), nullable=False)
    division_name = Column(String(255), nullable=False)
    sub_division_name = Column(String(255), nullable=False)
    activity_name = Column(String(255), nullable=False)
    sub_activity_name = Column(String(255), nullable=False)
    defect_type = Column(String(255), nullable=False)
    defect_threshold = Column(Integer, nullable=False)
    yearly_count = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False, default=2025)
