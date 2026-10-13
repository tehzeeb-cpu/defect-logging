import io
import csv
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from database import engine, Base, get_db
from models import Project, Division, SubDivision, Activity, SubActivity, DefectThresholdMapping, DefectReportLog
import schemas
from seed_data import seed

# Auto create tables and seed baseline data
Base.metadata.create_all(bind=engine)
seed()

app = FastAPI(
    title="Sobha Quality Management & Defect Logging API",
    description="Enterprise REST API for Construction Quality Control, Site Inspections & Defect Threshold Mapping",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "Sobha Quality Management API"}

# ==========================================
# 0. Global Filter Dropdowns Options
# ==========================================
@app.get("/api/filter-options")
def get_filter_options(db: Session = Depends(get_db)):
    projects = [p.name for p in db.query(Project).order_by(Project.name).all()]
    divisions = [d.name for d in db.query(Division).order_by(Division.name).all()]
    sub_divisions = [sd.name for sd in db.query(SubDivision).order_by(SubDivision.name).all()]
    activities = [a.name for a in db.query(Activity).order_by(Activity.name).all()]
    sub_activities = [sa.name for sa in db.query(SubActivity).order_by(SubActivity.name).all()]
    defect_types = [
        d[0] for d in db.query(DefectThresholdMapping.defect_type).distinct().all()
    ]
    years = [y[0] for y in db.query(DefectReportLog.year).distinct().order_by(DefectReportLog.year.desc()).all()]
    if not years:
        years = [2025, 2024]

    return {
        "projects": projects,
        "divisions": divisions,
        "sub_divisions": sub_divisions,
        "activities": activities,
        "sub_activities": sub_activities,
        "defect_types": defect_types,
        "years": years,
        "severities": list(range(1, 11)),
        "controls": list(range(1, 11))
    }

# ==========================================
# 1. Activities & Inspection Requests API
# ==========================================
@app.get("/api/activities", response_model=List[schemas.ActivityResponse])
def get_activities(
    search: Optional[str] = Query(None),
    parent_activity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Activity)

    if search:
        search_filter = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Activity.name).ilike(search_filter),
                func.lower(Activity.description).ilike(search_filter)
            )
        )

    if parent_activity and parent_activity != "All" and parent_activity != "Parent Activity":
        query = query.filter(Activity.name == parent_activity)

    activities = query.order_by(Activity.id.asc()).all()

    response = []
    for act in activities:
        # Also filter sub activities if search query matches sub-activities
        subs = act.sub_activities
        act_dict = {
            "id": act.id,
            "name": act.name,
            "description": act.description,
            "created_at": act.created_at,
            "sub_activities_count": len(subs),
            "sub_activities": [
                schemas.SubActivityResponse.from_orm(s) for s in subs
            ]
        }
        response.append(schemas.ActivityResponse(**act_dict))

    return response

@app.post("/api/activities", response_model=schemas.ActivityResponse)
def create_activity(activity: schemas.ActivityCreate, db: Session = Depends(get_db)):
    db_act = Activity(name=activity.name, description=activity.description)
    db.add(db_act)
    db.commit()
    db.refresh(db_act)

    if activity.sub_activities:
        for sa in activity.sub_activities:
            sub_obj = SubActivity(
                activity_id=db_act.id,
                name=sa.name,
                description=sa.description,
                inspection_request_count=sa.inspection_request_count or 0
            )
            db.add(sub_obj)
        db.commit()
        db.refresh(db_act)

    return schemas.ActivityResponse(
        id=db_act.id,
        name=db_act.name,
        description=db_act.description,
        created_at=db_act.created_at,
        sub_activities_count=len(db_act.sub_activities),
        sub_activities=[schemas.SubActivityResponse.from_orm(s) for s in db_act.sub_activities]
    )

