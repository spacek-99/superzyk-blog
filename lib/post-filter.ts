import type { PostCategory, PostSummary } from "./posts";

export type CategoryFilter = "all" | PostCategory;

function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase();
}

export function filterPosts(posts: PostSummary[], category: CategoryFilter, query: string) {
  const terms = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean);

  return posts.filter((post) => {
    if (category !== "all" && post.category !== category) return false;
    if (terms.length === 0) return true;

    const text = normalizeSearchText([
      post.title,
      post.description,
      ...post.tags,
      post.environment ?? "",
    ].join(" "));

    return terms.every((term) => text.includes(term));
  });
}
