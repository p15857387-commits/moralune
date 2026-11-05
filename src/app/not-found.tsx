import Link from "next/link";
export default function NotFound() { return <main className="empty-state"><span>404</span><h1>这一页还没有被安放。</h1><p>The page you are looking for has drifted away.</p><Link className="button dark" href="/zh-CN">回到首页</Link></main>; }
