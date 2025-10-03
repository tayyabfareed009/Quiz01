const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so frontend can connect
app.use(cors());
app.use(express.json());

// Temporary "database" (in-memory array)
let todos = [];

// GET all todos
app.get("/todos", (req, res) => {
  console.log("📥 GET /todos called");
  res.json(todos);
});

// POST add a new todo
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task) return res.status(400).json({ error: "Task is required" });

  const newTodo = { id: Date.now(), task, done: false };
  todos.push(newTodo);

  console.log("📥 POST /todos called:", newTodo);
  res.json(newTodo);
});

// PUT toggle task done/undone
app.put("/todos/:id", (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  let todo = todos.find((t) => t.id === parseInt(id));
  if (!todo) return res.status(404).json({ error: "Task not found" });

  todo.done = done;
  console.log(`📥 PUT /todos/${id} called:`, todo);

  res.json(todo);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
