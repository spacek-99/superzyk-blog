import Link from "next/link";
import type { PostSummary } from "@/lib/posts";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function PostCard({ post, latest = false }: { post: PostSummary; latest?: boolean }) {
  const titleId = `post-${post.slug}`;

  return (
    <article className="h-full min-w-0">
      <Link href={`/posts/${post.slug}`} aria-labelledby={titleId} className="post-card group">
        {latest ? <span className="post-card-label">最新教程</span> : null}
        <h3 id={titleId} className="post-card-title">{post.title}</h3>
        <p className="post-card-description">{post.description}</p>
        {post.tags.length > 0 ? (
          <ul className="post-card-tags" aria-label="主要主题">
            {post.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        ) : null}
        <div className="post-card-footer">
          <time dateTime={post.date}>{dateFormatter.format(new Date(`${post.date}T00:00:00`))}</time>
          <span className="post-card-read">阅读全文 <span aria-hidden="true">↗</span></span>
        </div>
      </Link>
    </article>
  );
}
