"use client";

import { useState } from "react";
import type { ClientFile } from "@prisma/client";
import { updateClientFile } from "@/lib/actions";

type Props = { projectId: string; client: ClientFile };

export function ClientFileDetail({ projectId, client }: Props) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="space-y-8">
      {editing ? (
        <form
          action={async (fd) => {
            await updateClientFile(projectId, client.id, fd);
            setEditing(false);
          }}
          className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                Client name
              </label>
              <input
                id="clientName"
                name="clientName"
                required
                defaultValue={client.clientName}
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
                Role
              </label>
              <input
                id="role"
                name="role"
                defaultValue={client.role ?? ""}
                placeholder="e.g. Sponsor, PMO"
                className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="priorities" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
              Priorities
            </label>
            <textarea
              id="priorities"
              name="priorities"
              rows={4}
              defaultValue={client.priorities ?? ""}
              placeholder="List or describe key priorities for this client…"
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none resize-none"
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-1.5">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={client.notes ?? ""}
              placeholder="Additional notes…"
              className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none resize-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg btn-primary text-sm font-medium">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{client.clientName}</h1>
              <p className="text-[rgb(var(--text-tertiary))] mt-1">{client.role ?? "—"}</p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[rgb(var(--text))] border border-border-subtle hover:bg-surface-muted transition-colors"
            >
              Edit
            </button>
          </div>
          {client.priorities ? (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Priorities</h2>
              <p className="text-[rgb(var(--text))] whitespace-pre-wrap">{client.priorities}</p>
            </div>
          ) : null}
          {client.notes ? (
            <div>
              <h2 className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">Notes</h2>
              <p className="text-[rgb(var(--text))] whitespace-pre-wrap">{client.notes}</p>
            </div>
          ) : null}
          {!client.priorities && !client.notes && (
            <p className="text-[rgb(var(--text-tertiary))] text-sm">No priorities or notes. Click Edit to add.</p>
          )}
        </div>
      )}
    </div>
  );
}
