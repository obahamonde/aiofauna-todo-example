# AioFauna Example

## Todo App

This is a Simple Todo App made with FAV Stack (FaunaDB, AioFauna, VueJS).

It is an example of the common CRUD operations that most applications need.

[Todos](/todos)

## Code

The code is pretty straightforward, you can check it below:

```python
# models.py
from aiofauna import FaunaModel, Field, Optional


class Todo(FaunaModel):
    title: str = Field(..., unique=True)
    completed: bool = Field(default=False, index=True)
    description: Optional[str] = Field(None)
```

```python
# api.py
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
```

```python
# main.py
from api import app
from aiofauna import render_template, markdown_it

@app.get("/")
async def index():
    return markdown_it("index.md")

@app.get("/todos")
async def todos():
    return render_template("index.html")
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@unocss/reset/tailwind.min.css">
    <link rel="icon" type="image/svg+xml" href="static/logo.svg" />
    <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/mini.global.js"></script>
    <title>AioFauna Todos</title>
  </head>
  <body>
    <div id="app">
    <div flex flex-col items-center shadow-lg shadow-black w-96 p-8 m-8 mx-auto>
      <h1
      text-4xl font-extrabold text-center text-blue-500 font-sans
      >+ Task</h1>
      <form
      flex flex-col items-center
      >
        <input type="text" v-model="todo.title"
        outline m-4 p-1 rounded-lg placeholder="Title"
        />
        <textarea v-model="todo.description"
        outline m-4 p-1 rounded-lg w-64 h-32 
        placeholder="Description"
        ></textarea>
        <button @click="post(todo)"
        px-4 py-2 bg-blue-500 text-white rounded-lg
        >Add</button>
      </form>

    
    </div>
    <div v-if="todos.length"
    m-4 p-4 bg-gray-100 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
    >
      <div v-for="t in todos"
      m-4 p-4 flex flex-col items-center bg-white rounded-lg shadow-lg w-64 gap-2
      >
      <label font-extrabold>Title:</label>
        <h2> [[ t.title ]]</h2>
        <label font-extrabold>Description:</label>
        <p> [[ t.description ]]</p>
        <div class="flex items-center mb-4">
          <input  :id="t.ref" type="checkbox" :value="t.completed" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            @change="put(t.ref)" checked="t.completed"
          >
          <label :for="t.ref" class="ml-2 text-sm font-medium text-gray-400 dark:text-gray-500">[[ t.completed ? 'Done' : 'Pending' ]]</label>
      </div>
        <label>Created:</label>
        <p> [[ new Date(Math.abs(t.ts)).toLocaleString() ]]</p>
        <button @click="del(t.ref)"
        px-4 py-2 bg-red-500 text-white rounded-lg
        >Delete</button>
      </div>
    </div>
  </div>
    <script type="module" src="static/main.js"></script>
  </body>
</html>
```

```javascript
// static/main.js

import * as Vue from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.prod.min.js";

const { ref,createApp, onMounted } = Vue;

const app = createApp({
  delimiters: ["[[", "]]"],
  setup() {
    const todos = ref([]);
    const todo = ref({
      title: "",
      completed: false,
      description: "",
    });

    const get = async () => {
      const res = await fetch("/api/todos");
      const data = await res.json();
      console.log(data)
      todos.value = data;
    };
    const post = async (todo) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      });
      await res.json();
      setTimeout(async () => {
        await get();
      }, 1000);
      
    };
    const put = async (ref_) => {
      const res = await fetch(`/api/todos?ref=${ref_}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await res.json();
      await get();
    };

    const del = async (ref_) => {
      const res = await fetch(`/api/todos?ref=${ref_}`, {
        method: "DELETE",
      });
      await res.text();
      await get();1

    };

    onMounted(async () => {
      await get();
    });

    return {
      todo,
      todos,
      get,
      post,
      put,
      del,
    };
  },
});

app.mount("#app");
```

