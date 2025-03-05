import { useState } from "react";
import { Task, TaskFilter } from "../../types/tasks";

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [filter, setFilter] = useState<TaskFilter>("all");



  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">todos</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Что нужно сделать?"
            className="flex-1 p-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newTask.trim()}
            className={`px-4 py-2 text-white rounded-md 
              ${newTask.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
          >
            Добавить
          </button>
        </form>
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className="flex items-center gap-2 p-2 border-b transition-all duration-300">
              <input type="checkbox" checked={task.completed} onChange={() => handleToggleTask(task.id, task.completed)}/>
              <span>{task.text}</span>
              <button
                aria-label="Удалить задачу"
                onClick={() => handleDeleteTask(task.id)}
                className="text-red-500 hover:text-red-600"
              >
                ❌
              </button>
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
          {tasks.some(task => task.completed) && (
            <button onClick={handleClearCompleted} className="px-3 py-1 text-red-500 hover:text-red-600">
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
