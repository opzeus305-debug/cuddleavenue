'use client';

import { useEffect, useRef, useState } from 'react';

const programs = [
  { code: '01', name: 'Infant', age: '6 weeks—18 months', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Responsive care follows each baby’s feeding, sleeping and sensory rhythms while secure relationships take root.', points: ['Individual care rhythms', 'Sensory exploration', 'Feeding partnership'], color: '#3f66b1' },
  { code: '02', name: 'Toddler', age: '18 months—2 years', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'Language, movement, practical routines and first friendships unfold in a prepared environment made for “I can do it.”', points: ['Language development', 'Practical life', 'Toilet-learning support'], color: '#2f6b50' },
  { code: '03', name: '2K', age: '2 years', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Focused work cycles introduce early literacy, mathematics, creative thinking and the independence children carry into 3-K.', points: ['Early literacy', 'Early mathematics', 'Independent routines'], color: '#d6a833' },
  { code: '04', name: 'NYC 3-K', age: '3 years', image: '/assets/review-craft.webp', title: 'A free, full school day.', copy: 'NYC-funded 3-K combines hands-on learning, a caring classroom and homemade meals, with extended care available.', points: ['8:40am—3:00pm', 'Before & after care', 'Free school day'], color: '#c6473d' },
  { code: '05', name: 'Summer', age: 'Seasonal', image: '/assets/sami-play-structure.webp', title: 'A season built for discovery.', copy: 'Outdoor play, water, cooking, gardening and STEM turn summer into an active extension of the school year.', points: ['Outdoor discovery', 'Creative projects', 'Seasonal schedule'], color: '#4c6f70' },
];

const familyDetails = [
  { label: 'Meals', kicker: 'Nutrition', title: 'Cooked here, every morning.', copy: 'Breakfast, lunch and an afternoon snack are prepared in-house with organic ingredients. Vegetarian, vegan and allergy accommodations are discussed with each family.', image: '/assets/menu-friday-lunch.jpg', facts: ['Breakfast · 9:00', 'Lunch · 12:00', 'Snack · 4:00'], color: '#d6a833' },
  { label: 'Safety', kicker: 'Peace of mind', title: 'Care you can verify.', copy: 'Licensed programs, displayed permits, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.', image: '/assets/space-play.webp', facts: ['Licensed programs', 'Prepared staff', 'Secure routines'], color: '#2f6b50' },
  { label: 'Updates', kicker: 'Family connection', title: 'No wondering how the day went.', copy: 'Meaningful updates on eating, sleep, play and learning keep parents connected to the small moments—not only the pickup summary.', image: '/assets/story-table.webp', facts: ['Meals & bottles', 'Sleep & toileting', 'Learning moments'], color: '#3f66b1' },
];

const locations = [
  { label: '16th Street', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', note: 'A warm neighborhood setting near the corner of 3rd Avenue.', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { label: '3rd Avenue', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', note: 'An intimate prepared environment with calm learning areas and room for purposeful movement.', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
];

function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: 0, y: 0, active: false };
    const colors = ['rgba(198,71,61,.32)', 'rgba(47,107,80,.28)', 'rgba(214,168,51,.34)', 'rgba(63,102,177,.26)'];
    const dots = Array.from({ length: 22 }, (_, index) => ({
      x: ((index * 61) % 97) / 97,
      y: ((index * 43) % 89) / 89,
      dx: ((index % 4) - 1.5) * .025,
      dy: (((index * 3) % 4) - 1.5) * .021,
      color: colors[index % colors.length],
    }));
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const scale = Math.min(devicePixelRatio || 1, 2);
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
        if (!reduced) {
          dot.x = (dot.x + dot.dx / Math.max(width, 1) + 1) % 1;
          dot.y = (dot.y + dot.dy / Math.max(height, 1) + 1) % 1;
        }
        let x = dot.x * width;
        let y = dot.y * height;
        if (pointer.active) {
          const distance = Math.hypot(pointer.x - x, pointer.y - y);
          if (distance < 160) {
            x -= (pointer.x - x) * .045;
            y -= (pointer.y - y) * .045;
          }
        }
        context.beginPath();
        context.fillStyle = dot.color;
        context.arc(x, y, index % 5 === 0 ? 2.4 : 1.15, 0, Math.PI * 2);
        context.fill();
      });
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', leave);
    addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="ambient-field" ref={canvasRef} aria-hidden="true" />;
}

function LensImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--lens-x', String(((event.clientX - bounds.left) / bounds.width) * 100) + '%');
    event.currentTarget.style.setProperty('--lens-y', String(((event.clientY - bounds.top) / bounds.height) * 100) + '%');
  };
  return <div className={'lens-image ' + className} onPointerMove={move}><img src={src} alt={alt} /><span aria-hidden="true" /></div>;
}

export default function Home() {
  const [programIndex, setProgramIndex] = useState(0);
  const [familyIndex, setFamilyIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 720);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.setAttribute('data-visible', 'true');
    }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
    const progress = document.querySelector<HTMLElement>('.scroll-progress');
    const update = () => {
      const available = document.documentElement.scrollHeight - innerHeight;
      progress?.style.setProperty('transform', 'scaleX(' + (available > 0 ? scrollY / available : 0) + ')');
    };
    addEventListener('scroll', update, { passive: true });
    update();
    return () => { clearTimeout(timer); observer.disconnect(); removeEventListener('scroll', update); };
  }, []);

  const transition = (update: () => void) => {
    const doc = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (doc.startViewTransition) doc.startViewTransition(update); else update();
  };
  const magnetMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', String((event.clientX - bounds.left - bounds.width / 2) * .065) + 'px');
    event.currentTarget.style.setProperty('--my', String((event.clientY - bounds.top - bounds.height / 2) * .065) + 'px');
  };
  const magnetLeave = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--mx', '0px');
    event.currentTarget.style.setProperty('--my', '0px');
  };
  const program = programs[programIndex];
  const family = familyDetails[familyIndex];

  return <main>
    <a className="skip-link" href="#content">Skip to content</a>
    <div className={['page-loader', loaded ? 'is-hidden' : ''].join(' ')} aria-hidden={loaded}><img src="/assets/cuddle-avenue-logo.png" alt="" /><p>Cuddle Avenue</p><i /><span>Early learning · Brooklyn</span></div>
    <div className="scroll-progress" aria-hidden="true" />

    <header className="site-nav">
      <button className="nav-menu" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><b>Menu</b></button>
      <a className="brand-logo" href="#content" aria-label="Cuddle Avenue home"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><span>Academy · Brooklyn</span></a>
      <nav className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">{[['Approach','#approach'],['Programs','#programs'],['Parents','#parents'],['Locations','#locations']].map(([label,href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}>{label}<span>↗</span></a>)}</nav>
      <a className="pill-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Plan a visit <span>↗</span></a>
    </header>

    <section className="hero" id="content">
      <AmbientField />
      <div className="hero-photo-wrap">
        <LensImage className="hero-photo" src="/assets/sami-classroom-hero.webp" alt="A warm, prepared Cuddle Avenue classroom" />
        <figure className="hero-polaroid"><img src="/assets/story-table.webp" alt="Children learning together at a classroom table" /><figcaption>Purposeful play, every day.</figcaption></figure>
        <span className="hero-photo-label">Inside our learning house · Brooklyn</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow"><span>Early childhood education</span><span>6 weeks—5 years</span></p>
        <h1><span>A thoughtful</span><span>beginning lasts</span><em>a lifetime.</em></h1>
        <p className="hero-deck">Care with the warmth of home. An academic foundation built through attention, independence and purposeful play.</p>
        <div className="hero-actions"><a className="dark-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Schedule a tour <span>↗</span></a><a className="text-link" href="#programs">Explore programs <span>↓</span></a></div>
        <div className="hero-proof"><span><b>02</b> Brooklyn campuses</span><span><b>5.0</b> parent rating</span><span><b>3-K</b> free school day</span></div>
      </div>
      <div className="hero-mark" aria-hidden="true"><img src="/assets/cuddle-avenue-logo.png" alt="" /></div>
    </section>

    <section className="approach reveal" id="approach">
      <header className="center-heading"><p className="eyebrow">The Cuddle Avenue approach</p><h2>Care is the condition<br />that lets <em>learning begin.</em></h2><p>Our rooms are calm on purpose. Educators observe closely, prepare intentionally and give each child enough trust to try, repeat and master.</p></header>
      <div className="approach-world">
        <LensImage className="approach-photo" src="/assets/sami-practical-life.webp" alt="A child-scaled practical-life space at Cuddle Avenue" />
        <article className="principle p-one"><span>01</span><h3>Known closely</h3><p>Responsive educators notice the cues, interests and rhythms behind every next step.</p></article>
        <article className="principle p-two"><span>02</span><h3>Prepared thoughtfully</h3><p>Ordered spaces invite choice, concentration and purposeful movement without noise.</p></article>
        <article className="principle p-three"><span>03</span><h3>Trusted to grow</h3><p>Children build real confidence through time, useful tools and meaningful responsibility.</p></article>
        <blockquote><p>“Not a miniature school. A complete learning world, made for early childhood.”</p><footer>Our point of view</footer></blockquote>
      </div>
    </section>

    <section className="program-theatre reveal" id="programs" style={{ '--active-color': program.color } as React.CSSProperties}>
      <div className="theatre-glow" aria-hidden="true" />
      <header><p className="eyebrow">Programs · 6 weeks to 5 years</p><h2>One learning story.<br /><em>Five distinct chapters.</em></h2></header>
      <div className="program-selector" role="tablist" aria-label="Programs by age">{programs.map((item,index) => <button type="button" role="tab" aria-selected={programIndex === index} onClick={() => transition(() => setProgramIndex(index))} key={item.name}><span style={{ background: item.color }} />{item.name}<small>{item.age}</small></button>)}</div>
      <div className="program-stage" id="program-stage">
        <span className="program-number" aria-hidden="true">{program.code}</span>
        <LensImage className="program-photo" src={program.image} alt={program.name + ' classroom at Cuddle Avenue'} />
        <article><p>{program.age}</p><h3>{program.title}</h3><p>{program.copy}</p><div className="program-points">{program.points.map((point) => <span key={point}>{point}</span>)}</div><a className="light-button magnetic" href="#visit" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Ask about {program.name} <span>↗</span></a></article>
      </div>
      <p className="fineprint">NYC 3-K’s free day runs 8:40am—3:00pm. Extended care and seasonal summer schedules are available separately.</p>
    </section>

    <section className="day-flow reveal">
      <header><p className="eyebrow">A weekday with structure</p><h2>Predictable,<br /><em>never repetitive.</em></h2><p>Children know what comes next. That security is what frees them to explore.</p></header>
      <figure><img src="/assets/story-gardening.webp" alt="Children exploring and learning together" /><figcaption>A day designed around energy, focus and rest.</figcaption></figure>
      <div className="day-orbit">{[['7:30','Arrive'],['9:00','Gather'],['9:30','Explore'],['12:00','Restore'],['3:00','Create']].map(([time,title],index) => <article key={time}><span>0{index + 1}</span><strong>{time}</strong><p>{title}</p></article>)}</div>
    </section>

    <section className="parents reveal" id="parents">
      <header className="center-heading"><p className="eyebrow">For parents</p><h2>The details around the day<br />deserve <em>equal thought.</em></h2><p>Open a note to see what families can expect—specific information, visible standards and no vague promises.</p></header>
      <div className="parent-desk">
        <div className="paper-stack">{familyDetails.map((item,index) => <button className={familyIndex === index ? 'is-active' : ''} type="button" aria-pressed={familyIndex === index} onClick={() => transition(() => setFamilyIndex(index))} key={item.label} style={{ '--paper-color': item.color } as React.CSSProperties}><span>0{index + 1}</span><img src={item.image} alt="" /><strong>{item.label}</strong><small>{item.kicker}</small></button>)}</div>
        <article className="open-note"><p className="eyebrow">{family.kicker}</p><h3>{family.title}</h3><p>{family.copy}</p><div>{family.facts.map((fact,index) => <span key={fact}><b>0{index + 1}</b>{fact}</span>)}</div><a className="text-link" href="#visit">Talk with our team <span>↗</span></a></article>
        <aside><span>Parent standard</span><strong>Clear.<br />Consistent.<br />Human.</strong></aside>
      </div>
    </section>

    <section className="review reveal"><div className="review-score"><strong>5.0</strong><span>47 parent reviews</span></div><blockquote><span>Parent perspective</span><p>“We could see how much our daughter learned—not only academically, but socially and emotionally.”</p><footer>Verified parent review · Brooklyn</footer></blockquote><img src="/assets/cuddle-avenue-logo.png" alt="" /></section>

    <section className="locations reveal" id="locations">
      <header className="center-heading"><p className="eyebrow">South Slope · Brooklyn</p><h2>Two learning houses.<br /><em>One shared standard.</em></h2><p>Choose the campus that fits your family. We’ll help you understand availability and the best next step.</p></header>
      <div className="location-cards">{locations.map((location,index) => <article key={location.label}><figure><img src={location.image} alt={location.label + ' Cuddle Avenue campus'} /><span>0{index + 1}</span></figure><div><p>South Slope · Brooklyn</p><h3>{location.label}</h3><address>{location.address}</address><span>{location.note}</span><footer><a href={location.map} target="_blank" rel="noreferrer">Directions ↗</a><a href="#visit">Tour this campus →</a></footer></div></article>)}</div>
    </section>

    <section className="closing reveal" id="visit">
      <div className="tour"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><p className="eyebrow">Admissions · 2026</p><h2>Come feel the<br /><em>difference.</em></h2><p>Tell us your child’s age and preferred campus. We’ll guide you through the right program, availability and next steps.</p><a className="light-button magnetic" href="mailto:customerservice@cuddleavenue.org?subject=Cuddle%20Avenue%20tour%20request" onPointerMove={magnetMove} onPointerLeave={magnetLeave}>Request a tour <span>↗</span></a><a href="tel:+19179605618">+1 (917) 960-5618</a></div>
      <div className="faq"><p className="eyebrow">Before you visit</p><h2>A few useful answers.</h2>{[
        ['What ages do you serve?', 'Programs begin at six weeks and continue through age five, including a free NYC 3-K school day for eligible families.'],
        ['Are meals provided?', 'Yes. Breakfast, lunch and a snack are prepared in-house, with dietary accommodations discussed directly with families.'],
        ['Can I tour both locations?', 'Yes. Tell us which program and schedule you need, and we can guide you to the most relevant campus.'],
        ['How do I begin enrollment?', 'Start with a tour request. Our team will follow up about availability, tuition and the documents needed for your child’s program.'],
      ].map(([question,answer],index) => <details key={question}><summary><span>0{index + 1}</span>{question}<i>+</i></summary><p>{answer}</p></details>)}</div>
    </section>

    <footer className="site-footer"><div className="footer-brand"><img src="/assets/cuddle-avenue-logo.png" alt="Cuddle Avenue" /><p>Thoughtful early education<br />for Brooklyn families.</p></div><div><strong>Explore</strong><a href="#approach">Approach</a><a href="#programs">Programs</a><a href="#parents">For parents</a></div><div><strong>Visit</strong><span>69 16th Street</span><span>591 3rd Avenue</span><span>Brooklyn, NY 11215</span></div><div><strong>Connect</strong><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.facebook.com/cuddleavenueacademy" target="_blank" rel="noreferrer">Facebook ↗</a><a href="mailto:customerservice@cuddleavenue.org">Email ↗</a></div><p className="footer-legal">© 2026 Cuddle Avenue Academy <span>Licensed child care · Brooklyn, New York</span></p></footer>
  </main>;
}
