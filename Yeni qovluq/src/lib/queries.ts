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
};

// ---- Ana səhifə üçün: model profilləri, ən son qiymətlə birlikdə ----
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
      })
      .from(modelProfiles)
      .innerJoin(models, eq(modelProfiles.modelId, models.id))
      .innerJoin(brands, eq(models.brandId, brands.id))
      .orderBy(asc(brands.name), asc(models.name));

    return Promise.all(
      rows.map(async (row) => {
        const prices = (
          await db
            .select({ price: pricePoints.price })
            .from(pricePoints)
            .where(eq(pricePoints.modelProfileId, row.id))
        ).map((p) => p.price);

        const [listingCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(listings)
          .where(eq(listings.modelProfileId, row.id));

        return {
          ...row,
          minPrice: prices.length ? Math.min(...prices) : null,
          maxPrice: prices.length ? Math.max(...prices) : null,
          listingCount: listingCount?.count ?? 0,
        };
      })
    );
  }
);

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

  return {
    listing,
    problems,
    priceRange: prices.length
      ? { min: Math.min(...prices), max: Math.max(...prices) }
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
