import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Load tasks from backend
  const fetchTodos = async () => {
    try {
      const response = await fetch("http://10.0.2.2:5000/todos");
      if (!response.ok) throw new Error("Failed to fetch todos");
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
      Alert.alert("Error", "Could not load tasks.");
    }
  };

  // Add task to backend
  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const response = await fetch("http://10.0.2.2:5000/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      if (!response.ok) throw new Error("Failed to add todo");
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setTask("");
    } catch (err) {
      console.error("Error adding todo:", err);
      Alert.alert("Error", "Could not add task.");
    }
  };

  // Toggle task status (done/undone)
  const toggleTask = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: !currentStatus }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      const updatedTodo = await response.json();

      // Update local state
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
    } catch (err) {
      console.error("Error updating todo:", err);
      Alert.alert("Error", "Could not update task.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo List</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter task..."
        value={task}
        onChangeText={setTask}
      />

      <Button title="Add Task" onPress={addTask} />

      <Text style={styles.heading}>Load Tasks</Text>
      <Button title="Fetch Tasks" onPress={fetchTodos} />

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.todoBox}
            onPress={() => toggleTask(item.id, item.done)}
          >
            <Text
              style={[
                styles.todo,
                { textDecorationLine: item.done ? "line-through" : "none" },
              ]}
            >
              {item.task}
            </Text>
            <Text style={{ color: item.done ? "green" : "red" }}>
              {item.done ? "✅ Done" : "⏳ Pending"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 40,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  todoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  todo: {
    fontSize: 18,
  },
});
