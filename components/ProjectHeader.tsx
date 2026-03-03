"use client";

import { useState } from "react";
import { updateProject, deleteProject } from "@/lib/actions";
import { Pencil, Trash2 } from "lucide-react";

type Project = {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  notes: string | null;
};

export function ProjectHeader({ project }: { project: Project }) {
  const [editing, setEditing] = useState(false);

  const formatDate = (d: Date | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : "";

  return (
    <div className="flex items-center justify-between mb-8">
      <h1>{project.name}</h1>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[rgb(var(--text-secondary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
      >
        <Pencil className="w-4 h-4" />
        Edit project
      </button>

      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20"
          onClick={() => setEditing(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-4">Edit project</h2>
            <form
              action={async (fd) => {
                await updateProject(project.id, fd);
                setEditing(false);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={project.name}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                    Start
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={formatDate(project.startDate)}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] outline-none focus:border-[rgb(var(--accent))]"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                    End
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={formatDate(project.endDate)}
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] outline-none focus:border-[rgb(var(--accent))]"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  defaultValue={project.notes ?? ""}
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </form>
            <form
              action={deleteProject.bind(null, project.id)}
              onSubmit={(e) => {
                if (!confirm("Delete this project and all its meetings, associates, and client files?")) {
                  e.preventDefault();
                }
              }}
              className="mt-4 pt-4 border-t border-border-subtle"
            >
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
