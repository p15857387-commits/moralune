"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <div className="empty-state"><span>MORALUNE</span><h1>暂时没有连上这一处日常。</h1><p>Something went quiet. Please try once more.</p><button className="button dark" onClick={reset}>重新尝试 · Try again</button></div>; }
