import { useCart } from '../context/CartContext.jsx';

export function CartToast() {
  const { toast } = useCart();
  return (
    <p className="aviso" id="aviso" role="status" data-visible={toast ? '1' : undefined}>
      {toast}
    </p>
  );
}
