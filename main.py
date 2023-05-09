from api import app
from aiofauna import render_template, markdown_it

@app.get("/")
async def index():
    return markdown_it("index.md")

@app.get("/todos")
async def todos():
    return render_template("index.html")
