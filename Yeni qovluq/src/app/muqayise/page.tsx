import { getComparisonCatalog } from "@/lib/queries";
import { CompareView } from "@/components/CompareView";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const catalog = await getComparisonCatalog();

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-catalog-600">
                      Qərar vermək asanlaşsın
                            </p>
                                  <h1 className="mt-1 text-3xl font-bold text-foreground">Model müqayisəsi</h1>
                                        <p className="mt-1 max-w-2xl text-sm text-foreground/60">
                                                2-3 modeli yan-yana qoyun — qiymət aralığı, bilinən xronik problem sayı
                                                        və reytinq xalları (təhlükəsizlik, dözümlülük, qiymət, performans) bir
                                                                yerdə.
                                                                      </p>

                                                                            <div className="mt-6">
                                                                                    <CompareView catalog={catalog} />
                                                                                          </div>
                                                                                              </div>
                                                                                                );
                                                                                                }
                                                                                                
