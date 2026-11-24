const STEPS = [
  { n: '01', title: 'El creador imagina', text: 'Ilustraciones originales nacen en tiendas independientes de Colombia.' },
  { n: '02', title: 'KREATA lo hace posible', text: 'El diseño se imprime cuando alguien lo elige; cada pedido se prepara para esa persona.' },
  { n: '03', title: 'La historia sigue contigo', text: 'Una camiseta, un mug o un afiche lleva ese trabajo creativo a nuevos lugares.' },
];

export function HistorySection() {
  return (
    <section className="historia" id="historia" aria-labelledby="titulo-historia">
      <div className="historia-intro">
        <p className="sobretitulo">Así funciona KREATA</p>
        <h2 id="titulo-historia">De una idea propia a una pieza que encuentra su lugar</h2>
        <p>Detrás de cada diseño hay una persona creadora. KREATA le ayuda a convertir su arte en productos impresos bajo pedido, sin tener que producir inventario por adelantado.</p>
      </div>
      <ol className="historia-pasos">
        {STEPS.map((step) => (
          <li key={step.n}>
            <span>{step.n}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
