import { ReactElement, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { ColumnDef } from "@tanstack/react-table";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { Skeleton } from "../../components/Loader";
import { useGetAllCouponsQuery } from "../../redux/api/dashboardApi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

interface DataType {
  code: string;
  amount: number;
  _id: string;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "ID",
    accessorKey: "_id",
  },
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: (info) => info.getValue(),
  },
];

const Discount = () => {
  const [rows, setRows] = useState<DataType[]>([]);
  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data, isLoading, error, isError } = useGetAllCouponsQuery(user?._id!);

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data)
      setRows(
        data.coupons.map((i) => ({
          _id: i._id,
          code: i.code,
          amount: i.amount,
          action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = useCallback(
    TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Coupons",
      rows.length > 6
    ),
    [rows]
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to={"/admin/discount/new"} className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Discount;
