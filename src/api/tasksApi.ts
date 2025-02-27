import baseURL from "../config/baseUrl";

export const fetchTodos = async () => {
    try {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error("Ошибка загрузки данных");
        return response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const addTask = async (text: string) => {
    try {
        const response = await fetch(baseURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, completed: false }),
        });
        if (!response.ok) throw new Error("Ошибка при добавлении задачи");
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const toggleTask = async (id: string, completed: boolean) => {
    try {
        const response = await fetch(`${baseURL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });
        if (!response.ok) throw new Error("Ошибка обновления задачи");
        return response.json();
    } catch (error) {
        console.error(error);
    }
};

export const deleteTask = async (id: string) => {
    try {
        const response = await fetch(`${baseURL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Ошибка при удалении задачи");
    } catch (error) {
        console.error("Ошибка при удалении задачи", error);
    }
}

export const deleteCompletedTasks = async (completedTasks: { id: string }[]) => {
    try {
        await Promise.all(completedTasks.map(task =>
            fetch(`${baseURL}/${task.id}`, { method: "DELETE" })
        ));
    } catch (error) {
        console.error("Ошибка при удалении завершённых задач", error);
    }
};
