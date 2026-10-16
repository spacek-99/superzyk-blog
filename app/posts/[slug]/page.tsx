import type { Metadata } from "next";
import ArticleImageLightbox from "@/components/ArticleImageLightbox";
import ArticleToc from "@/components/ArticleToc";
import BackToTop from "@/components/BackToTop";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { getPostDisplayTitle } from "@/lib/post-display";
import { getReadingGuide } from "@/lib/reading-guide";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import CodeCopyButtons from "./CodeCopyButtons";
import "./article.css";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到 | superzyk.com",
      alternates: { canonical: null },
      robots: { index: false, follow: false },
    };
  }

  const canonical = `${SITE_URL}/posts/${post.slug}`;
  const image = post.coverImage
    ? { url: post.coverImage, alt: post.title }
    : { url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT };

  return {
    title: `${post.title} | superzyk.com`,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "zh_CN",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const guide = getReadingGuide(post.slug);
  const publishedPosts = getAllPosts();
  const relatedPosts = guide?.related.flatMap((related) => {
    const nextPost = publishedPosts.find((item) => item.slug === related.slug);
    return nextPost ? [nextPost] : [];
  }) ?? [];

  return (
    <>
      <SiteHeader active="posts" />
      <main id="main-content" tabIndex={-1} className="article-page">
        <div className="article-shell">
          <nav className="article-back" aria-label="文章导航">
            <Link href="/posts">返回文章</Link>
          </nav>

          <article className="article-layout">
            <header className="article-heading">
              <h1>{getPostDisplayTitle(post)}</h1>
              <p className="article-summary">{post.description}</p>
              <div className="article-byline">
                <span>superzyk</span>
                <span>发布于 <time dateTime={post.date}>{formatDate(post.date)}</time></span>
                {post.updatedAt ? (
                  <span>更新于 <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time></span>
                ) : null}
              </div>
              {post.environment || post.version || post.verifiedAt ? (
                <dl className="article-facts">
                  {post.environment ? <div><dt>适用环境</dt><dd>{post.environment}</dd></div> : null}
                  {post.version ? <div><dt>文中版本</dt><dd>{post.version}</dd></div> : null}
                  {post.verifiedAt ? (
                    <div><dt>最近实测</dt><dd><time dateTime={post.verifiedAt}>{formatDate(post.verifiedAt)}</time></dd></div>
                  ) : null}
                </dl>
              ) : null}
            </header>

            <ArticleToc key={post.slug} headings={post.headings} />

            <div className="article-reading-column">
              <div
                className="article-content"
                data-article-content
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
              <ArticleImageLightbox />
              <CodeCopyButtons key={post.slug} />

              <footer className="article-end">
                {relatedPosts.length > 0 ? (
                  <section className="article-next" aria-labelledby="next-reading-title">
                    <h2 id="next-reading-title">相关阅读</h2>
                    <ul>
                      {relatedPosts.map((nextPost) => (
                        <li key={nextPost.slug}>
                          <Link href={`/posts/${nextPost.slug}`}>
                            <span className="article-next-title">{getPostDisplayTitle(nextPost)}</span>
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
                              <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                <div className="article-end-actions">
                  <Link href="/posts">查看全部文章</Link>
                  <BackToTop />
                </div>
              </footer>
            </div>
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
