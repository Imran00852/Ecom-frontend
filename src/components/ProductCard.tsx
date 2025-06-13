import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";
import { transformImage } from "../utils/features";

interface ProductCardProps {
  productId: string;
  photos: [
    {
      public_id: string;
      url: string;
    }
  ];
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
}

const ProductCard = ({
  productId,
  name,
  photos,
  price,
  stock,
  handler,
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={transformImage(photos[0]?.url,700)} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={() =>
            handler({
              productId,
              name,
              photo: photos[0].url,
              price,
              stock,
              quantity: 1,
            })
          }
        >
          <FaPlus />
        </button>
        <Link to={`/product/${productId}`}>
          <FaExpandAlt />
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
