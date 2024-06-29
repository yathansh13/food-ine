import "./CartItem.css"; 

function CartItem({ item }) {
  // Initialize quantity state
  // const [quantity, setQuantity] = useState(1);

  // // Increment quantity
  // const incrementQuantity = () => {
  //   setQuantity((prevQuantity) => prevQuantity + 1);
  // };

  // // Decrement quantity, ensuring it doesn't go below 1
  // const decrementQuantity = () => {
  //   setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  // };

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
