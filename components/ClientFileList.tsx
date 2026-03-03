"use client";

import Link from "next/link";
import { useState } from "react";
import type { ClientFile } from "@prisma/client";
import { createClientFile, deleteClientFile } from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";

type Props = { projectId: string; clientFiles: ClientFile[] };

export function ClientFileList({ projectId, clientFiles }: Props) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Client files</h2>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add client
        </button>
      </div>

      {isCreating && (
        <div className="mb-4 rounded-xl border border-border-subtle bg-surface-elevated p-5">
          <form
            action={async (fd) => {
              await createClientFile(projectId, fd);
              setIsCreating(false);
            }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="clientName" className="block text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1">
                  Client name
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1">
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
                  placeholder="Sponsor / PMO"
                />
              </div>
            </div>
            <div>
              <label htmlFor="priorities" className="block text-xs font-medium text-[rgb(var(--text-tertiary))] mb-1">
                Priorities
              </label>
              <textarea
                id="priorities"
                name="priorities"
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none resize-none"
                placeholder="Top priorities for this client"
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

      {clientFiles.length === 0 && !isCreating ? (
        <p className="text-[rgb(var(--text-tertiary))] py-8 text-center rounded-xl border border-border-subtle bg-surface-elevated">
          No client files yet. Add clients to track roles and priorities.
        </p>
      ) : (
        <ul className="space-y-2">
          {clientFiles.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface-elevated p-4 group"
            >
              <Link
                href={`/project/${projectId}/client/${c.id}`}
                className="flex-1 min-w-0 hover:opacity-90 transition-opacity"
              >
                <p className="font-medium text-[rgb(var(--text))]">{c.clientName}</p>
                <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                  {c.role ?? "—"}
                </p>
              </Link>
              <form action={deleteClientFile.bind(null, projectId, c.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="submit"
                  className="p-2 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-red-500/10 hover:text-red-600"
                  aria-label="Delete client"
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
