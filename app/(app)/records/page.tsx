"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Perf = {
  _id: string;
  username: string;
  name: string;
  repetitions: number;
  accuracyPercent: number;
  durationSeconds: number;
  date: string;
  speeds: number[];
  type?: string;
};

export default function RecordsPage() {
  const [data, setData] = useState<Perf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<
    "date_desc" | "date_asc" | "acc_desc" | "acc_asc" | "reps_desc" | "reps_asc"
  >("date_desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selected, setSelected] = useState<Perf | null>(null);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/performances", { cache: "no-store" });
      const list = await r.json();
      setData(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const types = useMemo(
    () => Array.from(new Set(data.map((x) => x.type || "Uncategorized"))),
    [data]
  );
  const filtered = useMemo(
    () =>
      data.filter((x) => {
        const matchType =
          !typeFilter || (x.type || "Uncategorized") === typeFilter;
        const matchQ = !q || x.name.toLowerCase().includes(q.toLowerCase());
        const inFrom = !from || x.date >= from;
        const inTo = !to || x.date <= to;
        return matchType && matchQ && inFrom && inTo;
      }),
    [data, typeFilter, q, from, to]
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      switch (sort) {
        case "date_asc":
          return a.date.localeCompare(b.date);
        case "date_desc":
          return b.date.localeCompare(a.date);
        case "acc_asc":
          return (a.accuracyPercent || 0) - (b.accuracyPercent || 0);
        case "acc_desc":
          return (b.accuracyPercent || 0) - (a.accuracyPercent || 0);
        case "reps_asc":
          return (a.repetitions || 0) - (b.repetitions || 0);
        case "reps_desc":
          return (b.repetitions || 0) - (a.repetitions || 0);
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageItems = useMemo(
    () => sorted.slice((page - 1) * pageSize, page * pageSize),
    [sorted, page]
  );

  async function onDelete(id: string) {
    if (!confirm("Delete this record?")) return;
    const r = await fetch(`/api/performances/${id}`, { method: "DELETE" });
    if (r.ok) {
      setData((prev) => prev.filter((x) => x._id !== id));
    } else {
      alert("Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Workout Records</h1>

      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ maxWidth: 220 }}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
        <Input
          type="date"
          value={from}
          onChange={(e) => {
            setPage(1);
            setFrom(e.target.value);
          }}
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => {
            setPage(1);
            setTo(e.target.value);
          }}
        />
        <Select value={sort} onChange={(e) => setSort(e.target.value as any)}>
          <option value="date_desc">Date ↓</option>
          <option value="date_asc">Date ↑</option>
          <option value="acc_desc">Accuracy ↓</option>
          <option value="acc_asc">Accuracy ↑</option>
          <option value="reps_desc">Reps ↓</option>
          <option value="reps_asc">Reps ↑</option>
        </Select>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <Table className="min-w-full">
          <THead className="bg-gray-50 text-gray-600">
            <TR>
              <TH>Date</TH>
              <TH>Name</TH>
              <TH>Type</TH>
              <TH>Reps</TH>
              <TH>Accuracy</TH>
              <TH>Duration</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody className="divide-y">
            {loading && (
              <TR>
                <TD colSpan={7}>Loading…</TD>
              </TR>
            )}
            {!loading &&
              pageItems.map((x) => (
                <TR key={x._id} className="hover:bg-gray-50">
                  <TD className="whitespace-nowrap">{x.date}</TD>
                  <TD
                    className="cursor-pointer underline"
                    onClick={() => setSelected(x)}
                  >
                    {x.name}
                  </TD>
                  <TD>{x.type || "Uncategorized"}</TD>
                  <TD>{x.repetitions}</TD>
                  <TD>{x.accuracyPercent}%</TD>
                  <TD>{x.durationSeconds}s</TD>
                  <TD className="space-y-2 md:space-x-2 md:space-y-0 md:flex md:justify-end">
                    <Button variant="outline" onClick={() => setSelected(x)}>
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(x._id)}
                    >
                      Delete
                    </Button>
                  </TD>
                </TR>
              ))}
            {!loading && sorted.length === 0 && (
              <TR>
                <TD colSpan={7}>No data</TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {sorted.length} items · page {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name || "Details"}
      >
        {selected && (
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              {selected.date} · {selected.type || "Uncategorized"} ·{" "}
              {selected.repetitions} reps · {selected.accuracyPercent}% ·{" "}
              {selected.durationSeconds}s
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selected.speeds.map((v, i) => ({ i, v }))}>
                  <XAxis dataKey="i" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => String(value)}
                    labelFormatter={(l) => `Index ${l}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#0ea5e9"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
