import klccHazeImage from './assets/klcc-haze.jpg'
import './App.css'

const causes = [
  {
    icon: '🔥',
    title: 'Forest & peat fires',
    text: 'Land clearing and accidental fires can burn vegetation and peat. Peat fires may smoulder underground and release smoke for a long time.',
  },
  {
    icon: '🏭',
    title: 'Industry',
    text: 'Factories and power generation release pollutants. Their contribution varies by location and should be considered alongside other sources.',
  },
  {
    icon: '🚗',
    title: 'Vehicles',
    text: 'Traffic emissions add particles and gases to urban air, where weather can sometimes keep pollution close to the ground.',
  },
  {
    icon: '🌿',
    title: 'Other burning',
    text: 'Agricultural burning and burning rubbish can add harmful smoke. Wind may carry fire smoke across districts and borders.',
  },
]

const healthEffects = [
  {
    term: 'Short-term',
    items: ['Eye, nose, or throat irritation', 'Coughing or breathing discomfort', 'Headache and fatigue'],
  },
  {
    term: 'Higher concern',
    items: [
      'Asthma or lung conditions may worsen',
      'Greater risk for children and older adults',
      'Repeated exposure can affect heart and lung health',
    ],
  },
]

const actions = [
  {
    icon: '🚫',
    title: 'Prevent fires',
    text: 'Do not burn vegetation or rubbish. Report fires to local authorities.',
  },
  {
    icon: '🚌',
    title: 'Reduce emissions',
    text: 'Choose public transport, carpool, walk, or cycle when it is safe.',
  },
  {
    icon: '😷',
    title: 'Protect yourself',
    text: 'Check official advice, limit outdoor exertion, and use a well-fitted respirator if advised.',
  },
  {
    icon: '🌱',
    title: 'Support prevention',
    text: 'Support responsible land management, forest protection, and restoration.',
  },
  {
    icon: '✓',
    title: 'Check air quality',
    text: 'Use Malaysia’s official API reading for your area. Conditions can change quickly.',
  },
]

const apiLevels = [
  ['0–50', 'Good'],
  ['51–100', 'Moderate'],
  ['101–200', 'Unhealthy'],
  ['201–300', 'Very unhealthy'],
  ['Above 300', 'Hazardous'],
]

