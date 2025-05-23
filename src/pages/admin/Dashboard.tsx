import { BiMaleFemale } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, DoughnutChart } from "../../components/admin/Charts";
import DashboardTable from "../../components/admin/DashboardTable";
import { useStatsQuery } from "../../redux/api/dashboardApi";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { CustomError } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { getLastMonths } from "../../utils/features";

const { last6Months } = getLastMonths();

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { data, isLoading, isError, error } = useStatsQuery(user?._id!);

  const stats = data?.stats!;

  useEffect(() => {
    if (isError) {
      const err = error as CustomError;
      toast.error(err.data.message);
    }
  }, [isError, error]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            {/* Search bar */}
            <div className="bar">
              <BsSearch />
              <input type="text" placeholder="Search for data,users,docs..." />
              <FaRegBell />
              <img src={user?.photo} alt="User" />
            </div>

            {/* widgets */}
            <section className="widget-container">
              <WidgetItem
                amount={true}
                percent={stats.changePercent.revenue}
                value={stats.count.revenue}
                heading="Revenue"
                color="rgb(0,115,255)"
              />
              <WidgetItem
                percent={stats.changePercent.user}
                value={stats.count.user}
                heading="Users"
                color="rgb(0,198,202)"
              />
              <WidgetItem
                percent={stats.changePercent.order}
                value={stats.count.order}
                heading="Transactions"
                color="rgb(255,196,0)"
              />
              <WidgetItem
                percent={stats.changePercent.product}
                value={stats.count.product}
                heading="Products"
                color="rgb(75,0,255)"
              />
            </section>

            {/* Graphs */}
            <section className="graph-container">
              <div className="revenue-chart">
                <h2>Revenue & Transaction</h2>
                {/* graph here */}
                <BarChart
                  labels={last6Months}
                  data_1={stats.chart.revenue}
                  data_2={stats.chart.order}
                  title_1="Revenue"
                  title_2="Transaction"
                  bgColor_1="rgb(0,115,255)"
                  bgColor_2="rgba(53,162,235,0.8)"
                />
              </div>
              <div className="dashboard-categories">
                <h2>Inventory</h2>
                <div>
                  {stats.categoryCount.map((i) => {
                    const [heading, value] = Object.entries(i)[0];
                    return (
                      <CategoryItem
                        key={heading}
                        heading={heading}
                        value={value}
                        color={`hsl(${value * 3},${value}%,50%)`}
                      />
                    );
                  })}
                </div>
              </div>
            </section>

            {/* doughtnut chart and table at the bottom */}
            <section className="transaction-container">
              <div className="gender-chart">
                <h2>Gender Ratio</h2>
                {/* chart here */}
                <DoughnutChart
                  labels={["Female", "Male"]}
                  data={[stats.userRatio.female, stats.userRatio.male]}
                  backgroundColor={["hsl(340,82%,56%)", "rgba(53,162,235,0.8)"]}
                  cutout={90}
                />
                <p>
                  <BiMaleFemale />
                </p>
              </div>
              {/* table here */}
              <DashboardTable data={stats.latestTransactions} />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({
  heading,
  value,
  percent,
  color,
  amount = false,
}: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `₹ ${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> +{percent}%
        </span>
      ) : (
        <span>
          <HiTrendingDown /> {percent}%
        </span>
      )}
    </div>
    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(
      ${color} ${(Math.abs(percent) / 100) * 360}deg,
      rgb(255,255,255) 0
      )`,
      }}
    >
      <span style={{ color }}>
        {percent > 0 && `${percent > 10000 ? 9999 : percent}%`}
        {percent < 0 && `${percent < -10000 ? -9999 : percent}%`}
      </span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}
const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div style={{ backgroundColor: color, width: `${value}%` }}></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
