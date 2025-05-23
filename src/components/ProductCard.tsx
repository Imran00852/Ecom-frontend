import { FaPlus } from "react-icons/fa";
import { server } from "../constants/config";
import { CartItem } from "../types/types";

interface ProductCardProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
}

const ProductCard = ({
  productId,
  name,
  photo,
  price,
  stock,
  handler,
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={() =>
            handler({
              productId,
              name,
              photo,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
