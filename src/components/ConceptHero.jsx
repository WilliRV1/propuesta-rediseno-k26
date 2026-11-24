// Hero de concepto (decision 2 del equipo: "el inicio vende primero el concepto").
// El trazo de pincel es una mascara SVG con dos paths de stroke-dashoffset animado --
// sin GSAP ni Lottie: un unico stroke se ve irregular, dos con angulos distintos cubren
// mejor la foto y leen como una pincelada real.
export function ConceptHero() {
  return (
    <section className="hero-concepto" aria-labelledby="titulo-hero-concepto" data-enter>
      <div className="hero-concepto-texto">
        <h1 id="titulo-hero-concepto">El talento creativo merece llegar más lejos.</h1>
        <p className="hero-concepto-bajada">
          Diseños originales, artistas independientes y productos que convierten ideas en objetos para disfrutar.
        </p>
        <a href="#catalogo" className="boton">Descubre más</a>
      </div>

      <div className="hero-concepto-arte">
        <svg viewBox="0 0 900 640" role="img" aria-label="Camiseta con el diseño Azulejo común, de ARTERY">
          <mask id="pincelada">
            {/* dos trazos anchos y cruzados: juntos cubren el encuadre completo, de ahi el barrido */}
            <path
              className="pincelada-trazo pincelada-trazo-1"
              d="M -120,230 C 200,160 480,200 1020,150"
              fill="none" stroke="white" strokeWidth="430" strokeLinecap="round" pathLength="1"
            />
            <path
              className="pincelada-trazo pincelada-trazo-2"
              d="M -120,430 C 220,520 520,440 1020,500"
              fill="none" stroke="white" strokeWidth="430" strokeLinecap="round" pathLength="1"
            />
          </mask>
          <image href="/img/p-53766.jpg" x="0" y="0" width="900" height="640" mask="url(#pincelada)" preserveAspectRatio="xMidYMid slice" />
        </svg>
      </div>
    </section>
  );
}
