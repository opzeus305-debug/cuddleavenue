'use client';

import { useCallback, useEffect, useState } from 'react';

const programs = [
  { name: 'Infant', age: '6 weeks—18 months', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while secure relationships take root.', color: '#3f66b1' },
  { name: 'Toddler', age: '18 months—2 years', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', color: '#2f6b50' },
  { name: '2K', age: '2 years', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', color: '#d6a833' },
  { name: 'NYC 3-K', age: '3 years', image: '/assets/review-craft.webp', title: 'A free, full school day.', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', color: '#c6473d' },
  { name: 'Pre-K', age: '4—5 years', image: '/assets/program-playroom.webp', title: 'Ready without being rushed.', copy: 'Collaborative projects, early academics and practical independence prepare children for kindergarten while protecting the joy of discovery.', color: '#8e5b4b' },
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
const roomIds = ['approach', 'programs', 'day', 'parents', 'campuses'];

function SpatialImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty('--px', String(x * 5) + 'px');
    event.currentTarget.style.setProperty('--py', String(y * 5) + 'px');
  };
  const leave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--px', '0px');
    event.currentTarget.style.setProperty('--py', '0px');
  };
  return <figure className={'spatial-image ' + className} onPointerMove={move} onPointerLeave={leave}><img src={src} alt={alt} /><i aria-hidden="true" /></figure>;
}

export default function Home() {
  const [programIndex, setProgramIndex] = useState(0);
  const [parentIndex, setParentIndex] = useState(0);
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
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
    return () => { clearTimeout(timer); removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, []);

  const jumpToRoom = useCallback((index: number) => {
    document.getElementById(roomIds[index])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const heroMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    event.currentTarget.style.setProperty('--hero-x', String(x));
    event.currentTarget.style.setProperty('--hero-y', String(y));
    event.currentTarget.style.setProperty('--lens-x', String(event.clientX - bounds.left) + 'px');
    event.currentTarget.style.setProperty('--lens-y', String(event.clientY - bounds.top) + 'px');
  };
  const heroLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--hero-x', '0');
    event.currentTarget.style.setProperty('--hero-y', '0');
  };

  return <main>
    <a className="skip-link" href="#content">Skip to content</a>
    <div className={['page-loader', loaded ? 'is-hidden' : ''].join(' ')} aria-hidden={loaded}><img src="/assets/cuddle-avenue-logo.png" alt="" /><p>Opening the learning house</p><i /></div>
    <div className="scroll-progress" aria-hidden="true" />

    <header className="atlas-nav">
      <a className="atlas-brand" href="#content"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><span>Cuddle Avenue<br /><b>Academy</b></span></a>
      <p>Academic care for the first five years<br /><span>Brooklyn · New York</span></p>
      <div><a className="atlas-visit magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Arrange a visit ↗</a><button className="atlas-index" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>Index <span>{menuOpen ? '×' : '＋'}</span></button></div>
      <nav className={menuOpen ? 'is-open' : ''}>{rooms.map((room,index) => <button type="button" key={room} onClick={() => { jumpToRoom(index); setMenuOpen(false); }}><span>0{index + 1}</span>{room}</button>)}</nav>
    </header>

    <section className="manifesto-hero" id="content" onPointerMove={heroMove} onPointerLeave={heroLeave}>
      <div className="hero-grid" aria-hidden="true" />
      <p className="hero-folio"><span>Prospectus</span><b>2026—27</b></p>
      <h1><span>Childhood is not</span><em>a rehearsal.</em></h1>
      <SpatialImage className="manifesto-image" src="/assets/hero-classroom.webp" alt="Children and an educator working together around a classroom table" />
      <div className="observation-tags" aria-hidden="true"><span className="tag-a"><i />Concentration</span><span className="tag-b"><i />Language</span><span className="tag-c"><i />Belonging</span></div>
      <aside className="manifesto-note"><span>Our point of view</span><p>Care and curriculum belong at the same table. When children feel known, confidence, language, concentration and joy develop together.</p><div><a className="light-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Meet the school <b>↗</b></a><button type="button" onClick={() => jumpToRoom(0)}>Read our approach ↓</button></div></aside>
      <div className="age-scale" aria-label="Programs from infancy to age five"><span><b>6w</b>Infant</span><span><b>18m</b>Toddler</span><span><b>2y</b>2K</span><span><b>3y</b>NYC 3-K</span><span><b>5y</b>Pre-K</span></div>
      <p className="hero-coordinate">40.6602° N<br />73.9874° W</p>
      <p className="hero-proof"><b>02</b><span>Brooklyn<br />learning houses</span></p>
    </section>

    <section className="field-study" id="approach">
      <p className="section-folio"><span>01</span> The method</p>
      <header><p>Montessori-inspired · Relationship-led</p><h2>Before a child can<br />master the world,<br /><em>they must feel at home in it.</em></h2></header>
      <div className="observation-board">
        <SpatialImage className="field-image" src="/assets/sami-practical-life.webp" alt="A thoughtfully prepared practical-life classroom" />
        <span className="field-label field-label-a"><b>Observe</b>Before directing</span>
        <span className="field-label field-label-b"><b>Prepare</b>Before expecting</span>
        <span className="field-label field-label-c"><b>Trust</b>Before helping</span>
        <blockquote>Care is not separate from curriculum. It is what lets learning begin.</blockquote>
      </div>
      <div className="method-ledger"><p>Known closely</p><span>Educators notice temperament, interests and the rhythm behind each child’s day.</span><p>Invited thoughtfully</p><span>Materials and routines make concentration, language and independence possible.</span><p>Trusted gradually</p><span>Children receive enough time to try, repeat, revise and take genuine ownership.</span></div>
    </section>

    <section className="program-library" id="programs" style={{ '--program-color': program.color } as React.CSSProperties}>
      <header><p><span>02</span> The continuum</p><h2>Every age has a language.<br /><em>We learn to speak it.</em></h2></header>
      <div className="program-selector" role="tablist" aria-label="Choose a program">{programs.map((item,index) => <button type="button" role="tab" aria-selected={programIndex === index} onClick={() => transition(() => setProgramIndex(index))} key={item.name}><span>0{index + 1}</span><b>{item.name}</b><small>{item.age}</small><i style={{ background: item.color }} /></button>)}</div>
      <div className="program-spread">
        <div className="program-mark"><span>Currently viewing</span><b>{program.name}</b><i /></div>
        <SpatialImage className="library-image" src={program.image} alt={program.name + ' learning program at Cuddle Avenue'} />
        <article><span>{program.age}</span><h3>{program.title}</h3><p>{program.copy}</p><a href="#visit">Discuss {program.name} admissions ↗</a></article>
        <p className="program-count">0{programIndex + 1}<span>/ 06</span></p>
      </div>
    </section>

    <section className="rhythm-lab" id="day">
      <header><p><span>03</span> The school day</p><h2>A reliable rhythm<br />makes room for<br /><em>the unexpected.</em></h2><p>Children know what comes next. That security frees their attention for deeper exploration, social confidence and joyful work.</p></header>
      <div className="day-orbit">
        <div className="orbit-ring" aria-hidden="true" />
        <SpatialImage className="rhythm-image" src="/assets/story-gardening.webp" alt="Children exploring outdoors during the school day" />
        {[
          ['7:30','Arrival','A warm, unhurried welcome'],
          ['9:00','Gather','Language and shared attention'],
          ['9:30','Work','Choice, focus and discovery'],
          ['12:00','Restore','A home-cooked meal and rest'],
          ['3:00','Create','Movement, making and play'],
        ].map(([time,label,copy],index) => <div className={'orbit-stop orbit-stop-' + (index + 1)} key={time}><b>{time}</b><span>{label}</span><p>{copy}</p></div>)}
        <p className="orbit-center">One day.<br /><em>Hundreds of<br />small discoveries.</em></p>
      </div>
    </section>

    <section className="parent-desk" id="parents" style={{ '--note-color': parent.color } as React.CSSProperties}>
      <header><p><span>04</span> Parent intelligence</p><h2>The details are<br /><em>not small details.</em></h2><p>The quality of a school is visible in the questions parents have to ask—and in how clearly the answers arrive.</p></header>
      <div className="parent-tabs" role="tablist" aria-label="Practical information for parents">{parentNotes.map((item,index) => <button type="button" role="tab" aria-selected={parentIndex === index} onClick={() => transition(() => setParentIndex(index))} key={item.label}><span>0{index + 1}</span>{item.label}<i style={{ background: item.color }} /></button>)}</div>
      <article className="parent-sheet">
        <p className="sheet-index">CAA / PARENT NOTE / 0{parentIndex + 1}</p>
        <div><span>{parent.kicker}</span><h3>{parent.title}</h3><p>{parent.copy}</p><a href="#visit">Ask our team directly ↗</a></div>
        <SpatialImage className="sheet-image" src={parent.image} alt={parent.label + ' at Cuddle Avenue'} />
        <p className="sheet-stamp">Clear<br />Consistent<br />Human</p>
      </article>
      <blockquote>“We could see how much our daughter learned—not only academically, but socially and emotionally.”<span><b>5.0</b> · 47 parent reviews</span></blockquote>
    </section>

    <section className="campus-threshold" id="campuses">
      <header><p><span>05</span> South Slope, Brooklyn</p><h2>Two front doors.<br /><em>One standard of care.</em></h2><p>Choose the campus that fits your family. We will guide you through availability, schedule and the most relevant classroom.</p></header>
      <div className="campus-pair">{locations.map((location,index) => <article key={location.name}><SpatialImage src={location.image} alt={location.name + ' Cuddle Avenue campus'} /><div><span>Campus 0{index + 1}</span><h3>{location.name}</h3><address>{location.address}</address><a href={location.map} target="_blank" rel="noreferrer">Open directions ↗</a></div></article>)}</div>
      <p className="campus-note">Both locations · Licensed care · Prepared environments · Brooklyn families</p>
    </section>

    <section className="admissions-call" id="visit">
      <p><span>Admissions</span> 2026—27</p><h2>A visit should answer<br /><em>what a website cannot.</em></h2><div className="admissions-copy"><p>Tell us your child’s age and the rhythm your family needs. We will guide you through programs, availability and both Brooklyn campuses.</p><div><a className="light-button magnetic" href="mailto:customerservice@cuddleavenue.org?subject=Cuddle%20Avenue%20tour%20request" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Request a conversation <b>↗</b></a><a href="tel:+19179605618">+1 (917) 960-5618</a></div></div><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" />
    </section>

    <section className="parent-questions"><p>Before you visit</p><div>{[['What ages do you serve?','Programs begin at six weeks and continue through age five, including free NYC 3-K for eligible families.'],['Are meals provided?','Yes. Breakfast, lunch and a snack are prepared in-house, with dietary accommodations discussed directly.'],['Can I tour both locations?','Yes. Tell us the program and schedule you need, and we will guide you to the most relevant campus.']].map(([q,a],index) => <details key={q}><summary><span>0{index + 1}</span>{q}<i>+</i></summary><p>{a}</p></details>)}</div></section>

    <footer className="atlas-footer"><div><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><p>Academic care with<br />the warmth of home.</p></div><div><strong>Visit</strong><span>69 16th Street</span><span>591 3rd Avenue</span><span>Brooklyn, NY 11215</span></div><div><strong>Connect</strong><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="mailto:customerservice@cuddleavenue.org">Email ↗</a></div><p>© 2026 Cuddle Avenue Academy · The first five years are the whole foundation.</p></footer>
  </main>;
}
