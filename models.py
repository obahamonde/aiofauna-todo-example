from aiofauna import FaunaModel, Field, Optional


class Todo(FaunaModel):
    title: str = Field(..., unique=True)
    completed: bool = Field(default=False, index=True)
    description: Optional[str] = Field(None)
