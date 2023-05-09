from aiofauna import Api
from models import Todo

app = Api()


app.router.add_static("/static", "./static")


@app.get("/api/todos")
async def get_todos():
    """Get all todos"""
    response = await Todo.all()
    return [r.dict() for r in response]

@app.post("/api/todos")
async def create_todo(todo: Todo):
    """Create a new todo"""
    print(todo)
    return await todo.create()


@app.put("/api/todos")
async def update_todo(ref: str):
    """Update a todo"""
    return await Todo.update(ref, completed=True)


@app.delete("/api/todos")
async def delete_todo(ref: str):
    """Delete a todo"""
    return await Todo.delete(ref)


@app.on_event("startup")
async def startup(_):
    await Todo.provision()
