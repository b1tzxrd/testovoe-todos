import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import App from "../components/app/App";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/tasksApi", () => ({
    fetchTodos: vi.fn(() => Promise.resolve([])),
    addTask: vi.fn((text: string) => Promise.resolve({ id: "1", text, completed: false })),
    toggleTask: vi.fn((id: string) =>
        Promise.resolve({ id, completed: true }) 
    ),

    deleteCompletedTasks: vi.fn(() => Promise.resolve()),
    deleteTask: vi.fn(() => Promise.resolve()),
}));

describe("App Component", () => {
    beforeEach(async () => {
        await act(async () => {
            render(<App />);
        });
    });

    it("рендерит заголовок", () => {
        expect(screen.getByText("todos")).toBeInTheDocument();
    });

    it("начально рендерит пустой список задач", () => {
        const tasks = screen.queryAllByRole("listitem");
        expect(tasks.length).toBe(0);
    });

    it("не добавляет пустую задачу", async () => {
        const addButton = screen.getByText("Добавить");

        await act(async () => {
            fireEvent.click(addButton);
        });

        const tasks = screen.queryAllByRole("listitem");
        expect(tasks.length).toBe(0);
    });

    it("добавляет новую задачу", async () => {
        const input = screen.getByPlaceholderText("Что нужно сделать?");
        const addButton = screen.getByText("Добавить");

        await act(async () => {
            fireEvent.change(input, { target: { value: "Новая задача" } });
            fireEvent.click(addButton);
        });

        expect(await screen.findByText("Новая задача")).toBeInTheDocument();
    });

    it("переключает состояние задачи", async () => {
        const input = screen.getByPlaceholderText("Что нужно сделать?");
        const addButton = screen.getByText("Добавить");

        await act(async () => {
            fireEvent.change(input, { target: { value: "Сделать тесты" } });
            fireEvent.click(addButton);
        });

        const checkbox = await screen.findByRole("checkbox");

        await act(async () => {
            fireEvent.click(checkbox);
        });

        await waitFor(() => {
            expect(checkbox).toBeChecked();
        });
    });

    it("кнопка 'Clear completed' исчезает, если нет завершенных задач", () => {
        const clearButton = screen.queryByText("Clear completed");
        expect(clearButton).not.toBeInTheDocument();
    });

    it("удаляет одну задачу", async () => {
        const input = screen.getByPlaceholderText("Что нужно сделать?");
        const addButton = screen.getByText("Добавить");

        await act(async () => {
            fireEvent.change(input, { target: { value: "Удаляемая задача" } });
            fireEvent.click(addButton);
        });

        await screen.findByText("Удаляемая задача");

        const deleteButton = await screen.findByRole("button", { name: /удалить/i });

        await act(async () => {
            fireEvent.click(deleteButton);
        });

        await waitFor(() => {
            expect(screen.queryByText("Удаляемая задача")).not.toBeInTheDocument();
        });
    });

    it("очищает завершенные задачи", async () => {
        const input = screen.getByPlaceholderText("Что нужно сделать?");
        const addButton = screen.getByText("Добавить");

        await act(async () => {
            fireEvent.change(input, { target: { value: "Завершить проект" } });
            fireEvent.click(addButton);
        });

        const checkbox = await screen.findByRole("checkbox");

        await act(async () => {
            fireEvent.click(checkbox);
        });

        const clearButton = screen.getByText("Clear completed");

        await act(async () => {
            fireEvent.click(clearButton);
        });

        await waitFor(() => {
            expect(screen.queryByText("Завершить проект")).not.toBeInTheDocument();
        });
    });
});
