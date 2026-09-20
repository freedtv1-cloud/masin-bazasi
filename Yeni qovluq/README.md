# MaşınBazası — konsepsiya prototipi

Maşın elanı saytı, amma sadəcə elan lövhəsi deyil: hər model üçün xronik
problemlər, real bazar qiyməti aralığı və mövcud elanlar bir yerdə. Tam
konsepsiya sənədi ayrıca hazırlanıb (bax: layihənin Claude Docs sənədi);
bu repo həmin konsepsiyanın işlək texniki skeletidir.

## Texnologiya

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Drizzle ORM + PostgreSQL** — Netlify kimi serverless mühitlərdə fayl
  əsaslı SQLite persistent olmadığı üçün Postgres istifadə olunur (Supabase
  pulsuz Postgres verir)
- Server Actions ilə elan yaratma (JavaScript olmadan da işləyir)

## Yerli qurulum

1. Postgres bazası lazımdır (lokal Postgres, Supabase, Docker — hər hansı).
2. `.env.example` faylını `.env.local` kimi kopyalayın və `DATABASE_URL`-i
   doldurun.
3. ```bash
   npm install
   npm run db:migrate   # cədvəlləri yaradır (drizzle/*.sql əsasında)
   npm run db:seed      # nümunə marka/model/elan məlumatları yükləyir
   npm run dev           # http://localhost:3000
   ```

Production build üçün:

```bash
npm run build
npm run start
```

## Netlify + Supabase ilə canlıya çıxarmaq

Bu stack (Netlify + Supabase) layihəni real istifadəyə vermək üçün tam
yetərlidir və hər ikisinin pulsuz planı bu miqyas üçün kifayətdir.

1. **Supabase**: [supabase.com](https://supabase.com)-da hesab açın, yeni
   layihə yaradın. Layihə hazır olduqdan sonra Settings → Database →
   Connection string bölməsindən **Transaction pooler** sətrini (6543 port)
   kopyalayın.
2. Lokal olaraq (və ya birbaşa Netlify-də) bu sətri `DATABASE_URL` kimi
   qoyub `npm run db:migrate && npm run db:seed` işə salın — bu, cədvəlləri
   yaradıb nümunə data ilə doldurur (nümunə datanı sonra Supabase Table
   Editor-dan silib öz real elanlarınızı əlavə edə bilərsiniz).
3. **Netlify**: [netlify.com](https://netlify.com)-da hesab açın, layihəni
   GitHub-a push edin (və ya birbaşa qovluğu sürükləyib buraxın), Netlify-ə
   qoşun. Netlify Next.js-i avtomatik tanıyır (`@netlify/plugin-nextjs`,
   `netlify.toml`-da artıq qeyd olunub) — Server Actions, dinamik səhifələr
   daxil olmaqla hər şey işləyəcək.
4. Netlify → Site settings → Environment variables bölməsində
   `DATABASE_URL`-i (Supabase-dən götürdüyünüz sətri) əlavə edin, sonra
   yenidən deploy edin.

Bundan sonra sayt tam işlək, real domenlə (Netlify pulsuz `*.netlify.app`
subdomeni verir, öz domeninizi də bağlaya bilərsiniz) canlıda olacaq.

## Layihə strukturu

```
src/
  db/
    schema.ts     — cədvəllər (brands, models, model_profiles,
                     chronic_problems, price_points, listings, sellers,
                     data_sources)
    client.ts      — Drizzle/Postgres bağlantısı (DATABASE_URL-dən)
    migrate.ts     — migrasiyaları işə salır
    seed.ts        — nümunə Azərbaycan bazarı məlumatları
  lib/
    queries.ts     — bütün DB oxuma sorğuları (React cache ilə)
    actions.ts     — elan yaratma Server Action-ı
  app/
    page.tsx                — ana səhifə (axtarış + populyar modellər + son elanlar)
    modeller/page.tsx        — model bazası, axtarış/filtr
    modeller/[id]/page.tsx   — model profili: xronik problemlər, qiymət trendi, elanlar
    elanlar/page.tsx         — bütün elanlar
    elanlar/[id]/page.tsx    — elan detalı + bazar qiymətinə görə "ucuz/normal/baha" siqnalı
    elan-yarat/page.tsx      — yeni elan forması
  components/       — SeverityBadge, PriceTrend (SVG qrafik), kartlar
```

## Verilənlər mənbəyi barədə qeyd

Konsepsiya sənədinə uyğun olaraq, `chronic_problems` cədvəlindəki hər
qeydin `source_type` (forum / xarici_baza / ai_generasiya) və `confidence`
sahələri var — bu, gələcəkdə real toplama pipeline-ı qurularkən mənbə
etibarlılığını izləmək üçün nəzərdə tutulub. Hazırkı seed məlumatları
nümunə xarakterlidir, real deyil.

## Bundan sonra nə qalır (real istifadə üçün)

1. **Autentifikasiya** — hazırda elan yaratma açıqdır (istənilən kəs telefon
   nömrəsi ilə elan verə bilər). Real istifadə üçün Supabase Auth asanlıqla
   inteqrasiya oluna bilər.
2. **Şəkil yükləmə** — `photo_url` sahəsi hazırda boşdur; Supabase Storage
   bunun üçün hazır həll verir.
3. **Forum/xarici baza toplama pipeline-ı** — `data_sources` cədvəli bunun
   üçün nəzərdə tutulub, amma pipeline-ın özü hələ qurulmayıb (konsepsiya
   sənədindəki qərara uyğun: forum + xarici baza + AI generasiyası).
4. **Moderasiya** — spam/yalan elanların qarşısını almaq üçün admin paneli
   və ya sadə təsdiq axını lazım olacaq.
