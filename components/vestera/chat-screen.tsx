"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useVestera } from "@/contexts/vestera-context";
import { relativeTime, type ChatThread } from "@/lib/vestera/data";
import {
  Button,
  cx,
  IconBack,
  IconChat,
  IconSend,
  KycBadge,
  TextInput,
} from "./ui";
import { EmptyState } from "./ui";
import { VerifiedName } from "./pieces";

export function ChatScreen() {
  const { chats, activeChatId, setActiveChat, now } = useVestera();
  const active = chats.find((c) => c.id === activeChatId) ?? null;

  if (active) return <ThreadView thread={active} onBack={() => setActiveChat(null)} />;

  return (
    <div className="vst-app-bg min-h-full pb-28">
      <header className="vst-safe-top px-4 pt-4">
        <h1 className="vst-display text-2xl font-bold text-[var(--vst-ink)]">Chat</h1>
        <p className="text-sm text-[var(--vst-muted-ink)]">Secure messaging with verified buyers, sellers and agents.</p>
      </header>

      <section className="px-4 pt-4">
        {chats.length === 0 ? (
          <EmptyState
            icon={<IconChat className="h-6 w-6" />}
            title="No conversations yet"
            body="Message a seller from any listing to start a secure, verified conversation."
          />
        ) : (
          <div className="space-y-2">
            {chats.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c.id)}
                  className="vst-press flex w-full items-center gap-3 rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)] p-3 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl vst-hero-grad text-[var(--vst-on-hero)]">
                    <IconChat className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <VerifiedName name={c.peerName} verified={c.peerVerified} className="truncate text-sm" />
                      <span className="shrink-0 text-[11px] text-[var(--vst-faint-ink)]">
                        {relativeTime(c.updatedAt, now)}
                      </span>
                    </div>
                    <p className="vst-clamp-1 text-xs text-[var(--vst-muted-ink)]">{c.listingTitle}</p>
                    <p className="vst-clamp-1 text-xs text-[var(--vst-faint-ink)]">
                      {last ? last.text : "Say hello to start the conversation."}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ThreadView({ thread, onBack }: { thread: ChatThread; onBack: () => void }) {
  const { sendMessage } = useVestera();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length]);

  const submit = () => {
    if (!text.trim()) return;
    sendMessage(thread.id, text);
    setText("");
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing || (e as unknown as { keyCode?: number }).keyCode === 229) return;
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="vst-app-bg flex min-h-full flex-col pb-28">
      <header className="vst-safe-top sticky top-0 z-10 flex items-center gap-3 border-b border-[var(--vst-line)] bg-[var(--vst-panel)]/95 px-3 py-3 backdrop-blur">
        <button onClick={onBack} className="vst-press flex h-9 w-9 items-center justify-center rounded-xl" aria-label="Back">
          <IconBack className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <VerifiedName name={thread.peerName} verified={thread.peerVerified} className="truncate text-sm" />
          <p className="vst-clamp-1 text-[11px] text-[var(--vst-muted-ink)]">
            {thread.listingCode} · {thread.listingTitle}
          </p>
        </div>
        <KycBadge />
      </header>

      <div className="flex-1 space-y-2 px-4 py-4">
        {thread.messages.length === 0 ? (
          <p className="mx-auto max-w-xs pt-8 text-center text-sm text-[var(--vst-muted-ink)]">
            This conversation is secured and both parties are Pi KYC verified. Send a message to begin.
          </p>
        ) : (
          thread.messages.map((m) => (
            <div key={m.id} className={cx("flex", m.from === "me" ? "justify-end" : "justify-start")}>
              <div
                className={cx(
                  "vst-fade-up max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.from === "me"
                    ? "vst-hero-grad text-[var(--vst-on-hero)]"
                    : "border border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-ink)]",
                )}
              >
                <p className="vst-pre">{m.text}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="vst-safe-bottom sticky bottom-0 border-t border-[var(--vst-line)] bg-[var(--vst-panel)] px-3 py-3">
        <div className="flex items-center gap-2">
          <TextInput
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder="Write a message"
            className="rounded-full"
          />
          <Button variant="primary" className="h-11 w-11 shrink-0 rounded-full px-0" onClick={submit} aria-label="Send">
            <IconSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
