import { useState, useRef, useEffect } from "react";

/*
  PORTFOLIO SKELETON — modeled on tanayakhadke.com
  Structure:
    1. Fixed header (name + menu)
    2. Draggable "board" hero (floating cards + big name)
    3. Work grid (project cards -> external links)
    4. Featured Work (tap-to-cycle card stack)
    5. About (bio + portrait + vertical type)
    6. Process strip
    7. Marquee nav ticker
    8. Footer (Explore / Follow / Contact + availability badge)

  TODO(you): swap PROJECTS, FEATURED, LINKS, and copy with your own content.
*/

// ---------- EDIT ME: your data ----------

const YOUR_NAME = ["Zyiire", "Brown"]; // TODO: first / last line of hero name
const ROLES = ["Frontend Engineer", "Builder", "Designer"]; // TODO: rotating role labels

const BOARD_CARDS = [
  // TODO: replace `label` with <img src=... /> screenshots of your projects
  { id: 1, label: "Spectral", x: 8, y: 12, w: 220, h: 150, rot: -6 },
  { id: 2, label: "Mira", x: 66, y: 8, w: 240, h: 170, rot: 4 },
  { id: 3, label: "AI Code Review", x: 12, y: 58, w: 200, h: 140, rot: 3 },
  { id: 4, label: "QuizGenius", x: 70, y: 55, w: 210, h: 150, rot: -3 },
  { id: 5, label: "Thytus", x: 40, y: 30, w: 190, h: 130, rot: 8 },
];

const PROJECTS = [
  // TODO: your work grid — link to GitHub / live demos instead of Behance
  { title: "Spectral", tag: "Music → Color", href: "#", tall: false },
  { title: "Mira", tag: "AI Visual Search", href: "#", tall: true },
  { title: "AI Code Review", tag: "VS Code Extension", href: "#", tall: false },
  { title: "Project 4", tag: "Tag", href: "#", tall: true },
  { title: "Project 5", tag: "Tag", href: "#", tall: false },
  { title: "Project 6", tag: "Tag", href: "#", tall: false },
];

const FEATURED = [
  // TODO: 3–5 flagship pieces for the card stack
  { title: "Featured 01", note: "One-line description" },
  { title: "Featured 02", note: "One-line description" },
  { title: "Featured 03", note: "One-line description" },
];

const NAV_ITEMS = ["BOARD", "WORK", "FEATURED", "ABOUT", "PROCESS", "CONNECT"];

const LINKS = {
  explore: [
    { label: "Board", href: "#board" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
  ],
  follow: [
    { label: "GitHub", href: "https://github.com/Zyiire" },
    { label: "LinkedIn", href: "https://linkedin.com/in/zyiire-brown-10m8" },
  ],
  email: "zyiirebrown@gmail.com",
};

// ---------- 2. Draggable board hero ----------

function DraggableCard({ card, containerRef }) {
  const [pos, setPos] = useState({ x: card.x, y: card.y }); // percent-based
  const drag = useRef(null);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
  };
  const onPointerMove = (e) => {
    if (!drag.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.current.startX) / rect.width) * 100;
    const dy = ((e.clientY - drag.current.startY) / rect.height) * 100;
    setPos({
      x: Math.min(92, Math.max(0, drag.current.origX + dx)),
      y: Math.min(90, Math.max(0, drag.current.origY + dy)),
    });
  };
  const onPointerUp = () => (drag.current = null);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute cursor-grab active:cursor-grabbing select-none touch-none rounded-lg border border-neutral-300 bg-white shadow-md flex items-center justify-center text-neutral-400 text-sm font-mono hover:shadow-xl transition-shadow"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: card.w,
        height: card.h,
        transform: `rotate(${card.rot}deg)`,
        zIndex: drag.current ? 50 : 10,
      }}
    >
      {/* TODO: replace with <img className="w-full h-full object-cover rounded-lg" src=... /> */}
      {card.label}
    </div>
  );
}

