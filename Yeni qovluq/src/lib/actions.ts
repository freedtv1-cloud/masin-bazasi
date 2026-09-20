"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { sellers, listings } from "@/db/schema";

const CONDITIONS = ["əla", "yaxşı", "orta", "təmirə ehtiyaclı"] as const;

export async function createListing(formData: FormData) {
  const modelProfileId = Number(formData.get("modelProfileId"));
  const sellerName = String(formData.get("sellerName") ?? "").trim();
  const sellerPhone = String(formData.get("sellerPhone") ?? "").trim();
  const sellerCity = String(formData.get("sellerCity") ?? "").trim();
  const year = Number(formData.get("year"));
  const mileageKm = Number(formData.get("mileageKm"));
  const condition = String(formData.get("condition") ?? "yaxşı");
  const price = Number(formData.get("price"));
  const city = String(formData.get("city") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (
    !modelProfileId ||
    !sellerName ||
    !sellerPhone ||
    !year ||
    !mileageKm ||
    !price ||
    !city
  ) {
    throw new Error("Bütün məcburi sahələr doldurulmalıdır.");
  }

  if (!CONDITIONS.includes(condition as (typeof CONDITIONS)[number])) {
    throw new Error("Yanlış vəziyyət dəyəri.");
  }

  // Eyni telefon nömrəsi ilə satıcı varsa, ondan istifadə et
  const [existingSeller] = await db
    .select()
    .from(sellers)
    .where(eq(sellers.phone, sellerPhone));

  const seller =
    existingSeller ??
    (
      await db
        .insert(sellers)
        .values({ name: sellerName, phone: sellerPhone, city: sellerCity || null })
        .returning()
    )[0];

  const [listing] = await db
    .insert(listings)
    .values({
      modelProfileId,
      sellerId: seller.id,
      year,
      mileageKm,
      condition: condition as (typeof CONDITIONS)[number],
      price,
      city,
      description: description || null,
      status: "aktiv",
    })
    .returning();

  revalidatePath("/elanlar");
  revalidatePath("/");
  redirect(`/elanlar/${listing.id}`);
}
