"use client";

import { useState } from "react";
import type { Associate, Task, Feedback } from "@prisma/client";
import {
  updateAssociate,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "@/lib/actions";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Props = {
  projectId: string;
  associate: Associate;
  tasks: Task[];
  feedback: Feedback[];
};

const STATUS_OPTIONS = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

export function AssociateDetail({
  projectId,
  associate,
  tasks,
  feedback,
}: Props) {
  const [editingName, setEditingName] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const [newFeedback, setNewFeedback] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {editingName ? (
          <form
            action={async (fd) => {
              await updateAssociate(projectId, associate.id, fd);
              setEditingName(false);
            }}
            className="flex flex-wrap items-center gap-3"
          >
            <input
              name="name"
              required
              defaultValue={associate.name}
              className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] text-lg font-medium focus:border-[rgb(var(--accent))] outline-none"
            />
            <input
              name="role"
              defaultValue={associate.role ?? ""}
              placeholder="Role"
              className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
            />
            <button type="submit" className="px-3 py-2 rounded-lg btn-primary text-sm font-medium">
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingName(false)}
              className="px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{associate.name}</h1>
            <p className="text-[rgb(var(--text-tertiary))] mt-1">{associate.role ?? "—"}</p>
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="mt-2 flex items-center gap-1.5 text-sm text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text))] transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        )}
      </div>

      {/* On their plate */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">On their plate</h2>
          <button
            type="button"
            onClick={() => setNewTask(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>

        {newTask && (
          <div className="mb-4 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <form
              action={async (fd) => {
                await createTask(associate.id, fd);
                setNewTask(false);
              }}
              className="flex flex-wrap items-end gap-3"
            >
              <div className="flex-1 min-w-[200px]">
                <input
                  name="title"
                  required
                  placeholder="Task title"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
                />
              </div>
              <select
                name="status"
                className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setNewTask(false)} className="px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-2 rounded-lg btn-primary text-sm font-medium">
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {tasks.length === 0 && !newTask ? (
          <p className="text-[rgb(var(--text-tertiary))] py-6 text-center rounded-xl border border-border-subtle bg-surface-elevated text-sm">
            No tasks. Add what they’re working on.
          </p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3"
              >
                {editingTaskId === t.id ? (
                  <form
                    action={async (fd) => {
                      await updateTask(associate.id, t.id, fd);
                      setEditingTaskId(null);
                    }}
                    className="flex flex-1 items-center gap-3 flex-wrap"
                  >
                    <input
                      name="title"
                      required
                      defaultValue={t.title}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
                    />
                    <select
                      name="status"
                      defaultValue={t.status}
                      className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] outline-none"
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-sm text-[rgb(var(--accent))] font-medium">
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingTaskId(null)} className="text-sm text-[rgb(var(--text-secondary))]">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <form action={toggleTaskStatus.bind(null, associate.id, t.id, t.status === "done" ? "todo" : "done")} className="shrink-0">
                      <button
                        type="submit"
                        className="flex items-center justify-center w-6 h-6 rounded-md border-2 border-border hover:border-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
                        title={t.status === "done" ? "Mark not done" : "Mark done"}
                        aria-label={t.status === "done" ? "Mark not done" : "Mark done"}
                      >
                        {t.status === "done" && (
                          <svg className="w-3.5 h-3.5 text-[rgb(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </form>
                    <span className={`flex-1 font-medium ${t.status === "done" ? "line-through text-[rgb(var(--text-tertiary))]" : "text-[rgb(var(--text))]"}`}>
                      {t.title}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        t.status === "done"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : t.status === "in_progress"
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-surface-muted text-[rgb(var(--text-secondary))]"
                      }`}
                    >
                      {STATUS_OPTIONS.find((o) => o.value === t.status)?.label ?? t.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingTaskId(t.id)}
                        className="p-1.5 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
                        aria-label="Edit task"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <form action={deleteTask.bind(null, associate.id, t.id)}>
                        <button
                          type="submit"
                          className="p-1.5 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-red-500/10 hover:text-red-600"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Feedback */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Feedback</h2>
          <button
            type="button"
            onClick={() => setNewFeedback(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add feedback
          </button>
        </div>

        {newFeedback && (
          <div className="mb-4 rounded-xl border border-border-subtle bg-surface-elevated p-4">
            <form
              action={async (fd) => {
                await createFeedback(associate.id, fd);
                setNewFeedback(false);
              }}
              className="space-y-3"
            >
              <textarea
                name="content"
                required
                rows={3}
                placeholder="Write feedback for this associate…"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none resize-none"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setNewFeedback(false)} className="px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted">
                  Cancel
                </button>
                <button type="submit" className="px-3 py-2 rounded-lg btn-primary text-sm font-medium">
                  Add
                </button>
              </div>
            </form>
          </div>
        )}

        {feedback.length === 0 && !newFeedback ? (
          <p className="text-[rgb(var(--text-tertiary))] py-6 text-center rounded-xl border border-border-subtle bg-surface-elevated text-sm">
            No feedback yet. Add notes to track performance and development.
          </p>
        ) : (
          <ul className="space-y-3">
            {feedback.map((f) => (
              <li
                key={f.id}
                className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
              >
                {editingFeedbackId === f.id ? (
                  <form
                    action={async (fd) => {
                      await updateFeedback(associate.id, f.id, fd);
                      setEditingFeedbackId(null);
                    }}
                    className="space-y-3"
                  >
                    <textarea
                      name="content"
                      required
                      defaultValue={f.content}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none resize-none"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="text-sm font-medium text-[rgb(var(--accent))]">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingFeedbackId(null)} className="text-sm text-[rgb(var(--text-secondary))]">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="text-[rgb(var(--text))] whitespace-pre-wrap">{f.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-[rgb(var(--text-tertiary))]">
                        {new Date(f.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingFeedbackId(f.id)}
                          className="p-1.5 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))]"
                          aria-label="Edit feedback"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <form action={deleteFeedback.bind(null, associate.id, f.id)}>
                          <button
                            type="submit"
                            className="p-1.5 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-red-500/10 hover:text-red-600"
                            aria-label="Delete feedback"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
