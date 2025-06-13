import React, { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useNewProductMutation } from "../../../redux/api/productApi";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );
  const [newProduct, { isLoading }] = useNewProductMutation();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [stock, setStock] = useState<number>(0);

  const navigate = useNavigate();
  const photos = useFileHandler("multiple", 10, 5);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!price || stock < 0 || !name || !category || !description) return;
    if (!photos.file || photos.file.length === 0) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("category", category);

    photos.file.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await newProduct({ id: user?._id!, formData });
      responseToast(res, navigate, "/admin/products");
    } catch (err) {
      toast.error("Error in creating new product!");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <label>Photos</label>
              <input
                required
                type="file"
                accept="images/*"
                multiple
                onChange={photos.changeHandler}
              />
            </div>
            {photos.error && <p>{photos.error}</p>}

            {photos.preview &&
              photos.preview.map((img, idx) => (
                <img key={idx} src={img} alt="new image" />
              ))}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
