import { cache } from "react";
import { eq, desc, asc, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  brands,
  models,
  modelProfiles,
  chronicProblems,
  pricePoints,
  listings,
  sellers,
  listingPhotos,
} from "@/db/schema";

// ---- Kömekçi tiplər ----
export type ModelProfileCard = {
  id: number;
  brandName: string;
  modelName: string;
  yearFrom: number;
  yearTo: number;
  engine: string;
  bodyType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  listingCount: number;
  safetyScore: number | null;
  reliabilityScore: number | null;
  valueScore: number | null;
  performanceScore: number | null;
};

// ---- Ana səhifə üçün: model profilləri, ən son qiymətlə birlikdə ----
// Tək aqreqasiya sorğusu (LEFT JOIN + GROUP BY) — profil sayı qədər ayrı
// sorğu göndərməkdənsə (N+1), bütün məlumat bir dəfəyə gətirilir.
export const getModelProfileCards = cache(
  async (): Promise<ModelProfileCard[]> => {
    const rows = await db
      .select({
        id: modelProfiles.id,
        brandName: brands.name,
        modelName: models.name,
        yearFrom: modelProfiles.yearFrom,
        yearTo: modelProfiles.yearTo,
        engine: modelProfiles.engine,
        bodyType: modelProfiles.bodyType,
        minPrice: sql<number | null>`min(${pricePoints.price})`,
        maxPrice: sql<number | null>`max(${pricePoints.price})`,
        listingCount: sql<number>`count(distinct ${listings.id})::int`,
        safetyScore: modelProfiles.safetyScore,
        reliabilityScore: modelProfiles.reliabilityScore,
        valueScore: modelProfiles.valueScore,
        performanceScore: modelProfiles.performanceScore,
      })
      .from(modelProfiles)
      .innerJoin(models, eq(modelProfiles.modelId, models.id))
      .innerJoin(brands, eq(models.brandId, brands.id))
      .leftJoin(pricePoints, eq(pricePoints.modelProfileId, modelProfiles.id))
      .leftJoin(listings, eq(listings.modelProfileId, modelProfiles.id))
      .groupBy(
        modelProfiles.id,
        brands.name,
        models.name,
        modelProfiles.yearFrom,
        modelProfiles.yearTo,
        modelProfiles.engine,
        modelProfiles.bodyType,
        modelProfiles.safetyScore,
        modelProfiles.reliabilityScore,
        modelProfiles.valueScore,
        modelProfiles.performanceScore
      )
      .orderBy(asc(brands.name), asc(models.name));

    return rows;
  }
);

// ---- Kaskad seçici üçün: marka → model → il → mühərrik ----
// Cəmi bir yüngül sorğu ilə bütün kataloq gətirilir və seçim
// brauzerdə, əlavə server sorğusu olmadan aparılır.
export type CascadeEntry = {
  id: number;
  brandId: number;
  brandName: string;
  modelId: number;
  modelName: string;
  yearFrom: number;
  yearTo: number;
  engine: string;
  bodyType: string | null;
};

export const getCascadeCatalog = cache(async (): Promise<CascadeEntry[]> => {
  return db
    .select({
      id: modelProfiles.id,
      brandId: brands.id,
      brandName: brands.name,
      modelId: models.id,
      modelName: models.name,
      yearFrom: modelProfiles.yearFrom,
      yearTo: modelProfiles.yearTo,
      engine: modelProfiles.engine,
      bodyType: modelProfiles.bodyType,
    })
    .from(modelProfiles)
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .orderBy(asc(brands.name), asc(models.name), desc(modelProfiles.yearFrom));
});

export const searchModelProfiles = cache(async (query: string) => {
  if (!query.trim()) return getModelProfileCards();
  const all = await getModelProfileCards();
  return all.filter(
    (m) =>
      m.brandName.toLowerCase().includes(query.toLowerCase()) ||
      m.modelName.toLowerCase().includes(query.toLowerCase())
  );
});

// ---- Model profili detalı ----
export const getModelProfileDetail = cache(async (id: number) => {
  const [profile] = await db
    .select({
      id: modelProfiles.id,
      modelId: modelProfiles.modelId,
      brandName: brands.name,
      modelName: models.name,
      yearFrom: modelProfiles.yearFrom,
      yearTo: modelProfiles.yearTo,
      engine: modelProfiles.engine,
      bodyType: modelProfiles.bodyType,
      summary: modelProfiles.summary,
      safetyScore: modelProfiles.safetyScore,
      reliabilityScore: modelProfiles.reliabilityScore,
      valueScore: modelProfiles.valueScore,
      performanceScore: modelProfiles.performanceScore,
    })
    .from(modelProfiles)
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .where(eq(modelProfiles.id, id));

  if (!profile) return null;

  const problems = await db
    .select()
    .from(chronicProblems)
    .where(eq(chronicProblems.modelProfileId, id));

  const prices = await db
    .select()
    .from(pricePoints)
    .where(eq(pricePoints.modelProfileId, id))
    .orderBy(asc(pricePoints.date));

  const relatedListings = await db
    .select({
      id: listings.id,
      year: listings.year,
      mileageKm: listings.mileageKm,
      condition: listings.condition,
      price: listings.price,
      city: listings.city,
      description: listings.description,
      status: listings.status,
      sellerName: sellers.name,
      sellerPhone: sellers.phone,
    })
    .from(listings)
    .innerJoin(sellers, eq(listings.sellerId, sellers.id))
    .where(eq(listings.modelProfileId, id))
    .orderBy(desc(listings.createdAt));

  return { profile, problems, prices, listings: relatedListings };
});

