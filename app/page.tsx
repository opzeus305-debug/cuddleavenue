'use client';

import { useEffect, useMemo, useState } from 'react';

const programs = [
  { code: '01', name: 'Infant', age: '6 weeks—18 months', signal: 'A calm first classroom', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while secure relationships take root.', image: '/assets/program-infant.webp', color: '#486383' },
  { code: '02', name: 'Toddler', age: '18 months—2 years', signal: 'Curiosity finds its feet', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', image: '/assets/program-toddler.webp', color: '#416354' },
  { code: '03', name: '2K', age: '2 years', signal: 'Confidence before preschool', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', image: '/assets/program-preschool.webp', color: '#a17c3f' },
  { code: '04', name: 'NYC 3-K', age: '3 years', signal: 'A free, full school day', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', image: '/assets/review-craft.webp', color: '#91473e' },
  { code: '05', name: 'Pre-K', age: '4—5 years', signal: 'Ready without being rushed', copy: 'Collaborative projects, early academics and practical independence prepare children for kindergarten while protecting discovery.', image: '/assets/program-playroom.webp', color: '#65516f' },
  { code: '06', name: 'Summer', age: 'Seasonal', signal: 'A season built for discovery', copy: 'Outdoor play, water, cooking, gardening and STEM turn summer into an active extension of the school year.', image: '/assets/sami-play-structure.webp', color: '#3f6f70' },
];

const principles = [
  { number: '01', title: 'Known closely', copy: 'Educators notice temperament, interests and the quiet rhythm behind each child’s day.' },
  { number: '02', title: 'Invited thoughtfully', copy: 'Materials and routines make concentration, language and independence possible.' },
  { number: '03', title: 'Trusted gradually', copy: 'Children receive enough time to try, repeat, revise and take genuine ownership.' },
];

const parentBriefs = [
  { label: 'Meals', title: 'Cooked here, every morning.', copy: 'Breakfast, lunch and an afternoon snack are prepared in-house with organic ingredients. Dietary accommodations are discussed with every family.' },
  { label: 'Safety', title: 'Care you can verify.', copy: 'Licensed programs, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.' },
  { label: 'Updates', title: 'No wondering how the day went.', copy: 'Meaningful updates on eating, sleep, play and learning keep parents connected to the small moments—not only the pickup summary.' },
];

const locations = [
  { index: 'A', name: '16th Street', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { index: 'B', name: '3rd Avenue', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
];

const particles = Array.from({ length: 26 }, (_, index) => ({
  left: `${(index * 37 + 11) % 97}%`,
  top: `${(index * 61 + 7) % 91}%`,
  depth: ((index % 5) + 1) * 0.14,
}));

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? 'brand brand--compact' : 'brand'}>
      <span className="brand__seal"><img src="/assets/cuddle-avenue-logo.png" alt="" /></span>
      <span className="brand__type">Cuddle Avenue <b>Academy</b></span>
    </span>
  );
}

function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <figure className={`photo ${className}`}><img src={src} alt={alt} /></figure>;
}

export default function Home() {
  const [selected, setSelected] = useState(2);
  const [openBrief, setOpenBrief] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const program = programs[selected];

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setReady(true), 760);
    const progress = document.querySelector<HTMLElement>('.read-progress');
    const revealers = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-seen')),
      { threshold: 0.14 },
    );
    revealers.forEach((item) => observer.observe(item));
    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty('--read', `${distance > 0 ? window.scrollY / distance : 0}`);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
    return () => {
      window.clearTimeout(loadTimer);
      observer.disconnect();
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const chooseProgram = (index: number) => {
    const transitioningDocument = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (transitioningDocument.startViewTransition) transitioningDocument.startViewTransition(() => setSelected(index));
    else setSelected(index);
  };

  const moveStage = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--pointer-x', `${x}`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}`);
  };

  const resetStage = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--pointer-x', '0');
    event.currentTarget.style.setProperty('--pointer-y', '0');
  };

  const navItems = useMemo(() => [
    ['Approach', '#approach'],
    ['The day', '#day'],
    ['For parents', '#parents'],
    ['Locations', '#locations'],
  ], []);

  return (
    <main className="index-site">
      <a className="skip-link" href="#starting-point">Skip to content</a>
      <div className={`opening-curtain ${ready ? 'opening-curtain--gone' : ''}`} aria-hidden={ready}>
        <Logo />
        <div className="opening-curtain__line"><i /></div>
        <p>Brooklyn · 6 weeks—5 years</p>
      </div>
      <div className="read-progress" aria-hidden="true" />

      <header className="index-header">
        <a href="#starting-point" aria-label="Cuddle Avenue Academy home"><Logo compact /></a>
        <p className="index-header__descriptor">Academic care<br />with the warmth of home</p>
        <nav aria-label="Primary navigation">{navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
        <a className="visit-link" href="#visit">Arrange a visit <span>↗</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Index'} <span>{menuOpen ? '×' : '+'}</span></button>
        <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} id="mobile-menu">
          {navItems.map(([label, href], index) => <a href={href} key={href} onClick={() => setMenuOpen(false)}><span>0{index + 1}</span>{label}</a>)}
          <a href="#visit" onClick={() => setMenuOpen(false)}><span>05</span>Arrange a visit</a>
        </div>
      </header>

      <section className="starting-point" id="starting-point" style={{ '--program': program.color } as React.CSSProperties} onPointerMove={moveStage} onPointerLeave={resetStage}>
        <div className="particle-field" aria-hidden="true">
          {particles.map((point, index) => <i key={index} style={{ left: point.left, top: point.top, '--depth': point.depth } as React.CSSProperties} />)}
        </div>
        <div className="starting-copy">
          <p className="kicker"><span>Now enrolling</span> 2026—27</p>
          <h1>The first five years, <em>taken seriously.</em></h1>
          <p className="starting-copy__body">Select your child’s age to see the classroom designed for who they are now—and the foundation they are ready to build.</p>
          <div className="starting-proof">
            <p><b>02</b><span>Brooklyn<br />learning houses</span></p>
            <p><b>6w—5y</b><span>One continuous<br />learning journey</span></p>
          </div>
        </div>
        <div className="finder-stage" aria-live="polite">
          <div className="finder-stage__sheet finder-stage__sheet--one" aria-hidden="true" />
          <div className="finder-stage__sheet finder-stage__sheet--two" aria-hidden="true" />
          <Photo className="finder-photo" src={program.image} alt={`${program.name} classroom at Cuddle Avenue Academy`} />
          <p className="finder-stage__number" aria-hidden="true">{program.code}</p>
          <article className="finder-answer">
            <p>{program.age}</p>
            <h2>{program.signal}</h2>
            <p>{program.copy}</p>
            <a href="#visit">Ask about {program.name} <span>↗</span></a>
          </article>
          <p className="finder-stage__caption">Your starting point · {program.name}</p>
        </div>
        <div className="age-instrument">
          <p>Choose a starting point</p>
          <div role="tablist" aria-label="Choose a program by age">
            {programs.map((item, index) => (
              <button type="button" role="tab" aria-selected={selected === index} key={item.name} onClick={() => chooseProgram(index)}>
                <i style={{ background: item.color }} /><span>{item.code}</span><b>{item.name}</b><small>{item.age}</small>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="school-thesis" id="approach">
        <div className="thesis-spine" aria-hidden="true"><span>C</span><span>A</span><span>A</span></div>
        <header data-reveal>
          <p className="section-mark">Our point of view <span>01 / 04</span></p>
          <h2>A child learns best when they feel <em>completely at home.</em></h2>
          <p>Care and curriculum belong at the same table. Secure relationships give children the confidence to concentrate, communicate and try again.</p>
        </header>
        <div className="thesis-composition" data-reveal>
          <Photo className="thesis-photo thesis-photo--wide" src="/assets/hero-classroom.webp" alt="Children and an educator learning together around a classroom table" />
          <Photo className="thesis-photo thesis-photo--tall" src="/assets/sami-practical-life.webp" alt="A thoughtfully prepared practical-life classroom" />
          <blockquote>“Care is not separate from curriculum. It is what lets learning begin.”</blockquote>
          <p className="thesis-note thesis-note--one"><i /> Language grows through belonging</p>
          <p className="thesis-note thesis-note--two"><i /> Independence grows through trust</p>
          <p className="thesis-coordinate">40.6602° N<br />73.9874° W</p>
        </div>
        <div className="principle-index" data-reveal>
          {principles.map((principle) => <article key={principle.number}><span>{principle.number}</span><h3>{principle.title}</h3><p>{principle.copy}</p></article>)}
        </div>
      </section>

      <section className="day-score" id="day">
        <header data-reveal>
          <p className="section-mark">Inside the school day <span>02 / 04</span></p>
          <h2>Enough rhythm to feel secure.<br /><em>Enough room to surprise us.</em></h2>
        </header>
        <div className="score-grid" data-reveal>
          <div className="score-image-wrap"><Photo className="score-photo" src="/assets/story-gardening.webp" alt="Children exploring and gardening outdoors" /><p>Hundreds of small discoveries,<br />held inside one reliable day.</p></div>
          {[
            ['7:30', 'Arrive', 'A warm, unhurried welcome'],
            ['9:00', 'Gather', 'Language and shared attention'],
            ['9:30', 'Work', 'Choice, focus and discovery'],
            ['12:00', 'Restore', 'A home-cooked meal and rest'],
            ['3:00', 'Create', 'Movement, making and play'],
          ].map(([time, title, copy], index) => <article className={`score-stop score-stop--${index + 1}`} key={time}><b>{time}</b><span>{title}</span><p>{copy}</p><i aria-hidden="true" /></article>)}
          <p className="score-axis" aria-hidden="true">AM <span /> PM</p>
        </div>
      </section>

      <section className="parent-briefing" id="parents">
        <div className="briefing-intro" data-reveal>
          <p className="section-mark">The parent briefing <span>03 / 04</span></p>
          <h2>The details are not <em>small details.</em></h2>
          <p>The quality of a school is visible in the questions parents have to ask—and in how clearly the answers arrive.</p>
          <div className="review-mark"><b>5.0</b><span>47 parent reviews</span><i>★★★★★</i></div>
        </div>
        <div className="briefing-console" data-reveal>
          <div className="briefing-visual"><Photo src={['/assets/menu-friday-lunch.jpg', '/assets/space-play.webp', '/assets/story-table.webp'][openBrief]} alt={`${parentBriefs[openBrief].label} at Cuddle Avenue`} /><p>CAA / FAMILY NOTE / 0{openBrief + 1}</p></div>
          <div className="briefing-list">
            {parentBriefs.map((brief, index) => (
              <article className={openBrief === index ? 'is-open' : ''} key={brief.label}>
                <button type="button" aria-expanded={openBrief === index} onClick={() => setOpenBrief(index)}><span>0{index + 1}</span>{brief.label}<i>{openBrief === index ? '−' : '+'}</i></button>
                <div><h3>{brief.title}</h3><p>{brief.copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="campus-doors" id="locations">
        <header data-reveal>
          <p className="section-mark">South Slope, Brooklyn <span>04 / 04</span></p>
          <h2>Two front doors.<br /><em>One standard of care.</em></h2>
          <p>Choose the campus that fits your family. We will guide you through availability, schedule and the most relevant classroom.</p>
        </header>
        <div className="doors" data-reveal>
          {locations.map((location) => (
            <article className="door" key={location.name}>
              <Photo src={location.image} alt={`${location.name} Cuddle Avenue campus`} />
              <div className="door__index">{location.index}</div>
              <div className="door__copy"><p>Brooklyn campus</p><h3>{location.name}</h3><address>{location.address}</address><a href={location.map} target="_blank" rel="noreferrer">Open directions <span>↗</span></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="visit-statement" id="visit">
        <div className="visit-statement__mark"><Logo /></div>
        <div data-reveal><p>Admissions · 2026—27</p><h2>A visit should answer what a website <em>cannot.</em></h2><p>Tell us your child’s age and the rhythm your family needs. We’ll guide you through programs, availability and both Brooklyn campuses.</p></div>
        <div className="visit-actions" data-reveal>
          <a href="mailto:customerservice@cuddleavenue.org?subject=Cuddle%20Avenue%20tour%20request">Request a conversation <span>↗</span></a>
          <a href="tel:+19179605618">+1 (917) 960-5618</a>
          <a href="mailto:customerservice@cuddleavenue.org">customerservice@cuddleavenue.org</a>
        </div>
      </section>

      <footer className="index-footer">
        <Logo compact />
        <p>Academic care for the first five years.</p>
        <div><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="#starting-point">Back to top ↑</a></div>
        <p>© 2026 Cuddle Avenue Academy</p>
      </footer>
    </main>
  );
}
