import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PostCard from "@/components/PostCard";
import CampfireScene from "@/components/CampfireScene";
import { getAllPosts } from "@/lib/posts";
import { getPostActivityDate } from "@/lib/post-display";
import "./home.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  const posts = [...getAllPosts()].sort((a, b) => getPostActivityDate(b).localeCompare(getPostActivityDate(a)));

  return (
    <>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="home-page">
        <section id="about" className="home-intro" aria-labelledby="intro-title">
          <div className="home-intro-copy">
            <h1 id="intro-title">把 <span>AI</span> 用起来，把过程记下来。</h1>
            <p>我是 superzyk，记录 AI 工具、Agent 与本地模型的实践。</p>
          </div>
          <div className="home-scene">
            <CampfireScene />
          </div>
        </section>
        <section id="start" className="home-writing" aria-labelledby="articles">
          <h2 id="articles">文章</h2>
          <div id="explainers" className="recent-list">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