// ---- Elan detalı ----
export const getListingDetail = cache(async (id: number) => {
  const [listing] = await db
    .select({
      id: listings.id,
      modelProfileId: listings.modelProfileId,
      vin: listings.vin,
      year: listings.year,
      mileageKm: listings.mileageKm,
      condition: listings.condition,
      price: listings.price,
      city: listings.city,
      description: listings.description,
      status: listings.status,
      createdAt: listings.createdAt,
      sellerName: sellers.name,
      sellerPhone: sellers.phone,
      sellerCity: sellers.city,
      brandName: brands.name,
      modelName: models.name,
      yearFrom: modelProfiles.yearFrom,
      yearTo: modelProfiles.yearTo,
      engine: modelProfiles.engine,
    })
    .from(listings)
    .innerJoin(sellers, eq(listings.sellerId, sellers.id))
    .innerJoin(modelProfiles, eq(listings.modelProfileId, modelProfiles.id))
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .where(eq(listings.id, id));

  if (!listing) return null;

  const problems = await db
    .select()
    .from(chronicProblems)
    .where(eq(chronicProblems.modelProfileId, listing.modelProfileId));

  const prices = (
    await db
      .select({ price: pricePoints.price })
      .from(pricePoints)
      .where(eq(pricePoints.modelProfileId, listing.modelProfileId))
  ).map((p) => p.price);

  const photos = await db
    .select({ id: listingPhotos.id, url: listingPhotos.url })
    .from(listingPhotos)
    .where(eq(listingPhotos.listingId, listing.id))
    .orderBy(asc(listingPhotos.sortOrder));

  return {
    listing,
    problems,
    photos,
    priceRange: prices.length
      ? {
          min: Math.min(...prices),
          max: Math.max(...prices),
          avg: prices.reduce((a, b) => a + b, 0) / prices.length,
        }
      : null,
  };
});

// ---- Bütün elanlar (axtarış/filtr üçün) ----
export const getAllListings = cache(async () => {
  return db
    .select({
      id: listings.id,
      year: listings.year,
      mileageKm: listings.mileageKm,
      condition: listings.condition,
      price: listings.price,
      city: listings.city,
      status: listings.status,
      brandName: brands.name,
      modelName: models.name,
      modelProfileId: listings.modelProfileId,
    })
    .from(listings)
    .innerJoin(modelProfiles, eq(listings.modelProfileId, modelProfiles.id))
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .orderBy(desc(listings.createdAt));
});

// ---- Hər profilin orta bazar qiyməti (sərfəli təklif nişanı üçün) ----
export type ProfilePriceStat = {
  modelProfileId: number;
  avgPrice: number;
};

export const getProfilePriceStats = cache(async (): Promise<ProfilePriceStat[]> => {
  return db
    .select({
      modelProfileId: pricePoints.modelProfileId,
      avgPrice: sql<number>`avg(${pricePoints.price})::int`,
    })
    .from(pricePoints)
    .groupBy(pricePoints.modelProfileId);
});

// ---- Elanların üz şəkli (hər elanın ilk şəkli, sırasına görə) ----
export const getAllListingPhotos = cache(async () => {
  return db
    .select({
      listingId: listingPhotos.listingId,
      url: listingPhotos.url,
      sortOrder: listingPhotos.sortOrder,
    })
    .from(listingPhotos)
    .orderBy(asc(listingPhotos.sortOrder));
});

// ---- Model müqayisəsi üçün: qiymət, problem sayı və reytinq xalları bir yerdə ----
export type ComparisonProfile = {
  id: number;
  brandName: string;
  modelName: string;
  yearFrom: number;
  yearTo: number;
  engine: string;
  bodyType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  problemCount: number;
  safetyScore: number | null;
  reliabilityScore: number | null;
  valueScore: number | null;
  performanceScore: number | null;
};

export const getComparisonCatalog = cache(async (): Promise<ComparisonProfile[]> => {
  return db
    .select({
      id: modelProfiles.id,
      brandName: brands.name,
      modelName: models.name,
      yearFrom: modelProfiles.yearFrom,
      yearTo: modelProfiles.yearTo,
      engine: modelProfiles.engine,
      bodyType: modelProfiles.bodyType,
      minPrice: sql<number | null>`min(${pricePoints.price})`,
      maxPrice: sql<number | null>`max(${pricePoints.price})`,
      problemCount: sql<number>`count(distinct ${chronicProblems.id})::int`,
      safetyScore: modelProfiles.safetyScore,
      reliabilityScore: modelProfiles.reliabilityScore,
      valueScore: modelProfiles.valueScore,
      performanceScore: modelProfiles.performanceScore,
    })
    .from(modelProfiles)
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .leftJoin(pricePoints, eq(pricePoints.modelProfileId, modelProfiles.id))
    .leftJoin(chronicProblems, eq(chronicProblems.modelProfileId, modelProfiles.id))
    .groupBy(
      modelProfiles.id,
      brands.name,
      models.name,
      modelProfiles.yearFrom,
      modelProfiles.yearTo,
      modelProfiles.engine,
      modelProfiles.bodyType,
      modelProfiles.safetyScore,
      modelProfiles.reliabilityScore,
      modelProfiles.valueScore,
      modelProfiles.performanceScore
    )
    .orderBy(asc(brands.name), asc(models.name));
});

export const getModelProfileOptions = cache(async () => {
  return db
    .select({
      id: modelProfiles.id,
      brandName: brands.name,
      modelName: models.name,
      yearFrom: modelProfiles.yearFrom,
      yearTo: modelProfiles.yearTo,
      engine: modelProfiles.engine,
    })
    .from(modelProfiles)
    .innerJoin(models, eq(modelProfiles.modelId, models.id))
    .innerJoin(brands, eq(models.brandId, brands.id))
    .orderBy(asc(brands.name), asc(models.name));
});
