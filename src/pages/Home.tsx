import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducers/cartReducer";

const Home = () => {
  const { data, isLoading } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  const handleAddToCart = (cartItem: CartItem) => {
    if (cartItem.stock === 0) {
      return toast.error("Out of stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Item added to cart");
  };

  return (
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : data?.products?.length === 0 ? (
          <h2
            style={{
              padding: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            No products available.
          </h2>
        ) : (
          data?.products?.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              stock={i.stock}
              price={i.price}
              productId={i._id}
              photos={i.photos}
              handler={handleAddToCart}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
