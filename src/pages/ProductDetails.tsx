import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaStar, FaTrash } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong, FaRegStar } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Skeleton } from "../components/Loader";
import RatingsComponent from "../components/Ratings";
import {
  useAllReviewsOfProductQuery,
  useDeleteReviewMutation,
  useNewReviewMutation,
  useProductDetailsQuery,
} from "../redux/api/productApi";
import { addToCart } from "../redux/reducers/cartReducer";
import { CustomError } from "../types/api-types";
import { CartItem } from "../types/types";
import { RootState } from "../redux/store";
import { responseToast } from "../utils/features";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const reviewDialogRef = useRef<HTMLDialogElement>(null);

  const { data, isError, error, isLoading } = useProductDetailsQuery(
    params.id!
  );

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useAllReviewsOfProductQuery(params.id!);

  const increment = () => {
    if (data?.product?.stock === quantity) {
      return toast.error(`${data?.product?.stock} available only`);
    }
    setQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (quantity === 1) {
      return toast.error("Quantity cannot be less than 1");
    }
    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = (cartItem: CartItem) => {
    if (cartItem.stock === 0) {
      return toast.error("Out of stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Item added to cart");
  };

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  const showDialog = () => {
    reviewDialogRef.current?.showModal();
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
    },
  });

  const [reviewComment, setReviewComment] = useState("");
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [newReview, { isLoading: newReviewLoading }] = useNewReviewMutation();

  const reviewCloseHandler = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setReviewComment("");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await newReview({
        userId: user?._id!,
        productId: params.id!,
        comment: reviewComment,
        rating,
      });
      responseToast(res, null, "");
      reviewCloseHandler();
      refetchReviews(); // ✅ refetch after submitting review
    } catch (err) {
      toast.error("Error in adding review!");
    }
  };

  const [deleteReview] = useDeleteReviewMutation();
  const deleteReviewHandler = async (id: string) => {
    try {
      const res = await deleteReview({
        userId: user?._id!,
        reviewId: id,
      });
      responseToast(res, null, "");
      refetchReviews(); // ✅ refetch after deleting review
    } catch (err) {
      toast.error("Error in deleting review!");
    }
  };

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                showNav={false}
                onClick={() => setCarouselOpen(true)}
                images={data?.product?.photos.map((i) => i.url) || []}
              />
              {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={data?.product?.photos.map((i) => i.url) || []}
                />
              )}
            </section>
            <section>
              <code>{data?.product?.category}</code>
              <h1>{data?.product?.name}</h1>
              <em
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <RatingsComponent value={data?.product?.ratings || 0} />(
                {data?.product?.numOfReviews} reviews)
              </em>
              <h3>₹{data?.product?.price}</h3>
              <article>
                <div>
                  <button onClick={decrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={increment}>+</button>
                </div>
                <button
                  onClick={() =>
                    handleAddToCart({
                      productId: data?.product?._id!,
                      name: data?.product?.name!,
                      price: data?.product?.price!,
                      stock: data?.product?.stock!,
                      quantity,
                      photo: data?.product?.photos[0]?.url!,
                    })
                  }
                >
                  Add to Cart
                </button>
              </article>
              <p>{data?.product?.description}</p>
            </section>
          </main>
        </>
      )}

      {/* Review Dialog */}
      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={reviewCloseHandler}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Review..."
          ></textarea>
          <RatingsEditable />
          <button disabled={newReviewLoading} type="submit">
            Submit
          </button>
        </form>
      </dialog>

      {/* Reviews Section */}
      <section>
        <article>
          <h2>Reviews</h2>
          {user && (
            <button onClick={showDialog}>
              <FiEdit />
            </button>
          )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewsLoading ? (
            <Skeleton width="100%" length={5} />
          ) : (
            reviewsData?.reviews.map((review) => (
              <div key={review._id} className="review">
                <RatingsComponent value={review.rating} />
                <p>{review.comment}</p>
                <div>
                  <img
                    src={review.user.photo}
                    alt={review.user.name}
                    referrerPolicy="no-referrer"
                  />
                  <small>{review.user.name}</small>
                </div>
                {user?._id === review.user._id && (
                  <button onClick={() => deleteReviewHandler(review._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ProductLoader = () => (
  <div
    style={{
      display: "flex",
      gap: "2rem",
      border: "1px solid #f1f1f1",
      height: "80vh",
    }}
  >
    <section style={{ width: "100%", height: "100%" }}>
      <Skeleton
        width="100%"
        containerHeight="100%"
        height="100%"
        length={2}
      />
    </section>
    <section
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
        padding: "2rem",
      }}
    >
      <Skeleton width="100%" length={3} />
      <Skeleton width="100%" length={4} />
      <Skeleton width="100%" length={4} />
    </section>
  </div>
);

const NextButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowRightLong />
  </button>
);

const PrevButton: CarouselButtonType = ({ onClick }) => (
  <button onClick={onClick} className="carousel-btn">
    <FaArrowLeftLong />
  </button>
);

export default ProductDetails;
