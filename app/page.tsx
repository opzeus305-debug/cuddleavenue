'use client';

import { useEffect, useRef, useState } from 'react';

const programs = [
  { code: 'P–01', name: 'Infant', age: '6 weeks—18 months', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while building secure, trusting relationships.', points: ['Individual care rhythms', 'Sensory exploration', 'Feeding partnership'], tone: '#b9c8ef' },
  { code: 'P–02', name: 'Toddler', age: '18 months—2 years', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', points: ['Language development', 'Practical life', 'Toilet-learning support'], tone: '#d8ec73' },
  { code: 'P–03', name: '2K', age: '2 years', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', points: ['Early literacy', 'Early mathematics', 'Independent routines'], tone: '#f4c65d' },
  { code: 'P–04', name: 'NYC 3-K', age: '3 years', image: '/assets/review-craft.webp', title: 'A free, full school day.', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', points: ['8:40am—3:00pm', 'Before & after care', 'Free school day'], tone: '#f29a83' },
  { code: 'P–05', name: 'Summer', age: 'Seasonal', image: '/assets/sami-play-structure.webp', title: 'A season built for discovery.', copy: 'Outdoor play, water, cooking, gardening and STEM turn summer into a familiar, active extension of the school year.', points: ['Outdoor discovery', 'Creative projects', 'Seasonal schedule'], tone: '#c6bee7' },
];

const familyDetails = [
  { label: 'Meals', code: 'F–01', kicker: 'Nutrition', title: 'Cooked here, every morning.', copy: 'Breakfast, lunch and an afternoon snack are prepared in-house with organic ingredients. Vegetarian, vegan and allergy accommodations are discussed with each family.', image: '/assets/menu-friday-lunch.jpg', facts: ['Breakfast · 9:00', 'Lunch · 12:00', 'Snack · 4:00'] },
  { label: 'Safety', code: 'F–02', kicker: 'Peace of mind', title: 'Care you can verify.', copy: 'Licensed programs, displayed permits, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.', image: '/assets/space-play.webp', facts: ['Licensed programs', 'Prepared staff', 'Secure routines'] },
  { label: 'Updates', code: 'F–03', kicker: 'Family connection', title: 'No wondering how the day went.', copy: 'Meaningful updates on eating, sleep, play and learning keep parents connected to the small moments—not only the pickup summary.', image: '/assets/story-table.webp', facts: ['Meals & bottles', 'Sleep & toileting', 'Learning moments'] },
];

const locations = [
  { code: 'BK–01', label: '16th Street', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', note: 'A warm neighborhood setting near the corner of 3rd Avenue.', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { code: 'BK–02', label: '3rd Avenue', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', note: 'An intimate prepared environment with calm learning areas and room for purposeful movement.', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
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
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, active: false };
    const dots = Array.from({ length: 24 }, (_, index) => ({
      x: ((index * 61) % 97) / 97,
      y: ((index * 43) % 89) / 89,
      dx: ((index % 4) - 1.5) * .024,
      dy: (((index * 3) % 4) - 1.5) * .02,
    }));

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
      const positions = dots.map((dot) => {
        if (!reduceMotion) {
          dot.x = (dot.x + dot.dx / Math.max(width, 1) + 1) % 1;
          dot.y = (dot.y + dot.dy / Math.max(height, 1) + 1) % 1;
        }
        let x = dot.x * width;
        let y = dot.y * height;
        if (pointer.active && Math.hypot(pointer.x - x, pointer.y - y) < 150) {
          x += (pointer.x - x) * .032;
          y += (pointer.y - y) * .032;
        }
        return { x, y };
      });
      positions.forEach((point, index) => {
        positions.slice(index + 1).forEach((other) => {
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 118) {
            context.beginPath();
            context.strokeStyle = 'rgba(49,88,216,' + ((1 - distance / 118) * .12) + ')';
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        });
        context.beginPath();
        context.fillStyle = index % 7 === 0 ? 'rgba(240,107,79,.55)' : 'rgba(23,33,29,.26)';
        context.arc(point.x, point.y, index % 5 === 0 ? 2.2 : 1.25, 0, Math.PI * 2);
        context.fill();
      });
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

function FocusImage({ src, alt, className = '', note }: { src: string; alt: string; className?: string; note?: string }) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--focus-x', String(((event.clientX - bounds.left) / bounds.width) * 100) + '%');
    event.currentTarget.style.setProperty('--focus-y', String(((event.clientY - bounds.top) / bounds.height) * 100) + '%');
  };
  const leave = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--focus-x', '68%');
    event.currentTarget.style.setProperty('--focus-y', '38%');
  };

  return (
    <div className={['focus-image', className].join(' ')} onPointerMove={move} onPointerLeave={leave}>
      <img className="focus-base" src={src} alt={alt} />
      <img className="focus-reveal" src={src} alt="" aria-hidden="true" />
      {note && <span className="focus-note">{note}</span>}
    </div>
  );
}

export default function Home() {
  const [programIndex, setProgramIndex] = useState(0);
  const [familyIndex, setFamilyIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 720);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.setAttribute('data-visible', 'true');
      });
    }, { threshold: .1 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const update = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      progress?.style.setProperty('transform', 'scaleX(' + (available > 0 ? scrollY / available : 0) + ')');
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      removeEventListener('scroll', update);
    };
  }, []);

  const transition = (update: () => void) => {
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (doc.startViewTransition) doc.startViewTransition(update); else update();
  };
  const magnetMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--magnet-x', String((event.clientX - bounds.left - bounds.width / 2) * .065) + 'px');
    event.currentTarget.style.setProperty('--magnet-y', String((event.clientY - bounds.top - bounds.height / 2) * .065) + 'px');
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
      <div className={['page-loader', loaded ? 'is-hidden' : ''].join(' ')} aria-hidden={loaded}>
        <div className="loader-mark"><img src="/assets/ca-bears.png" alt="" /><span>CA</span></div>
        <p>Cuddle Avenue Academy</p><i /><span>Brooklyn · New York · Est. with care</span>
      </div>
      <div className="scroll-progress" aria-hidden="true" />

      <header className="atlas-nav">
        <a className="atlas-brand" href="#content" aria-label="Cuddle Avenue Academy home"><span className="atlas-monogram">CA</span><span>Cuddle Avenue<small>Academy · Brooklyn</small></span></a>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
          {[['01', 'Method', '#approach'], ['02', 'Programs', '#programs'], ['03', 'Family', '#parents'], ['04', 'Campuses', '#locations']].map(([number, label, href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}><span>{number}</span>{label}</a>)}
        </nav>
        <a className="atlas-nav-cta magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Visit the academy <span>↗</span></a>
      </header>

      <section className="atlas-hero" id="content">
        <ParticleField /><div className="atlas-rule atlas-rule-a" aria-hidden="true" /><div className="atlas-rule atlas-rule-b" aria-hidden="true" />
        <div className="atlas-copy">
          <p className="atlas-label"><span>Early learning, considered</span><span>Brooklyn · NY</span></p>
          <h1 aria-label="The first five years deserve intention."><span>The first</span><span><em>five years</em></span><span>deserve intention.</span></h1>
          <div className="atlas-summary"><p>Care with the warmth of home. An academic foundation built through attention, independence and purposeful play.</p><div><a className="atlas-primary magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a><a className="atlas-text-link" href="#programs">Explore programs <span>↓</span></a></div></div>
        </div>
        <div className="atlas-visual"><FocusImage src="/assets/sami-classroom-hero.webp" alt="A calm, carefully prepared Cuddle Avenue classroom in Brooklyn" /><div className="atlas-photo-note"><span>Field note · 001</span><span>Inside a prepared classroom</span></div><div className="atlas-seal"><img src="/assets/ca-bears.png" alt="" /><span>Care<br />meets<br />curiosity</span></div></div>
        <aside className="atlas-index"><span>CAA / 2026</span><strong>01</strong><p>An academy for the years that matter first.</p></aside>
        <div className="atlas-ledger"><div><span>Age range</span><strong>6 weeks—5 years</strong></div><div><span>Weekdays</span><strong>7:30—6:00</strong></div><div><span>Community</span><strong>2 Brooklyn campuses</strong></div><div><span>Public program</span><strong>Free NYC 3-K</strong></div></div>
      </section>

      <div className="signal-rail" aria-label="Curriculum areas"><div className="signal-track">{[0, 1].map((group) => <div className="signal-group" aria-hidden={group === 1} key={group}>{['Observe closely', 'Move with purpose', 'Speak with confidence', 'Think independently', 'Create with joy'].map((item, index) => <span key={item}>{item}<i>{index % 2 ? '●' : '↗'}</i></span>)}</div>)}</div></div>

      <section className="chapter-section approach-v2 reveal" id="approach"><div className="section-grid">
        <aside className="chapter-marker"><span>01</span><p>Method</p><small>How learning begins</small></aside>
        <div className="chapter-body">
          <header className="editorial-heading"><p className="section-kicker">The Cuddle Avenue method</p><h2>An education<br />of <em>attention.</em></h2><p>Our rooms are calm on purpose. Educators watch closely, prepare intentionally and step in at the exact moment support becomes possibility.</p></header>
          <div className="method-map">
            <FocusImage className="method-image" src="/assets/sami-practical-life.webp" alt="A child-scaled practical-life area inside Cuddle Avenue" note="Observation / practice / independence" />
            <article className="method-entry method-entry-primary"><span>01 / 03</span><h3>Known closely</h3><p>Responsive educators notice each child’s cues, interests and next steps—then shape the environment around what they see.</p></article>
            <article className="method-entry"><span>02 / 03</span><h3>Prepared thoughtfully</h3><p>Ordered rooms invite choice, concentration, movement and meaningful work without sensory clutter.</p></article>
            <article className="method-entry"><span>03 / 03</span><h3>Trusted fully</h3><p>Licensing, safety routines and daily communication stay visible, specific and easy for families to verify.</p></article>
            <blockquote className="method-quote"><p>“Care is not separate from curriculum. It is the condition that lets learning begin.”</p><footer>Our point of view · CAA</footer></blockquote>
          </div>
        </div>
      </div></section>

      <section className="programs-v2 chapter-section reveal" id="programs"><div className="section-grid">
        <aside className="chapter-marker chapter-marker-dark"><span>02</span><p>Programs</p><small>Ages 6 weeks—5 years</small></aside>
        <div className="chapter-body">
          <header className="editorial-heading editorial-heading-light"><p className="section-kicker">Program index</p><h2>One continuous<br /><em>learning story.</em></h2><p>Every program changes the pace and scale of the environment while preserving the same close relationships and academic intent.</p></header>
          <div className="program-index" role="tablist" aria-label="Programs by age">{programs.map((item, index) => <button key={item.name} role="tab" aria-selected={programIndex === index} aria-controls="program-dossier" onClick={() => transition(() => setProgramIndex(index))}><span>{item.code}</span><strong>{item.name}</strong><small>{item.age}</small><i>↗</i></button>)}</div>
          <div className="program-dossier" id="program-dossier" style={{ '--program-tone': program.tone } as React.CSSProperties}>
            <FocusImage className="program-focus" src={program.image} alt={program.name + ' program at Cuddle Avenue'} note={program.code + ' · ' + program.age} />
            <div className="program-narrative"><p className="section-kicker">{program.name} program</p><h3>{program.title}</h3><p>{program.copy}</p><a className="atlas-primary magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Ask about {program.name} <span>↗</span></a></div>
            <div className="program-notes"><span>What develops here</span>{program.points.map((point, index) => <p key={point}><b>0{index + 1}</b>{point}</p>)}<small>Program availability can vary by campus.</small></div>
          </div>
          <p className="program-fineprint">NYC 3-K’s free school day is 8:40am—3:00pm; extended care is available for an additional fee. Summer details vary by season.</p>
        </div>
      </div></section>

      <section className="rhythm-v2 reveal">
        <div className="rhythm-heading"><p className="section-kicker">A weekday with structure</p><h2>Children know what comes next.<br /><em>That’s what frees them to explore.</em></h2></div>
        <div className="timeband">{[
          ['7:30', 'Arrive', 'A calm welcome and time to settle in.'],
          ['9:00', 'Gather', 'Breakfast, conversation and belonging.'],
          ['9:30', 'Explore', 'A focused Montessori-inspired work cycle.'],
          ['12:00', 'Restore', 'Lunch, rest and a slower rhythm.'],
          ['3:00', 'Create', 'Art, movement, stories and outdoor play.'],
        ].map(([time, title, copy], index) => <article key={time}><span>0{index + 1}</span><strong>{time}</strong><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="family-v2 chapter-section reveal" id="parents"><div className="section-grid">
        <aside className="chapter-marker"><span>03</span><p>For families</p><small>The practical layer</small></aside>
        <div className="chapter-body">
          <header className="editorial-heading"><p className="section-kicker">The parent’s desk</p><h2>Clarity is part<br />of <em>the care.</em></h2><p>The details surrounding a school day should feel as considered as the classroom itself.</p></header>
          <div className="family-tabs" role="tablist" aria-label="Information for families">{familyDetails.map((item, index) => <button key={item.label} role="tab" aria-selected={familyIndex === index} aria-controls="family-dossier" onClick={() => transition(() => setFamilyIndex(index))}><span>{item.code}</span><strong>{item.label}</strong><i>↗</i></button>)}</div>
          <div className="family-dossier" id="family-dossier">
            <FocusImage className="family-focus" src={family.image} alt={family.label + ' at Cuddle Avenue'} note={family.code + ' · ' + family.kicker} />
            <div className="family-narrative"><p className="section-kicker">{family.kicker}</p><h3>{family.title}</h3><p>{family.copy}</p><div className="family-facts">{family.facts.map((fact, index) => <span key={fact}><b>0{index + 1}</b>{fact}</span>)}</div></div>
            <aside className="family-aside"><span>Parent standard</span><p>Specific information.<br />Consistent communication.<br />No vague promises.</p><a href="#visit">Talk with our team ↗</a></aside>
          </div>
        </div>
      </div></section>

      <section className="evidence reveal"><div className="evidence-score"><span>Parent evidence</span><strong>5.0</strong><p>Average from 47 parent reviews</p></div><div className="evidence-quotes"><blockquote><span>01 / 02</span><p>“As first-time parents, we were nervous. Ayna and her team made us feel comfortable since day one.”</p><footer>Ben Santiago · Parent</footer></blockquote><blockquote><span>02 / 02</span><p>“The care, love and nurture you feel from the team—you won’t feel anywhere else.”</p><footer>Izabella Battaglia · Parent</footer></blockquote></div></section>

      <section className="locations-v2 chapter-section reveal" id="locations"><div className="section-grid">
        <aside className="chapter-marker"><span>04</span><p>Campuses</p><small>Brooklyn · New York</small></aside>
        <div className="chapter-body">
          <header className="editorial-heading"><p className="section-kicker">Two neighborhood doors</p><h2>One close<br /><em>community.</em></h2><p>Compare both locations at a glance, then choose the one that fits your family’s daily rhythm.</p></header>
          <div className="campus-ledger">{locations.map((item, index) => <article key={item.label}><FocusImage className="campus-focus" src={item.image} alt={item.label + ' Cuddle Avenue location'} note={item.code} /><div className="campus-number"><span>0{index + 1}</span></div><div className="campus-copy"><p className="section-kicker">Brooklyn · NY</p><h3>{item.label}</h3><address>{item.address}</address><p>{item.note}</p></div><div className="campus-actions"><a href="#visit">Schedule a tour <span>↗</span></a><a href={item.map} target="_blank" rel="noreferrer">Directions <span>↗</span></a></div></article>)}</div>
        </div>
      </div></section>

      <section className="closing-v2 reveal" id="visit">
        <div className="faq-v2"><p className="section-kicker">Before you visit</p><h2>Useful answers.</h2>{[
          ['What ages do you welcome?', 'Children from 6 weeks through 5 years, with distinct environments for every developmental stage.'],
          ['What are weekday hours?', 'Weekday care runs from 7:30am to 6:00pm. NYC 3-K’s free school day runs 8:40am to 3:00pm.'],
          ['Are meals included?', 'Yes. Breakfast, lunch and an afternoon snack are prepared in-house.'],
          ['How does enrollment begin?', 'Start with a conversation and tour. The team then shares availability and the application steps.'],
        ].map(([question, answer], index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
        <div className="visit-panel"><div className="visit-code">Admissions / 2026</div><div className="visit-bear"><img src="/assets/ca-bears.png" alt="" /></div><h2>See a thoughtful<br />day <em>in motion.</em></h2><p>Tours run on weekday mornings, so you experience the classroom as it really is.</p><a className="visit-button magnetic" href="mailto:customerservice@cuddleavenue.org?subject=Schedule%20a%20Cuddle%20Avenue%20tour" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a><a className="visit-email" href="mailto:customerservice@cuddleavenue.org">customerservice@cuddleavenue.org</a></div>
      </section>

      <footer className="footer-v2"><div className="footer-brand"><span className="atlas-monogram">CA</span><div><strong>Cuddle Avenue Academy</strong><p>Montessori-inspired early education in Brooklyn.</p></div></div><div><strong>Explore</strong><a href="#approach">Method</a><a href="#programs">Programs</a><a href="#parents">For families</a></div><div><strong>Visit</strong><span>69 16th Street</span><span>591 3rd Avenue</span><span>Brooklyn, NY 11215</span></div><div><strong>Connect</strong><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/cuddleavenueacademy" target="_blank" rel="noreferrer">Facebook ↗</a><a href="mailto:customerservice@cuddleavenue.org">Email ↗</a></div><div className="footer-bottom"><span>© 2026 Cuddle Avenue Academy</span><span>Licensed child care · Brooklyn, New York</span></div></footer>
    </main>
  );
}
