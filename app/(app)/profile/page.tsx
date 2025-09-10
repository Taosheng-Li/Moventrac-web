"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfilePage() {
  const [me, setMe] = useState<any>(null);
  const [perfs, setPerfs] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [rMe, rP, rT] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/performances"),
          fetch("/api/templates"),
        ]);
        const [meJson, pJson, tJson] = await Promise.all([
          rMe.ok ? rMe.json() : null,
          rP.ok ? rP.json() : [],
          rT.ok ? rT.json() : [],
        ]);
        if (!mounted) return;
        setMe(meJson);
        setPerfs(Array.isArray(pJson) ? pJson : []);
        setTemplates(Array.isArray(tJson) ? tJson : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const total = perfs.length;
  const avgAcc = useMemo(
    () => (total ? Math.round(perfs.reduce((s, x) => s + (x.accuracyPercent || 0), 0) / total) : 0),
    [perfs, total]
  );
  const totalDur = useMemo(
    () => (total ? perfs.reduce((s, x) => s + (x.durationSeconds || 0), 0) : 0),
    [perfs, total]
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Profile</h1>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 space-y-1">
            <p>
              <span className="text-gray-500">Username: </span>
              {me?.username || "-"}
            </p>
            <p>
              <span className="text-gray-500">Email: </span>
              {me?.email || "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Stat title="Total Workouts" value={String(total)} />
        <Stat title="Average Accuracy" value={`${avgAcc}%`} />
        <Stat title="Total Duration" value={`${totalDur}s`} />
        <Stat title="Templates" value={String(templates.length)} />
      </section>

      <Card>
        <CardHeader>
          <h2 className="font-semibold">Recent Workouts</h2>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {perfs.slice(0, 5).map((x: any) => (
              <li key={x._id} className="py-2 text-sm flex justify-between">
                <div>
                  <div className="font-medium">
                    {x.name} <span className="text-gray-500">({x.type || "No type"})</span>
                  </div>
                  <div className="text-gray-600">{x.date}</div>
                </div>
                <div className="text-gray-700">{x.repetitions} reps · {x.accuracyPercent}% · {x.durationSeconds}s</div>
              </li>
            ))}
            {!loading && perfs.length === 0 && (
              <li className="py-2 text-gray-500">No workout records</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
