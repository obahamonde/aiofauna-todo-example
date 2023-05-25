from aiofauna import render_template

from api import app


@app.get("/todos")
async def todos():
    return render_template("index.html")


app.static()