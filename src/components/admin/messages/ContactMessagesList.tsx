"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, Trash2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { markMessageRead, deleteMessage } from "@/lib/contact/mutations";
import type { ContactMessage } from "@/lib/contact/queries";

type Filter = "all" | "unread";

export default function ContactMessagesList({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const unreadCount = useMemo(() => messages.filter((m) => m.status === "unread").length, [messages]);
  const filtered = filter === "unread" ? messages.filter((m) => m.status === "unread") : messages;

  const handleOpen = async (msg: ContactMessage) => {
    setOpenId(openId === msg.id ? null : msg.id);
    if (msg.status === "unread") {
      setBusyId(msg.id);
      await markMessageRead(msg.id);
      setBusyId(null);
      router.refresh();
    }
  };

  const handleDelete = async (msg: ContactMessage) => {
    if (!confirm(`Delete the message from "${msg.name}" permanently?`)) return;
    setBusyId(msg.id);
    await deleteMessage(msg.id);
    setBusyId(null);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-1.5 rounded-[12px] bg-brand-gray p-1">
        {(
          [
            { value: "all", label: `All ${messages.length}` },
            { value: "unread", label: `Unread ${unreadCount}` },
          ] as { value: Filter; label: string }[]
        ).map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={cn(
              "rounded-[9px] px-3.5 py-1.5 text-sm font-semibold transition-colors",
              filter === opt.value ? "bg-white text-brand-heading shadow-sm" : "text-brand-light hover:text-brand-heading"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-[16px] border border-dashed border-brand-border/70 bg-white px-5 py-10 text-center text-sm text-brand-light">
          No {filter === "unread" ? "unread " : ""}messages.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((msg) => {
            const isOpen = openId === msg.id;
            return (
              <li key={msg.id} className="overflow-hidden rounded-[16px] border border-brand-border/60 bg-white">
                <button
                  type="button"
                  onClick={() => handleOpen(msg)}
                  className="flex w-full items-start justify-between gap-3 p-5 text-left"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {msg.status === "unread" ? (
                      <Circle className="mt-1.5 size-2 shrink-0 fill-brand-primary text-brand-primary" />
                    ) : (
                      <span className="mt-1.5 size-2 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={cn("font-semibold text-brand-heading", msg.status === "unread" && "font-bold")}>{msg.subject}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-brand-light">
                        {msg.name} &middot; {msg.email}
                      </p>
                      {!isOpen && <p className="mt-1.5 line-clamp-1 text-sm text-brand-body">{msg.message}</p>}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-brand-light">{new Date(msg.createdAt).toLocaleDateString()}</span>
                </button>

                {isOpen && (
                  <div className="border-t border-brand-border/60 bg-brand-cream/40 p-5">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-brand-body">{msg.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject}`)}`}
                        className="flex items-center gap-1.5 rounded-[10px] bg-brand-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-primary-dark"
                      >
                        <MailOpen className="size-3.5" />
                        Reply by Email
                      </a>
                      <button
                        type="button"
                        disabled={busyId === msg.id}
                        onClick={() => handleDelete(msg)}
                        className="flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 text-xs font-semibold text-brand-error transition-colors hover:bg-brand-error/10 disabled:opacity-60"
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
