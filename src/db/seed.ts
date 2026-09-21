import { db } from "./client";
import {
  brands,
  models,
  modelProfiles,
  chronicProblems,
  pricePoints,
  sellers,
  listings,
} from "./schema";

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString().slice(0, 10);
}

async function seed() {
  console.log("Nümunə məlumatlar yüklənir...");

  // ---- Markalar ----
  const [toyota, bmw, mercedes, hyundai, vaz] = await db
    .insert(brands)
    .values([
      { name: "Toyota" },
      { name: "BMW" },
      { name: "Mercedes-Benz" },
      { name: "Hyundai" },
      { name: "VAZ (Lada)" },
    ])
    .returning();

  // ---- Modellər ----
  const [camry] = await db
    .insert(models)
    .values({ brandId: toyota.id, name: "Camry" })
    .returning();
  const [x5] = await db
    .insert(models)
    .values({ brandId: bmw.id, name: "X5" })
    .returning();
  const [eClass] = await db
    .insert(models)
    .values({ brandId: mercedes.id, name: "E-Class" })
    .returning();
  const [elantra] = await db
    .insert(models)
    .values({ brandId: hyundai.id, name: "Elantra" })
    .returning();
  const [vaz2107] = await db
    .insert(models)
    .values({ brandId: vaz.id, name: "2107" })
    .returning();

  // ---- Model profilləri ----
  const [camryProfile] = await db
    .insert(modelProfiles)
    .values({
      modelId: camry.id,
      yearFrom: 2012,
      yearTo: 2017,
      engine: "2.5L Benzin (2AR-FE)",
      bodyType: "Sedan",
      summary:
        "Etibarlı və geniş yayılmış model. Ehtiyat hissə tapmaq asandır, orta hesabla saxlama xərci aşağıdır.",
    })
    .returning();

  const [x5Profile] = await db
    .insert(modelProfiles)
    .values({
      modelId: x5.id,
      yearFrom: 2007,
      yearTo: 2013,
      engine: "3.0L Dizel (M57)",
      bodyType: "Offroader",
      summary:
        "Güclü mühərrik, amma hava asqısı və elektronika saxlanması baha başa gəlir.",
    })
    .returning();

  const [eClassProfile] = await db
    .insert(modelProfiles)
    .values({
      modelId: eClass.id,
      yearFrom: 2002,
      yearTo: 2009,
      engine: "3.2L Benzin (M112)",
      bodyType: "Sedan",
      summary: "Rahat sürüş, lakin hava asqısı (Airmatic) problemləri yayğındır.",
    })
    .returning();

  const [elantraProfile] = await db
    .insert(modelProfiles)
    .values({
      modelId: elantra.id,
      yearFrom: 2011,
      yearTo: 2016,
      engine: "1.6L Benzin",
      bodyType: "Sedan",
      summary: "Yanacaq qənaətcildir, gündəlik istifadə üçün uyğundur.",
    })
    .returning();

  const [vazProfile] = await db
    .insert(modelProfiles)
    .values({
      modelId: vaz2107.id,
      yearFrom: 1982,
      yearTo: 2012,
      engine: "1.5L Benzin",
      bodyType: "Sedan",
      summary: "Ən ucuz saxlama xərcli modellərdən biri, ehtiyat hissə hər yerdə var.",
    })
    .returning();

  // ---- Xronik problemlər ----
  await db.insert(chronicProblems).values([
    {
      modelProfileId: camryProfile.id,
      description: "150,000 km-dən sonra eksentrik val sensorunda arıza tez-tez rast gəlinir",
      kmFrom: 150000,
      kmTo: 220000,
      repairCostMin: 80,
      repairCostMax: 200,
      severity: "aşağı",
      sourceType: "forum",
      confidence: 0.72,
    },
    {
      modelProfileId: camryProfile.id,
      description: "U660E avtomat sürətlər qutusunda 200,000 km+ zamanı sarsıntılı keçidlər",
      kmFrom: 200000,
      kmTo: null,
      repairCostMin: 600,
      repairCostMax: 1500,
      severity: "orta",
      sourceType: "forum",
      confidence: 0.61,
    },
    {
      modelProfileId: x5Profile.id,
      description: "Timing chain (zəncir) 120,000–150,000 km aralığında uzanaraq səs salır",
      kmFrom: 120000,
      kmTo: 150000,
      repairCostMin: 1200,
      repairCostMax: 2500,
      severity: "yüksək",
      sourceType: "xarici_baza",
      confidence: 0.8,
    },
    {
      modelProfileId: x5Profile.id,
      description: "Hava asqısı (air suspension) təzyiq itirməsi, xüsusən soyuq havada",
      kmFrom: 100000,
      kmTo: null,
      repairCostMin: 400,
      repairCostMax: 1800,
      severity: "orta",
      sourceType: "forum",
      confidence: 0.68,
    },
    {
      modelProfileId: eClassProfile.id,
      description: "Balans şaftı 100,000 km-dən sonra mühərrikdə xarakterik səs yaradır",
      kmFrom: 100000,
      kmTo: null,
      repairCostMin: 500,
      repairCostMax: 1200,
      severity: "yüksək",
      sourceType: "xarici_baza",
      confidence: 0.75,
    },
    {
      modelProfileId: elantraProfile.id,
      description: "Arxa əyləc barabanlarının orta müddətdən tez aşınması",
      kmFrom: 40000,
      kmTo: 60000,
      repairCostMin: 60,
      repairCostMax: 150,
      severity: "aşağı",
      sourceType: "forum",
      confidence: 0.55,
    },
    {
      modelProfileId: vazProfile.id,
      description: "Qapı ətəkləri və yan qanadlarda korroziya (pas) — əsasən 10 ildən yuxarı nüsxələrdə",
      kmFrom: null,
      kmTo: null,
      repairCostMin: 100,
      repairCostMax: 400,
      severity: "orta",
      sourceType: "forum",
      confidence: 0.7,
    },
  ]);

  // ---- Qiymət tarixçəsi (trend üçün) ----
  const priceSeries: [number, number, number][] = [
    [camryProfile.id, 15500, 11],
    [camryProfile.id, 16200, 8],
    [camryProfile.id, 17000, 5],
    [camryProfile.id, 17800, 2],
    [x5Profile.id, 27000, 11],
    [x5Profile.id, 28500, 7],
    [x5Profile.id, 30000, 3],
    [eClassProfile.id, 9500, 10],
    [eClassProfile.id, 10200, 6],
    [eClassProfile.id, 11000, 2],
    [elantraProfile.id, 11500, 9],
    [elantraProfile.id, 12200, 4],
    [vazProfile.id, 3800, 9],
    [vazProfile.id, 4200, 3],
  ];

  await db.insert(pricePoints).values(
    priceSeries.map(([modelProfileId, price, m]) => ({
      modelProfileId,
      price,
      date: monthsAgo(m),
      source: "elanlar_ortalaması",
    }))
  );

  // ---- Satıcılar ----
  const [seller1, seller2, seller3, seller4] = await db
    .insert(sellers)
    .values([
      { name: "Elşən", phone: "+994 50 123 45 67", city: "Bakı" },
      { name: "Rəşad", phone: "+994 55 234 56 78", city: "Gəncə" },
      { name: "Aygün", phone: "+994 70 345 67 89", city: "Bakı" },
      { name: "Vüqar", phone: "+994 51 456 78 90", city: "Sumqayıt" },
    ])
    .returning();

  // ---- Elanlar ----
  await db.insert(listings).values([
    {
      modelProfileId: camryProfile.id,
      sellerId: seller1.id,
      year: 2015,
      mileageKm: 178000,
      condition: "yaxşı",
      price: 17500,
      city: "Bakı",
      description: "Rənglənməyib, servis kitabçası var, təzə şin dəsti quraşdırılıb.",
      status: "aktiv",
    },
    {
      modelProfileId: x5Profile.id,
      sellerId: seller2.id,
      year: 2010,
      mileageKm: 210000,
      condition: "orta",
      price: 29500,
      city: "Gəncə",
      description: "Hava asqısı yenicə dəyişdirilib, timing chain hələ orijinaldır — yoxlanış tövsiyə olunur.",
      status: "aktiv",
    },
    {
      modelProfileId: eClassProfile.id,
      sellerId: seller3.id,
      year: 2006,
      mileageKm: 265000,
      condition: "orta",
      price: 10800,
      city: "Bakı",
      description: "Salon təmiz, klimat işləkdir, balans şaftı səsi hələ yoxdur.",
      status: "aktiv",
    },
    {
      modelProfileId: elantraProfile.id,
      sellerId: seller4.id,
      year: 2013,
      mileageKm: 145000,
      condition: "əla",
      price: 12800,
      city: "Sumqayıt",
      description: "Bir sahibdən, qəza olmayıb, arxa əyləc barabanları təzəcə dəyişdirilib.",
      status: "aktiv",
    },
    {
      modelProfileId: vazProfile.id,
      sellerId: seller2.id,
      year: 2005,
      mileageKm: 320000,
      condition: "orta",
      price: 4100,
      city: "Gəncə",
      description: "Gündəlik iş üçün etibarlı, kiçik pas ləkələri var.",
      status: "aktiv",
    },
  ]);

  console.log("Nümunə məlumatlar uğurla yükləndi.");
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
