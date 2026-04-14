"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Loader2, BarChart2, Link2, FileText, LogOut, Image, Video, GripVertical } from "lucide-react";
import { MediaInput } from "@/components/MediaInput";

type Sale = { identifier: string; amount: number; status: string; transaction_date: string; linkId?: string; creator?: string };
type Link = { id: string; target: string; label: string; clicks: unknown[] };
type ContentBlock = { id: string; creator: string; type: "image" | "video"; title: string; value: string; display_order: number };

type Tab = "sales" | "links" | "content";

const CREATORS = [
  { slug: "emilly",   label: "Emilly Faria" },
  { slug: "yasmin",   label: "Yasmin Torrez" },
  { slug: "alice",    label: "Alice Montenegro" },
  { slug: "yasminof", label: "Yasmin (OF)" },
  { slug: "of",       label: "Emilly (OF)" },
];

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<Tab>("sales");

  const [sales, setSales] = useState<Sale[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [linkTarget, setLinkTarget] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [filterCreator, setFilterCreator] = useState("emilly");
  const [newCreator, setNewCreator] = useState("emilly");
  const [newType, setNewType] = useState<"image" | "video">("image");
  const [newTitle, setNewTitle] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editValue, setEditValue] = useState("");

  // Drag state
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/auth").then((r) => {
      if (!r.ok) router.replace("/admin/login");
      else { setAuthChecked(true); fetchSales(); fetchLinks(); }
    });
  }, [router]);

  useEffect(() => { if (authChecked) fetchContent(); }, [filterCreator, authChecked]);

  async function logout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.replace("/admin/login");
  }

  async function fetchSales() {
    const res = await fetch("/api/admin/sales");
    const data = await res.json();
    setSales(data.sales || []);
  }

  async function fetchLinks() {
    const res = await fetch("/api/admin/links");
    const data = await res.json();
    setLinks(data.links || []);
  }

  async function fetchContent() {
    const res = await fetch(`/api/admin/content?creator=${filterCreator}`);
    const data = await res.json();
    setBlocks(data.blocks || []);
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/links", {
      method: "POST",
      body: JSON.stringify({ target: linkTarget, label: linkLabel }),
      headers: { "Content-Type": "application/json" },
    });
    setLinkTarget(""); setLinkLabel(""); fetchLinks();
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const nextOrder = blocks.length > 0 ? Math.max(...blocks.map((b) => b.display_order)) + 1 : 0;
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creator: newCreator, type: newType, title: newTitle, value: newValue, display_order: nextOrder }),
    });
    setNewTitle(""); setNewValue("");
    await fetchContent();
    setSaving(false);
  }

  async function deleteBlock(id: string) {
    if (!confirm("Excluir este bloco?")) return;
    await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    fetchContent();
  }

  function startEdit(block: ContentBlock) {
    setEditingId(block.id);
    setEditTitle(block.title ?? "");
    setEditValue(block.value);
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, value: editValue }),
    });
    setEditingId(null);
    fetchContent();
  }

  // ── Drag & drop handlers ─────────────────────────────────────────────────
  function onDragStart(index: number) {
    dragIndex.current = index;
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOver(index);
  }

  function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === dropIndex) { setDragOver(null); return; }

    const reordered = [...blocks];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(dropIndex, 0, moved);

    // Reassign display_order based on new position
    const updated = reordered.map((b, i) => ({ ...b, display_order: i }));
    setBlocks(updated);
    setDragOver(null);
    dragIndex.current = null;

    // Persist
    fetch("/api/admin/content/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated.map((b) => ({ id: b.id, display_order: b.display_order }))),
    });
  }

  function onDragEnd() {
    setDragOver(null);
    dragIndex.current = null;
  }

  // ── Revenue helpers ───────────────────────────────────────────────────────
  function sumPeriod(period: "day" | "week" | "month") {
    const now = new Date();
    return sales
      .filter((s) => s.status === "completed")
      .filter((s) => {
        const d = new Date(s.transaction_date);
        if (period === "day")  return d.toDateString() === now.toDateString();
        if (period === "week") return (now.getTime() - d.getTime()) / 86400000 <= 7;
        return (now.getTime() - d.getTime()) / (86400000 * 30) <= 1;
      })
      .reduce((acc, s) => acc + (Number(s.amount) || 0), 0);
  }

  function revenueForLink(id: string) {
    return sales
      .filter((s) => s.linkId === id && s.status === "completed")
      .reduce((a, b) => a + (Number((b as { amount?: number }).amount) || 0), 0);
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="mx-auto max-w-5xl px-4 py-6">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Painel Admin</h1>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/50 hover:text-white transition"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-white/5 p-1 mb-6 w-fit">
          {([
            { id: "sales",   label: "Vendas",       icon: BarChart2 },
            { id: "links",   label: "Links",         icon: Link2 },
            { id: "content", label: "Conteúdo Pago", icon: FileText },
          ] as { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === id ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* ── SALES ── */}
        {tab === "sales" && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {([
                { label: "Hoje",           period: "day"   as const },
                { label: "Últimos 7 dias", period: "week"  as const },
                { label: "Último mês",     period: "month" as const },
              ]).map(({ label, period }) => (
                <div key={period} className="rounded-xl border border-white/8 bg-white/3 p-4">
                  <p className="text-xs text-white/40 mb-1">{label}</p>
                  <p className="text-xl font-semibold">R$ {sumPeriod(period).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <h2 className="text-sm font-semibold text-white/60 mb-3">Vendas recentes</h2>
            <div className="space-y-2">
              {sales.slice().reverse().map((s) => (
                <div key={s.identifier} className="rounded-xl border border-white/8 bg-white/3 p-3 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/80">{s.identifier}</p>
                    <p className="text-xs text-white/40">{s.transaction_date} · {s.status} · R$ {(s.amount || 0).toString()} · {s.creator ?? "—"}</p>
                    <p className="text-xs text-white/30">link: {s.linkId ?? "—"}</p>
                  </div>
                  <button
                    onClick={async () => {
                      const linkId = prompt("Atribuir a qual link id?");
                      if (linkId) {
                        await fetch("/api/admin/links/attribution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier: s.identifier, linkId }) });
                        fetchSales(); fetchLinks();
                      }
                    }}
                    className="shrink-0 rounded-lg bg-white/8 px-3 py-1.5 text-xs font-medium hover:bg-white/12 transition"
                  >Atribuir</button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── LINKS ── */}
        {tab === "links" && (
          <>
            <form onSubmit={createLink} className="flex gap-2 mb-4">
              <input value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} placeholder="https://..." className="flex-1 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none" />
              <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Rótulo" className="w-40 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 outline-none" />
              <button className="rounded-xl bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Criar</button>
            </form>
            <div className="space-y-2">
              {links.map((l) => (
                <div key={l.id} className="rounded-xl border border-white/8 bg-white/3 p-3">
                  <p className="text-sm font-medium">{l.label} <span className="text-xs text-white/30">/{l.id}</span></p>
                  <a className="text-xs text-[#3b82f6]" href={`/r/${l.id}`} target="_blank" rel="noreferrer">/r/{l.id} →</a>
                  <p className="text-xs text-white/40 mt-1">Clicks: {l.clicks?.length || 0} · Receita: R$ {revenueForLink(l.id).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CONTENT ── */}
        {tab === "content" && (
          <>
            {/* Creator filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CREATORS.map((c) => (
                <button key={c.slug} onClick={() => setFilterCreator(c.slug)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition border ${filterCreator === c.slug ? "bg-[#e89c30] border-[#e89c30] text-black" : "border-white/10 text-white/50 hover:text-white"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Add block form */}
            <div className="rounded-2xl border border-white/8 bg-white/3 p-5 mb-6">
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#e89c30]" />Adicionar conteúdo
              </h2>
              <form onSubmit={addBlock} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Criador</label>
                    <select value={newCreator} onChange={(e) => setNewCreator(e.target.value)}
                      className="rounded-xl border border-white/8 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white outline-none"
                    >
                      {CREATORS.map((c) => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-white/40">Tipo</label>
                    <div className="flex gap-2">
                      {([
                        { value: "image", label: "Imagem", icon: Image },
                        { value: "video", label: "Vídeo",  icon: Video },
                      ] as { value: "image" | "video"; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ value, label, icon: Icon }) => (
                        <button key={value} type="button" onClick={() => setNewType(value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-sm font-medium transition ${newType === value ? "border-[#e89c30] bg-[#e89c30]/10 text-[#e89c30]" : "border-white/8 text-white/40 hover:text-white"}`}
                        >
                          <Icon className="h-4 w-4" />{label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Título</label>
                  <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Título do conteúdo"
                    className="rounded-xl border border-white/8 bg-[#1a1a1a] px-3 py-2.5 text-sm text-white placeholder:text-white/20 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/40">Arquivo ou URL</label>
                  <MediaInput
                    type={newType}
                    creator={newCreator}
                    value={newValue}
                    onChange={setNewValue}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#e89c30] px-5 py-2.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}Adicionar
                  </button>
                </div>
              </form>
            </div>

            {/* Blocks list with drag & drop */}
            <p className="text-xs text-white/40 mb-3">
              {blocks.length} item(s) — {CREATORS.find((c) => c.slug === filterCreator)?.label}
              {blocks.length > 1 && <span className="ml-2 text-white/25">· arraste para reordenar</span>}
            </p>

            {blocks.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/3 p-8 text-center text-sm text-white/30">
                Nenhum conteúdo cadastrado para este criador ainda.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDragOver={(e) => onDragOver(e, index)}
                    onDrop={(e) => onDrop(e, index)}
                    onDragEnd={onDragEnd}
                    className={`rounded-2xl border overflow-hidden transition-all ${
                      dragOver === index ? "border-[#e89c30] scale-[1.01]" : "border-white/8"
                    } bg-white/3`}
                  >
                    {/* Preview */}
                    <div className="relative bg-black group cursor-grab active:cursor-grabbing">
                      {block.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={block.value} alt={block.title} className="w-full max-h-[200px] object-cover" />
                      ) : (
                        <video src={block.value} className="w-full max-h-[200px] object-cover" muted />
                      )}
                      {/* Drag handle overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                        <div className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5">
                          <GripVertical className="h-4 w-4 text-white" />
                          <span className="text-xs text-white font-medium">Arraste para reordenar</span>
                        </div>
                      </div>
                      <span className="absolute top-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-medium text-white/70 uppercase tracking-wider">
                        {block.type === "image" ? "Imagem" : "Vídeo"}
                      </span>
                      <span className="absolute top-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white/50">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Info / edit */}
                    <div className="p-4">
                      {editingId === block.id ? (
                        <div className="flex flex-col gap-2">
                          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Título"
                            className="rounded-lg border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white outline-none"
                          />
                          <MediaInput
                            type={block.type}
                            creator={block.creator}
                            value={editValue}
                            onChange={setEditValue}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(block.id)} className="rounded-lg bg-[#e89c30] px-3 py-1.5 text-xs font-semibold text-black">Salvar</button>
                            <button onClick={() => setEditingId(null)} className="rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white/60">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">{block.title}</p>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => startEdit(block)} className="rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white/60 hover:text-white transition">Editar</button>
                            <button onClick={() => deleteBlock(block.id)} className="rounded-lg bg-red-500/10 p-1.5 text-red-400 hover:bg-red-500/20 transition">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
