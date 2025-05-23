import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useLoginMutation } from "../redux/api/userApi";
import { userExist } from "../redux/reducers/userReducer";
import { MessageResponse } from "../types/api-types";

const Login = () => {
  const [gender, setGender] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const res = await login({
        name: user.displayName!,
        email: user.email!,
        gender,
        photo: user.photoURL!,
        role: "user",
        dob: date,
        _id: user.uid,
      });

      if (res?.data?.success) {
        toast.success(res.data.message);
        if (res.data.user) {
          dispatch(userExist(res.data.user));
        }
        navigate("/");
      } else {
        const error = res.error as FetchBaseQueryError | undefined;
        const message =
          error &&
          error.data &&
          typeof error.data === "object" &&
          "message" in error.data
            ? (error.data as MessageResponse).message
            : "Login failed";

        toast.error(message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Server error");
    }
  };

  return (
    <div className="login">
      <main>
        <h1 className="heading">Login</h1>
        <div>
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <p>Already Signed In Once</p>
          <button onClick={handleLogin}>
            <FcGoogle /> <span>Sign in with google</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
