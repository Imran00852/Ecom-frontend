import { useFileHandler } from "6pp";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import {
  useDeleteProductMutation,
  useProductDetailsQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast, transformImage } from "../../../utils/features";

const ProductManagement = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const navigate = useNavigate();

  const params = useParams();

  const { data, isLoading } = useProductDetailsQuery(params.id!, {
    skip: !params.id!,
  });

  const { photos, stock, name, category, price, description } =
    data?.product || {
      photos: [],
      stock: 0,
      name: "",
      description: "",
      category: "",
      price: 0,
    };

  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const photosFiles = useFileHandler("multiple", 10, 5);

  const [updateProduct, { isLoading: updateProductLoading }] =
    useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (nameUpdate) formData.append("name", nameUpdate);
    if (descriptionUpdate) formData.append("description", descriptionUpdate);
    if (priceUpdate) formData.append("price", priceUpdate.toString());
    if (stockUpdate !== undefined)
      formData.append("stock", stockUpdate.toString());
    if (categoryUpdate) formData.append("category", categoryUpdate);
    if (photosFiles.file && photosFiles.file.length > 0) {
      photosFiles.file.forEach((file) => {
        formData.append("photos", file);
      });
    }

    try {
      const res = await updateProduct({
        formData,
        userId: user?._id!,
        productId: params.id!,
      });
      responseToast(res, navigate, "/admin/products");
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteProduct({
        userId: user?._id!,
        productId: params.id!,
      });
      responseToast(res, navigate, "/admin/products");
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  useEffect(() => {
    if (data) {
      setNameUpdate(data.product.name);
      setDescriptionUpdate(data.product.description);
      setPriceUpdate(data.product.price);
      setStockUpdate(data.product.stock);
      setCategoryUpdate(data.product.category);
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {data?.product._id}</strong>
              <img src={transformImage(photos[0]?.url!, 200)} alt="product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red">Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button onClick={handleDelete} className="product-delete-btn">
                <FaTrash />
              </button>
              <form onSubmit={handleSubmit}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    required
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Photos</label>
                  <input
                    type="file"
                    onChange={photosFiles.changeHandler}
                    multiple
                    accept="images/*"
                  />
                </div>

                {photosFiles.error && <p>{photosFiles.error}</p>}

                {photosFiles.preview && (
                  <div
                    style={{ display: "flex", gap: "1rem", overflowX: "auto" }}
                  >
                    {photosFiles.preview.map((img, idx) => (
                      <img
                        style={{ width: 100, height: 100, objectFit: "cover" }}
                        key={idx}
                        src={img}
                        alt="new img"
                      />
                    ))}
                  </div>
                )}

                <button type="submit" disabled={updateProductLoading}>
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