function App() {
  return (
    <div className="page-shell">
      <header className="topbar container">
        <a className="brand" href="#home" aria-label="HazeAware home">
          <span className="brand-leaf" aria-hidden="true">◢</span>
          HazeAware
        </a>
        <nav className="nav" aria-label="Main navigation">
          <a className="nav-home" href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#air-quality">Air Quality</a>
          <a href="#health">Health &amp; Impact</a>
          <a href="#actions">What You Can Do</a>
        </nav>
        <a className="header-link" href="https://apims.doe.gov.my/" target="_blank" rel="noreferrer">
          Check API <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <img
            className="hero-image"
            src={klccHazeImage}
            alt="The Kuala Lumpur skyline covered in haze, with the Petronas Twin Towers barely visible"
          />
          <div className="hero-shade" />
          <div className="hero-content container">
            <p className="hero-kicker">Malaysia • Air pollution awareness</p>
            <h1><span>What is</span> haze?</h1>
            <p className="hero-subtitle">A silent blanket over our skies,<br />with a bigger impact than we think.</p>
            <p className="hero-explainer">
              Haze is polluted air containing tiny particles and gases. It reduces visibility and
              can make breathing unhealthy. Smoke can travel far from the fire that created it.
            </p>
            <a className="hero-cta" href="#air-quality">Know the risk <span aria-hidden="true">↓</span></a>
          </div>
          <p className="image-credit">
            Kuala Lumpur skyline during the 2019 haze, photographed 11 September 2019 by Benjy8769.
            <a
              href="https://commons.wikimedia.org/wiki/File:Kuala_Lumpur_hazy_skyline_2019.jpg"
              target="_blank"
              rel="noreferrer"
            >
              Wikimedia Commons • CC BY-SA 4.0
            </a>
          </p>
        </section>

        <div className="poster-content">
          <section id="about" className="intro-strip container paper-panel">
            <div className="section-title">
              <span className="section-symbol" aria-hidden="true">☁</span>
              <div>
                <p className="eyebrow">More than a little mist</p>
                <h2>Haze is a warning we should not ignore.</h2>
              </div>
            </div>
            <p>
              Haze forms when smoke and other pollutants build up in the atmosphere. Dry weather
              can help fires spread, while wind can carry smoke across Southeast Asia into Malaysia.
              Local traffic and industry also affect air quality. The causes and severity differ by
              place and day.
            </p>
          </section>

          <section id="air-quality" className="topic-grid container">
            <article className="paper-panel api-panel">
              <div className="section-title">
                <span className="section-symbol" aria-hidden="true">◉</span>
                <div>
                  <p className="eyebrow">Malaysia’s Air Pollutant Index</p>
                  <h2>Check your area. Don’t guess.</h2>
                </div>
              </div>
              <div className="api-content">
                <div className="api-gauge" aria-label="API categories, not a live reading">
                  <span>API</span>
                  <strong>Check<br />today</strong>
                </div>
                <div className="api-scale" aria-label="Malaysia API categories">
                  {apiLevels.map(([range, label], index) => (
                    <div className={`api-row api-row-${index + 1}`} key={range}>
                      <span className="api-dot" aria-hidden="true" />
                      <strong>{range}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="panel-note">This graphic shows API categories only—not current conditions.</p>
              <a className="text-link" href="https://apims.doe.gov.my/" target="_blank" rel="noreferrer">
                Open Malaysia’s official API portal <span aria-hidden="true">↗</span>
              </a>
            </article>

            <article className="paper-panel causes-panel">
              <div className="section-title">
                <span className="section-symbol" aria-hidden="true">♨</span>
                <div>
                  <p className="eyebrow">The main sources</p>
                  <h2>What adds pollution to the air?</h2>
                </div>
              </div>
              <div className="causes-grid">
                {causes.map((cause) => (
                  <article className="cause-item" key={cause.title}>
                    <span className="cause-icon" aria-hidden="true">{cause.icon}</span>
                    <h3>{cause.title}</h3>
                    <p>{cause.text}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section id="health" className="topic-grid container">
            <article className="paper-panel health-panel">
              <div className="section-title">
                <span className="section-symbol" aria-hidden="true">♥</span>
                <div>
                  <p className="eyebrow">Health effects</p>
                  <h2>Who breathes the consequences?</h2>
                </div>
              </div>
              <div className="health-columns">
                {healthEffects.map((group) => (
                  <div className="health-group" key={group.term}>
                    <h3>{group.term}</h3>
                    <ul>
                      {group.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="panel-note">
                Children, older adults, pregnant people, and people with heart or lung conditions
                may be more vulnerable. Seek medical advice if symptoms worsen.
              </p>
            </article>

            <article className="smoke-panel">
              <p className="eyebrow">What’s in haze?</p>
              <h2>PM2.5<br />is smaller than a grain of sand.</h2>
              <div className="particle-compare" aria-hidden="true">
                <span className="particle particle-large" />
                <span className="particle particle-small" />
              </div>
              <div className="particle-labels">
                <p><strong>PM10</strong><br />Can enter the airways.</p>
                <p><strong>PM2.5</strong><br />Can travel deep into the lungs.</p>
              </div>
              <p className="smoke-note">
                Particle sizes shown comparatively, not to scale. PM2.5 means particles 2.5
                micrometres or smaller.
              </p>
            </article>
          </section>

          <section className="topic-grid container">
            <article className="paper-panel impact-panel">
              <div className="section-title">
                <span className="section-symbol" aria-hidden="true">🌿</span>
                <div>
                  <p className="eyebrow">The impact</p>
                  <h2>Haze reaches beyond our lungs.</h2>
                </div>
              </div>
              <div className="impact-columns">
                <div>
                  <h3>Environment</h3>
                  <ul>
                    <li>Smoke and ash affect plants and wildlife.</li>
                    <li>Low visibility can make travel more dangerous.</li>
                  </ul>
                </div>
                <div>
                  <h3>Daily life</h3>
                  <ul>
                    <li>Outdoor work, sports, and school activities may be disrupted.</li>
                    <li>Tourism and local businesses can be affected.</li>
                  </ul>
                </div>
              </div>
            </article>

            <article id="actions" className="paper-panel actions-panel">
              <div className="section-title">
                <span className="section-symbol" aria-hidden="true">☼</span>
                <div>
                  <p className="eyebrow">What you can do</p>
                  <h2>Small actions. Cleaner air.</h2>
                </div>
              </div>
              <div className="actions-grid">
                {actions.map((action) => (
                  <article className="action-item" key={action.title}>
                    <span className="action-icon" aria-hidden="true">{action.icon}</span>
                    <h3>{action.title}</h3>
                    <p>{action.text}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>

          <section className="closing container">
            <p className="eyebrow">Awareness starts with us</p>
            <h2>Less haze. More blue skies.<br />It starts with us.</h2>
            <a href="https://apims.doe.gov.my/" target="_blank" rel="noreferrer" className="closing-link">
              Check the air quality <span aria-hidden="true">↗</span>
            </a>
          </section>
        </div>

        <footer className="footer">
          <div className="container footer-inner">
            <p>Cleaner air. Healthier lives. A greener Malaysia.</p>
            <p className="student-credit">
              Prepared by <strong>NURISMA MARYAM BINTI MAHAIDIR</strong>
              <span>Matric No. 223593</span>
            </p>
            <ul aria-label="Sources">
              <li><a href="https://www.who.int/health-topics/air-pollution" target="_blank" rel="noreferrer">WHO</a></li>
              <li><a href="https://apims.doe.gov.my/" target="_blank" rel="noreferrer">DOE Malaysia API</a></li>
              <li><a href="https://www.doe.gov.my/" target="_blank" rel="noreferrer">Department of Environment Malaysia</a></li>
            </ul>
            <p className="footer-note">
              For awareness only. Air-quality levels can change quickly; follow official local
              health advice. This page does not provide live readings or medical advice.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
