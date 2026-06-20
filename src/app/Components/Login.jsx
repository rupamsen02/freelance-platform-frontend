"use client";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";

function Login() {
  const [openModal, setOpenModal] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
  });
  const [file, setFile] = useState(null);

  const clearLoginFields = () => {
    setIdentifier("");
    setPassword("");
    setError(null);
  };

  const resetJoinForm = () => {
    setUser({
      username: "",
      email: "",
      password: "",
      img: "",
      country: "",
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          identifier,
          password,
        },
        {
          withCredentials: true,
        },
      );

      localStorage.setItem("currentUser", JSON.stringify(res.data));

      toast.success("Login successful!");
      clearLoginFields();
      document.getElementById("login_modal")?.close();
      window.location.reload();
    } catch (err) {
      console.log("Login error", err);
      if (err.response) {
        const message =
          err.response.data?.message || "Login failed. Please try again.";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", user.username);
    data.append("email", user.email);
    data.append("password", user.password);
    data.append("country", user.country);
    if (file) data.append("img", file);

    try {
      await axios.post(`${API_URL}/api/auth/register`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Signup successful");
      document.getElementById("join_modal")?.close();
      resetJoinForm();
    } catch (err) {
      console.log("Signup error", err);
      toast.error("Signup failed! Please try again.");
    }
  };

  useEffect(() => {
    const handleOpenLogin = () => {
      setOpenModal(true);
    };

    window.addEventListener("openLoginModal", handleOpenLogin);
    return () => {
      window.removeEventListener("openLoginModal", handleOpenLogin);
    };
  }, []);

  return (
    <div>
      <div
        className="hover:underline cursor-pointer sm:pb-0 pb-4"
        onClick={() => setOpenModal(true)}
      >
        Sign in
      </div>
      {openModal && (
        <div className="fixed inset-0 z-[9999] lg:bg-black/30 flex flex-col items-center jusitfy-start mt-30 md:mt-0 sm:justify-center p-4">
          <div className="border-animation rounded-3xl">
            <div className="relative flex flex-col justify-center bg-white rounded-3xl w-150 md:w-220 h-140 md:h-160 max-w-100 md:max-w-[760px] lg:max-w-[900px] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gray-500/5" />
              <form className="">
                <button
                  className="absolute z-50 right-2 top-2 text-lg text-gray-500 hover:text-black cursor-pointer btn btn-circle btn-ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    clearLoginFields();
                    setOpenModal(false);
                  }}
                >
                  ✕
                </button>

                <div className="relative flex flex-col md:flex-row w-full">
                  <img
                    src="/login-signup-image.jpg"
                    alt="login illustration"
                    className="hidden md:block md:w-[50%] h-180 object-cover"
                  />

                  <div className="flex flex-col justify-center w-[100%] md:w-[50%] px-10 lg:px-12 py-10">
                    <h3 className="font-bold px-6 text-2xl mb-4">
                      Sign in to your account
                    </h3>

                    <div className="flex flex-col w-full px-6">
                      <input
                        type="text"
                        placeholder="Username or email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="border-b border-black w-full outline-0 mb-4 p-3 pl-8"
                      />

                      <span className="absolute pt-3.5 sm:pt-3 lg:pt-4 px-1">
                        <FaUser />
                      </span>

                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-b border-black w-full outline-0 mb-4 p-3 pl-8"
                      />

                      <span className="absolute pt-21 md:pt-18 lg:pt-20 px-1">
                        <FaLock />
                      </span>

                      <button
                        onClick={handleLoginSubmit}
                        className="w-full h-10 bg-black text-white rounded-md cursor-pointer hover:bg-gray-900 mt-1 font-semibold"
                      >
                        Login
                      </button>

                      {/* Demo Credentials */}
                      <div className="mt-4 p-3 bg-gray-100 rounded-md text-sm">
                        <p className="font-semibold text-gray-700 mb-2">
                          Demo Accounts
                        </p>

                        <div className="mb-2">
                          <p>
                            <strong>Client</strong>
                          </p>
                          <p>Username: dolan</p>
                          <p>Email: dolan@gmail.com</p>
                          <p>Password: 12345678</p>
                        </div>

                        <div>
                          <p>
                            <strong>Freelancer</strong>
                          </p>
                          <p>Username: rupamsen76</p>
                          <p>Email: rupamsen195@gmail.com</p>
                          <p>Password: 12345678</p>
                        </div>
                      </div>

                      {error && (
                        <div className="text-gray-500 text-sm mt-2">
                          {typeof error === "string"
                            ? error
                            : error.message || "Login failed"}
                        </div>
                      )}

                      <div className="relative mb-10 mt-4">
                        Don't have an account?{" "}
                        <span
                          className="text-blue-500 underline cursor-pointer"
                          onClick={() => {
                            setOpenModal(false);
                            window.dispatchEvent(new Event("openJoinModal"));
                          }}
                        >
                          Join here
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
