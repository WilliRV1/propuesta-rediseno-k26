import { Link } from 'react-router-dom';

const COLLECTIONS = [
  {
    store: 'ARTERY · NATURALEZA LOCAL',
    title: 'Aves del Valle',
    text: 'Ilustraciones que celebran la biodiversidad del suroccidente colombiano.',
    cta: 'Ver diseños ARTERY',
    image: '/img/wrap-bichofue.jpg',
    alt: 'Ilustración de un bichofué de ARTERY',
    to: '/#tienda-artery',
  },
  {
    store: 'KOKOMOCHI · PERSONAJES',
    title: 'Un toque de Cali',
    text: 'Personajes, café y guiños cotidianos convertidos en ilustración.',
    cta: 'Ver diseños Kokomochi',
    image: '/img/wrap-juancho.jpg',
    alt: 'Juancho y Conchita, personajes ilustrados de Kokomochi',
    to: '/#tienda-kokomochi',
  },
  {
    store: 'ARTERY · COLOR Y MOVIMIENTO',
    title: 'Hecho para expresarte',
    text: 'Diseños con carácter para acompañar tu estilo todos los días.',
    cta: 'Ver diseños ARTERY',
    image: '/img/wrap-salsita.jpg',
    alt: 'Diseño Salsita de la tienda ARTERY',
    to: '/#tienda-artery',
  },
];

export function CollectionsSection() {
  return (
    <section className="colecciones" id="colecciones" aria-labelledby="titulo-colecciones">
      <div className="seccion-cabeza">
        <div>
          <p className="sobretitulo">Un mundo en cada tienda</p>
          <h2 id="titulo-colecciones">Colecciones para descubrir nuevas historias</h2>
        </div>
        <Link to="/#catalogo">Explorar el catálogo</Link>
      </div>
      <ul className="colecciones-lista">
        {COLLECTIONS.map((c, i) => (
          <li className="coleccion" key={i}>
            <Link to={c.to}>
              <img src={c.image} alt={c.alt} width="2048" height="952" loading="lazy" />
              <span className="coleccion-cuerpo">
                <span className="coleccion-artista">{c.store}</span>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
                <span className="coleccion-enlace">{c.cta} <span aria-hidden="true">→</span></span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
