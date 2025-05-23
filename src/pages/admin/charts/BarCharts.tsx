import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/Loader";
import { useBarQuery } from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";

const { last6Months, last12Months } = getLastMonths();

const BarCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useBarQuery(user?._id!);

  const charts = data?.charts!;

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        <h1>Bar Charts</h1>
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <BarChart
                data_1={charts.products}
                data_2={charts.users}
                title_1="Products"
                title_2="Users"
                labels={last6Months}
                bgColor_1={`hsl(260,50%,30%)`}
                bgColor_2={`hsl(360,90%,90%)`}
              />
              <h2>Top selling products & top customers</h2>
            </section>
            <section>
              <BarChart
                horizontal={true}
                data_1={charts.orders}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180,40%,50%)`}
                bgColor_2={""}
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default BarCharts;
