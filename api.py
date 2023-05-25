from aiofauna import Api, markdown_it

from models import Todo

app = Api()


@app.get("/")
async def index():
    """Markdown Index Page"""
    return markdown_it("index.md")


@app.get("/api/todos")
async def get_todos():
    """Get all todos"""
    return await Todo.all()

@app.post("/api/todos")
async def create_todo(todo: Todo):
    """Create a new todo"""
    return await todo.save()


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
    """Startup event hook"""
    await Todo.provision()