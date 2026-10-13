from database import SessionLocal, Base, engine
from models import Project, Division, SubDivision, Activity, SubActivity, DefectThresholdMapping, DefectReportLog
from datetime import datetime

from sqlalchemy import text

def seed_threshold_mappings(db):
    threshold_data = [
        # Sobha Reserve (Wireframe Image 4 dataset)
        {
            "defect_type": "UCM Leak",
            "defect_threshold": 60,
            "sporadic_threshold": 5,
            "chronic_threshold": 20,
            "severity_index": 4,
            "control_index": 8,
            "project_name": "Sobha Reserve",
            "division_name": "Structural Division",
            "sub_division_name": "Waterproofing",
            "activity_name": "Enclosure",
            "sub_activity_name": "Structural Silicone Weatherproofing"
        },
        {
            "defect_type": "Glass Bend",
            "defect_threshold": 70,
            "sporadic_threshold": 3,
            "chronic_threshold": 15,
            "severity_index": 6,
            "control_index": 3,
            "project_name": "Sobha Reserve",
            "division_name": "Finishing Division",
            "sub_division_name": "Carpentry",
            "activity_name": "Enclosure",
            "sub_activity_name": "Double Glazed Unit Fitting"
        },
        {
            "defect_type": "Wire not connected",
            "defect_threshold": 100,
            "sporadic_threshold": 5,
            "chronic_threshold": 10,
            "severity_index": 8,
            "control_index": 8,
            "project_name": "Sobha Reserve",
            "division_name": "MEP Division",
            "sub_division_name": "Electrical",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "Conduit Termination"
        },
        {
            "defect_type": "FCD connection issue",
            "defect_threshold": 200,
            "sporadic_threshold": 5,
            "chronic_threshold": 5,
            "severity_index": 5,
            "control_index": 4,
            "project_name": "Sobha Reserve",
            "division_name": "MEP Division",
            "sub_division_name": "HVAC",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "GI Box Fixing"
        },
        {
            "defect_type": "Access not provided for FCU",
            "defect_threshold": 50,
            "sporadic_threshold": 8,
            "chronic_threshold": 55,
            "severity_index": 4,
            "control_index": 8,
            "project_name": "Sobha Reserve",
            "division_name": "MEP Division",
            "sub_division_name": "HVAC",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "GI Box Fixing"
        },
        {
            "defect_type": "Screw missing",
            "defect_threshold": 30,
            "sporadic_threshold": 2,
            "chronic_threshold": 32,
            "severity_index": 2,
            "control_index": 1,
            "project_name": "Sobha Reserve",
            "division_name": "Finishing Division",
            "sub_division_name": "False Ceiling",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "MS Bracket Fixing"
        },
        {
            "defect_type": "Tile hollow sound",
            "defect_threshold": 80,
            "sporadic_threshold": 6,
            "chronic_threshold": 25,
            "severity_index": 5,
            "control_index": 7,
            "project_name": "Sobha Reserve",
            "division_name": "Finishing Division",
            "sub_division_name": "Tile Division",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling"
        },
        {
            "defect_type": "Paint peeling & blister",
            "defect_threshold": 90,
            "sporadic_threshold": 7,
            "chronic_threshold": 30,
            "severity_index": 3,
            "control_index": 6,
            "project_name": "Sobha Reserve",
            "division_name": "Finishing Division",
            "sub_division_name": "Paint",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Ceiling First coat"
        },
        # Sobha Seahaven
        {
            "defect_type": "Honeycombing in Concrete",
            "defect_threshold": 40,
            "sporadic_threshold": 2,
            "chronic_threshold": 10,
            "severity_index": 7,
            "control_index": 4,
            "project_name": "Sobha Seahaven",
            "division_name": "Structural Division",
            "sub_division_name": "Concrete & Formwork",
            "activity_name": "Framing",
            "sub_activity_name": "Column Shuttering"
        },
        {
            "defect_type": "Rebar Cover Inadequate",
            "defect_threshold": 45,
            "sporadic_threshold": 3,
            "chronic_threshold": 12,
            "severity_index": 8,
            "control_index": 5,
            "project_name": "Sobha Seahaven",
            "division_name": "Structural Division",
            "sub_division_name": "Steel Framing",
            "activity_name": "Framing",
            "sub_activity_name": "Shear Wall Reinforcement"
        },
        {
            "defect_type": "Screed Level Discrepancy",
            "defect_threshold": 65,
            "sporadic_threshold": 4,
            "chronic_threshold": 18,
            "severity_index": 4,
            "control_index": 6,
            "project_name": "Sobha Seahaven",
            "division_name": "Finishing Division",
            "sub_division_name": "Tile Division",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling"
        },
        # The Crest
        {
            "defect_type": "Conduit Choking",
            "defect_threshold": 55,
            "sporadic_threshold": 3,
            "chronic_threshold": 15,
            "severity_index": 6,
            "control_index": 5,
            "project_name": "The Crest",
            "division_name": "MEP Division",
            "sub_division_name": "Electrical",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "Conduit Termination"
        },
        {
            "defect_type": "Cold Joint in Slab",
            "defect_threshold": 30,
            "sporadic_threshold": 1,
            "chronic_threshold": 8,
            "severity_index": 9,
            "control_index": 7,
            "project_name": "The Crest",
            "division_name": "Structural Division",
            "sub_division_name": "Concrete & Formwork",
            "activity_name": "Framing",
            "sub_activity_name": "Post-Tension Tendon Profiling"
        },
        # Sobha Hartland II
        {
            "defect_type": "Pipe Joint Leakage",
            "defect_threshold": 60,
            "sporadic_threshold": 4,
            "chronic_threshold": 20,
            "severity_index": 7,
            "control_index": 6,
            "project_name": "Sobha Hartland II",
            "division_name": "MEP Division",
            "sub_division_name": "Plumbing",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "GI Box Fixing"
        },
        {
            "defect_type": "Curtain Wall Air Leak",
            "defect_threshold": 75,
            "sporadic_threshold": 5,
            "chronic_threshold": 18,
            "severity_index": 6,
            "control_index": 4,
            "project_name": "Sobha Hartland II",
            "division_name": "Structural Division",
            "sub_division_name": "Waterproofing",
            "activity_name": "Enclosure",
            "sub_activity_name": "Curtain Wall Bracket Anchoring"
        }
    ]

    for t in threshold_data:
        t_obj = DefectThresholdMapping(
            defect_type=t["defect_type"],
            defect_threshold=t["defect_threshold"],
            sporadic_threshold=t["sporadic_threshold"],
            chronic_threshold=t["chronic_threshold"],
            severity_index=t["severity_index"],
            control_index=t["control_index"],
            project_name=t.get("project_name", "Sobha Reserve"),
            division_name=t.get("division_name"),
            sub_division_name=t.get("sub_division_name"),
            activity_name=t.get("activity_name"),
            sub_activity_name=t.get("sub_activity_name")
        )
        db.add(t_obj)
    db.commit()