@app.put("/api/activities/{activity_id}", response_model=schemas.ActivityResponse)
def update_activity(activity_id: int, activity: schemas.ActivityUpdate, db: Session = Depends(get_db)):
    db_act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_act:
        raise HTTPException(status_code=404, detail="Activity not found")

    if activity.name is not None:
        db_act.name = activity.name
    if activity.description is not None:
        db_act.description = activity.description

    db.commit()
    db.refresh(db_act)

    return schemas.ActivityResponse(
        id=db_act.id,
        name=db_act.name,
        description=db_act.description,
        created_at=db_act.created_at,
        sub_activities_count=len(db_act.sub_activities),
        sub_activities=[schemas.SubActivityResponse.from_orm(s) for s in db_act.sub_activities]
    )

@app.delete("/api/activities/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    db_act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_act:
        raise HTTPException(status_code=404, detail="Activity not found")
    db.delete(db_act)
    db.commit()
    return {"message": "Activity deleted successfully"}

# Sub Activities endpoints
@app.post("/api/activities/{activity_id}/sub-activities", response_model=schemas.SubActivityResponse)
def add_sub_activity(activity_id: int, sub_activity: schemas.SubActivityCreate, db: Session = Depends(get_db)):
    db_act = db.query(Activity).filter(Activity.id == activity_id).first()
    if not db_act:
        raise HTTPException(status_code=404, detail="Activity not found")

    sub_obj = SubActivity(
        activity_id=activity_id,
        name=sub_activity.name,
        description=sub_activity.description,
        inspection_request_count=sub_activity.inspection_request_count or 0
    )
    db.add(sub_obj)
    db.commit()
    db.refresh(sub_obj)
    return schemas.SubActivityResponse.from_orm(sub_obj)

@app.put("/api/sub-activities/{sub_id}", response_model=schemas.SubActivityResponse)
def update_sub_activity(sub_id: int, update: schemas.SubActivityUpdate, db: Session = Depends(get_db)):
    sub_obj = db.query(SubActivity).filter(SubActivity.id == sub_id).first()
    if not sub_obj:
        raise HTTPException(status_code=404, detail="Sub Activity not found")

    if update.name is not None:
        sub_obj.name = update.name
    if update.description is not None:
        sub_obj.description = update.description
    if update.inspection_request_count is not None:
        sub_obj.inspection_request_count = update.inspection_request_count

    db.commit()
    db.refresh(sub_obj)
    return schemas.SubActivityResponse.from_orm(sub_obj)

@app.delete("/api/sub-activities/{sub_id}")
def delete_sub_activity(sub_id: int, db: Session = Depends(get_db)):
    sub_obj = db.query(SubActivity).filter(SubActivity.id == sub_id).first()
    if not sub_obj:
        raise HTTPException(status_code=404, detail="Sub Activity not found")
    db.delete(sub_obj)
    db.commit()
    return {"message": "Sub-activity deleted successfully"}

# ==========================================
# 2. Defect Threshold Sensitivity API
# ==========================================
@app.get("/api/threshold-mappings", response_model=List[schemas.DefectThresholdResponse])
def get_threshold_mappings(
    search: Optional[str] = Query(None),
    severity: Optional[int] = Query(None),
    control: Optional[int] = Query(None),
    defect_type: Optional[str] = Query(None),
    project: Optional[str] = Query(None),
    division: Optional[str] = Query(None),
    sub_division: Optional[str] = Query(None),
    activity: Optional[str] = Query(None),
    sub_activity: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DefectThresholdMapping)

    if search:
        search_filter = f"%{search.strip().lower()}%"
        query = query.filter(func.lower(DefectThresholdMapping.defect_type).ilike(search_filter))

    if severity:
        query = query.filter(DefectThresholdMapping.severity_index == severity)

    if control:
        query = query.filter(DefectThresholdMapping.control_index == control)

    if defect_type and defect_type not in ["All", "Defect Type"]:
        query = query.filter(DefectThresholdMapping.defect_type == defect_type)

    if project and project not in ["All", "Project"]:
        query = query.filter(DefectThresholdMapping.project_name == project)

    if division and division not in ["All", "Division"]:
        query = query.filter(DefectThresholdMapping.division_name == division)

    if sub_division and sub_division not in ["All", "Sub-Division"]:
        query = query.filter(DefectThresholdMapping.sub_division_name == sub_division)

    if activity and activity not in ["All", "Activity"]:
        query = query.filter(DefectThresholdMapping.activity_name == activity)

    if sub_activity and sub_activity not in ["All", "Sub-Activity"]:
        query = query.filter(DefectThresholdMapping.sub_activity_name == sub_activity)

    results = query.order_by(DefectThresholdMapping.id.asc()).all()
    return [schemas.DefectThresholdResponse.from_orm(r) for r in results]

@app.post("/api/threshold-mappings", response_model=schemas.DefectThresholdResponse)
def create_threshold_mapping(item: schemas.DefectThresholdCreate, db: Session = Depends(get_db)):
    data = item.dict()
    if data.get("project_name") and not data.get("project_id"):
        proj = db.query(Project).filter(Project.name == data["project_name"]).first()
        if proj:
            data["project_id"] = proj.id
    if data.get("division_name") and not data.get("division_id"):
        div = db.query(Division).filter(Division.name == data["division_name"]).first()
        if div:
            data["division_id"] = div.id
    if data.get("sub_division_name") and not data.get("sub_division_id"):
        sdiv = db.query(SubDivision).filter(SubDivision.name == data["sub_division_name"]).first()
        if sdiv:
            data["sub_division_id"] = sdiv.id
    if data.get("activity_name") and not data.get("activity_id"):
        act = db.query(Activity).filter(Activity.name == data["activity_name"]).first()
        if act:
            data["activity_id"] = act.id
    if data.get("sub_activity_name") and not data.get("sub_activity_id"):
        sact = db.query(SubActivity).filter(SubActivity.name == data["sub_activity_name"]).first()
        if sact:
            data["sub_activity_id"] = sact.id

    obj = DefectThresholdMapping(**data)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return schemas.DefectThresholdResponse.from_orm(obj)

@app.put("/api/threshold-mappings/{mapping_id}", response_model=schemas.DefectThresholdResponse)
def update_threshold_mapping(mapping_id: int, item: schemas.DefectThresholdUpdate, db: Session = Depends(get_db)):
    obj = db.query(DefectThresholdMapping).filter(DefectThresholdMapping.id == mapping_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Threshold mapping not found")

    data = item.dict(exclude_unset=True)
    if data.get("project_name") and not data.get("project_id"):
        proj = db.query(Project).filter(Project.name == data["project_name"]).first()
        if proj:
            data["project_id"] = proj.id
    if data.get("division_name") and not data.get("division_id"):
        div = db.query(Division).filter(Division.name == data["division_name"]).first()
        if div:
            data["division_id"] = div.id
    if data.get("sub_division_name") and not data.get("sub_division_id"):
        sdiv = db.query(SubDivision).filter(SubDivision.name == data["sub_division_name"]).first()
        if sdiv:
            data["sub_division_id"] = sdiv.id
    if data.get("activity_name") and not data.get("activity_id"):
        act = db.query(Activity).filter(Activity.name == data["activity_name"]).first()
        if act:
            data["activity_id"] = act.id
    if data.get("sub_activity_name") and not data.get("sub_activity_id"):
        sact = db.query(SubActivity).filter(SubActivity.name == data["sub_activity_name"]).first()
        if sact:
            data["sub_activity_id"] = sact.id

    for field, value in data.items():
        setattr(obj, field, value)

    db.commit()
    db.refresh(obj)
    return schemas.DefectThresholdResponse.from_orm(obj)

@app.delete("/api/threshold-mappings/{mapping_id}")
def delete_threshold_mapping(mapping_id: int, db: Session = Depends(get_db)):
    obj = db.query(DefectThresholdMapping).filter(DefectThresholdMapping.id == mapping_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Threshold mapping not found")
    db.delete(obj)
    db.commit()
    return {"message": "Defect threshold mapping deleted successfully"}

@app.post("/api/threshold-mappings/bulk-update")
def bulk_update_thresholds(bulk_data: schemas.DefectThresholdBulkUpdate, db: Session = Depends(get_db)):
    updated_count = 0
    for item in bulk_data.items:
        obj = db.query(DefectThresholdMapping).filter(DefectThresholdMapping.id == item.id).first()
        if obj:
            obj.defect_threshold = item.defect_threshold
            obj.sporadic_threshold = item.sporadic_threshold
            obj.chronic_threshold = item.chronic_threshold
            obj.severity_index = item.severity_index
            obj.control_index = item.control_index
            updated_count += 1
    db.commit()
    return {"message": f"Successfully updated {updated_count} defect threshold records"}

# ==========================================
# 3. Quality Audit & Defect Reports API
# ==========================================
@app.get("/api/defects-report", response_model=List[schemas.DefectReportLogResponse])
def get_defects_report(
    search: Optional[str] = Query(None),
    project: Optional[str] = Query(None),
    division: Optional[str] = Query(None),
    sub_division: Optional[str] = Query(None),
    activity: Optional[str] = Query(None),
    sub_activity: Optional[str] = Query(None),
    defect_type: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DefectReportLog)

    if search:
        search_filter = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(DefectReportLog.sou).ilike(search_filter),
                func.lower(DefectReportLog.project_name).ilike(search_filter),
                func.lower(DefectReportLog.division_name).ilike(search_filter),
                func.lower(DefectReportLog.sub_division_name).ilike(search_filter),
                func.lower(DefectReportLog.activity_name).ilike(search_filter),
                func.lower(DefectReportLog.sub_activity_name).ilike(search_filter),
                func.lower(DefectReportLog.defect_type).ilike(search_filter),
            )
        )

    if project and project not in ["All", "Project"]:
        query = query.filter(DefectReportLog.project_name == project)
    if division and division not in ["All", "Division"]:
        query = query.filter(DefectReportLog.division_name == division)
    if sub_division and sub_division not in ["All", "Sub-Division"]:
        query = query.filter(DefectReportLog.sub_division_name == sub_division)
    if activity and activity not in ["All", "Activity"]:
        query = query.filter(DefectReportLog.activity_name == activity)
    if sub_activity and sub_activity not in ["All", "Sub-Activity"]:
        query = query.filter(DefectReportLog.sub_activity_name == sub_activity)
    if defect_type and defect_type not in ["All", "Defect Type"]:
        query = query.filter(DefectReportLog.defect_type == defect_type)
    if year:
        query = query.filter(DefectReportLog.year == year)

    records = query.order_by(DefectReportLog.id.asc()).all()
    return [schemas.DefectReportLogResponse.from_orm(r) for r in records]

@app.get("/api/defects-report/export")
def export_defects_report(
    search: Optional[str] = Query(None),
    project: Optional[str] = Query(None),
    division: Optional[str] = Query(None),
    sub_division: Optional[str] = Query(None),
    activity: Optional[str] = Query(None),
    sub_activity: Optional[str] = Query(None),
    defect_type: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    records = get_defects_report(
        search=search,
        project=project,
        division=division,
        sub_division=sub_division,
        activity=activity,
        sub_activity=sub_activity,
        defect_type=defect_type,
        year=year,
        db=db
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "SOU", "Projects", "Division", "Sub-Division", "Activity", 
        "Sub-Activity", "Defect Type", "Defect Threshold", "Yearly Count", "Year"
    ])

    for r in records:
        writer.writerow([
            r.sou, r.project_name, r.division_name, r.sub_division_name,
            r.activity_name, r.sub_activity_name, r.defect_type,
            r.defect_threshold, r.yearly_count, r.year
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=sobha_defects_report_{year or 'all'}.csv"}
    )
