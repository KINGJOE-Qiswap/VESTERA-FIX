"use client";

import { useState } from "react";
import { useVestera } from "@/contexts/vestera-context";
import { Button, Card, Field, TextInput, Pill } from "./ui";
import { PiPaymentCard } from "./pi-payment-button";

export function AgentDashboard() {
  const { agents, registerAgent, myListings, setTab } = useVestera(); const [username, setUsername] = useState("");
  const me = agents.find((a) => a.username === username.trim()); const count = myListings.filter((l) => l.agentId === me?.id).length;
  return <section className="space-y-4 p-4 pb-24"><div><p className="vst-eyebrow">Professional workspace</p><h1 className="vst-display text-3xl font-bold text-[var(--vst-ink)]">Agent Dashboard</h1><p className="mt-1 text-sm text-[var(--vst-muted-ink)]">Manage up to 10 property listings under your agent identity.</p></div>{me ? <Card className="space-y-4 p-4"><div className="flex items-center justify-between"><div><p className="font-semibold text-[var(--vst-ink)]">@{me.username}</p><p className="text-xs text-[var(--vst-muted-ink)]">{count}/10 properties listed</p></div><Pill tone={me.isVerified ? "avail" : "offer"}>{me.isVerified ? "Verified Agent" : "Pending review"}</Pill></div><Button variant="primary" className="w-full" disabled={count >= 10} onClick={() => setTab("sell")}>List property for this agent</Button><PiPaymentCard purpose="listing" /></Card> : <Card className="space-y-3 p-4"><p className="font-semibold text-[var(--vst-ink)]">Register as a VESTERA agent</p><Field label="Pi username"><TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_pi_username" /></Field><Button variant="primary" className="w-full" disabled={!username.trim()} onClick={() => registerAgent(username)}>Submit agent application</Button></Card>}<Card className="p-4"><p className="font-semibold text-[var(--vst-ink)]">Agent standards</p><ul className="mt-2 space-y-2 text-sm text-[var(--vst-muted-ink)]"><li>• Maximum 10 active properties per agent</li><li>• Verified Agent badge appears on approved listings</li><li>• Pi identity and property details remain visible for trust</li></ul></Card></section>;
}
