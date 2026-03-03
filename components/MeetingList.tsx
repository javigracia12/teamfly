"use client";

import { useState } from "react";
import type { Meeting } from "@prisma/client";
import { createMeeting, updateMeeting, deleteMeeting } from "@/lib/actions";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Props = { projectId: string; meetings: Meeting[] };

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MeetingList({ projectId, meetings }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Key meetings</h2>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[rgb(var(--accent))] hover:bg-[rgb(var(--accent)/0.08)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add meeting
        </button>
      </div>

      {isCreating && (
        <MeetingForm
          projectId={projectId}
          onClose={() => setIsCreating(false)}
          onSuccess={() => setIsCreating(false)}
          action={createMeeting.bind(null, projectId)}
        />
      )}

      {meetings.length === 0 && !isCreating ? (
        <p className="text-[rgb(var(--text-tertiary))] py-8 text-center rounded-xl border border-border-subtle bg-surface-elevated">
          No meetings yet. Add one to track key dates.
        </p>
      ) : (
        <ul className="space-y-2">
          {meetings.map((m) => (
            <li
              key={m.id}
              className={`rounded-xl border border-border-subtle bg-surface-elevated ${
                editingId === m.id ? "p-4" : "flex items-center gap-4 p-4"
              }`}
            >
              {editingId === m.id ? (
                <MeetingForm
                  projectId={projectId}
                  meeting={m}
                  onClose={() => setEditingId(null)}
                  onSuccess={() => setEditingId(null)}
                  action={updateMeeting.bind(null, projectId, m.id)}
                />
              ) : (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[rgb(var(--text))]">{m.title}</p>
                    <p className="text-sm text-[rgb(var(--text-tertiary))] mt-0.5">
                      {formatDate(m.scheduledAt)}
                    </p>
                    {m.notes && (
                      <p className="text-sm text-[rgb(var(--text-secondary))] mt-2 whitespace-pre-wrap">{m.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(m.id)}
                      className="p-2 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-surface-muted hover:text-[rgb(var(--text))] transition-colors"
                      aria-label="Edit meeting"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <form action={deleteMeeting.bind(null, projectId, m.id)}>
                      <button
                        type="submit"
                        className="p-2 rounded-lg text-[rgb(var(--text-tertiary))] hover:bg-red-500/10 hover:text-red-600 transition-colors"
                        aria-label="Delete meeting"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MeetingForm({
  projectId,
  meeting,
  onClose,
  onSuccess,
  action,
}: {
  projectId: string;
  meeting?: Meeting;
  onClose: () => void;
  onSuccess: () => void;
  action: (formData: FormData) => Promise<void>;
}) {
  const defaultDate = meeting
    ? new Date(meeting.scheduledAt).toISOString().slice(0, 16)
    : "";

  return (
    <form
      action={async (fd) => {
        await action(fd);
        onSuccess();
      }}
      className="flex flex-col gap-4 w-full"
    >
      <input type="hidden" name="projectId" value={projectId} />
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <input
          name="title"
          required
          defaultValue={meeting?.title}
          placeholder="Meeting title"
          className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none focus:ring-1 focus:ring-[rgb(var(--accent))]"
        />
        <input
          name="scheduledAt"
          type="datetime-local"
          required
          defaultValue={defaultDate}
          className="w-full sm:w-auto min-w-0 px-3 py-2 rounded-lg border border-border-subtle bg-surface text-[rgb(var(--text))] focus:border-[rgb(var(--accent))] outline-none focus:ring-1 focus:ring-[rgb(var(--accent))]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="meeting-notes" className="text-sm font-medium text-[rgb(var(--text-secondary))]">
          Notes
        </label>
        <textarea
          id="meeting-notes"
          name="notes"
          defaultValue={meeting?.notes ?? ""}
          placeholder="Agenda, outcomes, action items…"
          rows={6}
          className="w-full min-h-[140px] px-3 py-3 rounded-xl border border-border-subtle bg-surface text-[rgb(var(--text))] placeholder:text-[rgb(var(--text-tertiary))] focus:border-[rgb(var(--accent))] outline-none focus:ring-1 focus:ring-[rgb(var(--accent))] resize-y leading-relaxed"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-[rgb(var(--text-secondary))] hover:bg-surface-muted text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg btn-primary text-sm font-medium"
        >
          {meeting ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
}
