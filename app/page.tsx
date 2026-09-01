'use client';

import { useEffect, useRef, useState } from 'react';

const programs = [
  { name: 'Infant', age: '6 weeks—18 months', color: '#d8b6ac', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while building secure, trusting relationships.', points: ['Individual care rhythms', 'Sensory exploration', 'Feeding partnership'] },
  { name: 'Toddler', age: '18 months—2 years', color: '#afc9bd', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', points: ['Language development', 'Practical life', 'Toilet-learning support'] },
  { name: '2K', age: '2 years', color: '#e8ce65', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', points: ['Early literacy', 'Early mathematics', 'Independent routines'] },
  { name: 'NYC 3-K', age: '3 years', color: '#c7c5d4', image: '/assets/review-craft.webp', title: 'A free, full school day.', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', points: ['8:40am—3:00pm', 'Before & after care', 'Free school day'] },
  { name: 'Summer', age: 'Seasonal', color: '#d88a65', image: '/assets/program-playroom.webp', title: 'A season built for discovery.', copy: 'Outdoor play, water, cooking, gardening and STEM turn summer into a familiar, active extension of the school year.', points: ['Outdoor discovery', 'Creative projects', 'Seasonal schedule'] },
];

const familyDetails = [
  { label: 'Meals', kicker: 'Nutrition', title: 'Cooked here, every morning.', copy: 'Breakfast, lunch and an afternoon snack are prepared in-house with organic ingredients. Vegetarian, vegan and allergy accommodations are discussed with each family.', image: '/assets/menu-friday-lunch.jpg', facts: ['Breakfast 9:00', 'Lunch 12:00', 'Snack 4:00'] },
  { label: 'Safety', kicker: 'Peace of mind', title: 'Care you can verify.', copy: 'Licensed programs, displayed permits, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.', image: '/assets/space-play.webp', facts: ['Licensed programs', 'Prepared staff', 'Secure routines'] },
  { label: 'Updates', kicker: 'Family connection', title: 'No wondering how the day went.', copy: 'Meaningful updates on eating, sleep, play and learning keep parents connected to the small moments—not only the pickup summary.', image: '/assets/story-table.webp', facts: ['Meals & bottles', 'Sleep & toileting', 'Learning moments'] },
];

const locations = [
  { label: '16th Street', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', note: 'A warm neighborhood setting near the corner of 3rd Avenue.', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { label: '3rd Avenue', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', note: 'An intimate prepared environment with calm learning areas and room for purposeful movement.', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0, active: false };
    const dots = Array.from({ length: 26 }, (_, index) => ({ x: ((index * 61) % 97) / 97, y: ((index * 43) % 89) / 89, dx: ((index % 4) - 1.5) * .018, dy: (((index * 3) % 4) - 1.5) * .015 }));

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = width * scale;
      canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };
    const move = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      dots.forEach((dot, index) => {
        dot.x = (dot.x + dot.dx / Math.max(width, 1) + 1) % 1;
        dot.y = (dot.y + dot.dy / Math.max(height, 1) + 1) % 1;
        let x = dot.x * width;
        let y = dot.y * height;
        if (pointer.active) {
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          if (distance < 140) { x += (pointer.x - x) * .025; y += (pointer.y - y) * .025; }
        }
        context.beginPath();
        context.fillStyle = 'rgba(18,45,40,.24)';
        context.arc(x, y, index % 6 === 0 ? 2 : 1.25, 0, Math.PI * 2);
        context.fill();
      });
      frame = requestAnimationFrame(draw);
    };

    resize();
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    window.addEventListener('resize', resize);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

export default function Home() {
  const [programIndex, setProgramIndex] = useState(0);
  const [familyIndex, setFamilyIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 800);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.setAttribute('data-visible', 'true')), { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const update = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      progress?.style.setProperty('transform', `scaleX(${available > 0 ? scrollY / available : 0})`);
      document.querySelectorAll<HTMLElement>('.scroll-shift').forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const distance = innerHeight / 2 - (bounds.top + bounds.height / 2);
        const shift = Math.max(-12, Math.min(12, distance * .022));
        element.style.setProperty('--scroll-shift', `${shift}px`);
      });
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => { clearTimeout(timer); observer.disconnect(); removeEventListener('scroll', update); };
  }, []);

  const transition = (update: () => void) => {
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (doc.startViewTransition) doc.startViewTransition(update); else update();
  };
  const depthMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty('--depth-x', `${x * -7}px`);
    event.currentTarget.style.setProperty('--depth-y', `${y * -7}px`);
  };
  const depthLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--depth-x', '0px');
    event.currentTarget.style.setProperty('--depth-y', '0px');
  };
  const magnetMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--magnet-x', `${(event.clientX - bounds.left - bounds.width / 2) * .07}px`);
    event.currentTarget.style.setProperty('--magnet-y', `${(event.clientY - bounds.top - bounds.height / 2) * .07}px`);
  };
  const magnetLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--magnet-x', '0px');
    event.currentTarget.style.setProperty('--magnet-y', '0px');
  };

  const program = programs[programIndex];
  const family = familyDetails[familyIndex];

  return (
    <main>
      <a className="skip-link" href="#content">Skip to content</a>
      <div className={`page-loader ${loaded ? 'is-hidden' : ''}`} aria-hidden={loaded}><div><img src="/assets/ca-bears.png" alt="" /><span>Cuddle Avenue Academy</span></div><i /><p>Brooklyn · New York</p></div>
      <div className="scroll-progress" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#content" aria-label="Cuddle Avenue Academy home"><img src="/assets/ca-bears.png" alt="" /><span>Cuddle Avenue</span><small>Academy</small></a>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          {[['01', 'Approach', '#approach'], ['02', 'Programs', '#programs'], ['03', 'For parents', '#parents'], ['04', 'Locations', '#locations']].map(([number, label, href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}><span>{number}</span>{label}</a>)}
        </nav>
        <a className="button button-ink magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a>
      </header>

      <div className="notice"><span>Now enrolling across two Brooklyn locations</span><a href="#programs">Infant—Preschool · Free NYC 3-K ↗</a></div>

      <section className="hero container" id="content">
        <ParticleField />
        <div className="hero-copy">
          <p className="eyebrow">Montessori-inspired early learning · Ages 6 weeks—5 years</p>
          <h1 aria-label="A thoughtful start to a lifetime of learning.">{['A thoughtful', 'start to a', 'lifetime of'].map((line, index) => <span className="hero-line" style={{ '--line-index': index } as React.CSSProperties} key={line}>{line}</span>)}<em className="hero-line" style={{ '--line-index': 3 } as React.CSSProperties}>learning.</em></h1>
          <p className="hero-intro">A warm, academically purposeful Brooklyn academy where children are known closely and guided toward real independence.</p>
          <div className="hero-actions"><a className="button button-ink magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Visit the academy <span>↗</span></a><a className="quiet-link" href="#programs">Find a program <span>↓</span></a></div>
        </div>
        <div className="hero-media depth-card scroll-shift" onPointerMove={depthMove} onPointerLeave={depthLeave}>
          <img src="/assets/hero-classroom.webp" alt="An educator guiding toddlers in a Cuddle Avenue classroom" />
          <div className="image-note"><span>Inside the classroom</span><span>Weekdays · 7:30—6:00</span></div>
          <div className="hero-seal"><strong>5.0</strong><span>47 parent reviews</span></div>
        </div>
        <div className="hero-facts"><div><strong>02</strong><span>Brooklyn locations</span></div><div><strong>6w—5y</strong><span>Continuity of care</span></div><div><strong>3-K</strong><span>Free NYC school day</span></div><div><strong>Fresh</strong><span>Meals made in-house</span></div></div>
      </section>

      <div className="motion-rail" aria-label="Curriculum areas"><div><span>Practical life</span><i>↗</i><span>Language</span><i>↗</i><span>Mathematics</span><i>↗</i><span>Sensory work</span><i>↗</i><span>Art & movement</span><i>↗</i><span aria-hidden="true">Practical life</span><i aria-hidden="true">↗</i><span aria-hidden="true">Language</span><i aria-hidden="true">↗</i></div></div>

      <section className="approach section reveal" id="approach">
        <div className="container">
          <div className="section-heading"><p className="eyebrow">01 · Our approach</p><h2>Care that feels personal.<br /><span>Learning that has purpose.</span></h2><p>Parents should never have to choose between a child who is deeply cared for and one who is thoughtfully challenged.</p></div>
          <div className="principle-grid">
            <article className="principle principle-feature"><span>01</span><h3>Known closely</h3><p>Responsive educators notice each child’s cues, interests and next steps.</p><div className="depth-card scroll-shift" onPointerMove={depthMove} onPointerLeave={depthLeave}><img src="/assets/story-gardening.webp" alt="An educator and child gardening together" /></div></article>
            <article className="principle"><span>02</span><h3>Prepared thoughtfully</h3><p>Calm, ordered rooms invite choice, focus, movement and meaningful work.</p></article>
            <article className="principle"><span>03</span><h3>Trusted fully</h3><p>Licensing, safety routines and daily communication are visible—not fine print.</p><blockquote>“Families followed Ayna when she opened a place of her own.”</blockquote></article>
          </div>
        </div>
      </section>

      <section className="programs section reveal" id="programs">
        <div className="container">
          <div className="section-heading row"><div><p className="eyebrow">02 · Programs</p><h2>The right-sized world,<br /><span>at every stage.</span></h2></div><p>Select your child’s age to see how the pace, environment and learning evolve.</p></div>
          <div className="program-tabs" role="tablist" aria-label="Programs by age">{programs.map((item, index) => <button key={item.name} role="tab" aria-selected={programIndex === index} onClick={() => transition(() => setProgramIndex(index))}><span>0{index + 1}</span><strong>{item.name}</strong><small>{item.age}</small></button>)}</div>
          <div className="program-card" style={{ '--program-color': program.color } as React.CSSProperties}>
            <div className="program-image depth-card scroll-shift" onPointerMove={depthMove} onPointerLeave={depthLeave}><img src={program.image} alt={`${program.name} program at Cuddle Avenue`} /><span>{program.age}</span></div>
            <div className="program-copy"><p className="eyebrow">{program.name} program</p><h3>{program.title}</h3><p>{program.copy}</p><ul>{program.points.map((point) => <li key={point}>{point}</li>)}</ul><a className="button button-ink magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Ask about {program.name} <span>↗</span></a></div>
          </div>
          <p className="fine-print">NYC 3-K’s free school day is 8:40am—3:00pm; extended care is available for an additional fee. Summer details vary by season.</p>
        </div>
      </section>

      <section className="rhythm section reveal">
        <div className="container">
          <div className="section-heading row"><div><p className="eyebrow">The everyday curriculum</p><h2>Small moments,<br /><span>serious learning.</span></h2></div><p>Children build capability through a steady rhythm of choice, concentration, community and care.</p></div>
          <div className="rhythm-grid">{[['7:30', 'Arrive', 'A calm welcome and time to settle in.'], ['9:00', 'Gather', 'Breakfast, conversation and belonging.'], ['9:30', 'Explore', 'A focused Montessori-inspired work cycle.'], ['12:00', 'Restore', 'Lunch, rest and a slower afternoon rhythm.'], ['3:00', 'Create', 'Art, movement, stories and outdoor play.']].map(([time, title, copy]) => <article key={time}><span>{time}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="parents section reveal" id="parents">
        <div className="container">
          <div className="section-heading row"><div><p className="eyebrow">03 · For parents</p><h2>The details that make<br /><span>a family day work.</span></h2></div><p>Choose what matters most right now. Every answer stays clear, specific and easy to compare.</p></div>
          <div className="parent-workspace">
            <div className="detail-tabs" role="tablist">{familyDetails.map((item, index) => <button key={item.label} aria-selected={familyIndex === index} onClick={() => transition(() => setFamilyIndex(index))}><span>0{index + 1}</span>{item.label}<i>↗</i></button>)}</div>
            <div className="detail-image depth-card scroll-shift" onPointerMove={depthMove} onPointerLeave={depthLeave}><img src={family.image} alt={`${family.label} at Cuddle Avenue`} /></div>
            <div className="detail-copy"><p className="eyebrow">{family.kicker}</p><h3>{family.title}</h3><p>{family.copy}</p><div className="detail-facts">{family.facts.map((fact) => <span key={fact}>{fact}</span>)}</div></div>
          </div>
        </div>
      </section>

      <section className="voices section reveal">
        <div className="container">
          <div className="voice-score"><strong>5.0</strong><span>Average from 47 parent reviews</span></div>
          <div className="voice-quotes"><blockquote><p>“As first-time parents, we were nervous. Ayna and her team made us feel comfortable since day one.”</p><footer>Ben Santiago · Parent</footer></blockquote><blockquote><p>“The care, love and nurture you feel from the team—you won’t feel anywhere else.”</p><footer>Izabella Battaglia · Parent</footer></blockquote></div>
        </div>
      </section>

      <section className="locations section reveal" id="locations">
        <div className="container">
          <div className="section-heading row"><div><p className="eyebrow">04 · Locations</p><h2>Two Brooklyn doors.<br /><span>One close community.</span></h2></div><p>Compare both locations at a glance, then choose the one that fits your family’s daily rhythm.</p></div>
          <div className="campus-grid">{locations.map((item, index) => <article className="campus-card" key={item.label}><div className="campus-image depth-card scroll-shift" onPointerMove={depthMove} onPointerLeave={depthLeave}><img src={item.image} alt={`${item.label} Cuddle Avenue location`} /><span>0{index + 1}</span></div><div className="campus-copy"><p className="eyebrow">Brooklyn · NY</p><h3>{item.label}</h3><address>{item.address}</address><p>{item.note}</p><div><a href="#visit">Schedule a tour ↗</a><a href={item.map} target="_blank" rel="noreferrer">Directions ↗</a></div></div></article>)}</div>
        </div>
      </section>

      <section className="closing section reveal" id="visit">
        <div className="container closing-grid">
          <div className="faq"><p className="eyebrow">Useful answers</p>{[['What ages do you welcome?', 'Children from 6 weeks through 5 years, with distinct environments for every developmental stage.'], ['What are weekday hours?', 'Weekday care runs from 7:30am to 6:00pm. NYC 3-K’s free school day runs 8:40am to 3:00pm.'], ['Are meals included?', 'Yes. Breakfast, lunch and an afternoon snack are prepared in-house.'], ['How does enrollment begin?', 'Start with a conversation and tour. The team then shares availability and the application steps.']].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
          <div className="tour-card"><p className="eyebrow">Admissions · 2026</p><h2>See a thoughtful day in motion.</h2><p>Tours run on weekday mornings, so you experience the classroom as it really is.</p><a className="button button-cream magnetic" href="mailto:customerservice@cuddleavenue.org?subject=Schedule%20a%20Cuddle%20Avenue%20tour" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a><a href="mailto:customerservice@cuddleavenue.org">customerservice@cuddleavenue.org</a></div>
        </div>
      </section>

      <footer className="footer"><div className="container"><div><a className="brand" href="#content"><img src="/assets/ca-bears.png" alt="" /><span>Cuddle Avenue</span><small>Academy</small></a><p>Montessori-inspired early education in Brooklyn.</p></div><div><strong>Explore</strong><a href="#approach">Approach</a><a href="#programs">Programs</a><a href="#parents">For parents</a></div><div><strong>Visit</strong><span>69 16th Street</span><span>591 3rd Avenue</span><span>Brooklyn, NY 11215</span></div><div><strong>Connect</strong><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/cuddleavenueacademy" target="_blank" rel="noreferrer">Facebook ↗</a><a href="mailto:customerservice@cuddleavenue.org">Email ↗</a></div><div className="footer-bottom"><span>© 2026 Cuddle Avenue Academy</span><span>Licensed child care · Brooklyn, New York</span></div></div></footer>
    </main>
  );
}
