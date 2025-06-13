import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import { useEffect, useState } from "react";
import {
  useDeleteCouponMutation,
  useGetSingleCouponQuery,
  useUpdateCouponMutation,
} from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { responseToast } from "../../../utils/features";
import toast from "react-hot-toast";

const DiscountManagement = () => {
  const [codeUpdate, setCodeUpdate] = useState<string>("");
  const [amountUpdate, setAmountUpdate] = useState<number>(0);

  const { user } = useSelector((state: RootState) => state.userReducer);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetSingleCouponQuery({
    adminId: user?._id!,
    couponId: params.id!,
  });

  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteCoupon({
        adminId: user?._id!,
        couponId: params.id!,
      });
      responseToast(res, navigate, "/admin/discount");
    } catch (err) {
      toast.error("Error deleting coupon");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (codeUpdate) formData.append("code", codeUpdate);
    if (amountUpdate) formData.append("amount", amountUpdate.toString());

    try {
      const res = await updateCoupon({
        adminId: user?._id!,
        couponId: params.id!,
        code: codeUpdate,
        amount: amountUpdate,
      });
      responseToast(res, navigate, "/admin/discount");
    } catch (err) {
      toast.error("Error updating coupon");
    }
  };

  useEffect(() => {
    if (data) {
      setCodeUpdate(data.coupon.code);
      setAmountUpdate(data.coupon.amount);
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
            <article>
              <button onClick={handleDelete} className="product-delete-btn">
                <FaTrash />
              </button>
              <form onSubmit={handleSubmit}>
                <h2>Manage</h2>
                <div>
                  <label>Code</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={codeUpdate}
                    onChange={(e) => setCodeUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amountUpdate}
                    onChange={(e) => setAmountUpdate(Number(e.target.value))}
                  />
                </div>
                <button type="submit">Update</button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default DiscountManagement;
