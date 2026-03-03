"use client";

import { useState } from "react";
import { createProject, createProjectAndOpen } from "@/lib/actions";

export function CreateProjectForm({ createAndOpen }: { createAndOpen?: boolean } = {}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg btn-primary text-sm font-medium hover:opacity-90 transition-opacity"
      >
        New project
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-elevated p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-4">New project</h2>
            <form
              action={async (fd) => {
                if (createAndOpen) {
                  await createProjectAndOpen(fd);
                } else {
                  await createProject(fd);
                  setOpen(false);
                }
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
                  autoFocus
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] focus:ring-1 focus:ring-[rgb(var(--accent))] outline-none transition"
                  placeholder="e.g. Retail Strategy Q1"
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
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] focus:ring-1 focus:ring-[rgb(var(--accent))] outline-none transition resize-none"
                  placeholder="Optional"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg btn-primary text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
