import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import { useNewCouponMutation } from "../../../redux/api/dashboardApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";

const NewDiscount = () => {
  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const [newCoupon, { isLoading }] = useNewCouponMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await newCoupon({ id: user?._id!, code, amount });
      responseToast(res, navigate, "/admin/discount");
    } catch (err) {
      toast.error("Error creating coupon");
    }
  };
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <article>
              <form onSubmit={handleSubmit}>
                <h2>New Discount Coupon</h2>
                <div>
                  <label>Code</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <button type="submit">Create</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default NewDiscount;
