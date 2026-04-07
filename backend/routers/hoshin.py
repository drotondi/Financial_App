from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload
from ..core.dependencies import get_db, get_current_user
from ..models.user import User
from ..models.hoshin import (
    StrategicObjective, AnnualObjective, HoshinProgram,
    HoshinKPI, HoshinCorrelation, InitiativeTask,
)
from ..schemas.hoshin import (
    StrategicObjectiveCreate, StrategicObjectiveUpdate, StrategicObjectiveOut,
    AnnualObjectiveCreate, AnnualObjectiveUpdate, AnnualObjectiveOut,
    HoshinProgramCreate, HoshinProgramUpdate, HoshinProgramOut,
    HoshinKPICreate, HoshinKPIUpdate, HoshinKPIOut,
    CorrelationSet, CorrelationOut, CorrelationDelete,
    InitiativeTaskCreate, InitiativeTaskUpdate, InitiativeTaskOut,
    HoshinMatrixOut, HoshinDashboardOut,
)

router = APIRouter()


# ── Matrix aggregate ─────────────────────────────────────────────────────────

@router.get("/matrix", response_model=HoshinMatrixOut)
def get_matrix(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = current_user.id
    strategic = db.query(StrategicObjective).filter(StrategicObjective.user_id == uid).order_by(StrategicObjective.order_index).all()
    annual = db.query(AnnualObjective).filter(AnnualObjective.user_id == uid).order_by(AnnualObjective.order_index).all()
    programs = (
        db.query(HoshinProgram)
        .options(selectinload(HoshinProgram.tasks))
        .filter(HoshinProgram.user_id == uid)
        .order_by(HoshinProgram.order_index)
        .all()
    )
    kpis = db.query(HoshinKPI).filter(HoshinKPI.user_id == uid).order_by(HoshinKPI.order_index).all()
    correlations = db.query(HoshinCorrelation).filter(HoshinCorrelation.user_id == uid).all()
    return HoshinMatrixOut(
        strategic_objectives=strategic,
        annual_objectives=annual,
        programs=programs,
        kpis=kpis,
        correlations=correlations,
    )


# ── Dashboard ────────────────────────────────────────────────────────────────

@router.get("/dashboard", response_model=HoshinDashboardOut)
def get_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uid = current_user.id
    programs = db.query(HoshinProgram).filter(HoshinProgram.user_id == uid).all()
    kpis = db.query(HoshinKPI).filter(HoshinKPI.user_id == uid).all()
    tasks = db.query(InitiativeTask).filter(InitiativeTask.user_id == uid).all()

    status_counts: dict[str, int] = {}
    for p in programs:
        status_counts[p.status] = status_counts.get(p.status, 0) + 1

    avg_progress = sum(p.progress for p in programs) / len(programs) if programs else 0.0

    completed_kpis = sum(
        1 for k in kpis
        if k.target_value is not None and k.current_value is not None and k.current_value >= k.target_value
    )
    kpi_completion_rate = (completed_kpis / len(kpis) * 100) if kpis else 0.0

    blocked = sum(1 for t in tasks if t.status == "blocked")
    completed_tasks = sum(1 for t in tasks if t.status == "complete")

    return HoshinDashboardOut(
        program_status_counts=status_counts,
        avg_program_progress=round(avg_progress, 1),
        kpi_completion_rate=round(kpi_completion_rate, 1),
        blocked_task_count=blocked,
        total_tasks=len(tasks),
        completed_tasks=completed_tasks,
    )


# ── Strategic Objectives ─────────────────────────────────────────────────────

@router.get("/strategic-objectives", response_model=list[StrategicObjectiveOut])
def list_strategic(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(StrategicObjective).filter(StrategicObjective.user_id == current_user.id).order_by(StrategicObjective.order_index).all()


@router.post("/strategic-objectives", response_model=StrategicObjectiveOut, status_code=status.HTTP_201_CREATED)
def create_strategic(data: StrategicObjectiveCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = StrategicObjective(**data.model_dump(), user_id=current_user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/strategic-objectives/{obj_id}", response_model=StrategicObjectiveOut)
def update_strategic(obj_id: int, data: StrategicObjectiveUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(StrategicObjective).filter(StrategicObjective.id == obj_id, StrategicObjective.user_id == current_user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Strategic objective not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/strategic-objectives/{obj_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_strategic(obj_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(StrategicObjective).filter(StrategicObjective.id == obj_id, StrategicObjective.user_id == current_user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Strategic objective not found")
    db.delete(obj)
    db.commit()


# ── Annual Objectives ─────────────────────────────────────────────────────────

@router.get("/annual-objectives", response_model=list[AnnualObjectiveOut])
def list_annual(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(AnnualObjective).filter(AnnualObjective.user_id == current_user.id).order_by(AnnualObjective.order_index).all()


@router.post("/annual-objectives", response_model=AnnualObjectiveOut, status_code=status.HTTP_201_CREATED)
def create_annual(data: AnnualObjectiveCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = AnnualObjective(**data.model_dump(), user_id=current_user.id)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.put("/annual-objectives/{obj_id}", response_model=AnnualObjectiveOut)
def update_annual(obj_id: int, data: AnnualObjectiveUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(AnnualObjective).filter(AnnualObjective.id == obj_id, AnnualObjective.user_id == current_user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Annual objective not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj


@router.delete("/annual-objectives/{obj_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_annual(obj_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    obj = db.query(AnnualObjective).filter(AnnualObjective.id == obj_id, AnnualObjective.user_id == current_user.id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Annual objective not found")
    db.delete(obj)
    db.commit()


# ── Programs ──────────────────────────────────────────────────────────────────

@router.get("/programs", response_model=list[HoshinProgramOut])
def list_programs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(HoshinProgram)
        .options(selectinload(HoshinProgram.tasks))
        .filter(HoshinProgram.user_id == current_user.id)
        .order_by(HoshinProgram.order_index)
        .all()
    )


@router.post("/programs", response_model=HoshinProgramOut, status_code=status.HTTP_201_CREATED)
def create_program(data: HoshinProgramCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prog = HoshinProgram(**data.model_dump(), user_id=current_user.id)
    db.add(prog)
    db.commit()
    db.refresh(prog)
    # reload with tasks (empty list for new program)
    prog = db.query(HoshinProgram).options(selectinload(HoshinProgram.tasks)).filter(HoshinProgram.id == prog.id).first()
    return prog


@router.put("/programs/{prog_id}", response_model=HoshinProgramOut)
def update_program(prog_id: int, data: HoshinProgramUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prog = db.query(HoshinProgram).filter(HoshinProgram.id == prog_id, HoshinProgram.user_id == current_user.id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(prog, field, value)
    db.commit()
    prog = db.query(HoshinProgram).options(selectinload(HoshinProgram.tasks)).filter(HoshinProgram.id == prog_id).first()
    return prog


@router.delete("/programs/{prog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_program(prog_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    prog = db.query(HoshinProgram).filter(HoshinProgram.id == prog_id, HoshinProgram.user_id == current_user.id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(prog)
    db.commit()


# ── KPIs ──────────────────────────────────────────────────────────────────────

@router.get("/kpis", response_model=list[HoshinKPIOut])
def list_kpis(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(HoshinKPI).filter(HoshinKPI.user_id == current_user.id).order_by(HoshinKPI.order_index).all()


@router.post("/kpis", response_model=HoshinKPIOut, status_code=status.HTTP_201_CREATED)
def create_kpi(data: HoshinKPICreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    kpi = HoshinKPI(**data.model_dump(), user_id=current_user.id)
    db.add(kpi)
    db.commit()
    db.refresh(kpi)
    return kpi


@router.put("/kpis/{kpi_id}", response_model=HoshinKPIOut)
def update_kpi(kpi_id: int, data: HoshinKPIUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    kpi = db.query(HoshinKPI).filter(HoshinKPI.id == kpi_id, HoshinKPI.user_id == current_user.id).first()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(kpi, field, value)
    db.commit()
    db.refresh(kpi)
    return kpi


@router.delete("/kpis/{kpi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_kpi(kpi_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    kpi = db.query(HoshinKPI).filter(HoshinKPI.id == kpi_id, HoshinKPI.user_id == current_user.id).first()
    if not kpi:
        raise HTTPException(status_code=404, detail="KPI not found")
    db.delete(kpi)
    db.commit()


# ── Correlations ──────────────────────────────────────────────────────────────

@router.post("/correlations", response_model=CorrelationOut, status_code=status.HTTP_200_OK)
def upsert_correlation(data: CorrelationSet, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(HoshinCorrelation).filter(
        HoshinCorrelation.user_id == current_user.id,
        HoshinCorrelation.element_a_type == data.element_a_type,
        HoshinCorrelation.element_a_id == data.element_a_id,
        HoshinCorrelation.element_b_type == data.element_b_type,
        HoshinCorrelation.element_b_id == data.element_b_id,
    ).first()
    if existing:
        existing.strength = data.strength
        db.commit()
        db.refresh(existing)
        return existing
    corr = HoshinCorrelation(**data.model_dump(), user_id=current_user.id)
    db.add(corr)
    db.commit()
    db.refresh(corr)
    return corr


@router.delete("/correlations", status_code=status.HTTP_204_NO_CONTENT)
def delete_correlation(data: CorrelationDelete, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    corr = db.query(HoshinCorrelation).filter(
        HoshinCorrelation.user_id == current_user.id,
        HoshinCorrelation.element_a_type == data.element_a_type,
        HoshinCorrelation.element_a_id == data.element_a_id,
        HoshinCorrelation.element_b_type == data.element_b_type,
        HoshinCorrelation.element_b_id == data.element_b_id,
    ).first()
    if corr:
        db.delete(corr)
        db.commit()


# ── Initiative Tasks ──────────────────────────────────────────────────────────

def _get_program_or_404(prog_id: int, user_id: int, db: Session) -> HoshinProgram:
    prog = db.query(HoshinProgram).filter(HoshinProgram.id == prog_id, HoshinProgram.user_id == user_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    return prog


@router.get("/programs/{prog_id}/tasks", response_model=list[InitiativeTaskOut])
def list_tasks(prog_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_program_or_404(prog_id, current_user.id, db)
    return db.query(InitiativeTask).filter(InitiativeTask.program_id == prog_id).order_by(InitiativeTask.created_at).all()


@router.post("/programs/{prog_id}/tasks", response_model=InitiativeTaskOut, status_code=status.HTTP_201_CREATED)
def create_task(prog_id: int, data: InitiativeTaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_program_or_404(prog_id, current_user.id, db)
    task = InitiativeTask(**data.model_dump(), program_id=prog_id, user_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.put("/programs/{prog_id}/tasks/{task_id}", response_model=InitiativeTaskOut)
def update_task(prog_id: int, task_id: int, data: InitiativeTaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_program_or_404(prog_id, current_user.id, db)
    task = db.query(InitiativeTask).filter(InitiativeTask.id == task_id, InitiativeTask.program_id == prog_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/programs/{prog_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(prog_id: int, task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_program_or_404(prog_id, current_user.id, db)
    task = db.query(InitiativeTask).filter(InitiativeTask.id == task_id, InitiativeTask.program_id == prog_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
