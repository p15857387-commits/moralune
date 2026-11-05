import { notFound } from "next/navigation";
import { SelectionPage } from "@/components/selection-page";
import { hasPayPal, paypalPriceMap, payPalCheckoutEnabled } from "@/lib/env";
import { isLocale } from "@/lib/i18n";
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <SelectionPage locale={locale} paypalEnabled={hasPayPal && payPalCheckoutEnabled} paypalPriceIds={Object.keys(paypalPriceMap)} />; }
