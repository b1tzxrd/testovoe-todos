import { useEffect, useState, useCallback, useMemo } from "react";
import { fetchTodos, addTask, toggleTask, deleteCompletedTasks } from "../../api/tasksApi";
import { Task, TaskFilter } from "../../types/tasks";


export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => {
    fetchTodos().then(setTasks);
  }, []);

  const handleAddTask = useCallback(async () => {
    if (newTask.trim()) {
      const createdTask = await addTask(newTask);
      if (createdTask) {
        setTasks(prev => [...prev, createdTask]);
        setNewTask("");
      }
    }
  }, [newTask]);

  const handleToggleTask = useCallback(async (id: string, completed: boolean) => {
    await toggleTask(id, completed);
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const completedTasks = tasks.filter(task => task.completed);
    await deleteCompletedTasks(completedTasks);
    setTasks(prev => prev.filter(task => !task.completed));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter(task => !task.completed);
      case "completed":
        return tasks.filter(task => task.completed);
      case "all":
      default:
        return tasks;
    }
  }, [tasks, filter]);
  

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">todos</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <div className="flex gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Что нужно сделать?"
            className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Добавить
          </button>
        </div>
        <ul>
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`flex items-center gap-2 p-2 border-b ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id, task.completed)}
              />
              {task.text}
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>{tasks.filter(task => !task.completed).length} items left</span>
          <div className="flex gap-2">
            <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-md ${filter === "all" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
              All
            </button>
            <button onClick={() => setFilter("active")} className={`px-3 py-1 rounded-md ${filter === "active" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
              Active
            </button>
            <button onClick={() => setFilter("completed")} className={`px-3 py-1 rounded-md ${filter === "completed" ? "bg-gray-200" : "hover:bg-gray-100"}`}>
              Completed
            </button>
          </div>
          <button onClick={handleClearCompleted} className="px-3 py-1 text-red-500 hover:text-red-600">
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
}
