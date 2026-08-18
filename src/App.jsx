import React, {useEffect, useMemo, useState} from "react";
import { Moon, Sun, Search, Heart, Shuffle, ArrowUp, X, Copy, Check, BookOpen, Sparkles, ChevronRight } from "lucide-react";
import { formulas } from "./data";
import { Aurora, Magnet, ScrollReveal, ShinyText, SpotlightCard } from "./components/Bits";
import "./styles.css";

const popularNames=["XLOOKUP","SUMIFS","IF","FILTER","COUNTIFS","INDEX","MATCH","TEXTJOIN","UNIQUE","IFERROR"];
const categories=["All",...Array.from(new Set(formulas.map(f=>f.cat)))];

const difficulty=f=>{
  const advanced=["Cube","Engineering","Financial","Statistical"];
  if(advanced.includes(f.cat)||f.name.includes(".")) return "Advanced";
  if(["Lookup & Reference","Database"].includes(f.cat)) return "Intermediate";
  return "Beginner";
};

const related=f=>{
  const words=new Set((f.desc+" "+f.keywords).toLowerCase().split(/\W+/).filter(x=>x.length>4));
  return formulas.filter(x=>x.name!==f.name).map(x=>{
    let score=x.cat===f.cat?4:0; const hay=(x.desc+" "+x.keywords).toLowerCase();
    words.forEach(w=>{if(hay.includes(w))score++});
    return {x,score};
  }).sort((a,b)=>b.score-a.score).slice(0,5).map(v=>v.x);
};

const useCases=f=>{
  const h=(f.name+" "+f.cat+" "+f.desc).toLowerCase(), t=[];
  const add=x=>!t.includes(x)&&t.push(x);
  if(/employee|salary|workday|lookup|date/.test(h))add("HR");
  if(/sales|sum|average|max|min|forecast/.test(h))add("Sales");
  if(/stock|inventory|product|count|unique/.test(h))add("Inventory");
  if(f.cat==="Financial"||/interest|payment|loan/.test(h))add("Finance");
  if(f.cat==="Date & Time")add("Dates");
  if(f.cat==="Text"||/trim|clean|text|replace/.test(h))add("Cleaning");
  if(/filter|sort|rank|aggregate|subtotal/.test(h))add("Reporting");
  return t.slice(0,3);
};

