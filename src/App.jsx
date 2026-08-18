import React, { useEffect, useRef } from "react";
import legacyMarkup from "./legacy-markup";
import Aurora from "./reactbits/Aurora";
import ClickSpark from "./reactbits/ClickSpark";
import Ferrofluid from "./reactbits/Ferrofluid/Ferrofluid";
import "./legacy.css";
import "./reactbits/reactbits.css";

function enhanceWithReactBits(host) {
  const cards = host.querySelectorAll(
    ".card,.panel,.feature-panel,.launch-card,.hero-card,.about-box,.daily-inner,.progress-panel,.compare-box,.shortcut-item"
  );
  cards.forEach(card => {
    card.classList.add("rb-spotlight");
    const move = e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--rbx", `${e.clientX - r.left}px`);
      card.style.setProperty("--rby", `${e.clientY - r.top}px`);
    };
    card.addEventListener("pointermove", move, { passive: true });
  });

  host.querySelectorAll(".btn,.small-btn,.icon-btn,.popular-btn,.path-btn").forEach(btn => {
    btn.classList.add("rb-magnet");
    btn.addEventListener("pointermove", e => {
      if (matchMedia("(pointer:coarse)").matches) return;
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width * 7;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height * 7;
      btn.style.transform = `translate(${x}px,${y}px)`;
    }, { passive: true });
    btn.addEventListener("pointerleave", () => {
      btn.style.transform = "";
    }, { passive: true });
  });

  const brandText = host.querySelector(".brand > div:last-child");
  if (brandText) brandText.classList.add("rb-shiny");

  // Mobile hamburger navigation: keep the header compact while preserving every nav link.
  const nav = host.querySelector(".topbar .nav");
  const navlinks = host.querySelector(".topbar .navlinks");
  const navActions = host.querySelector(".topbar .nav-actions");

  if (nav && navlinks && !host.querySelector(".mobile-menu-toggle")) {
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "icon-btn mobile-menu-toggle";
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = '<span aria-hidden="true">☰</span>';

    const mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-nav-drawer";
    mobileMenu.setAttribute("aria-hidden", "true");

    const menuHead = document.createElement("div");
    menuHead.className = "mobile-nav-head";
    menuHead.innerHTML = '<strong>FORMULA LAB</strong>';

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "mobile-nav-close";
    closeButton.setAttribute("aria-label", "Close navigation");
    closeButton.textContent = "×";
    menuHead.appendChild(closeButton);

    const menuLinks = document.createElement("div");
    menuLinks.className = "mobile-nav-links";

    const closeMenu = () => {
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("mobile-nav-open");
    };

    navlinks.querySelectorAll("a").forEach(link => {
      const clone = link.cloneNode(true);
      clone.addEventListener("click", closeMenu);
      menuLinks.appendChild(clone);
    });

    mobileMenu.appendChild(menuHead);
    mobileMenu.appendChild(menuLinks);
    host.appendChild(mobileMenu);

    const openMenu = () => {
      mobileMenu.classList.add("open");
      mobileMenu.setAttribute("aria-hidden", "false");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation");
      document.body.classList.add("mobile-nav-open");
    };

    menuButton.addEventListener("click", () => {
      mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
    });
    closeButton.addEventListener("click", closeMenu);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeMenu();
    });

    if (navActions) navActions.insertBefore(menuButton, navActions.firstChild);
    else nav.appendChild(menuButton);
  }

  const revealTargets = host.querySelectorAll(
    ".section-head,.launch-card,.daily-inner,.progress-panel,.feature-panel,.about-box"
  );
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("rb-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .05, rootMargin: "0px 0px -4% 0px" });

  revealTargets.forEach(el => {
    el.classList.add("rb-scroll");
    io.observe(el);
  });

  return () => io.disconnect();
}

export default function App() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Preserve the original body's #top anchor used by Back to Top/mobile navigation.
    document.body.id = "top";

    // Execute the exact JavaScript from the original full-feature HTML.
    const script = document.createElement("script");
    script.src = "/legacy-runtime.js";
    script.dataset.edsxelLegacy = "true";
    document.body.appendChild(script);

    let cleanupEffects = () => {};
    const onLoad = () => {
      // Allow the original runtime to finish initial rendering first.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          cleanupEffects = enhanceWithReactBits(host);
        });
      });
    };
    script.addEventListener("load", onLoad);

    return () => {
      cleanupEffects();
      script.removeEventListener("load", onLoad);
      script.remove();
    };
  }, []);

  return (
    <>
      <Ferrofluid
        className="edsxel-ferrofluid-bg"
        colors={["#83d7ae","#1f6f57","#e2a064","#a5e7c8"]}
        speed={0.22}
        scale={1.75}
        turbulence={0.82}
        fluidity={0.14}
        rimWidth={0.22}
        sharpness={2.7}
        shimmer={1.15}
        glow={1.8}
        flowDirection="down"
        opacity={0.82}
        mouseInteraction={true}
        mouseStrength={0.7}
        mouseRadius={0.28}
        mouseDampening={0.18}
      />
      <Aurora />
      <ClickSpark />
      <div ref={hostRef} dangerouslySetInnerHTML={{ __html: legacyMarkup }} />
    </>
  );
}
