import { ColumnDef } from "@tanstack/react-table";
import TableHOC from "./TableHOC";

interface DataType {
  _id: string;
  amount: number;
  quantity: number;
  discount: number;
  status: string;
}

const columns: ColumnDef<DataType>[] = [
  {
    header: "Id",
    accessorKey: "_id",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  return TableHOC<DataType>(
    columns,
    data,
    "transaction-box",
    "Top Transactions"
  )();
};

export default DashboardTable;
