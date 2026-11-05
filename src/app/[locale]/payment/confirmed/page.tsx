import { notFound } from "next/navigation";
import { PaymentConfirmation } from "@/components/payment-confirmation";
import { isLocale } from "@/lib/i18n";

export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ reference?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(locale) || !query.reference || !/^[A-Z0-9]{10,40}$/.test(query.reference)) notFound();
  return <PaymentConfirmation locale={locale} reference={query.reference} />;
}
