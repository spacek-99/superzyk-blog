import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { formatPostDate, getPostActivityDate, getPostDisplayTitle } from "@/lib/post-display";

export default function PostCard({ post }: { post: PostSummary }) {
  const titleId = `post-${post.slug}`;
  const revised = Boolean(post.updatedAt && post.updatedAt !== post.date);

  return (
    <article className="post-row">
      <div className="post-row-meta">
        <span>{post.category === "explainer" ? "概念科普" : "动手实践"}</span>
        <span><time dateTime={getPostActivityDate(post)}>{formatPostDate(getPostActivityDate(post))}</time>{revised ? " · 修订" : ""}</span>
      </div>
      <Link href={`/posts/${post.slug}`} aria-labelledby={titleId} className="post-card">
        <div className="post-card-body">
          <h3 id={titleId} className="post-card-title">{getPostDisplayTitle(post)}</h3>
          <p className="post-card-description">{post.description}</p>
        </div>
      </Link>
    </article>
  );
}
