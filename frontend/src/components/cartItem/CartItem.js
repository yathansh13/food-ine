import "./CartItem.css";

function CartItem({ item }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <div className="items-detail">
          <h4>{item.name}</h4>
          <p>${item.price}</p>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
