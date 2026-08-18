import React, { useEffect, useRef, useState } from "react";

export function Aurora({ className="" }) {
  return <div className={`aurora ${className}`} aria-hidden="true">
    <i/><i/><i/>
  </div>;
}

export function ShinyText({children, className=""}) {
  return <span className={`shiny-text ${className}`}>{children}</span>;
}

export function SpotlightCard({children, className=""}) {
  const ref=useRef(null);
  const onMove=e=>{
    const r=ref.current?.getBoundingClientRect(); if(!r)return;
    ref.current.style.setProperty("--mx",`${e.clientX-r.left}px`);
    ref.current.style.setProperty("--my",`${e.clientY-r.top}px`);
  };
  return <div ref={ref} onMouseMove={onMove} className={`spotlight-card ${className}`}>{children}</div>;
}

export function Magnet({children, strength=12, className=""}) {
  const ref=useRef(null);
  const move=e=>{
    const r=ref.current?.getBoundingClientRect(); if(!r)return;
    const x=(e.clientX-(r.left+r.width/2))/r.width*strength;
    const y=(e.clientY-(r.top+r.height/2))/r.height*strength;
    ref.current.style.transform=`translate(${x}px,${y}px)`;
  };
  const reset=()=>{if(ref.current)ref.current.style.transform="translate(0,0)"};
  return <span ref={ref} onMouseMove={move} onMouseLeave={reset} className={`magnet ${className}`}>{children}</span>;
}

export function ScrollReveal({children, className=""}) {
  const ref=useRef(null); const [seen,setSeen]=useState(false);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setSeen(true);io.disconnect()}},{rootMargin:"0px 0px -8% 0px",threshold:.08});
    io.observe(el);return()=>io.disconnect();
  },[]);
  return <div ref={ref} className={`reveal ${seen?"is-seen":""} ${className}`}>{children}</div>
}
