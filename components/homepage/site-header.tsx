import Link from "next/link";
import type { Language } from "../../content";
import { homepageCopy } from "../../content";
import { withSiteBasePath } from "../../lib/site-path";

type SiteHeaderProps = {
  language: Language;
  onToggleLanguage: () => void;
  onAnchorClick?: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  variant?: "home" | "secondary";
  activePage?: "teaching" | "activities" | "voices";
};

export function SiteHeader({ language, onToggleLanguage, onAnchorClick, variant = "home", activePage }: SiteHeaderProps) {
  const { nav } = homepageCopy[language];
  const isSecondary = variant === "secondary";

  return (
    <header className="site-header">
      <div className="header-inner">
        {isSecondary ? <Link className="header-brand" href="/" aria-label={language === "zh" ? "METC 首页" : "METC home"}>
          <span className="header-brand-emblem" aria-hidden="true">
            <img src={withSiteBasePath("/images/metc-graduation-logo.jpg")} alt="" />
          </span>
          <span className="header-brand-mark">METC</span>
          <span className="header-brand-dot" aria-hidden="true" />
        </Link> : <a className="header-brand" href="#top" onClick={(event) => onAnchorClick?.(event, "#top")} aria-label={language === "zh" ? "METC 首页" : "METC home"}>
          <span className="header-brand-emblem" aria-hidden="true"><img src={withSiteBasePath("/images/metc-graduation-logo.jpg")} alt="" /></span><span className="header-brand-mark">METC</span><span className="header-brand-dot" aria-hidden="true" />
        </a>}

        <nav className="primary-nav" aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
          {nav.map((item) => isSecondary ? (
            item.id === "teaching" || item.id === "activities" || item.id === "voices" ? <Link className={activePage === item.id ? "nav-current" : undefined} key={item.id} href={`/${item.id}`}><span>{language === "zh" ? item.zh : item.en}</span></Link> : <Link key={item.id} href={`/#${item.id}`}><span>{language === "zh" ? item.zh : item.en}</span></Link>
          ) : (
            <a key={item.id} href={`#${item.id}`} onClick={(event) => onAnchorClick?.(event, `#${item.id}`)}>
              <span>{language === "zh" ? item.zh : item.en}</span>
            </a>
          ))}
        </nav>

        <button className="language-toggle" type="button" onClick={onToggleLanguage} aria-label={language === "zh" ? "切换为英文" : "Switch to Chinese"}>
          <span className={language === "zh" ? "active" : ""}>中</span>
          <i aria-hidden="true" />
          <span className={language === "en" ? "active" : ""}>EN</span>
        </button>
      </div>
    </header>
  );
}
