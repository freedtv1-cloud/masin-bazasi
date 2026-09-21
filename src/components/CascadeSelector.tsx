"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CascadeEntry } from "@/lib/queries";

const BODY_TYPE_LABEL: Record<string, string> = {
  sedan: "Sedan",
  offroader: "Offroader",
  hetçbek: "Hetçbek",
  universal: "Universal",
  kupe: "Kupe",
  minivan: "Minivan",
};

type Props = {
  catalog: CascadeEntry[];
};

export function CascadeSelector({ catalog }: Props) {
  const router = useRouter();
  const [brandId, setBrandId] = useState<number | "">("");
  const [modelId, setModelId] = useState<number | "">("");
  const [yearKey, setYearKey] = useState<string>("");
  const [profileId, setProfileId] = useState<number | "">("");

  const brands = useMemo(() => {
    const seen = new Map<number, string>();
    for (const e of catalog) seen.set(e.brandId, e.brandName);
    return [...seen.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "az"));
  }, [catalog]);

  const models = useMemo(() => {
    if (brandId === "") return [];
    const seen = new Map<number, string>();
    for (const e of catalog) {
      if (e.brandId === brandId) seen.set(e.modelId, e.modelName);
    }
    return [...seen.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, "az"));
  }, [catalog, brandId]);

  const years = useMemo(() => {
    if (modelId === "") return [];
    const seen = new Map<string, { yearFrom: number; yearTo: number }>();
    for (const e of catalog) {
      if (e.modelId === modelId) {
        seen.set(`${e.yearFrom}-${e.yearTo}`, { yearFrom: e.yearFrom, yearTo: e.yearTo });
      }
    }
    return [...seen.entries()].sort((a, b) => b[1].yearFrom - a[1].yearFrom);
  }, [catalog, modelId]);

  const engines = useMemo(() => {
    if (modelId === "" || yearKey === "") return [];
    return catalog
      .filter((e) => e.modelId === modelId && `${e.yearFrom}-${e.yearTo}` === yearKey)
      .sort((a, b) => a.engine.localeCompare(b.engine, "az"));
  }, [catalog, modelId, yearKey]);

  function handleBrandChange(value: string) {
    const id = value === "" ? "" : Number(value);
    setBrandId(id);
    setModelId("");
    setYearKey("");
    setProfileId("");
  }

  function handleModelChange(value: string) {
    const id = value === "" ? "" : Number(value);
    setModelId(id);
    setYearKey("");
    setProfileId("");
  }

  function handleYearChange(value: string) {
    setYearKey(value);
    setProfileId("");
    // Bu il aralığında yalnız bir mühərrik variantı varsa, birbaşa seçilir.
    const matching = catalog.filter(
      (e) => e.modelId === modelId && `${e.yearFrom}-${e.yearTo}` === value
    );
    if (matching.length === 1) {
      setProfileId(matching[0].id);
    }
  }

  function handleEngineChange(value: string) {
    const id = value === "" ? "" : Number(value);
    setProfileId(id);
  }

  function handleSubmit() {
    if (profileId !== "") {
      router.push(`/modeller/${profileId}`);
    }
  }

  const selectClass =
    "w-full rounded-lg border border-border-subtle bg-surface px-3 py-2.5 text-sm outline-none focus:border-catalog-500 disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-foreground/40";

  return (
    <div className="mt-6 rounded-2xl border border-catalog-100 bg-surface p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Marka
          </label>
          <select
            className={selectClass}
            value={brandId}
            onChange={(e) => handleBrandChange(e.target.value)}
          >
            <option value="">Marka seçin</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Model
          </label>
          <select
            className={selectClass}
            value={modelId}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={brandId === ""}
          >
            <option value="">Model seçin</option>
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/50">
            İl
          </label>
          <select
            className={selectClass}
            value={yearKey}
            onChange={(e) => handleYearChange(e.target.value)}
            disabled={modelId === ""}
          >
            <option value="">İl seçin</option>
            {years.map(([key, y]) => (
              <option key={key} value={key}>
                {y.yearFrom}–{y.yearTo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Mühərrik
          </label>
          <select
            className={selectClass}
            value={profileId}
            onChange={(e) => handleEngineChange(e.target.value)}
            disabled={yearKey === ""}
          >
            <option value="">Mühərrik seçin</option>
            {engines.map((e) => (
              <option key={e.id} value={e.id}>
                {e.engine}
                {e.bodyType ? ` · ${BODY_TYPE_LABEL[e.bodyType] ?? e.bodyType}` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={profileId === ""}
        className="mt-4 w-full rounded-lg bg-catalog-500 px-4 py-2.5 font-medium text-white transition hover:bg-catalog-600 disabled:cursor-not-allowed disabled:bg-black/10 disabled:text-foreground/40 sm:w-auto"
      >
        Profilə bax →
      </button>
    </div>
  );
}
