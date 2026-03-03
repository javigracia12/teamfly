"use client";

import Link from "next/link";
import { useState } from "react";
import type { Associate } from "@prisma/client";
import { createAssociate, deleteAssociate } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";

type AssociateWithCount = Associate & {
  _count: { tasks: number; feedback: number };
};

type Props = { projectId: string; associates: AssociateWithCount[] };

export function AssociateList({ projectId, associates }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Associates</h2>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add associate
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 rounded-xl border border-border-subtle bg-surface-elevated p-4">
          <form
            action={async (fd) => {
              await createAssociate(projectId, fd);
              setIsCreating(false);
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] w-48 focus:border-[rgb(var(--accent))] outline-none"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1">
                Role
              </label>
              <input
                id="role"
                name="role"
                className="px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] w-36 focus:border-[rgb(var(--accent))] outline-none"
                placeholder="Consultant"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 rounded-lg btn-primary text-sm font-medium"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {associates.length === 0 && !isCreating ? (
        <p className="text-[rgb(var(--text-tertiary))] py-8 text-center rounded-xl border border-border-subtle bg-surface-elevated">
          No associates yet. Add your team to track workload and feedback.
        </p>
      ) : (
        <ul className="space-y-2">
          {associates.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-4 group"
            >
              <Link
                href={`/project/${projectId}/associate/${a.id}`}
                className="flex-1 min-w-0 hover:opacity-90 transition-opacity"
              >
                <p className="font-medium text-[rgb(var(--text))]">{a.name}</p>
                <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                  {a.role ?? "—"} · {a._count.tasks} tasks · {a._count.feedback} feedback
                </p>
              </Link>
              <form action={deleteAssociate.bind(null, projectId, a.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="submit"
                  className="p-2 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-red-500/10 hover:text-red-600"
                  aria-label="Delete associate"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
