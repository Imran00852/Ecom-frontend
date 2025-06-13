import { ColumnDef } from "@tanstack/react-table";
import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import { useAllProductsQuery } from "../../redux/api/productApi";
import { CustomError } from "../../types/api-types";
import { UserReducerInitialState } from "../../types/reducer-types";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Photo",
    accessorKey: "photo",
    cell: (info) => info.getValue(),
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Stock",
    accessorKey: "stock",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: (info) => info.getValue(),
  },
];

const Product = () => {
  const [rows, setRows] = useState<DataType[]>([]);

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  const { data, isLoading, error, isError } = useAllProductsQuery(user?._id!);

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data)
      setRows(
        data.products.map((i) => ({
          photo: <img src={i.photos[0]?.url} alt={i.name} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/products/${i._id}`}>Manage</Link>,
        }))
      );
  }, [data]);

  const Table = useCallback(
    TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Products",
      rows.length > 6
    ),
    [rows]
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to={"/admin/products/new"} className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Product;
