import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ShapeGrid from "./ShapeGrid.jsx";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  // TODO: your work grid — link to GitHub / live demos, swap `gradient` for real screenshots
  { title: "Spectral", tag: "Music → Color", href: "#", tall: false, gradient: "from-midnight-900 via-grape-700 to-blush-500", desc: "Turns any track into a living color field in real time." },
  { title: "Mira", tag: "AI Visual Search", href: "#", tall: true, gradient: "from-midnight-950 via-midnight-700 to-grape-500", desc: "Search your screenshots and photos by describing them." },
  { title: "AI Code Review", tag: "VS Code Extension", href: "#", tall: false, gradient: "from-midnight-900 via-grape-800 to-midnight-600", desc: "Inline AI review comments before you ever open a PR." },
  { title: "Project 4", tag: "Tag", href: "#", tall: true, gradient: "from-blush-800 via-blush-600 to-tangerine-400", desc: "One-line description of what this project does." },
  { title: "Project 5", tag: "Tag", href: "#", tall: false, gradient: "from-tangerine-800 via-tangerine-500 to-apricot-400", desc: "One-line description of what this project does." },
  { title: "Project 6", tag: "Tag", href: "#", tall: false, gradient: "from-midnight-800 via-blush-700 to-grape-400", desc: "One-line description of what this project does." },
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
      data-depth="3"
      className="board-card absolute cursor-grab active:cursor-grabbing select-none touch-none rounded-lg border border-apricot-200 bg-white shadow-md flex items-center justify-center text-midnight-400 text-sm font-mono hover:shadow-xl transition-shadow"
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
    <section id="board" ref={containerRef} className="relative h-screen overflow-hidden bg-apricot-100">
      {/* Animated grid backdrop */}
      <div className="absolute inset-0 z-0 opacity-15" data-depth="0" aria-hidden="true">
        <ShapeGrid
          speed={0.2}
          squareSize={60}
          direction="diagonal"
          borderColor="#2b1485"
          hoverFillColor="#f94b06"
          shape="hexagon"
          hoverTrailAmount={0}
        />
      </div>

      {/* Big name behind the cards */}
      <div className="hero-center absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0" data-depth="2">
        <div className="overflow-hidden">
          <h1 className="hero-line text-6xl md:text-8xl font-black tracking-tight text-midnight-900 leading-none">
            {YOUR_NAME[0]}
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1 className="hero-line text-6xl md:text-8xl font-black tracking-tight text-midnight-900 leading-none">
            {YOUR_NAME[1]}
          </h1>
        </div>
        <p className="hero-role mt-4 text-lg font-mono text-tangerine-600">{ROLES[roleIndex]}</p>
      </div>

      {BOARD_CARDS.map((c) => (
        <DraggableCard key={c.id} card={c} containerRef={containerRef} />
      ))}

      {/* Scattered vertical type, tanayakhadke-style */}
      <div
        className="hidden md:flex flex-col absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none z-0 text-2xl font-black text-blush-400 leading-snug"
        data-depth="2"
        aria-hidden="true"
      >
        {"ENGINEER".split("").map((ch, i) => (
          <span key={i} className="hero-vert-letter" style={{ marginLeft: (i % 3) * 10 }}>
            {ch}
          </span>
        ))}
      </div>

      <p className="drag-hint absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono tracking-widest text-midnight-400 z-20" data-depth="5">
        DRAG TO MOVE
      </p>
    </section>
  );
}

// ---------- 3. Work grid ----------

