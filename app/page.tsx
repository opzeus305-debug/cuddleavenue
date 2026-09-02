'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const programs = [
  { name: 'Infant', age: '6 weeks—18 months', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while secure relationships take root.', color: '#3f66b1' },
  { name: 'Toddler', age: '18 months—2 years', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', color: '#2f6b50' },
  { name: '2K', age: '2 years', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', color: '#d6a833' },
  { name: 'NYC 3-K', age: '3 years', image: '/assets/review-craft.webp', title: 'A free, full school day.', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', color: '#c6473d' },
  { name: 'Summer', age: 'Seasonal', image: '/assets/sami-play-structure.webp', title: 'A season built for discovery.', copy: 'Outdoor play, water, cooking, gardening and STEM turn summer into an active extension of the school year.', color: '#4c6f70' },
];

const parentNotes = [
  { label: 'Meals', kicker: 'Nutrition', title: 'Cooked here, every morning.', copy: 'Breakfast, lunch and an afternoon snack are prepared in-house with organic ingredients. Dietary accommodations are discussed with every family.', image: '/assets/menu-friday-lunch.jpg', color: '#d6a833' },
  { label: 'Safety', kicker: 'Peace of mind', title: 'Care you can verify.', copy: 'Licensed programs, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.', image: '/assets/space-play.webp', color: '#2f6b50' },
  { label: 'Updates', kicker: 'Family connection', title: 'No wondering how the day went.', copy: 'Meaningful updates on eating, sleep, play and learning keep parents connected to the small moments—not only the pickup summary.', image: '/assets/story-table.webp', color: '#3f66b1' },
];

const locations = [
  { name: '16th Street', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { name: '3rd Avenue', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
];

const rooms = ['Approach', 'Programs', 'The day', 'For parents', 'Campuses'];

function SpatialImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty('--px', String(x * 12) + 'px');
    event.currentTarget.style.setProperty('--py', String(y * 12) + 'px');
  };
  const leave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--px', '0px');
    event.currentTarget.style.setProperty('--py', '0px');
  };
  return <figure className={'spatial-image ' + className} onPointerMove={move} onPointerLeave={leave}><img src={src} alt={alt} /><i aria-hidden="true" /></figure>;
}

export default function Home() {
  const storyRef = useRef<HTMLElement>(null);
  const [programIndex, setProgramIndex] = useState(0);
  const [parentIndex, setParentIndex] = useState(0);
  const [activeRoom, setActiveRoom] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const program = programs[programIndex];
  const parent = parentNotes[parentIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 700);
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const update = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      progress?.style.setProperty('transform', 'scaleX(' + (total > 0 ? scrollY / total : 0) + ')');
      const story = storyRef.current;
      if (!story || innerWidth < 800) return;
      const rect = story.getBoundingClientRect();
      const distance = story.offsetHeight - innerHeight;
      const value = Math.max(0, Math.min(1, -rect.top / Math.max(distance, 1)));
      story.style.setProperty('--story-x', String(value * -400) + 'vw');
      story.style.setProperty('--story-progress', String(value));
      setActiveRoom(Math.min(4, Math.round(value * 4)));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    return () => { clearTimeout(timer); removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  const jumpToRoom = useCallback((index: number) => {
    const story = storyRef.current;
    if (!story) return;
    if (innerWidth < 800) {
      story.querySelectorAll<HTMLElement>('.room')[index]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const distance = story.offsetHeight - innerHeight;
    scrollTo({ top: story.offsetTop + (distance * index / 4), behavior: 'smooth' });
  }, []);

  const transition = (update: () => void) => {
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (doc.startViewTransition) doc.startViewTransition(update); else update();
  };
  const magnetMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', String((event.clientX - bounds.left - bounds.width / 2) * .07) + 'px');
    event.currentTarget.style.setProperty('--my', String((event.clientY - bounds.top - bounds.height / 2) * .07) + 'px');
  };
  const magnetLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '0px');
    event.currentTarget.style.setProperty('--my', '0px');
  };

  return <main>
    <a className="skip-link" href="#content">Skip to content</a>
    <div className={['page-loader', loaded ? 'is-hidden' : ''].join(' ')} aria-hidden={loaded}><img src="/assets/cuddle-avenue-logo.png" alt="" /><p>Opening the learning house</p><i /></div>
    <div className="scroll-progress" aria-hidden="true" />

    <header className="site-nav">
      <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><b>Explore</b></button>
      <a className="brand" href="#content"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><span>Academy · Brooklyn</span></a>
      <nav className={menuOpen ? 'is-open' : ''}>{rooms.map((room,index) => <button type="button" key={room} onClick={() => { jumpToRoom(index); setMenuOpen(false); }}>{room}<span>0{index + 1}</span></button>)}</nav>
      <a className="visit-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Plan a visit <span>↗</span></a>
    </header>

    <section className="hero" id="content">
      <div className="hero-copy"><p>Early childhood education · Brooklyn</p><h1><span>A thoughtful beginning</span><em>lasts a lifetime.</em></h1><p>Care with the warmth of home. An academic foundation built through attention, independence and purposeful play.</p><div><a className="dark-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a><button type="button" onClick={() => jumpToRoom(0)}>Enter the learning house <span>↓</span></button></div></div>
      <SpatialImage className="hero-image" src="/assets/sami-classroom-hero.webp" alt="A warm Cuddle Avenue classroom with a central reading tree" />
      <div className="hero-facts"><span><b>02</b> Brooklyn campuses</span><span><b>5.0</b> parent rating</span><span><b>3-K</b> free school day</span></div>
      <div className="hero-orbit" aria-hidden="true"><span /><span /><span /><i /></div>
    </section>

    <section className="spatial-story" ref={storyRef}>
      <div className="story-sticky">
        <div className="room-progress"><span><b>0{activeRoom + 1}</b> / 05</span><div>{rooms.map((room,index) => <button type="button" aria-label={'Go to ' + room} aria-current={activeRoom === index ? 'step' : undefined} onClick={() => jumpToRoom(index)} key={room} />)}</div><p>{rooms[activeRoom]}</p></div>
        <div className="room-track">
          <article className="room room-approach">
            <div className="room-title"><span>Room 01 · Approach</span><h2>Everything starts<br />with <em>attention.</em></h2><p>Educators observe closely, prepare intentionally and give each child enough trust to try, repeat and master.</p></div>
            <SpatialImage className="approach-image" src="/assets/sami-practical-life.webp" alt="A prepared practical-life classroom at Cuddle Avenue" />
            <div className="principle-cloud"><span className="cloud-one"><b>01</b>Known closely</span><span className="cloud-two"><b>02</b>Prepared thoughtfully</span><span className="cloud-three"><b>03</b>Trusted to grow</span></div>
            <blockquote>“Care is not separate from curriculum. It is what lets learning begin.”</blockquote>
          </article>

          <article className="room room-programs" style={{ '--program-color': program.color } as React.CSSProperties}>
            <div className="program-intro"><span>Room 02 · Programs</span><h2>One story.<br /><em>Five chapters.</em></h2><p>Six weeks to five years, with the pace and independence evolving around the child.</p></div>
            <div className="program-live">
              <SpatialImage className="program-image" src={program.image} alt={program.name + ' program at Cuddle Avenue'} />
              <div className="program-card"><span>{program.age}</span><h3>{program.title}</h3><p>{program.copy}</p><a href="#visit">Ask about {program.name} ↗</a></div>
            </div>
            <div className="program-dial" role="tablist">{programs.map((item,index) => <button type="button" role="tab" aria-selected={programIndex === index} onClick={() => transition(() => setProgramIndex(index))} key={item.name}><i style={{ background: item.color }} />{item.name}<small>{item.age}</small></button>)}</div>
          </article>

          <article className="room room-day">
            <div className="day-copy"><span>Room 03 · Daily rhythm</span><h2>Predictable.<br /><em>Never repetitive.</em></h2><p>Children know what comes next. That sense of security is what frees them to explore.</p></div>
            <SpatialImage className="day-image" src="/assets/story-gardening.webp" alt="Children exploring and learning together" />
            <div className="time-constellation">{[['7:30','Arrive'],['9:00','Gather'],['9:30','Explore'],['12:00','Restore'],['3:00','Create']].map(([time,label],index) => <span className={'time time-' + (index + 1)} key={time}><b>{time}</b>{label}</span>)}</div>
          </article>

          <article className="room room-parents" style={{ '--note-color': parent.color } as React.CSSProperties}>
            <div className="parent-intro"><span>Room 04 · For parents</span><h2>Clarity is<br /><em>part of care.</em></h2><p>The details surrounding the school day should feel as considered as the classroom itself.</p></div>
            <div className="parent-note">
              <SpatialImage className="parent-image" src={parent.image} alt={parent.label + ' at Cuddle Avenue'} />
              <div><span>{parent.kicker}</span><h3>{parent.title}</h3><p>{parent.copy}</p><a href="#visit">Talk with our team ↗</a></div>
            </div>
            <div className="note-switcher">{parentNotes.map((item,index) => <button type="button" aria-pressed={parentIndex === index} onClick={() => transition(() => setParentIndex(index))} key={item.label}><i style={{ background: item.color }} />{item.label}</button>)}</div>
            <aside>Clear.<br />Consistent.<br />Human.</aside>
          </article>

          <article className="room room-campuses">
            <div className="campus-copy"><span>Room 05 · South Slope</span><h2>Two houses.<br /><em>One standard.</em></h2><p>Choose the campus that fits your family. We’ll help with availability and the right next step.</p><a className="dark-button" href="#visit">Plan a visit ↗</a></div>
            <div className="campus-film">{locations.map((location,index) => <article key={location.name}><SpatialImage src={location.image} alt={location.name + ' Cuddle Avenue campus'} /><div><span>0{index + 1}</span><h3>{location.name}</h3><address>{location.address}</address><a href={location.map} target="_blank" rel="noreferrer">Directions ↗</a></div></article>)}</div>
          </article>
        </div>
      </div>
    </section>

    <section className="finale" id="visit">
      <div className="review"><p>Parent perspective</p><blockquote>“We could see how much our daughter learned—not only academically, but socially and emotionally.”</blockquote><span><b>5.0</b> · 47 parent reviews</span></div>
      <div className="tour"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><p>Admissions · 2026</p><h2>Come feel the<br /><em>difference.</em></h2><span>Tell us your child’s age and preferred campus. We’ll guide you through programs, availability and next steps.</span><a className="light-button magnetic" href="mailto:customerservice@cuddleavenue.org?subject=Cuddle%20Avenue%20tour%20request" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Request a tour <b>↗</b></a><a href="tel:+19179605618">+1 (917) 960-5618</a></div>
      <div className="answers"><p>Useful answers</p>{[['What ages do you serve?','Programs begin at six weeks and continue through age five, including free NYC 3-K for eligible families.'],['Are meals provided?','Yes. Breakfast, lunch and a snack are prepared in-house, with dietary accommodations discussed directly.'],['Can I tour both locations?','Yes. Tell us the program and schedule you need, and we will guide you to the most relevant campus.']].map(([q,a],index) => <details key={q}><summary><span>0{index + 1}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div>
    </section>

    <footer><div><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><p>Thoughtful early education<br />for Brooklyn families.</p></div><div><strong>Visit</strong><span>69 16th Street</span><span>591 3rd Avenue</span><span>Brooklyn, NY 11215</span></div><div><strong>Connect</strong><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="mailto:customerservice@cuddleavenue.org">Email ↗</a></div><p>© 2026 Cuddle Avenue Academy</p></footer>
  </main>;
}
