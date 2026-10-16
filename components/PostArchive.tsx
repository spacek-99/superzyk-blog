"use client";

import { useRef, useState } from "react";
import PostCard from "@/components/PostCard";
import { filterPosts, type CategoryFilter } from "@/lib/post-filter";
import type { PostSummary } from "@/lib/posts";

const filters: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "explainer", label: "概念科普" },
  { value: "tutorial", label: "动手实践" },
];

export default function PostArchive({ posts }: { posts: PostSummary[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const visiblePosts = filterPosts(posts, category, query);
  const hasQuery = query.trim().length > 0;

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  function resetFilters() {
    setCategory("all");
    clearSearch();
  }

  return (
    <section className="archive-results" aria-labelledby="archive-results-heading">
      <h2 id="archive-results-heading" className="sr-only">文章列表</h2>
      <div className="archive-search" role="search" aria-label="搜索文章">
        <label htmlFor="archive-search-input" className="sr-only">搜索文章</label>
        <div className="archive-search-field">
          <input
            ref={searchRef}
            id="archive-search-input"
            type="search"
            value={query}
            placeholder="搜索文章"
            aria-controls="archive-posts"
            onChange={(event) => setQuery(event.target.value)}
          />
          {query.length > 0 ? <button type="button" onClick={clearSearch}>清空</button> : null}
        </div>
      </div>

      <div className="archive-filter-bar">
        <div className="archive-filters" role="group" aria-label="按文章类型筛选">
          {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={category === filter.value}
                aria-controls="archive-posts"
                onClick={() => setCategory(filter.value)}
              >
                {filter.label}
              </button>
          ))}
        </div>
        <p className="archive-result-count" aria-live="polite" aria-atomic="true">
          {visiblePosts.length} 篇
        </p>
      </div>

      <div id="archive-posts" className="archive-posts">
        {visiblePosts.map((post, index) => {
          // Keep existing category links useful while showing one chronological list.
          const firstInCategory = visiblePosts.findIndex((item) => item.category === post.category) === index;
          const categoryAnchor = post.category === "explainer" ? "explainers" : "tutorials";

          return (
            <div key={post.slug} id={firstInCategory ? categoryAnchor : undefined} className="archive-entry">
              <PostCard post={post} />
            </div>
          );
        })}
        {visiblePosts.length === 0 ? (
          <div className="archive-empty">
            <h3>{hasQuery ? "没有找到匹配的文章" : "这个分类暂时还没有文章"}</h3>
            <p>{hasQuery ? "试试更短的关键词，或清除筛选后浏览全部内容。" : "可以先看看其他文章。"}</p>
            {hasQuery || category !== "all" ? (
              <button type="button" onClick={resetFilters}>清除筛选，查看全部文章</button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
