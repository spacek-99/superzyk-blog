import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader({ active = "home" }: { active?: "home" | "posts" }) {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <div className="site-header-inner">
        <Link href="/" aria-label="superzyk.com 首页" aria-current={active === "home" ? "page" : undefined} className="site-brand">
          <span>superzyk<span className="brand-domain">.com</span></span>
        </Link>
        <nav aria-label="主导航" className="site-primary-nav">
          <Link href="/posts" aria-current={active === "posts" ? "page" : undefined}>文章</Link>
        </nav>
        <div className="site-header-actions"><ThemeToggle /></div>
      </div>
    </header>
  );
}
