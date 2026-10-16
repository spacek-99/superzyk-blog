import type { PostSummary } from "./posts";

/** Avoid a freshness promise without changing the article's original metadata. */
export function getPostDisplayTitle(post: Pick<PostSummary, "title">): string {
  return post.title.replace("最新安装教程", "安装教程");
}

export function formatPostDate(date: string): string {
  return date.replaceAll("-", ".");
}

export function getPostActivityDate(post: Pick<PostSummary, "date" | "updatedAt">): string {
  return post.updatedAt ?? post.date;
}