function BoardHero() {
  const containerRef = useRef(null);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRoleIndex((i) => (i + 1) % ROLES.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="board" ref={containerRef} className="relative h-screen overflow-hidden bg-neutral-100">
      {/* Big name behind the cards */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-neutral-900 leading-none">
          {YOUR_NAME[0]}
        </h1>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-neutral-900 leading-none">
          {YOUR_NAME[1]}
        </h1>
        <p className="mt-4 text-lg font-mono text-neutral-500">{ROLES[roleIndex]}</p>
      </div>

      {BOARD_CARDS.map((c) => (
        <DraggableCard key={c.id} card={c} containerRef={containerRef} />
      ))}

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest text-neutral-400 z-20">
        DRAG TO MOVE
      </p>
    </section>
  );
}

// ---------- 3. Work grid ----------

function WorkGrid() {
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-5xl font-bold mb-12">Work</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            className="block break-inside-avoid group"
            target="_blank"
            rel="noreferrer"
          >
            {/* TODO: replace with real thumbnail */}
            <div
              className={`w-full rounded-xl bg-neutral-200 group-hover:bg-neutral-300 transition-colors flex items-center justify-center text-neutral-400 font-mono text-sm ${
                p.tall ? "h-80" : "h-56"
              }`}
            >
              image
            </div>
            <div className="mt-3">
              <h3 className="font-semibold group-hover:underline">{p.title}</h3>
              <p className="text-sm text-neutral-500">{p.tag}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

// ---------- 4. Featured card stack (tap to cycle) ----------

function FeaturedStack() {
  const [top, setTop] = useState(0);
  const cycle = () => setTop((t) => (t + 1) % FEATURED.length);

  return (
    <section id="featured" className="max-w-6xl mx-auto px-6 py-24">
      <h2 className="text-3xl md:text-5xl font-bold mb-12">
        Featured <span className="text-neutral-400">Work</span>
      </h2>
      <div className="relative h-96 max-w-xl mx-auto cursor-pointer" onClick={cycle}>
        {FEATURED.map((f, i) => {
          const depth = (i - top + FEATURED.length) % FEATURED.length;
          return (
            <div
              key={f.title}
              className="absolute inset-0 rounded-2xl border border-neutral-200 bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-300"
              style={{
                transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                zIndex: FEATURED.length - depth,
                opacity: depth > 2 ? 0 : 1,
              }}
            >
              {/* TODO: replace with project image / embed */}
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="text-neutral-500 mt-2">{f.note}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs font-mono tracking-widest text-neutral-400 mt-6">
        TAP TO CYCLE THROUGH THE CARDS
      </p>
    </section>
  );
}

// ---------- 5. About ----------

function About() {
  const vertical = "BUILDER"; // TODO: word for the scattered vertical type treatment
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
      <div>
        <h2 className="text-3xl md:text-5xl font-bold mb-8">About</h2>
        <p className="text-lg leading-relaxed text-neutral-600 max-w-xl">
          {/* TODO: your bio — what you build, how you think, what you're looking for */}
          I'm a frontend engineer who cares about interfaces that feel intuitive
          from the first click. I build with React and TypeScript, ship fast,
          and sweat the details other people skip.
        </p>
        {/* TODO: portrait — <img className="mt-8 w-48 rounded-xl" src=... /> */}
      </div>
      <div className="hidden md:flex flex-col items-center text-4xl font-black text-neutral-300 leading-tight">
        {vertical.split("").map((ch, i) => (
          <span key={i} style={{ marginLeft: (i % 3) * 14 - 14 }}>
            {ch}
          </span>
        ))}
      </div>
    </section>
  );
}

// ---------- 6. Process strip ----------

function ProcessStrip() {
  return (
    <section id="process" className="max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs font-mono tracking-widest text-neutral-400 mb-6">PROCESS</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((n) => (
          /* TODO: replace with WIP screenshots, sketches, terminal recordings */
          <div
            key={n}
            className="min-w-64 h-44 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 font-mono text-sm shrink-0"
          >
            wip {n}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- 7. Marquee nav ticker ----------

function Marquee() {
  const items = [...NAV_ITEMS, ...NAV_ITEMS, ...NAV_ITEMS];
  return (
    <div className="overflow-hidden border-y border-neutral-200 py-4 bg-neutral-50">
      <div className="flex gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {items.map((item, i) => (
          <a key={i} href={`#${item.toLowerCase()}`} className="font-mono text-sm tracking-widest text-neutral-500 hover:text-neutral-900">
            {item}
          </a>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }`}</style>
    </div>
  );
}

// ---------- 8. Footer ----------

function Footer() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(LINKS.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <footer id="connect" className="bg-neutral-900 text-neutral-100 px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="text-xs font-mono tracking-widest text-neutral-500 mb-4">EXPLORE</p>
          {LINKS.explore.map((l) => (
            <a key={l.label} href={l.href} className="block py-1 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <p className="text-xs font-mono tracking-widest text-neutral-500 mb-4">FOLLOW</p>
          {LINKS.follow.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="block py-1 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
        <div>
          <p className="text-xs font-mono tracking-widest text-neutral-500 mb-4">CONTACT</p>
          <button onClick={copyEmail} className="hover:underline text-left">
            {copied ? "Copied!" : LINKS.email}
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 flex items-center gap-2 text-sm text-neutral-400">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        Available to work
      </div>
    </footer>
  );
}

// ---------- 1. Header + page ----------

export default function PortfolioSkeleton() {
  const [menuOpen, setMenuOpen] = useState(false);

  <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
  <ShapeGrid
    speed={0.2}
    squareSize={60}
    direction="diagonal"
    borderColor="#06020a"
    hoverFillColor="#34842c"
    shape="hexagon"
    hoverTrailAmount={0}
  />
</div>

  return (
    <div className="font-sans text-neutral-900 bg-white">
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white">
        <a href="#board" className="font-mono text-sm tracking-widest">
          {YOUR_NAME.join(" ").toUpperCase()}
        </a>
        <button onClick={() => setMenuOpen((o) => !o)} className="font-mono text-sm tracking-widest">
          ☰ MENU
        </button>
      </header>

      {menuOpen && (
        <nav className="fixed inset-0 z-40 bg-neutral-900/95 text-white flex flex-col items-center justify-center gap-6 text-3xl font-bold">
          {NAV_ITEMS.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="hover:text-neutral-400">
              {item}
            </a>
          ))}
        </nav>
      )}

      <BoardHero />
      <Marquee />
      <WorkGrid />
      <FeaturedStack />
      <About />
      <ProcessStrip />
      <Footer />
    </div>
  );
}