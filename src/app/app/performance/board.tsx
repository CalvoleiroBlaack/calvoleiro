"use client";

import { useState } from "react";
import { upsertPerformanceAction } from "@/actions/crud";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge, Card, Modal, Field, EmptyState } from "@/components/ui/card";
import { TrendingUp, Trophy, Activity } from "lucide-react";
import { formatNumber, formatPercent } from "@/lib/utils";

export function PerformanceBoard({ videos, games, performance: perf }: any) {
  const [open, setOpen] = useState(false);
  const perfMap: Record<string, any> = {};
  perf.forEach((p: any) => (perfMap[p.videoId] = p));

  const enriched = videos.map((v: any) => ({
    ...v,
    perf: perfMap[v.id],
    game: games.find((g: any) => g.id === v.gameId),
  }));

  const sortedByViews = [...enriched]
    .filter((v) => v.perf)
    .sort((a, b) => (b.perf.views || 0) - (a.perf.views || 0));

  const totals = enriched.reduce(
    (acc: any, v: any) => {
      if (!v.perf) return acc;
      return {
        views: acc.views + (v.perf.views || 0),
        subs: acc.subs + (v.perf.subscribers || 0),
        ctrSum: acc.ctrSum + (v.perf.ctr || 0),
        retSum: acc.retSum + (v.perf.retention || 0),
        n: acc.n + 1,
      };
    },
    { views: 0, subs: 0, ctrSum: 0, retSum: 0, n: 0 }
  );

  const avgCtr = totals.n ? totals.ctrSum / totals.n : 0;
  const avgRet = totals.n ? totals.retSum / totals.n : 0;

  return (
    <div>
      <div className="grid md:grid-cols-4 gap-3 mb-4">
        <KpiCard icon={Activity} label="Views" value={formatNumber(totals.views)} />
        <KpiCard icon={TrendingUp} label="CTR médio" value={formatPercent(avgCtr)} accent />
        <KpiCard icon={TrendingUp} label="Retenção média" value={formatPercent(avgRet)} accent />
        <KpiCard icon={Trophy} label="Inscritos ganhos" value={formatNumber(totals.subs)} accent />
      </div>

      <div className="flex justify-end mb-3">
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          Registrar métricas
        </Button>
      </div>

      {sortedByViews.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="h-5 w-5" />}
          title="Sem métricas registradas"
          description="Publique vídeos e registre as métricas do YouTube Studio aqui."
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-[10px] uppercase tracking-widest text-muted">
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Título</th>
                  <th className="text-left p-3">Jogo</th>
                  <th className="text-right p-3">Views</th>
                  <th className="text-right p-3">CTR</th>
                  <th className="text-right p-3">Retenção</th>
                  <th className="text-right p-3">Inscritos</th>
                </tr>
              </thead>
              <tbody>
                {sortedByViews.map((v: any, idx: number) => (
                  <tr key={v.id} className="border-b border-border hover:bg-card-2">
                    <td className="p-3 font-mono text-blood-bright">
                      #{idx + 1}
                    </td>
                    <td className="p-3">{v.title}</td>
                    <td className="p-3 text-muted text-xs">
                      {v.game?.name ?? "—"}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {formatNumber(v.perf.views)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      <Badge
                        variant={
                          v.perf.ctr >= 10
                            ? "success"
                            : v.perf.ctr >= 6
                            ? "accent"
                            : v.perf.ctr >= 3
                            ? "warn"
                            : "danger"
                        }
                      >
                        {formatPercent(v.perf.ctr)}
                      </Badge>
                    </td>
                    <td className="p-3 text-right font-mono">
                      {formatPercent(v.perf.retention)}
                    </td>
                    <td className="p-3 text-right font-mono text-acid">
                      +{formatNumber(v.perf.subscribers)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {open && <PerfModal videos={videos} onClose={() => setOpen(false)} />}
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Card>
      <div className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded border border-border bg-bg flex items-center justify-center text-blood-bright">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {label}
          </div>
          <div className={accent ? "text-xl font-bold text-blood-bright" : "text-xl font-bold"}>
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}

function PerfModal({ videos, onClose }: any) {
  const [state, action, pending] = useActionStateCompat(upsertPerformanceAction);
  return (
    <Modal
      open
      onClose={onClose}
      title="Registrar métricas"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" form="perf-form" type="submit">
            {pending ? "..." : "Salvar ▸"}
          </Button>
        </>
      }
    >
      <form id="perf-form" action={(fd) => action(fd)} className="space-y-4">
        <Field label="Vídeo">
          <Select name="videoId" required>
            <option value="">Selecione</option>
            {videos.map((v: any) => (
              <option key={v.id} value={v.id}>{v.title}</option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Views"><Input name="views" type="number" min={0} defaultValue={0} /></Field>
          <Field label="CTR (%)" hint="Ex: 7.2"><Input name="ctr" type="number" step="0.1" min={0} defaultValue={0} /></Field>
          <Field label="Retenção (%)" hint="Ex: 55"><Input name="retention" type="number" step="0.1" min={0} defaultValue={0} /></Field>
          <Field label="Watch Time (min)"><Input name="watchTimeMinutes" type="number" step="0.1" min={0} defaultValue={0} /></Field>
          <Field label="Inscritos ganhos"><Input name="subscribers" type="number" min={0} defaultValue={0} /></Field>
          <Field label="Impressões"><Input name="impressions" type="number" min={0} defaultValue={0} /></Field>
        </div>
      </form>
    </Modal>
  );
}

function useActionStateCompat(actionFn: any) {
  const [state, setState] = useState<any>(null);
  const [pending, setPending] = useState(false);
  const action = (fd: FormData) => {
    setPending(true);
    Promise.resolve(actionFn(state, fd)).then((res: any) => {
      setState(res);
      setPending(false);
      if (res?.success) setTimeout(() => window.location.reload(), 200);
    });
  };
  return [state, action, pending] as const;
}
