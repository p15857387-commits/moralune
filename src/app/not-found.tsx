import Link from "next/link";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  return (
    <main className="empty-state">
      <span>404</span>
      <h1>This page has drifted away.</h1>
      <p>这一页还没有被安放。</p>
      <Link className="button dark" href={`/${defaultLocale}`}>Home</Link>
    </main>
  );
}
