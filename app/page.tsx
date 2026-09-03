'use client';

import { useEffect, useState } from 'react';

const programs = [
  { name: 'Infant', age: '6 weeks—18 months', line: 'Responsive care and secure first relationships', image: '/assets/program-infant.webp', title: 'A calm first classroom.', copy: 'Feeding, sleep, sensory exploration and first movement are held inside an individual rhythm, with close communication between family and educator.' },
  { name: 'Toddler', age: '18 months—2 years', line: 'Language, movement and practical independence', image: '/assets/program-toddler.webp', title: 'Curiosity finds its feet.', copy: 'A carefully prepared environment supports first friendships, developing language and the confidence that grows from meaningful “I can do it” moments.' },
  { name: '2K', age: '2 years', line: 'A focused bridge into preschool', image: '/assets/program-preschool.webp', title: 'Confidence before preschool.', copy: 'Longer work cycles introduce early literacy, mathematics, creative thinking and everyday responsibility without rushing childhood.' },
  { name: 'NYC 3-K', age: '3 years', line: 'A free, full school day for eligible families', image: '/assets/review-craft.webp', title: 'A public program, thoughtfully delivered.', copy: 'NYC-funded 3-K combines hands-on learning, home-cooked meals and a caring classroom, with extended care available for working families.' },
  { name: 'Pre-K', age: '4—5 years', line: 'Kindergarten readiness with depth and joy', image: '/assets/program-playroom.webp', title: 'Ready without being rushed.', copy: 'Collaborative projects, foundational academics and practical independence prepare children for what comes next while preserving the pleasure of discovery.' },
  { name: 'Summer', age: 'Seasonal', line: 'An active extension of the school year', image: '/assets/sami-play-structure.webp', title: 'A season for wider discovery.', copy: 'Outdoor play, water, cooking, gardening and STEM create a summer rhythm that is purposeful, social and full of movement.' },
];

const locations = [
  { name: '16th Street Campus', address: '69 16th Street, Brooklyn, NY 11215', image: '/assets/loc-exterior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=69+16th+Street+Brooklyn+NY+11215' },
  { name: '3rd Avenue Campus', address: '591 3rd Avenue, Brooklyn, NY 11215', image: '/assets/loc-interior.jpg', map: 'https://www.google.com/maps/dir/?api=1&destination=591+3rd+Avenue+Brooklyn+NY+11215' },
];

const navigationItems = [
  { label: 'Our approach', href: '#approach', note: 'The principles behind a prepared, relationship-led classroom.', image: '/assets/sami-practical-life.webp' },
  { label: 'Programs', href: '#programs', note: 'A continuous educational foundation from six weeks through age five.', image: '/assets/program-preschool.webp' },
  { label: 'Playroom', href: '#playroom', note: 'Open play, specialist classes and celebrations for Brooklyn families.', image: '/assets/space-play.webp' },
  { label: 'For families', href: '#families', note: 'Meals, safety, communication and the dependable rhythm of each day.', image: '/assets/story-table.webp' },
  { label: 'Locations', href: '#locations', note: 'Two South Slope campuses, united by one standard of care.', image: '/assets/loc-exterior.jpg' },
];

function Brand() {
  return (
    <span className="heritage-brand">
      <span className="heritage-brand__mark"><img src="/assets/cuddle-avenue-logo.png" alt="" /></span>
      <span><b>Cuddle Avenue Academy</b><small>Early education · Brooklyn</small></span>
    </span>
  );
}

