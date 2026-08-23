import type { Language } from "../../content";
import { homepageCopy } from "../../content";
import { MetcScriptLogo } from "./metc-script-logo";

type HeroSectionProps = {
  language: Language;
  onAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function HeroSection({ language, onAnchorClick }: HeroSectionProps) {
  const { hero } = homepageCopy[language];

  return (
    <section className="hero-section" id="top">
      <div className="hero-color-wash" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-particle-field" aria-hidden="true">
        <i className="hero-particle particle-a" /><i className="hero-particle particle-b" />
        <i className="hero-particle particle-c" /><i className="hero-particle particle-d" />
        <i className="hero-particle particle-e" /><i className="hero-particle particle-f" />
        <i className="hero-particle particle-g" /><i className="hero-particle particle-h" />
        <i className="hero-particle particle-i" /><i className="hero-particle particle-j" />
        <i className="hero-particle particle-k" /><i className="hero-particle particle-l" />
        <i className="hero-particle particle-m" /><i className="hero-particle particle-n" />
        <i className="shooting-star star-one" /><i className="shooting-star star-two" />
        <i className="shooting-star star-three" />
      </div>
      <div className="hero-graphic-set" aria-hidden="true">
        <svg className="hero-illustration hero-cell" viewBox="0 0 205 148">
          <path className="cell-membrane" d="M31 44c17-29 52-32 79-20 25-15 57-1 66 26 11 30-6 62-35 70-26 8-42-7-64 0-32 10-61-16-57-45 2-14 3-20 11-31z" />
          <path className="cell-wall" d="M31 44c17-29 52-32 79-20 25-15 57-1 66 26" />
          <ellipse className="cell-nucleus" cx="105" cy="73" rx="25" ry="22" />
          <circle className="cell-nucleolus" cx="109" cy="70" r="7" />
          <path className="cell-organelle cell-mito" d="M45 67c8-10 23-6 24 4 1 11-16 15-24 6-4-4-3-7 0-10zM141 89c8-10 22-6 23 4 1 10-16 14-23 6-4-4-4-7 0-10z" />
          <path className="cell-organelle cell-er" d="M74 38c8 3 13 0 18-4M71 44c8 3 15 1 22-3M121 44c12-7 23-4 31 3M123 51c10-6 21-3 29 4" />
          <circle className="cell-vacuole" cx="54" cy="99" r="13" />
          <circle className="cell-dot" cx="151" cy="61" r="4" />
          <circle className="cell-dot" cx="71" cy="111" r="3" />
          <text className="cell-caption" x="50" y="144">LIVING CELL</text>
        </svg>
        <svg className="hero-illustration hero-bridge-lab" viewBox="0 0 280 145">
          <path className="school-shadow" d="M27 124c48 9 170 9 225 0" />
          <path className="bridge-support bridge-support-blue" d="M36 101h39v19H36z" />
          <path className="bridge-support bridge-support-coral" d="M205 101h39v19h-39z" />
          <path className="bridge-paper" d="M52 101 76 72l31 24 34-37 34 37 29-24 23 29z" />
          <path className="bridge-fold" d="m76 72 31 24 34-37 34 37 29-24M52 101h175" />
          <path className="bridge-measure" d="M26 84h28M232 84h25" />
          <path className="bridge-measure-tick" d="M31 79v10M48 79v10M237 79v10M253 79v10" />
          <circle className="bridge-load" cx="141" cy="32" r="13" />
          <path className="bridge-force" d="M141 47v11" />
          <path className="bridge-force-head" d="m135 52 6 7 6-7" />
          <circle className="school-dot school-dot-coral" cx="263" cy="51" r="4" />
          <path className="school-spark school-spark-small" d="M21 40v13M15 46h13" />
          <text className="bridge-caption" x="84" y="141">PAPER BRIDGE TEST</text>
        </svg>
        <svg className="hero-illustration hero-note-strip" viewBox="0 0 246 76">
          <path className="note-dash" d="M7 65h232" />
          <path className="note-paper note-paper-blue" d="M16 14h56v38H16z" />
          <circle className="note-pin" cx="28" cy="20" r="3.5" />
          <path className="note-star" d="m44 27 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" />
          <path className="note-paper note-paper-sun" d="M91 8h56v43H91z" />
          <path className="note-check" d="m105 29 6 6 12-15M105 43h27" />
          <path className="note-paper note-paper-coral" d="M166 17h55v35h-55z" />
          <path className="note-orbit" d="M178 34c8-11 22-11 30 0-8 11-22 11-30 0zM193 24v20M181 34h24" />
          <text className="note-text" x="31" y="62">OBSERVE</text>
          <text className="note-text" x="104" y="62">TRY</text>
          <text className="note-text" x="179" y="62">SHARE</text>
        </svg>
        <svg className="hero-illustration hero-books" viewBox="0 0 300 190">
          <path className="school-shadow" d="M39 153c41 10 178 11 222 0" />
          <path className="book-cover book-cover-blue" d="M37 63c34-7 68-2 93 16v68c-28-17-60-22-93-14z" />
          <path className="book-cover book-cover-coral" d="M130 79c27-18 61-23 95-16v70c-34-8-67-3-95 14z" />
          <path className="book-page" d="M48 70c28-4 54 1 76 16v51c-23-12-49-16-76-11z" />
          <path className="book-page" d="M136 86c22-15 49-20 77-16v56c-28-5-54 0-77 12z" />
          <path className="page-line" d="M61 91h45M61 105h50M61 119h37M151 106h42M151 120h48" />
          <path className="book-spine" d="M130 79v68" />
          <path className="bookmark" d="M181 65v29l10-7 10 7V61" />
          <g className="pencil">
            <path className="pencil-body" d="m195 35 63 39-12 19-63-39z" />
            <path className="pencil-band" d="m241 64 12-19 12 8-12 19z" />
            <path className="pencil-tip" d="m183 54-13-18 25-1z" />
          </g>
          <circle className="school-dot school-dot-sun" cx="79" cy="35" r="8" />
          <path className="school-spark" d="M276 109v16M268 117h16" />
          <path className="school-spark school-spark-small" d="M31 113v11M25 119h12" />
        </svg>
        <svg className="hero-illustration hero-optics" viewBox="0 0 220 120">
          <path className="school-shadow" d="M18 109c42 8 139 8 184 0" />
          <circle className="optics-sun" cx="26" cy="35" r="13" />
          <path className="sun-ray" d="M26 14V7M5 35H1M12 21 7 16M40 21l5-5M40 49l6 5" />
          <path className="light-ray light-ray-in" d="M45 41 118 79" />
          <path className="light-arrow" d="m87 62 10 3-6 8" />
          <path className="mirror" d="M76 84h80" />
          <path className="mirror-stripe" d="M84 81h63M93 87h48" />
          <path className="mirror-normal" d="M118 79V22" />
          <path className="light-ray light-ray-reflect" d="m118 79 69-42" />
          <path className="light-arrow light-arrow-reflect" d="m165 50 11-3-2 10" />
          <circle className="reflection-target" cx="192" cy="34" r="8" />
          <path className="target-rays" d="M192 20v-5M179 34h-5M202 25l4-4M202 43l5 4" />
          <text className="optics-label" x="48" y="65">LIGHT IN</text>
          <text className="optics-label optics-label-reflect" x="141" y="68">REFLECTED</text>
          <text className="optics-label" x="103" y="115">MIRROR</text>
        </svg>
        <svg className="hero-illustration hero-rocket" viewBox="0 0 190 135">
          <path className="rocket-trail" d="M95 120c-2-20 10-34 7-52" />
          <path className="rocket-bottle" d="M82 19h26v18c0 5 13 9 13 22v38c0 12-9 20-20 20H89c-11 0-20-8-20-20V59c0-13 13-17 13-22z" />
          <path className="rocket-neck" d="M82 19h26v11H82z" />
          <path className="rocket-vinegar" d="M72 82h46v15c0 10-7 17-17 17H89c-10 0-17-7-17-17z" />
          <path className="rocket-label" d="M79 61h32" />
          <circle className="rocket-bubble" cx="88" cy="75" r="3" />
          <circle className="rocket-bubble" cx="103" cy="69" r="2.5" />
          <circle className="rocket-bubble" cx="109" cy="79" r="2" />
          <path className="rocket-cap" d="M85 117h20v8H85z" />
          <path className="rocket-spark" d="M50 43v16M42 51h16M143 79v13M137 85h12" />
          <text className="rocket-caption" x="45" y="133">VINEGAR ROCKET</text>
        </svg>
        <svg className="hero-illustration hero-economy" viewBox="0 0 220 104">
          <path className="school-shadow" d="M23 91c41 8 135 8 174 0" />
          <path className="economy-arrow" d="M57 40c11-20 39-28 60-17" />
          <path className="economy-arrow" d="M130 30c23 0 42 16 46 37" />
          <path className="economy-arrow" d="M165 78c-24 16-60 15-82-2" />
          <path className="economy-arrowhead" d="m111 21 8 3-4 7M176 61l1 9-8 1M89 82l-7-5 5-6" />
          <circle className="economy-node economy-node-blue" cx="50" cy="53" r="19" />
          <path className="student-icon" d="M50 43a7 7 0 1 0 0 .1M38 65c3-9 20-9 24 0" />
          <circle className="economy-node economy-node-sun" cx="125" cy="27" r="18" />
          <path className="coin-icon" d="M125 14v26M130 20c-3-3-11-3-11 1 0 5 11 4 11 9 0 5-9 6-12 1" />
          <circle className="economy-node economy-node-coral" cx="172" cy="72" r="19" />
          <path className="shop-icon" d="M160 72h24v10h-24zM158 67h28l-3-7h-22zM166 82v-7h7v7" />
          <circle className="school-dot school-dot-mint" cx="31" cy="23" r="5" />
          <text className="economy-caption" x="27" y="103">INCOME LOOP</text>
          <text className="economy-label" x="31" y="84">HOME</text>
          <text className="economy-label" x="111" y="55">PAY</text>
          <text className="economy-label" x="153" y="103">MARKET</text>
        </svg>
        <svg className="hero-illustration hero-linear-function" viewBox="0 0 230 150">
          <path className="graph-grid" d="M34 19v112M66 19v112M98 19v112M130 19v112M162 19v112M194 19v112M20 35h190M20 67h190M20 99h190M20 131h190" />
          <path className="graph-axis" d="M20 115h194M50 137V13" />
          <path className="graph-axis-head" d="m207 109 8 6-8 6M44 20l6-8 6 8" />
          <path className="graph-line" d="M27 129 185 22" />
          <circle className="graph-point" cx="66" cy="103" r="4" />
          <circle className="graph-point" cx="114" cy="70" r="4" />
          <circle className="graph-point" cx="162" cy="38" r="4" />
          <path className="graph-rise-run" d="M66 103h48V70" />
          <text className="graph-delta" x="80" y="114">Δx</text>
          <text className="graph-delta" x="118" y="91">Δy</text>
          <text className="graph-equation" x="125" y="139">y = 2x + 1</text>
          <text className="graph-caption" x="19" y="148">LINEAR FUNCTION</text>
        </svg>
        <svg className="hero-illustration hero-newton-first" viewBox="0 0 240 128">
          <path className="law-ground" d="M15 99h210M25 105h190" />
          <path className="law-motion-trail" d="M18 61h40M27 72h29M38 83h20" />
          <path className="law-cart law-cart-blue" d="M66 55h92v40H66z" />
          <path className="law-cart-top" d="M78 44h68l12 11H66z" />
          <circle className="law-wheel" cx="86" cy="102" r="9" />
          <circle className="law-wheel" cx="140" cy="102" r="9" />
          <path className="law-vector" d="M163 65h58" />
          <path className="law-vector-head" d="m213 58 9 7-9 7" />
          <text className="law-vector-label" x="180" y="55">v = constant</text>
          <text className="law-formula" x="82" y="80">ΣF = 0</text>
          <text className="law-caption" x="18" y="126">NEWTON I · INERTIA</text>
        </svg>
        <svg className="hero-illustration hero-newton-second" viewBox="0 0 240 132">
          <path className="law-ground" d="M17 104h207M28 110h185" />
          <path className="law-cart law-cart-sun" d="M57 60h82v39H57z" />
          <path className="law-cart-top" d="M69 49h58l12 11H57z" />
          <circle className="law-wheel" cx="76" cy="106" r="9" />
          <circle className="law-wheel" cx="123" cy="106" r="9" />
          <path className="law-vector law-vector-force" d="M140 77h78" />
          <path className="law-vector-head law-vector-force" d="m209 69 10 8-10 8" />
          <path className="law-vector law-vector-acceleration" d="M102 37h61" />
          <path className="law-vector-head law-vector-acceleration" d="m154 30 10 7-10 7" />
          <text className="law-vector-label law-force-label" x="174" y="68">F</text>
          <text className="law-vector-label" x="125" y="28">a</text>
          <text className="law-mass" x="88" y="85">m</text>
          <text className="law-formula" x="151" y="103">F = ma</text>
          <text className="law-caption" x="17" y="130">NEWTON II · ACCELERATION</text>
        </svg>
        <svg className="hero-illustration hero-statistics" viewBox="0 0 260 110">
          <path className="stats-axis" d="M22 56h216" />
          <path className="stats-whisker" d="M32 42v28M32 56h42M184 56h44M228 42v28" />
          <rect className="stats-box" x="74" y="35" width="110" height="42" rx="3" />
          <path className="stats-median" d="M126 35v42" />
          <circle className="stats-mean" cx="153" cy="56" r="7" />
          <path className="stats-mean-mark" d="m149 52 8 8m0-8-8 8" />
          <path className="stats-tick" d="M74 51v10M184 51v10" />
          <text className="stats-label" x="22" y="87">MIN</text>
          <text className="stats-label" x="108" y="94">MEDIAN</text>
          <text className="stats-label stats-label-mean" x="143" y="28">MEAN</text>
          <text className="stats-label" x="212" y="87">MAX</text>
          <text className="stats-caption" x="64" y="107">STATISTICAL SUMMARY</text>
        </svg>
        <svg className="hero-illustration hero-banknote" viewBox="0 0 220 100">
          <rect className="banknote-paper" x="10" y="12" width="200" height="74" rx="7" />
          <rect className="banknote-border" x="18" y="20" width="184" height="58" rx="4" />
          <circle className="banknote-seal" cx="110" cy="49" r="21" />
          <path className="banknote-emblem" d="M94 53c7-13 25-18 35-6-8 2-13 7-15 16-7-8-13-11-20-10zM110 32v34" />
          <path className="banknote-corner" d="M27 29h15v12M193 29h-15v12M27 69h15V57M193 69h-15V57" />
          <path className="banknote-dash" d="M51 31h24M51 67h24M145 31h24M145 67h24" />
          <text className="banknote-value" x="29" y="54">01</text>
          <text className="banknote-value" x="169" y="54">01</text>
          <text className="banknote-brand" x="97" y="52">METC</text>
          <text className="banknote-caption" x="60" y="98">LEARNING CREDIT</text>
        </svg>
        <svg className="hero-illustration hero-supplies" viewBox="0 0 300 76">
          <path className="supply-rule" d="M15 45 154 14l5 22-139 31z" />
          <path className="supply-tick" d="m36 43 4 16m20-21 4 16m20-21 4 16m20-21 4 16m20-21 4 16m20-21 4 16" />
          <path className="supply-paperclip" d="M207 25c8-9 22-1 16 9l-20 27c-8 10-23 1-16-9l19-26c3-4 9 0 6 4l-18 25" />
          <path className="supply-spark" d="M260 30v17M252 38h17" />
          <circle className="school-dot school-dot-coral" cx="285" cy="52" r="5" />
        </svg>
      </div>

      <div className="hero-inner">
        <p className="hero-eyebrow hero-enter hero-enter-1">{hero.eyebrow}</p>

        <div className="hero-logo-stage hero-enter hero-enter-2">
          <MetcScriptLogo />
          <span className="logo-note logo-note-left">signal / inquiry</span>
          <span className="logo-note logo-note-right">ask -&gt; teach -&gt; make</span>
        </div>

        <div className="hero-lower hero-enter hero-enter-3">
          <div className="hero-title-wrap">
            <h1>
              {hero.title}
              <span>{hero.titleAccent}</span>
            </h1>
            <div className="hero-topic-tags" aria-label="Learning approach">
              {(language === "zh" ? ["真实问题", "动手制作", "同伴讨论"] : ["Real questions", "Build together", "Peer discussion"]).map((label) => <span key={label}>{label}</span>)}
            </div>
          </div>
          <div className="hero-intro">
            <p>{hero.body}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#explore" onClick={(event) => onAnchorClick(event, "#explore")}>
                {hero.primaryCta}<span aria-hidden="true">↘</span>
              </a>
              <a className="text-link" href="#teaching" onClick={(event) => onAnchorClick(event, "#teaching")}>
                {hero.secondaryCta}<span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <a className="hero-scroll" href="#explore" onClick={(event) => onAnchorClick(event, "#explore")}>
        <span>{hero.scroll}</span><i aria-hidden="true" />
      </a>
    </section>
  );
}
