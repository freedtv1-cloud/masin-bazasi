import { getModelProfileOptions } from "@/lib/queries";
import { createListing } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function CreateListingPage() {
  const profiles = await getModelProfileOptions();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-accent-600">Yeni elan</p>
      <h1 className="mt-1 text-3xl font-bold text-foreground">Elan yerləşdir</h1>
      <p className="mt-1 text-sm text-foreground/60">
        Model seçdikdən sonra elanınızın yanında həmin profilin tanınmış
        problemlərini və bazar qiymət aralığını da göstərəcəyik.
      </p>

      <form action={createListing} className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium" htmlFor="modelProfileId">
            Marka / Model / İl / Mühərrik
          </label>
          <select
            id="modelProfileId"
            name="modelProfileId"
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
          >
            <option value="">Seçin...</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brandName} {p.modelName} ({p.yearFrom}–{p.yearTo}, {p.engine})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="year">
              İstehsal ili
            </label>
            <input
              id="year"
              name="year"
              type="number"
              required
              min={1970}
              max={new Date().getFullYear()}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="mileageKm">
              Yürüş (km)
            </label>
            <input
              id="mileageKm"
              name="mileageKm"
              type="number"
              required
              min={0}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium" htmlFor="condition">
              Vəziyyət
            </label>
            <select
              id="condition"
              name="condition"
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
            >
              <option value="əla">Əla</option>
              <option value="yaxşı">Yaxşı</option>
              <option value="orta">Orta</option>
              <option value="təmirə ehtiyaclı">Təmirə ehtiyaclı</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium" htmlFor="price">
              Qiymət (AZN)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              required
              min={0}
              className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="city">
            Şəhər
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="description">
            Təsvir
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="photoUrls">
            Şəkil linkləri
          </label>
          <p className="mt-0.5 text-xs text-foreground/50">
            Hər sətirdə bir link (istəsəniz bir neçə). İlk link üz şəkli kimi
            görünəcək.
          </p>
          <textarea
            id="photoUrls"
            name="photoUrls"
            rows={3}
            placeholder={"https://.../sekil1.jpg\nhttps://.../sekil2.jpg"}
            className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 font-mono text-xs outline-none focus:border-accent-500"
          />
        </div>

        <fieldset className="rounded-lg border border-border-subtle p-4">
          <legend className="px-1 text-sm font-medium">Əlaqə məlumatı</legend>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium" htmlFor="sellerName">
                Ad
              </label>
              <input
                id="sellerName"
                name="sellerName"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium" htmlFor="sellerPhone">
                  Telefon
                </label>
                <input
                  id="sellerPhone"
                  name="sellerPhone"
                  type="tel"
                  required
                  placeholder="+994 xx xxx xx xx"
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium" htmlFor="sellerCity">
                  Sizin şəhəriniz
                </label>
                <input
                  id="sellerCity"
                  name="sellerCity"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 outline-none focus:border-accent-500"
                />
              </div>
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full rounded-lg bg-accent-500 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-accent-600"
        >
          Elanı dərc et
        </button>
      </form>
    </div>
  );
}