function WorkGrid() {
  return (
    <section id="work" className="max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs font-mono tracking-widest text-tangerine-600 mb-3">SELECTED WORK</p>
      <h2 className="reveal-heading text-3xl md:text-5xl font-bold mb-12">Work</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {PROJECTS.map((p) => (
          <a
            key={p.title}
            href={p.href}
            className="work-card group relative block break-inside-avoid overflow-hidden rounded-xl"
            target="_blank"
            rel="noreferrer"
          >
            {/* Thumbnail — TODO: swap gradient for a real screenshot:
                <img className="w-full h-full object-cover" src=... alt=... /> */}
            <div
              data-depth="3"
              className={`w-full bg-gradient-to-br ${p.gradient} transition-transform duration-500 group-hover:scale-105 ${
                p.tall ? "h-80" : "h-56"
              }`}
            />

            {/* Glass hover panel: skewed at rest, straightens + expands on hover */}
            <div
              data-depth="4"
              className="absolute left-4 right-4 bottom-4 h-20 group-hover:h-[calc(100%-2rem)] overflow-hidden rounded-lg p-2 text-white bg-[rgba(198,198,198,0.34)] backdrop-blur-[5px] border-b-[3px] border-b-white/45 border-l-2 border-l-white/55 shadow-[-20px_25px_30px_rgba(0,0,0,0.28)] [transform:skewX(6deg)] group-hover:[transform:skew(0deg)] transition-all duration-[400ms]"
            >
              <div className="flex gap-1.5 p-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff605c] shadow-[-3px_3px_3px_rgba(0,0,0,0.28)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd44] shadow-[-3px_3px_3px_rgba(0,0,0,0.28)]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ca4e] shadow-[-3px_3px_3px_rgba(0,0,0,0.28)]" />
              </div>
              <h3 className="text-lg font-bold text-center [text-shadow:-6px_4px_8px_rgba(0,0,0,0.4)]">
                {p.title}
              </h3>
              <p className="text-[11px] font-mono tracking-widest text-center text-white/80 mt-1 uppercase">
                {p.tag}
              </p>
              <p className="text-sm text-white/90 text-center mt-5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                {p.desc}
              </p>
              <span className="block text-center text-[11px] font-mono tracking-widest mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                VIEW PROJECT →
              </span>
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
      <h2 className="reveal-heading text-3xl md:text-5xl font-bold mb-12">
        Featured <span className="text-grape-500">Work</span>
      </h2>
      <div className="featured-stack relative h-96 max-w-xl mx-auto cursor-pointer" onClick={cycle}>
        {FEATURED.map((f, i) => {
          const depth = (i - top + FEATURED.length) % FEATURED.length;
          return (
            <div
              key={f.title}
              className="absolute inset-0 rounded-2xl border border-apricot-200 bg-white shadow-lg flex flex-col items-center justify-center transition-all duration-300"
              style={{
                transform: `translateY(${depth * 14}px) scale(${1 - depth * 0.05})`,
                zIndex: FEATURED.length - depth,
                opacity: depth > 2 ? 0 : 1,
              }}
            >
              {/* TODO: replace with project image / embed */}
              <h3 className="text-2xl font-bold">{f.title}</h3>
              <p className="text-midnight-500 mt-2">{f.note}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs font-mono tracking-widest text-midnight-400 mt-6">
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
        <h2 className="reveal-heading text-3xl md:text-5xl font-bold mb-8">About</h2>
        <p className="text-lg leading-relaxed text-midnight-800 max-w-xl">
          {/* TODO: your bio — what you build, how you think, what you're looking for */}
          {"I'm a frontend engineer who cares about interfaces that feel intuitive from the first click. I build with React and TypeScript, ship fast, and sweat the details other people skip."
            .split(" ")
            .map((word, i) => (
              <span key={i} className="bio-word">
                {word + " "}
              </span>
            ))}
        </p>
        {/* TODO: portrait — <img className="mt-8 w-48 rounded-xl" src=... /> */}
      </div>
      <div className="hidden md:flex flex-col items-center text-4xl font-black text-grape-300 leading-tight">
        {vertical.split("").map((ch, i) => (
          <span key={i} className="vert-letter" style={{ marginLeft: (i % 3) * 14 - 14 }}>
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
      <p className="text-xs font-mono tracking-widest text-tangerine-600 mb-6">PROCESS</p>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((n) => (
          /* TODO: replace with WIP screenshots, sketches, terminal recordings */
          <div
            key={n}
            className="process-card min-w-64 h-44 rounded-xl bg-apricot-100 border border-apricot-200 flex items-center justify-center text-midnight-400 font-mono text-sm shrink-0"
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
    <div className="overflow-hidden border-y border-apricot-200 py-4 bg-apricot-100">
      <div className="flex gap-12 whitespace-nowrap animate-[marquee_20s_linear_infinite]">
        {items.map((item, i) => (
          <a key={i} href={`#${item.toLowerCase()}`} className="font-mono text-sm tracking-widest text-midnight-600 hover:text-tangerine-600">
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
    <footer id="connect" className="bg-midnight-950 text-apricot-50 px-6 py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="footer-col">
          <p className="text-xs font-mono tracking-widest text-grape-300 mb-4">EXPLORE</p>
          {LINKS.explore.map((l) => (
            <a key={l.label} href={l.href} className="block py-1 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <p className="text-xs font-mono tracking-widest text-grape-300 mb-4">FOLLOW</p>
          {LINKS.follow.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="block py-1 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
        <div className="footer-col">
          <p className="text-xs font-mono tracking-widest text-grape-300 mb-4">CONTACT</p>
          <button onClick={copyEmail} className="hover:underline text-left">
            {copied ? "Copied!" : LINKS.email}
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 flex items-center gap-2 text-sm text-apricot-200">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        Available to work
      </div>
    </footer>
  );
}

// ---------- 1. Header + page ----------

export default function PortfolioSkeleton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const scopeRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // All motion is gated behind prefers-reduced-motion; with it set,
      // every element simply stays in its final visible state.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const isTouch = window.matchMedia("(pointer: coarse)").matches;

        // Hero entrance: masked name lines, then cards pop in
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-line", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from(".hero-role", { y: 16, opacity: 0, duration: 0.6 }, "-=0.5")
          .from(
            ".board-card",
            { scale: 0.6, opacity: 0, duration: 0.8, ease: "back.out(1.7)", stagger: 0.08 },
            "-=0.6"
          )
          .from(".hero-vert-letter", { opacity: 0, x: 24, stagger: 0.05, duration: 0.5 }, "-=0.6")
          .from(".drag-hint", { opacity: 0, duration: 0.6 }, "-=0.3");

        if (!isTouch) {
          // Idle float loop on the board cards
          gsap.utils.toArray(".board-card").forEach((el, i) => {
            gsap.to(el, {
              y: i % 2 ? 10 : -10,
              duration: gsap.utils.random(2.5, 4),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: 1.5,
            });
          });

          // Hero name drifts up slower than the scroll (parallax out)
          gsap.to(".hero-center", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: { trigger: "#board", start: "top top", end: "bottom top", scrub: true },
          });
        }

        // Section headings: masked clip-path reveal
        gsap.utils.toArray(".reveal-heading").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 40, clipPath: "inset(0 0 100% 0)" },
            {
              y: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            }
          );
        });

        // Work cards rise in as they enter the viewport
        gsap.utils.toArray(".work-card").forEach((el) => {
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // Featured card stack rises as one unit
        gsap.from(".featured-stack", {
          y: 70,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: "#featured", start: "top 75%", once: true },
        });

        // Bio lights up word by word, scrubbed to scroll
        gsap.fromTo(
          ".bio-word",
          { opacity: 0.2 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: "none",
            scrollTrigger: { trigger: "#about", start: "top 70%", end: "top 25%", scrub: true },
          }
        );

        // Vertical type cascades in
        gsap.from(".vert-letter", {
          opacity: 0,
          x: -20,
          stagger: 0.06,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: "#about", start: "top 70%", once: true },
        });

        // Process strip slides in from the right
        gsap.from(".process-card", {
          x: 80,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "#process", start: "top 80%", once: true },
        });

        // Footer columns rise
        gsap.from(".footer-col", {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: "#connect", start: "top 85%", once: true },
        });
      });
    },
    { scope: scopeRef }
  );

  return (
    <div ref={scopeRef} className="font-sans text-midnight-950 bg-apricot-50">
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 mix-blend-difference text-white">
        <a href="#board" className="font-mono text-sm tracking-widest">
          {YOUR_NAME.join(" ").toUpperCase()}
        </a>
        <button onClick={() => setMenuOpen((o) => !o)} className="font-mono text-sm tracking-widest">
          ☰ MENU
        </button>
      </header>

      {menuOpen && (
        <nav className="fixed inset-0 z-40 bg-midnight-950/95 text-apricot-50 flex flex-col items-center justify-center gap-6 text-3xl font-bold">
          {NAV_ITEMS.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="hover:text-tangerine-400">
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