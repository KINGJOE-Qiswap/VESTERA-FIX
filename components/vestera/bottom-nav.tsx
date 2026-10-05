"use client";

import type { ComponentType } from "react";
import { useVestera } from "@/contexts/vestera-context";
import type { TabId } from "@/lib/vestera/data";
import { cx, IconBrowse, IconChat, IconPlus, IconSearch, IconUser, IconScale, IconPin } from "./ui";

const TABS: Array<{ id: TabId; label: string; Icon: ComponentType<{ className?: string }> }> = [
  { id: "browse", label: "Browse", Icon: IconBrowse },
  { id: "search", label: "Search", Icon: IconSearch },
  { id: "sell", label: "List", Icon: IconPlus },
  { id: "chat", label: "Chat", Icon: IconChat },
  { id: "account", label: "Account", Icon: IconUser },
  { id: "escrow", label: "Escrow", Icon: IconScale },
  { id: "nigeria", label: "Nigeria MAT", Icon: IconPin },
  { id: "agent", label: "Agent", Icon: IconUser },
];

export function BottomNav() {
  const { tab, setTab, chats } = useVestera();
  const unread = chats.reduce((n, c) => n + (c.messages.length > 0 ? 0 : 0), 0);
  return (
    <nav className="vst-safe-bottom absolute inset-x-0 bottom-0 z-[80] border-t border-[var(--vst-line)] bg-[var(--vst-panel)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          const isList = id === "sell";
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="vst-press relative flex flex-1 flex-col items-center gap-1 py-2.5"
              aria-label={label}
            >
              {isList ? (
                <span
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-xl",
                    active ? "vst-hero-grad text-[var(--vst-on-hero)]" : "bg-[var(--vst-ink)] text-[var(--vst-panel)]",
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              ) : (
                <Icon
                  className={cx("h-5 w-5", active ? "text-[var(--vst-accent)]" : "text-[var(--vst-faint-ink)]")}
                />
              )}
              {id === "chat" && unread > 0 ? (
                <span className="absolute right-5 top-1 h-2 w-2 rounded-full bg-[var(--vst-gold)]" />
              ) : null}
              <span
                className={cx(
                  "text-[10px] font-semibold",
                  active ? "text-[var(--vst-ink)]" : "text-[var(--vst-faint-ink)]",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
