import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { Skeleton } from "../../../components/Loader";
import { useLineQuery } from "../../../redux/api/dashboardApi";
import { RootState } from "../../../redux/store";
import { CustomError } from "../../../types/api-types";
import { getLastMonths } from "../../../utils/features";

const { last12Months: months } = getLastMonths();

const LineCharts = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useLineQuery(user?._id!);

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
        <h1>Line Charts</h1>
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <LineChart
                data={charts.users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                backgroundColor="rgba(53, 162, 255,0.5)"
                labels={months}
              />
              <h2>Active Users</h2>
            </section>
            <section>
              <LineChart
                data={charts.products}
                backgroundColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                label="Products"
                labels={months}
              />
              <h2>Total Products (SKU)</h2>
            </section>

            <section>
              <LineChart
                data={charts.revenue}
                backgroundColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={months}
              />
              <h2>Total Revenue</h2>
            </section>

            <section>
              <LineChart
                data={charts.discount}
                backgroundColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={months}
              />
              <h2>Discount Allotted</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default LineCharts;