function ImageFrame({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <figure className={`image-frame ${className}`}><img src={src} alt={alt} /></figure>;
}

export default function Home() {
  const [programIndex, setProgramIndex] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navIndex, setNavIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const program = programs[programIndex];

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 620);
    const progress = document.querySelector<HTMLElement>('.heritage-progress');
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      progress?.style.setProperty('--progress', `${height > 0 ? window.scrollY / height : 0}`);
    };
    const observed = Array.from(document.querySelectorAll<HTMLElement>('[data-enter]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('has-entered'));
    }, { threshold: 0.12 });
    observed.forEach((element) => observer.observe(element));
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const selectProgram = (index: number) => {
    const transitionDocument = document as Document & { startViewTransition?: (callback: () => void) => void };
    if (transitionDocument.startViewTransition) transitionDocument.startViewTransition(() => setProgramIndex(index));
    else setProgramIndex(index);
  };

  return (
    <main className="heritage-site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className={`heritage-loader ${loaded ? 'heritage-loader--hidden' : ''}`} aria-hidden={loaded}>
        <img src="/assets/cuddle-avenue-logo.png" alt="" />
        <span>Cuddle Avenue Academy</span>
        <i />
      </div>
      <div className="heritage-progress" aria-hidden="true" />

      <header className={`heritage-header ${menuOpen ? 'heritage-header--open' : ''}`}>
        <div className="utility-bar">
          <p>Now accepting enquiries for 2026—27</p>
          <p>South Slope, Brooklyn</p>
          <a href="tel:+19179605618">+1 (917) 960-5618</a>
        </div>
        <div className="masthead">
          <a href="#main-content" aria-label="Cuddle Avenue Academy home"><Brand /></a>
          <nav aria-label="Primary navigation">
            <a href="#approach">Our approach</a>
            <a href="#programs">Programs</a>
            <a href="#families">For families</a>
            <a href="#locations">Locations</a>
          </nav>
          <a className="masthead__visit" href="#visit">Arrange a visit</a>
          <button className="heritage-menu-button" type="button" aria-expanded={menuOpen} aria-controls="navigation-atlas" onClick={() => setMenuOpen(true)}>Menu</button>
        </div>
        <div className={`navigation-atlas ${menuOpen ? 'navigation-atlas--open' : ''}`} id="navigation-atlas" aria-hidden={!menuOpen}>
          <span className="navigation-atlas__curtain navigation-atlas__curtain--brass" aria-hidden="true" />
          <span className="navigation-atlas__curtain navigation-atlas__curtain--forest" aria-hidden="true" />
          <div className="navigation-atlas__top">
            <Brand />
            <p>Explore Cuddle Avenue</p>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation">Close <span>×</span></button>
          </div>
          <nav aria-label="Expanded navigation">
            {navigationItems.map((item, index) => (
              <a href={item.href} key={item.href} onPointerEnter={() => setNavIndex(index)} onFocus={() => setNavIndex(index)} onClick={() => setMenuOpen(false)}>
                <span>0{index + 1}</span><b>{item.label}</b><i>↗</i>
              </a>
            ))}
          </nav>
          <aside>
            <ImageFrame key={navigationItems[navIndex].image} src={navigationItems[navIndex].image} alt="" />
            <p>{navigationItems[navIndex].note}</p>
          </aside>
          <div className="navigation-atlas__footer">
            <a href="#visit" onClick={() => setMenuOpen(false)}>Arrange a visit ↗</a>
            <a href="mailto:customerservice@cuddleavenue.org">Email the school ↗</a>
            <a href="tel:+19179605618">+1 (917) 960-5618</a>
            <p>South Slope · Brooklyn, New York</p>
          </div>
        </div>
      </header>

      <section className="heritage-hero" id="main-content">
        <div className="heritage-hero__visual">
          <ImageFrame className="heritage-hero__image" src="/assets/hero-classroom.webp" alt="Children and an educator working together around a classroom table" />
          <nav className="path-selector" aria-label="Choose between Cuddle Avenue Academy and Playroom">
            <a href="#programs"><span>Explore the</span><b>Academy</b></a>
            <i aria-hidden="true"><img src="/assets/ca-bears.png" alt="" /></i>
            <a href="#playroom"><span>Visit the</span><b>Playroom</b></a>
          </nav>
        </div>
        <article className="heritage-hero__copy" data-enter>
          <p className="academic-kicker">Montessori-inspired early education</p>
          <h1>The first five years, taken seriously.</h1>
          <p>Thoughtful academics, responsive care and the steady confidence of being truly known.</p>
          <div className="hero-actions">
            <a href="#visit">Meet the school</a>
            <a href="#programs">Explore programs <span>↓</span></a>
          </div>
          <dl>
            <div><dt>Ages</dt><dd>6 weeks—5 years</dd></div>
            <div><dt>Campuses</dt><dd>Two in South Slope</dd></div>
            <div><dt>NYC 3-K</dt><dd>Free for eligible families</dd></div>
          </dl>
        </article>
        <p className="heritage-hero__caption">A prepared environment for concentration, language and belonging.</p>
      </section>

      <section className="editorial-statement" data-enter>
        <p>Our purpose</p>
        <blockquote>Care and curriculum belong at the same table. When children feel secure, they are free to concentrate, communicate and become capable.</blockquote>
      </section>

      <section className="academic-approach" id="approach">
        <div className="academic-approach__copy" data-enter>
          <p className="academic-kicker">An education built from close attention</p>
          <h2>Before teaching a child, we learn how they learn.</h2>
          <p>Our Montessori-inspired classrooms combine prepared materials, long work cycles and responsive relationships. Children are guided carefully, then given enough time to make knowledge their own.</p>
          <a className="text-link" href="#visit">Discuss our approach <span>↗</span></a>
        </div>
        <ImageFrame className="approach-image" src="/assets/sami-practical-life.webp" alt="A carefully prepared practical-life classroom at Cuddle Avenue" />
        <div className="approach-principles" data-enter>
          <article><span>01</span><div><h3>Known closely</h3><p>Educators notice temperament, interests and the rhythm behind each child’s day.</p></div></article>
          <article><span>02</span><div><h3>Invited thoughtfully</h3><p>Materials and routines make concentration, language and independence possible.</p></div></article>
          <article><span>03</span><div><h3>Trusted gradually</h3><p>Children receive time to try, repeat, revise and take genuine ownership.</p></div></article>
        </div>
      </section>

      <section className="academic-programs" id="programs">
        <header data-enter>
          <p className="academic-kicker">Programs · 6 weeks to 5 years</p>
          <h2>One continuous foundation, considered at every age.</h2>
          <p>Select a program to see how the environment changes while the standard of care remains constant.</p>
        </header>
        <div className="program-prospectus">
          <div className="program-rows" role="tablist" aria-label="Cuddle Avenue programs" data-enter>
            {programs.map((item, index) => (
              <button type="button" role="tab" aria-selected={programIndex === index} key={item.name} onClick={() => selectProgram(index)} onPointerEnter={() => selectProgram(index)}>
                <span>{item.age}</span>
                <b>{item.name}</b>
                <small>{item.line}</small>
                <i aria-hidden="true">↗</i>
              </button>
            ))}
          </div>
          <aside className="program-detail" data-enter aria-live="polite">
            <ImageFrame src={program.image} alt={`${program.name} learning environment at Cuddle Avenue`} />
            <div>
              <p>{program.name} · {program.age}</p>
              <h3>{program.title}</h3>
              <p>{program.copy}</p>
              <a className="text-link" href="#visit">Ask about availability <span>↗</span></a>
            </div>
          </aside>
        </div>
      </section>

      <section className="school-day" id="families">
        <header data-enter>
          <p className="academic-kicker">A day at Cuddle Avenue</p>
          <h2>A reliable rhythm leaves room for discovery.</h2>
        </header>
        <div className="school-day__body">
          <div className="day-table" data-enter>
            {[
              ['7:30', 'Arrival', 'A warm, unhurried welcome'],
              ['9:00', 'Morning gathering', 'Language and shared attention'],
              ['9:30', 'Work cycle', 'Choice, focus and discovery'],
              ['12:00', 'Lunch and rest', 'A home-cooked meal and restoration'],
              ['3:00', 'Creative afternoon', 'Movement, making and play'],
            ].map(([time, title, copy]) => <article key={time}><time>{time}</time><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <ImageFrame className="day-image" src="/assets/story-gardening.webp" alt="Children gardening and exploring outdoors during the school day" />
        </div>
      </section>

      <section className="playroom-study" id="playroom">
        <ImageFrame className="playroom-study__image" src="/assets/space-play.webp" alt="The Cuddle Avenue Playroom prepared for open play and classes" />
        <article data-enter>
          <p className="academic-kicker">The Playroom</p>
          <h2>A creative space for family life beyond the school day.</h2>
          <p>Open play, small-group classes and private celebrations bring the same considered environment to a more flexible rhythm.</p>
          <dl>
            <div><dt>Playspace</dt><dd>Memberships and single visits · Ages 0—5</dd></div>
            <div><dt>Classes</dt><dd>Art, music, language, movement and more</dd></div>
            <div><dt>Parties</dt><dd>Private birthdays and tailored celebrations</dd></div>
          </dl>
          <a className="text-link" href="https://www.cuddleavenue.org/child-care-playroom" target="_blank" rel="noreferrer">Explore the Playroom <span>↗</span></a>
        </article>
      </section>

      <section className="family-essentials">
        <header data-enter><p className="academic-kicker">For families</p><h2>The details should inspire confidence, too.</h2></header>
        <div data-enter>
          <article><h3>Meals prepared here</h3><p>Breakfast, lunch and an afternoon snack are made in-house with organic ingredients. Dietary accommodations are discussed with each family.</p></article>
          <article><h3>Safety you can verify</h3><p>Licensed programs, screened educators, secure arrival routines and staff trained in pediatric CPR, First Aid, AED and EpiPen response.</p></article>
          <article><h3>Meaningful daily updates</h3><p>Eating, sleep, play and learning updates keep parents connected to the small moments—not only the pickup summary.</p></article>
        </div>
        <blockquote data-enter>“We could see how much our daughter learned—not only academically, but socially and emotionally.”<span><b>5.0</b> from 47 parent reviews</span></blockquote>
      </section>

      <section className="heritage-locations" id="locations">
        <header data-enter><p className="academic-kicker">South Slope, Brooklyn</p><h2>Two campuses. One standard of care.</h2></header>
        <div className="location-grid" data-enter>
          {locations.map((location) => (
            <article key={location.name}>
              <ImageFrame src={location.image} alt={`${location.name} at Cuddle Avenue`} />
              <div><h3>{location.name}</h3><address>{location.address}</address><a className="text-link" href={location.map} target="_blank" rel="noreferrer">Directions <span>↗</span></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="heritage-faq">
        <p className="academic-kicker">Before you visit</p>
        <div>
          <details><summary>What ages do you serve?<span>+</span></summary><p>Programs begin at six weeks and continue through age five, including free NYC 3-K for eligible families.</p></details>
          <details><summary>Are meals provided?<span>+</span></summary><p>Yes. Breakfast, lunch and a snack are prepared in-house, with dietary accommodations discussed directly.</p></details>
          <details><summary>Can I tour both locations?<span>+</span></summary><p>Yes. Tell us the program and schedule you need, and we will guide you to the most relevant campus.</p></details>
        </div>
      </section>

      <section className="heritage-visit" id="visit">
        <div data-enter><p className="academic-kicker">Admissions · 2026—27</p><h2>Come and see what careful attention looks like.</h2></div>
        <div data-enter><p>Tell us your child’s age and the schedule your family needs. We will guide you through programs, availability and both Brooklyn campuses.</p><a href="mailto:customerservice@cuddleavenue.org?subject=Cuddle%20Avenue%20tour%20request">Request a conversation <span>↗</span></a></div>
      </section>

      <footer className="heritage-footer">
        <Brand />
        <div><p>69 16th Street</p><p>591 3rd Avenue</p><p>Brooklyn, NY 11215</p></div>
        <div><a href="mailto:customerservice@cuddleavenue.org">Email</a><a href="tel:+19179605618">+1 (917) 960-5618</a><a href="https://www.instagram.com/cuddle_avenue_academy/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <p>© 2026 Cuddle Avenue Academy</p>
      </footer>
    </main>
  );
}