def seed():
    Base.metadata.create_all(bind=engine)

    # Ensure new columns exist on defect_threshold_mappings
    try:
        with engine.connect() as conn:
            for col in ["project_name", "division_name", "sub_division_name", "activity_name", "sub_activity_name"]:
                try:
                    conn.execute(text(f"ALTER TABLE defect_threshold_mappings ADD COLUMN IF NOT EXISTS {col} VARCHAR(255);"))
                    conn.commit()
                except Exception:
                    pass
    except Exception as e:
        print(f"Migration note: {e}")

    db = SessionLocal()

    # Check if data already exists
    if db.query(Project).count() > 0:
        # Check if threshold mappings need migration to include project mappings
        try:
            mapped_count = db.query(DefectThresholdMapping).filter(DefectThresholdMapping.project_name.isnot(None)).count()
            if mapped_count == 0:
                print("Updating defect threshold mappings with project/activity hierarchy associations...")
                db.query(DefectThresholdMapping).delete()
                db.commit()
                seed_threshold_mappings(db)
            else:
                print("Database already seeded with full schema. Skipping...")
            db.close()
            return
        except Exception as e:
            print(f"Threshold check note: {e}")
            db.close()
            return

    print("Seeding database with Sobha Quality Management baseline dataset...")

    # 1. Projects
    projects_data = [
        {"name": "Sobha Seahaven", "code": "SSH-01", "sou": "SOU 1"},
        {"name": "The Crest", "code": "TCR-02", "sou": "SOU 1"},
        {"name": "Sobha Hartland II", "code": "SH2-03", "sou": "SOU 2"},
        {"name": "Sobha Waves", "code": "SWV-04", "sou": "SOU 3"},
        {"name": "Sobha Reserve", "code": "SRV-05", "sou": "SOU 2"},
    ]
    projects = {}
    for p in projects_data:
        obj = Project(name=p["name"], code=p["code"], sou=p["sou"])
        db.add(obj)
        projects[p["name"]] = obj
    db.commit()

    # 2. Divisions & Sub-Divisions
    div_data = {
        "Finishing Division": ["Paint", "Tile Division", "Carpentry", "False Ceiling"],
        "MEP Division": ["Plumbing", "Electrical", "HVAC", "Firefighting"],
        "Structural Division": ["Concrete & Formwork", "Steel Framing", "Waterproofing"]
    }
    divisions = {}
    sub_divisions = {}
    for d_name, subs in div_data.items():
        d_obj = Division(name=d_name)
        db.add(d_obj)
        db.commit()
        divisions[d_name] = d_obj
        for s_name in subs:
            s_obj = SubDivision(division_id=d_obj.id, name=s_name)
            db.add(s_obj)
            db.commit()
            sub_divisions[s_name] = s_obj

    # 3. Construction Activities & Sub-Activities Hierarchy
    act_data = [
        {
            "name": "Site Preparation",
            "desc": "Site clearance, perimeter hoarding, earth excavation and compaction.",
            "subs": [
                {"name": "Clearing and Grading", "desc": "Topsoil stripping and laser level grading", "count": 45, "dt": datetime(2023, 11, 18, 23, 0)},
                {"name": "Subsoil Compaction", "desc": "Proctor density compaction and field dry density testing", "count": 12, "dt": datetime(2023, 11, 20, 14, 30)},
                {"name": "Demarcation & Surveying", "desc": "Total station baseline coordinates fixation", "count": 18, "dt": datetime(2023, 11, 22, 10, 15)}
            ]
        },
        {
            "name": "Foundation Construction",
            "desc": "Piling, raft reinforcement, waterproofing barrier, and mass concrete pouring.",
            "subs": [
                {"name": "Raft Rebar Binding", "desc": "High yield deformed bar placement with cover spacers", "count": 14, "dt": datetime(2023, 12, 1, 23, 0)},
                {"name": "Under-raft Waterproofing", "desc": "SBS modified bituminous membrane sheet application", "count": 22, "dt": datetime(2023, 12, 2, 16, 0)},
                {"name": "PCC Blinding Layer", "desc": "Plain cement concrete grade M15 surface blinding", "count": 9, "dt": datetime(2023, 12, 3, 11, 0)}
            ]
        },
        {
            "name": "Framing",
            "desc": "Superstructure reinforced concrete columns, shear walls, and post-tensioned slabs.",
            "subs": [
                {"name": "Column Shuttering", "desc": "Aluminum formwork panel erection with plumb line calibration", "count": 14, "dt": datetime(2023, 12, 1, 23, 0)},
                {"name": "Shear Wall Reinforcement", "desc": "Vertical and horizontal steel bar lap splice verification", "count": 16, "dt": datetime(2023, 12, 4, 18, 0)},
                {"name": "Post-Tension Tendon Profiling", "desc": "High strength strand ducting and anchor placement", "count": 11, "dt": datetime(2023, 12, 5, 12, 0)}
            ]
        },
        {
            "name": "Enclosure",
            "desc": "Building facade envelope, unitized curtain wall, glazing, and external insulation.",
            "subs": [
                {"name": "Curtain Wall Bracket Anchoring", "desc": "Galvanized embedded steel plate alignment with torque checks", "count": 14, "dt": datetime(2023, 12, 1, 23, 0)},
                {"name": "Double Glazed Unit Fitting", "desc": "Acoustic and thermal insulated glass panel insertion", "count": 28, "dt": datetime(2023, 12, 6, 15, 30)},
                {"name": "Structural Silicone Weatherproofing", "desc": "Secondary silicone sealing with air and water infiltration tests", "count": 19, "dt": datetime(2023, 12, 7, 9, 45)}
            ]
        },
        {
            "name": "Dry Area Floor",
            "desc": "Internal dry floor finishes, acoustic screed, vitrified tiles and skirting.",
            "subs": [
                {"name": "Floor Tiling", "desc": "Porcelain tile bed adhesive application and tile leveling clips", "count": 30, "dt": datetime(2023, 12, 10, 11, 0)},
                {"name": "Ceiling First coat", "desc": "Anti-fungal primer and joint tape treatment for gypsum board", "count": 25, "dt": datetime(2023, 12, 11, 14, 0)},
                {"name": "MS Bracket Fixing", "desc": "Mild steel galvanized bracket fixing for false ceiling hanger rods", "count": 35, "dt": datetime(2023, 12, 12, 16, 30)}
            ]
        },
        {
            "name": "GI Box Fixing",
            "desc": "Galvanized iron electrical junction and back box installation in conduit networks.",
            "subs": [
                {"name": "GI Box Fixing", "desc": "Wall chase flush mounting and spirit level vertical alignment", "count": 50, "dt": datetime(2023, 12, 15, 10, 0)},
                {"name": "Conduit Termination", "desc": "PVC/GI connector bush locknut tightening into box entries", "count": 42, "dt": datetime(2023, 12, 16, 13, 0)}
            ]
        }
    ]

    for a in act_data:
        act_obj = Activity(name=a["name"], description=a["desc"], created_at=datetime(2023, 12, 1, 23, 0))
        db.add(act_obj)
        db.commit()
        for s in a["subs"]:
            sub_obj = SubActivity(
                activity_id=act_obj.id,
                name=s["name"],
                description=s["desc"],
                inspection_request_count=s["count"],
                created_at=s["dt"]
            )
            db.add(sub_obj)
        db.commit()

    # 4. Defect Threshold Sensitivity Mappings
    seed_threshold_mappings(db)

    # 5. Quality Audit Incident Records & Yearly Counts
    report_data = [
        {
            "sou": "SOU 3",
            "project_name": "Sobha Seahaven",
            "division_name": "Finishing Division",
            "sub_division_name": "Paint",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling",
            "defect_type": "UCM Leak",
            "defect_threshold": 200,
            "yearly_count": 80,
            "year": 2025
        },
        {
            "sou": "SOU 1",
            "project_name": "Sobha Seahaven",
            "division_name": "Finishing Division",
            "sub_division_name": "Tile Division",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Ceiling First coat",
            "defect_type": "Glass Bend",
            "defect_threshold": 60,
            "yearly_count": 40,
            "year": 2025
        },
        {
            "sou": "SOU 1",
            "project_name": "The Crest",
            "division_name": "Finishing Division",
            "sub_division_name": "Paint",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling",
            "defect_type": "UCM Leak",
            "defect_threshold": 200,
            "yearly_count": 20,
            "year": 2025
        },
        {
            "sou": "SOU 2",
            "project_name": "Sobha Hartland II",
            "division_name": "MEP Division",
            "sub_division_name": "Plumbing",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "GI Box Fixing",
            "defect_type": "Screw missing",
            "defect_threshold": 80,
            "yearly_count": 50,
            "year": 2025
        },
        {
            "sou": "SOU 2",
            "project_name": "Sobha Seahaven",
            "division_name": "Finishing Division",
            "sub_division_name": "Tile Division",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "MS Bracket Fixing",
            "defect_type": "Screw missing",
            "defect_threshold": 100,
            "yearly_count": 30,
            "year": 2025
        },
        {
            "sou": "SOU 3",
            "project_name": "Sobha Waves",
            "division_name": "MEP Division",
            "sub_division_name": "Electrical",
            "activity_name": "GI Box Fixing",
            "sub_activity_name": "Conduit Termination",
            "defect_type": "Wire not connected",
            "defect_threshold": 100,
            "yearly_count": 65,
            "year": 2025
        },
        {
            "sou": "SOU 1",
            "project_name": "The Crest",
            "division_name": "Finishing Division",
            "sub_division_name": "Carpentry",
            "activity_name": "Enclosure",
            "sub_activity_name": "Double Glazed Unit Fitting",
            "defect_type": "Glass Bend",
            "defect_threshold": 70,
            "yearly_count": 48,
            "year": 2025
        },
        {
            "sou": "SOU 2",
            "project_name": "Sobha Reserve",
            "division_name": "MEP Division",
            "sub_division_name": "HVAC",
            "activity_name": "Site Preparation",
            "sub_activity_name": "Clearing and Grading",
            "defect_type": "Access not provided for FCU",
            "defect_threshold": 50,
            "yearly_count": 15,
            "year": 2025
        },
        # 2024 Historical Data for Trend Comparison
        {
            "sou": "SOU 3",
            "project_name": "Sobha Seahaven",
            "division_name": "Finishing Division",
            "sub_division_name": "Paint",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling",
            "defect_type": "UCM Leak",
            "defect_threshold": 200,
            "yearly_count": 120,
            "year": 2024
        },
        {
            "sou": "SOU 1",
            "project_name": "The Crest",
            "division_name": "Finishing Division",
            "sub_division_name": "Paint",
            "activity_name": "Dry Area Floor",
            "sub_activity_name": "Floor Tiling",
            "defect_type": "UCM Leak",
            "defect_threshold": 200,
            "yearly_count": 45,
            "year": 2024
        }
    ]

    for r in report_data:
        r_obj = DefectReportLog(**r)
        db.add(r_obj)
    db.commit()

    db.close()
    print("Baseline dataset successfully populated!")

if __name__ == "__main__":
    seed()