function App(){
  const [dark,setDark]=useState(()=>localStorage.getItem("edsxelTheme")!=="light");
  const [query,setQuery]=useState("");
  const [cat,setCat]=useState("All");
  const [level,setLevel]=useState("All");
  const [selected,setSelected]=useState(null);
  const [favorites,setFavorites]=useState(()=>new Set(JSON.parse(localStorage.getItem("edsxelFavorites")||"[]")));
  const [learned,setLearned]=useState(()=>new Set(JSON.parse(localStorage.getItem("edsxelLearned")||"[]")));
  const [last,setLast]=useState(()=>localStorage.getItem("edsxelLastTutorial")||"");
  const [notes,setNotes]=useState(()=>JSON.parse(localStorage.getItem("edsxelNotes")||"{}"));
  const [copied,setCopied]=useState(false);
  const [showTop,setShowTop]=useState(false);

  useEffect(()=>{document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("edsxelTheme",dark?"dark":"light")},[dark]);
  useEffect(()=>{const fn=()=>setShowTop(scrollY>650);addEventListener("scroll",fn,{passive:true});return()=>removeEventListener("scroll",fn)},[]);
  useEffect(()=>{const n=new URLSearchParams(location.search).get("formula");if(n){const f=formulas.find(x=>x.name.toLowerCase()===n.toLowerCase());if(f)setSelected(f)}},[]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return formulas.filter(f=>{
      if(cat!=="All"&&f.cat!==cat)return false;
      if(level!=="All"&&difficulty(f)!==level)return false;
      if(!q)return true;
      const h=(f.name+" "+f.desc+" "+f.keywords+" "+f.syntax).toLowerCase();
      return q.split(/\s+/).every(w=>h.includes(w));
    });
  },[query,cat,level]);

  const suggestions=useMemo(()=>{
    if(query.trim().length<2)return [];
    const q=query.toLowerCase();
    return formulas.map(f=>{
      let s=0;const n=f.name.toLowerCase(),h=(f.desc+" "+f.keywords).toLowerCase();
      if(n.startsWith(q))s+=20;if(n.includes(q))s+=10;
      q.split(/\s+/).forEach(w=>{if(h.includes(w))s+=2});
      return {f,s};
    }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,6).map(x=>x.f);
  },[query]);

  const daily=formulas[Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/86400000)%formulas.length];
  const continueF=formulas.find(f=>f.name===last);

  const openFormula=f=>{
    setSelected(f);setLast(f.name);localStorage.setItem("edsxelLastTutorial",f.name);
    const u=new URL(location.href);u.searchParams.set("formula",f.name);history.replaceState({},"",u);
  };
  const closeModal=()=>{setSelected(null);history.replaceState({},"",location.pathname)};
  const toggleFav=name=>{
    const n=new Set(favorites);n.has(name)?n.delete(name):n.add(name);setFavorites(n);localStorage.setItem("edsxelFavorites",JSON.stringify([...n]));
  };
  const toggleLearn=name=>{
    const n=new Set(learned);n.has(name)?n.delete(name):n.add(name);setLearned(n);localStorage.setItem("edsxelLearned",JSON.stringify([...n]));
  };
  const copy=async text=>{try{await navigator.clipboard.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),900)}catch{}};

  return <div className="app">
    <Aurora/>
    <header className="topbar">
      <div className="nav">
        <a className="brand" href="#home"><span className="logo">EDS</span><span><ShinyText>EDSXEL NGANI</ShinyText><small>FORMULA LAB & LEARNING</small></span></a>
        <nav className="navlinks">
          <a href="#library">Formulas</a><a href="#learn">Learn</a><a href="#paths">Paths</a><a href="#about">About</a>
        </nav>
        <Magnet><button className="icon-btn" onClick={()=>setDark(v=>!v)} aria-label="Toggle theme">{dark?<Sun size={17}/>:<Moon size={17}/>}</button></Magnet>
      </div>
    </header>

    <main id="home">
      <section className="hero">
        <ScrollReveal className="hero-copy">
          <div className="eyebadge"><Sparkles size={13}/> 456 Excel functions. One smarter way to learn.</div>
          <h1>Excel formulas,<br/><span>decoded beautifully.</span></h1>
          <p>Search by task, learn through examples, compare functions, practice concepts, and build formulas without staring at documentation all day.</p>
          <div className="hero-search">
            <Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Try “sum sales by month” or “lookup employee”'/>
            {suggestions.length>0&&<div className="suggestions">{suggestions.map(f=><button key={f.name} onClick={()=>{setQuery(f.name);document.querySelector("#library")?.scrollIntoView()}}><b>{f.name}</b><span>{f.desc}</span></button>)}</div>}
          </div>
          <div className="hero-actions">
            <Magnet><button className="primary" onClick={()=>document.querySelector("#library")?.scrollIntoView({behavior:"smooth"})}>Explore formulas <ChevronRight size={16}/></button></Magnet>
            <button className="ghost" onClick={()=>openFormula(formulas[Math.floor(Math.random()*formulas.length)])}><Shuffle size={15}/> Teach me something</button>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <SpotlightCard className="formula-stage">
            <div className="stage-label">LIVE FORMULA ANATOMY</div>
            <div className="stage-formula"><span>=</span><b>XLOOKUP</b><span>(A2, Emp_ID, Emp_Value, </span><em>"Not found"</em><span>)</span></div>
            <div className="syntax-pills"><i>LOOKUP VALUE</i><i>SEARCH RANGE</i><i>RETURN RANGE</i><i>FALLBACK</i></div>
            <div className="stage-code">=IF(B2&gt;10000, B2*5%, 0)</div>
            <div className="stats"><div><b>456</b><span>FORMULAS</span></div><div><b>{learned.size}</b><span>LEARNED</span></div><div><b>{favorites.size}</b><span>FAVORITES</span></div></div>
          </SpotlightCard>
        </ScrollReveal>
      </section>

      <section className="quick-grid">
        <ScrollReveal><SpotlightCard className="quick-card"><span className="mini-kicker">POPULAR</span><h3>Start with the classics</h3><div className="pills">{popularNames.filter(n=>formulas.some(f=>f.name===n)).map(n=><button key={n} onClick={()=>openFormula(formulas.find(f=>f.name===n))}>{n}</button>)}</div></SpotlightCard></ScrollReveal>
        <ScrollReveal><SpotlightCard className="quick-card"><span className="mini-kicker">CONTINUE</span><h3>{continueF?continueF.name:"Your learning journey"}</h3><p>{continueF?continueF.desc:"Open any tutorial and EDSXEL will remember where you stopped."}</p><button className="ghost" onClick={()=>continueF?openFormula(continueF):document.querySelector("#library")?.scrollIntoView()}>Continue learning</button></SpotlightCard></ScrollReveal>
        <ScrollReveal><SpotlightCard className="quick-card daily"><span className="mini-kicker">FORMULA OF THE DAY</span><h3>{daily.name}</h3><p>{daily.desc}</p><button className="ghost" onClick={()=>openFormula(daily)}>Quick lesson</button></SpotlightCard></ScrollReveal>
      </section>

      <section id="library" className="section">
        <ScrollReveal><div className="section-head"><div><span className="mini-kicker">FORMULA LIBRARY</span><h2>Find what your spreadsheet needs.</h2></div><div className="result-count">{filtered.length} results</div></div></ScrollReveal>
        <div className="filters">
          <select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select>
          <select value={level} onChange={e=>setLevel(e.target.value)}><option>All</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
          <button className="ghost" onClick={()=>{setQuery("");setCat("All");setLevel("All")}}>Clear filters</button>
        </div>
        <div className="formula-grid">
          {filtered.map((f,i)=><SpotlightCard key={f.name} className="formula-card">
            <div className="card-top"><span className="cat">{f.cat}</span><button className={`heart ${favorites.has(f.name)?"on":""}`} onClick={()=>toggleFav(f.name)}><Heart size={16} fill={favorites.has(f.name)?"currentColor":"none"}/></button></div>
            <h3>{f.name}</h3><span className={`level ${difficulty(f).toLowerCase()}`}>{difficulty(f)}</span>
            <p>{f.desc}</p><div className="tag-row">{useCases(f).map(t=><span key={t}>{t}</span>)}</div>
            <code>{f.syntax}</code>
            <div className="card-actions"><button className="primary small" onClick={()=>openFormula(f)}><BookOpen size={14}/> Tutorial</button><button className="ghost small" onClick={()=>copy(f.example)}><Copy size={14}/> Copy</button></div>
          </SpotlightCard>)}
        </div>
      </section>

      <section id="paths" className="section">
        <ScrollReveal><div className="section-head"><div><span className="mini-kicker">GUIDED LEARNING</span><h2>Learning paths built around real work.</h2></div></div></ScrollReveal>
        <div className="path-grid">
          {[
            ["Excel Beginner",["SUM","AVERAGE","COUNT","IF","ROUND","TODAY","TRIM"]],
            ["HR & Payroll",["XLOOKUP","COUNTIFS","SUMIFS","NETWORKDAYS","DATEDIF","EOMONTH"]],
            ["Sales & Reporting",["SUMIFS","AVERAGEIFS","MAXIFS","FILTER","SORT","RANK.EQ"]],
            ["Data Cleaning",["TRIM","CLEAN","SUBSTITUTE","TEXTSPLIT","UNIQUE","FILTER"]],
            ["Dashboard Essentials",["XLOOKUP","INDEX","MATCH","FILTER","SORT","IFERROR"]]
          ].map(([title,names])=><ScrollReveal key={title}><SpotlightCard className="path-card"><h3>{title}</h3><div className="pills">{names.filter(n=>formulas.some(f=>f.name===n)).map(n=><button key={n} onClick={()=>openFormula(formulas.find(f=>f.name===n))}>{n}</button>)}</div></SpotlightCard></ScrollReveal>)}
        </div>
      </section>

      <section id="learn" className="section feature-callout">
        <ScrollReveal><SpotlightCard><span className="mini-kicker">LEARNING PROGRESS</span><h2>{learned.size} formulas learned</h2><p>Mark tutorials as learned and build a personal Excel reference library that stays in your browser.</p><div className="progress"><i style={{width:`${Math.min(100,learned.size/formulas.length*100)}%`}}/></div></SpotlightCard></ScrollReveal>
      </section>

      <section id="about" className="section about">
        <ScrollReveal><div><span className="mini-kicker">ABOUT</span><h2>Excel, gets mo na.</h2><p>EDSXEL NGANI turns formula syntax into practical learning: examples, plain-language tutorials, comparisons, and guided discovery. Favorites, notes, theme settings, and learning progress stay locally in your browser.</p></div></ScrollReveal>
      </section>
    </main>

    {selected&&<div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&closeModal()}>
      <div className="modal">
        <button className="modal-close" onClick={closeModal}><X/></button>
        <span className="cat">{selected.cat}</span><h2>{selected.name}</h2><p>{selected.desc}</p>
        <h4>Syntax</h4><code>{selected.syntax}</code><h4>Worked example</h4><code>{selected.example}</code>
        <div className="modal-actions"><button className="primary" onClick={()=>copy(selected.example)}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?"Copied":"Copy example"}</button><button className={`ghost ${learned.has(selected.name)?"learned":""}`} onClick={()=>toggleLearn(selected.name)}>{learned.has(selected.name)?"✓ Learned":"Mark as learned"}</button></div>
        <h4>Step by step</h4><ol>{selected.steps.map((s,i)=><li key={i}>{s}</li>)}</ol>
        <h4>Related formulas</h4><div className="pills">{related(selected).map(f=><button key={f.name} onClick={()=>openFormula(f)}>{f.name}</button>)}</div>
        <h4>Personal note</h4><textarea value={notes[selected.name]||""} onChange={e=>{const n={...notes,[selected.name]:e.target.value};setNotes(n);localStorage.setItem("edsxelNotes",JSON.stringify(n))}} placeholder="Write your own reminder…"/>
      </div>
    </div>}

    {showTop&&<button className="back-top" onClick={()=>scrollTo({top:0,behavior:"smooth"})}><ArrowUp/></button>}
  </div>
}
export default App;
