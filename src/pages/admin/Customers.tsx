import { ColumnDef } from "@tanstack/react-table";
import { ReactElement, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/Loader";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userApi";
import { userNotExist } from "../../redux/reducers/userReducer";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { responseToast } from "../../utils/features";
interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Avatar",
    accessorKey: "avatar",
    cell: (info) => info.getValue(), // explicitly render the JSX
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Gender",
    accessorKey: "gender",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: (info) => info.getValue(), // explicitly render the JSX
  },
];

const Customers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rows, setRows] = useState<DataType[]>([]);
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, error, isError } = useAllUsersQuery(user?._id!, {
    skip: !user?._id!,
  });

  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    const res = await deleteUser({ userId: id, adminUserId: user?._id! });
    responseToast(res, null, "");
    if (id === user?._id) {
      dispatch(userNotExist());
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  useEffect(() => {
    if (data)
      setRows(
        data.users.map((i) => {
          return {
            avatar: (
              <img
                style={{
                  borderRadius: "50%",
                }}
                src={i.photo}
                alt={i.name}
                referrerPolicy="no-referrer"
              />
            ),
            name: i.name,
            email: i.email,
            gender: i.gender,
            role: i.role,
            action: (
              <button onClick={() => handleDelete(i._id)}>
                <FaTrash />
              </button>
            ),
          };
        })
      );
  }, [data]);

  const Table = useCallback(
    TableHOC<DataType>(
      columns,
      rows,
      "dashboard-product-box",
      "Customers",
      rows.length > 6
    ),
    [rows]
  )();
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
