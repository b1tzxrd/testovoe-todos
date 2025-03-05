import { Task } from "../types/tasks";

const STORAGE_KEY = 'todos';

const loadTodos = (): Task[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

const saveTodos = (todos: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
};

export const fetchTodos = async (): Promise<Task[]> => {
    return loadTodos();
};

export const addTask = async (text: string): Promise<Task> => {
    const todos = loadTodos();
    const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
    };
    const updatedTodos = [...todos, newTask];
    saveTodos(updatedTodos);
    return newTask;
};

export const toggleTask = async (id: string, completed: boolean): Promise<Task> => {
    const todos = loadTodos();
    const updatedTodos = todos.map(task => 
        task.id === id ? { ...task, completed } : task
    );
    saveTodos(updatedTodos);
    return updatedTodos.find(task => task.id === id)!;  // гарантируем, что найдём
};

export const deleteTask = async (id: string): Promise<void> => {
    const todos = loadTodos();
    const updatedTodos = todos.filter(task => task.id !== id);
    saveTodos(updatedTodos);
};

export const deleteCompletedTasks = async (): Promise<void> => {
    const todos = loadTodos();
    const updatedTodos = todos.filter(task => !task.completed);
    saveTodos(updatedTodos);
};
