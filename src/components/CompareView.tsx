"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ComparisonProfile } from "@/lib/queries";
import { RatingGauge } from "@/components/RatingGauge";

function formatAzn(n: number) {
  return `${n.toLocaleString("az-AZ")} ₼`;
}

function profileLabel(p: ComparisonProfile) {
  return `${p.brandName} ${p.modelName} (${p.yearFrom}–${p.yearTo}, ${p.engine})`;
}

const selectClass =
  "w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm outline-none focus:border-catalog-500";

export function CompareView({ catalog }: { catalog: ComparisonProfile[] }) {
  const [slotIds, setSlotIds] = useState<(number | "")[]>(["", "", ""]);

  const sorted = useMemo(
    () => [...catalog].sort((a, b) => profileLabel(a).localeCompare(profileLabel(b), "az")),
    [catalog]
  );

  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

  const selected = slotIds
    .map((id) => (id === "" ? null : byId.get(id) ?? null))
    .filter((p): p is ComparisonProfile => p !== null);

  function setSlot(index: number, value: string) {
    const next = [...slotIds];
    next[index] = value === "" ? "" : Number(value);
    setSlotIds(next);
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {slotIds.map((id, i) => (
          <select
            key={i}
            className={selectClass}
            value={id}
            onChange={(e) => setSlot(i, e.target.value)}
          >
            <option value="">{i === 0 ? "1-ci maşını seçin" : i === 1 ? "2-ci maşını seçin" : "3-cü maşını seçin (istəyə bağlı)"}</option>
            {sorted.map((p) => (
              <option key={p.id} value={p.id}>
                {profileLabel(p)}
              </option>
            ))}
          </select>
        ))}
      </div>

      {selected.length < 2 ? (
        <p className="mt-8 text-center text-foreground/60">
          Müqayisə etmək üçün ən azı 2 maşın seçin.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-xl border border-border-subtle bg-surface p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-catalog-600">
                {p.brandName}
              </p>
              <h3 className="mt-0.5 text-lg font-bold text-foreground">{p.modelName}</h3>
              <p className="text-sm text-foreground/60">
                {p.yearFrom}–{p.yearTo} · {p.engine}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <RatingGauge label="Təhl." score={p.safetyScore} size={44} />
                <RatingGauge label="Döz." score={p.reliabilityScore} size={44} />
                <RatingGauge label="Qiy." score={p.valueScore} size={44} />
                <RatingGauge label="Perf." score={p.performanceScore} size={44} />
              </div>

              <dl className="mt-4 space-y-1.5 border-t border-border-subtle pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-foreground/50">Bazar qiyməti</dt>
                  <dd className="font-medium text-catalog-700">
                    {p.minPrice && p.maxPrice
                      ? `${formatAzn(p.minPrice)}–${formatAzn(p.maxPrice)}`
                      : "Məlumat yoxdur"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-foreground/50">Bilinən xronik problem</dt>
                  <dd className="font-medium text-foreground/80">{p.problemCount}</dd>
                </div>
              </dl>

              <Link
                href={`/modeller/${p.id}`}
                className="mt-4 text-center text-sm font-medium text-catalog-600 hover:underline"
              >
                Profilə bax →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
