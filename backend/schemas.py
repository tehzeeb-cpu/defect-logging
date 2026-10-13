from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# Sub-Activity Schemas
class SubActivityBase(BaseModel):
    name: str
    description: Optional[str] = "Standard Operational Sub-Activity"
    inspection_request_count: Optional[int] = 0

class SubActivityCreate(SubActivityBase):
    pass

class SubActivityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    inspection_request_count: Optional[int] = None

class SubActivityResponse(SubActivityBase):
    id: int
    activity_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Activity Schemas
class ActivityBase(BaseModel):
    name: str
    description: Optional[str] = "Standard Quality Assured Construction Activity"

class ActivityCreate(ActivityBase):
    sub_activities: Optional[List[SubActivityCreate]] = []

class ActivityUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime
    sub_activities_count: int = 0
    sub_activities: List[SubActivityResponse] = []

    class Config:
        from_attributes = True

# Defect Threshold Mapping Schemas
class DefectThresholdBase(BaseModel):
    defect_type: str
    defect_threshold: int = Field(ge=0)
    sporadic_threshold: int = Field(ge=0)
    chronic_threshold: int = Field(ge=0)
    severity_index: int = Field(ge=1, le=10)
    control_index: int = Field(ge=1, le=10)
    project_id: Optional[int] = None
    division_id: Optional[int] = None
    sub_division_id: Optional[int] = None
    activity_id: Optional[int] = None
    sub_activity_id: Optional[int] = None
    project_name: Optional[str] = None
    division_name: Optional[str] = None
    sub_division_name: Optional[str] = None
    activity_name: Optional[str] = None
    sub_activity_name: Optional[str] = None

class DefectThresholdCreate(DefectThresholdBase):
    pass

class DefectThresholdUpdate(BaseModel):
    defect_type: Optional[str] = None
    defect_threshold: Optional[int] = None
    sporadic_threshold: Optional[int] = None
    chronic_threshold: Optional[int] = None
    severity_index: Optional[int] = None
    control_index: Optional[int] = None
    project_id: Optional[int] = None
    division_id: Optional[int] = None
    sub_division_id: Optional[int] = None
    activity_id: Optional[int] = None
    sub_activity_id: Optional[int] = None
    project_name: Optional[str] = None
    division_name: Optional[str] = None
    sub_division_name: Optional[str] = None
    activity_name: Optional[str] = None
    sub_activity_name: Optional[str] = None

class DefectThresholdResponse(DefectThresholdBase):
    id: int

    class Config:
        from_attributes = True

class DefectThresholdBulkUpdateItem(BaseModel):
    id: int
    defect_threshold: int
    sporadic_threshold: int
    chronic_threshold: int
    severity_index: int
    control_index: int

class DefectThresholdBulkUpdate(BaseModel):
    items: List[DefectThresholdBulkUpdateItem]

# Defect Report Log Schemas
class DefectReportLogResponse(BaseModel):
    id: int
    sou: str
    project_name: str
    division_name: str
    sub_division_name: str
    activity_name: str
    sub_activity_name: str
    defect_type: str
    defect_threshold: int
    yearly_count: int
    year: int

    class Config:
        from_attributes = True
