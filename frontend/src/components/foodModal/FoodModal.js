export default function FoodModal({ isOpen, onClose, item }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <img src={item.image} alt={item.name} className="modal-image" />
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p>${item.price}</p>
        <button className="add-to-cart-btn">Add to Cart</button>
        <button onClick={onClose} className="close-modal-btn">
          Close
        </button>
      </div>
    </div>
  );
}
