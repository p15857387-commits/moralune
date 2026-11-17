import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <div className="empty-state">
      <span>404</span>
      <h1>This page has drifted away.</h1>
      <p>这一页还没有被安放。</p>
      <Link className="button dark" href="/en">Home</Link>
    </div>
  );
}
