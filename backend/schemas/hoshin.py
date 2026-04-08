from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator


# ── Strategic Objectives ────────────────────────────────────────────────────

class StrategicObjectiveCreate(BaseModel):
    title: str
    description: Optional[str] = None
    time_horizon_years: int = 3
    color: Optional[str] = None
    order_index: int = 0


class StrategicObjectiveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    time_horizon_years: Optional[int] = None
    color: Optional[str] = None
    order_index: Optional[int] = None


class StrategicObjectiveOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    time_horizon_years: int
    color: Optional[str]
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Annual Objectives ────────────────────────────────────────────────────────

class AnnualObjectiveCreate(BaseModel):
    title: str
    description: Optional[str] = None
    year: int
    color: Optional[str] = None
    order_index: int = 0


class AnnualObjectiveUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    year: Optional[int] = None
    color: Optional[str] = None
    order_index: Optional[int] = None


class AnnualObjectiveOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    year: int
    color: Optional[str]
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Initiative Tasks ─────────────────────────────────────────────────────────

VALID_TASK_STATUSES = {"not_started", "in_progress", "complete", "blocked"}


class InitiativeTaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    owner: Optional[str] = None
    status: str = "not_started"
    due_date: Optional[date] = None
    progress: float = 0.0
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_TASK_STATUSES:
            raise ValueError(f"status must be one of {VALID_TASK_STATUSES}")
        return v

    @field_validator("progress")
    @classmethod
    def validate_progress(cls, v: float) -> float:
        if not 0 <= v <= 100:
            raise ValueError("progress must be between 0 and 100")
        return v


class InitiativeTaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None
    progress: Optional[float] = None
    notes: Optional[str] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_TASK_STATUSES:
            raise ValueError(f"status must be one of {VALID_TASK_STATUSES}")
        return v


class InitiativeTaskOut(BaseModel):
    id: int
    program_id: int
    user_id: int
    title: str
    description: Optional[str]
    owner: Optional[str]
    status: str
    due_date: Optional[date]
    progress: float
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Programs ─────────────────────────────────────────────────────────────────

VALID_PROGRAM_STATUSES = {"not_started", "in_progress", "complete", "on_hold"}


class HoshinProgramCreate(BaseModel):
    title: str
    description: Optional[str] = None
    owner: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: str = "not_started"
    progress: float = 0.0
    order_index: int = 0

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if v not in VALID_PROGRAM_STATUSES:
            raise ValueError(f"status must be one of {VALID_PROGRAM_STATUSES}")
        return v

    @field_validator("progress")
    @classmethod
    def validate_progress(cls, v: float) -> float:
        if not 0 <= v <= 100:
            raise ValueError("progress must be between 0 and 100")
        return v


class HoshinProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    owner: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    progress: Optional[float] = None
    order_index: Optional[int] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in VALID_PROGRAM_STATUSES:
            raise ValueError(f"status must be one of {VALID_PROGRAM_STATUSES}")
        return v


class HoshinProgramOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    owner: Optional[str]
    start_date: Optional[date]
    end_date: Optional[date]
    status: str
    progress: float
    order_index: int
    tasks: list[InitiativeTaskOut] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── KPIs ─────────────────────────────────────────────────────────────────────

class HoshinKPICreate(BaseModel):
    title: str
    description: Optional[str] = None
    unit: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    order_index: int = 0


class HoshinKPIUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    unit: Optional[str] = None
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    order_index: Optional[int] = None


class HoshinKPIOut(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    unit: Optional[str]
    target_value: Optional[float]
    current_value: Optional[float]
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ── Correlations ─────────────────────────────────────────────────────────────

VALID_STRENGTHS = {"strong", "medium", "weak"}
VALID_TYPE_PAIRS = {
    frozenset({"annual", "strategic"}),
    frozenset({"program", "annual"}),
    frozenset({"kpi", "program"}),
    frozenset({"strategic", "kpi"}),
}


class CorrelationSet(BaseModel):
    element_a_type: str
    element_a_id: int
    element_b_type: str
    element_b_id: int
    strength: str

    @field_validator("strength")
    @classmethod
    def validate_strength(cls, v: str) -> str:
        if v not in VALID_STRENGTHS:
            raise ValueError(f"strength must be one of {VALID_STRENGTHS}")
        return v

    @field_validator("element_b_type")
    @classmethod
    def validate_type_pair(cls, v: str, info) -> str:
        a_type = info.data.get("element_a_type")
        if a_type and frozenset({a_type, v}) not in VALID_TYPE_PAIRS:
            raise ValueError(f"Invalid correlation type pair: ({a_type}, {v})")
        return v


class CorrelationOut(BaseModel):
    id: int
    user_id: int
    element_a_type: str
    element_a_id: int
    element_b_type: str
    element_b_id: int
    strength: str
    created_at: datetime

    model_config = {"from_attributes": True}


class CorrelationDelete(BaseModel):
    element_a_type: str
    element_a_id: int
    element_b_type: str
    element_b_id: int


# ── Aggregate schemas ─────────────────────────────────────────────────────────

class HoshinMatrixOut(BaseModel):
    strategic_objectives: list[StrategicObjectiveOut]
    annual_objectives: list[AnnualObjectiveOut]
    programs: list[HoshinProgramOut]
    kpis: list[HoshinKPIOut]
    correlations: list[CorrelationOut]


class HoshinDashboardOut(BaseModel):
    program_status_counts: dict[str, int]
    avg_program_progress: float
    kpi_completion_rate: float
    blocked_task_count: int
    total_tasks: int
    completed_tasks: int
