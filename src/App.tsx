import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducers/userReducer";
import { useGetUserQuery } from "./redux/api/userApi";
import { UserReducerInitialState } from "./types/reducer-types";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Login = lazy(() => import("./pages/Login"));
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Checkout = lazy(() => import("./pages/Checkout"));

// admin imports
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Product = lazy(() => import("./pages/admin/Product"));
const Customer = lazy(() => import("./pages/admin/Customers"));
const Transaction = lazy(() => import("./pages/admin/Transactions"));
const NewProduct = lazy(() => import("./pages/admin/management/NewProduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/ProductManagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/TransactionManagement")
);
const Discount = lazy(() => import("./pages/admin/Discount"));
const DiscountManagement = lazy(
  () => import("./pages/admin/management/DiscountManagement")
);
const NewDiscount = lazy(() => import("./pages/admin/management/NewDiscount"));

const BarCharts = lazy(() => import("./pages/admin/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/admin/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/admin/charts/LineCharts"));

const Stopwatch = lazy(() => import("./pages/admin/apps/Stopwatch"));
const Coupon = lazy(() => import("./pages/admin/apps/Coupon"));
const Toss = lazy(() => import("./pages/admin/apps/TossCoin"));

const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const dispatch = useDispatch();
  const [uid, setUid] = useState("");

  const { data, error } = useGetUserQuery(uid, {
    skip: !uid,
  });

  const { user, loading } = useSelector(
    (state: { userReducer: UserReducerInitialState }) => state.userReducer
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        dispatch(userNotExist());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (data?.user) {
      dispatch(userExist(data.user));
    } else if (error) {
      // Only dispatch userNotExist if there's a real error
      dispatch(userNotExist());
    }
  }, [data, error, dispatch]);
  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          {/* Not logged in */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Logged in user routes */}
          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>

          {/* admin routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminRoute={true}
                isAdmin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/customers" element={<Customer />} />
            <Route path="/admin/transactions" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />

            {/* Charts */}
            <Route path="/admin/charts/bar" element={<BarCharts />} />
            <Route path="/admin/charts/pie" element={<PieCharts />} />
            <Route path="/admin/charts/line" element={<LineCharts />} />

            {/* Apps */}
            <Route path="/admin/apps/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/apps/coupon" element={<Coupon />} />
            <Route path="/admin/apps/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/products/new" element={<NewProduct />} />
            <Route path="/admin/products/:id" element={<ProductManagement />} />

            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route
              path="/admin/discount/:id"
              element={<DiscountManagement />}
            />
            <Route
              path="/admin/transactions/:id"
              element={<TransactionManagement />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
