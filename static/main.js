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
