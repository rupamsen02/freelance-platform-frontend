"use client";
import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import { AiFillPicture } from "react-icons/ai";

function Step1({ data, onChange, onNext, file, setFile }) {
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const debouncedCheckUsername = useCallback(
    debounce(async (username) => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/users/check/exists",
          {
            params: { username },
          }
        );
        setUsernameError(
          res.data.usernameTaken ? "Username is already taken!" : ""
        );
      } catch (err) {
        console.error("Username check failed:", err);
      }
    }, 500),
    []
  );

  const debouncedCheckEmail = useCallback(
    debounce(async (email) => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/users/check/exists",
          {
            params: { email },
          }
        );
        setEmailError(res.data.emailTaken ? "Email is already taken!" : "");
      } catch (err) {
        console.error("Email check failed:", err);
      }
    }, 500),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(e); 

    if (name === "username") {
      setUsernameError(""); 
      if (value.trim() === "") {
        setUsernameError("");
      } else {
        debouncedCheckUsername(value);
      }
    }

    if (name === "email") {
      setEmailError(""); 
      if (value.trim() === "") {
        setEmailError("");
      } else {
        debouncedCheckEmail(value);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        "http://localhost:8800/api/users/check/exists",
        {
          params: {
            username: data.username,
            email: data.email,
          },
        }
      );

      const { usernameTaken, emailTaken } = res.data;

      setUsernameError(usernameTaken ? "Username is already taken!" : "");
      setEmailError(emailTaken ? "Email is already taken!" : "");

      if (!usernameTaken && !emailTaken) {
        setError("");
        onNext();
      }
    } catch (err) {
      console.error("Submit check failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div className="hidden md:block w-1/2">
        <img src="/login.jpg" alt="signup" className="h-[90vh] object-cover" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full md:w-80 mx-auto p-6"
      >
        <h3 className="text-2xl text-left font-bold mb-4">
          Create a new account
        </h3>

        <div>
          <span className="absolute pt-3 px-1">
            <FaUser />
          </span>
          <input
            name="username"
            value={data.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-67 outline-none p-2 border-b px-8"
          />
          {usernameError && (
            <p className="text-gray-500 mx-1 text-sm mt-1">{usernameError}</p>
          )}
        </div>

        <div>
          <span className="absolute pt-3 px-1">
            <IoMail />
          </span>
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-67 outline-none p-2 border-b px-8"
          />
          {emailError && (
            <p className="text-gray-500 mx-1 text-sm mt-1">{emailError}</p>
          )}
        </div>

        <span className="absolute pt-3 px-1">
          <FaLock />
        </span>
        <input
          name="password"
          type="password"
          value={data.password}
          onChange={onChange}
          placeholder="Password"
          required
          className="w-67 outline-none p-2 border-b px-8"
        />

        <div>
          <span className="absolute pt-9 px-2">
            <AiFillPicture />
          </span>

          <label className="block mb-1 font-medium">Profile Picture</label>
          <input
            type="file"
            name="img"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-8
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50
                hover:file:bg-gray-200"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-900"
        >
          Create My Account
        </button>

        <p className="mx-4 -mt-4 py-4 text">
          Already have an account?{" "}
          <span
            onClick={() => {
              document.getElementById("join_modal")?.close();
              document.getElementById("login_modal")?.showModal();
            }}
            className="text-blue-600 underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

function Step2({ data, onSelectRole, onNext, onBack }) {
  return (
    <div className="space-y-6 mt-20 pb-10">
      <h3 className="text-2xl font-bold text-center">
        How do you want to use the platform?
      </h3>

      <div className="flex justify-center px-10 gap-6">
        <button
          onClick={() => onSelectRole("client")}
          className={`bg-base-100 hover:bg-gray-100 border ${
            data.role === "client" ? "border-black" : "border-gray-400"
          } py-8 px-8 w-72 h-52 rounded flex flex-col items-center justify-center gap-3`}
        >
          <img
            src="client.png"
            alt="client"
            className="w-24 h-24 object-contain"
          />
          <section className="text-lg">I'm a Client</section>
        </button>

        <button
          onClick={() => onSelectRole("freelancer")}
          className={`bg-base-100 hover:bg-gray-100 border ${
            data.role === "freelancer" ? "border-black" : "border-gray-400"
          } py-8 px-8 w-72 h-52 rounded flex flex-col items-center justify-center gap-3`}
        >
          <img
            src="freelancer.png"
            alt="freelancer"
            className="w-16 h-16 object-contain"
          />
          <section className="text-lg mt-6">I'm a Freelancer</section>
        </button>
      </div>

      <div className="flex justify-between mt-10 px-8">
        <button
          onClick={onBack}
          className="py-2 px-4 bg-black text-white hover:bg-gray-900 rounded-sm border-1"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.role}
          className={`py-2 px-4 rounded-sm bg-black text-white hover:bg-gray-900 border-1 ${
            !data.role ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step3({ data, onSelect, onNext, onBack }) {
  const options =
    data.role === "freelancer"
      ? [
          { label: "A Side Hustle", icon: "A side hustle.png" },
          { label: "Solo Freelancer", icon: "solo freelancer.png" },
          { label: "Agency Employee", icon: "agency employee.png" },
          { label: "Agency Owner", icon: "agency owner.png" },
        ]
      : [
          {
            label: "Primary Job or Business",
            icon: "primary job or business.png",
          },
          { label: "Secondary Business", icon: "secondary business.png" },
          { label: "Non-Business Needs", icon: "non-business needs.png" },
        ];

  return (
    <div className="space-y-6 mt-20 pb-10">
      <h3 className="text-2xl font-bold text-center">
        {data.role === "freelancer"
          ? "What type of freelancer are you?"
          : "What best describes your need?"}
      </h3>

      <div className="flex px-10 gap-4 justify-center">
        {options.map((opt) => {
          const isSelected = data.goalType === opt.label;
          return (
            <button
              key={opt.label}
              onClick={() => onSelect(opt.label)}
              className={`border py-6 px-8 w-42 h-52 rounded text-center flex flex-col items-center justify-center gap-4 transition-all
                ${
                  isSelected
                    ? "border-black bg-blue-50"
                    : "border-gray-400 hover:bg-gray-100"
                }`}
            >
              <img
                src={opt.icon}
                alt={opt.label}
                className="w-16 h-16 object-contain"
              />
              <span className="text-lg">{opt.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-10 px-8">
        <button
          onClick={onBack}
          className="py-2 px-4 border bg-black text-white hover:bg-gray-900 rounded-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.goalType}
          className={`py-2 px-4 border bg-black text-white hover:bg-gray-900 rounded-sm ${
            !data.goalType ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step4({ data, onSelect, onNext, onBack }) {
  const sizes =
    data.role === "freelancer"
      ? [
          "I'm just getting started",
          "Freelance online",
          "Freelance offline",
          "Both online and offline",
        ]
      : ["Just me", "2-10", "11-50", "51-500", "500+"];

  const imageMap = {
    "I'm just getting started": "i'm just getting started.png",
    "Freelance online": "freelance online.png",
    "Freelance offline": "freelance offline.png",
    "Both online and offline": "both online and offline.png",
    "Just me": "one user.png",
    "2-10": "two users.png",
    "11-50": "three users.png",
    "51-500": "four users.png",
    "500+": "enterprise.png",
  };

  return (
    <div className="space-y-6 mt-20 pb-10">
      <h3 className="text-2xl font-bold text-center">
        {data.role === "freelancer"
          ? "What's your current freelancing experience?"
          : "How many people work in your company?"}
      </h3>

      <div className="flex justify-center gap-4 px-10">
        {sizes.map((sz) => {
          const isSelected = data.teamSize === sz;
          return (
            <button
              key={sz}
              onClick={() => onSelect(sz)}
              className={`border py-6 px-8 w-42 h-52 rounded text-center flex flex-col items-center gap-4 transition-all
                ${
                  isSelected
                    ? "border-black bg-blue-50"
                    : "border-gray-400 hover:bg-gray-100"
                }`}
            >
              <img
                src={imageMap[sz]}
                className="h-16 w-16 pt-6 object-contain"
              />
              <span className="text-sm">{sz}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between mt-10 px-8">
        <button
          onClick={onBack}
          className="py-2 px-4 bg-black text-white hover:bg-gray-900 border rounded-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.teamSize}
          className={`py-2 px-4 border bg-black text-white hover:bg-gray-900 rounded-sm ${
            !data.teamSize ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step5({ data, onSelect, onNext, onBack }) {
  const intents = [
    { label: "Start a Project", icon: "start a project.png" },
    { label: "Hire a Specific Service", icon: "hire a specific service.png" },
    { label: "Just Exploring", icon: "just exploring.png" },
  ];

  return (
    <div className="space-y-6 mt-20 pb-10">
      <h3 className="text-2xl font-bold text-center">
        What would you like to do first?
      </h3>
      <div className="flex px-10 gap-6 flex-wrap justify-center">
        {intents.map((item) => {
          const isSelected = data.intent === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onSelect(item.label)}
              className={`border py-6 px-8 w-52 h-52 rounded text-center flex flex-col items-center justify-center gap-4 transition-all
                ${
                  isSelected
                    ? "border-black bg-blue-50"
                    : "border-gray-400 hover:bg-gray-100"
                }`}
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-16 h-16 object-contain"
              />
              <span className="text-lg">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="flex justify-between  mt-10 px-8">
        <button
          onClick={onBack}
          className="py-2 px-4 border bg-black text-white hover:bg-gray-900 rounded-sm"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!data.intent}
          className={`py-2 px-4 border bg-black text-white hover:bg-gray-900 rounded-sm ${
            !data.intent ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function Step6({ data, onSubmitFinal, onClose }) {
  const router = useRouter();

  const handleGetStarted = async () => {
    await onSubmitFinal();
    
    setTimeout(() => {
      router.push("/freelancer/profile");
    }, 1000);
    onClose(); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 mt-20 mb-20">
      <h2 className="text-3xl font-bold">Welcome, {data.username}!</h2>
      {data.role === "freelancer" ? (
        <>
          <p className="text-center">You’re now registered as a Freelancer.</p>
          <ul className="list text-center">
            <li>✔ Complete your profile</li>
            <li>✔ Create your 1st gig</li>
            <li>✔ Publish it to start selling</li>
          </ul>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGetStarted}
              className="bg-black text-white px-6 py-3 cursor-pointer rounded"
            >
              Complete Your Profile
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="">
            <p className="text-center">You are now set as a Client.</p>
            <button
              onClick={async () => {
                await onSubmitFinal();
                toast.success("Signup successfull!");
                setTimeout(() => {
                  router.push("/client/gigs");
                }, 1000);
                onClose();
              }}
              className="bg-black text-white px-6 py-3 mx-22 mt-4 cursor-pointer rounded"
            >
              Start Exploring
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function JoinOnboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    role: "",
    goalType: "",
    teamSize: "",
    intent: "",
  });
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleOpen = () => document.getElementById("join_modal")?.showModal();

  const handleClose = () => {
    document.getElementById("join_modal")?.close();
    setStep(1);
    setData({
      username: "",
      email: "",
      password: "",
      img: "",
      role: "",
      goalType: "",
      teamSize: "",
      intent: "",
    });
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStep1 = () => setStep(2);
  const handleRoleSelect = (role) => {
    setData((prev) => ({ ...prev, role }));
  };
  const handleGoalSelect = (goalType) => {
    setData((prev) => ({ ...prev, goalType }));
    setStep(4);
  };
  const handleTeamSelect = (teamSize) => {
    setData((prev) => ({ ...prev, teamSize }));
    if (data.role === "freelancer") {
      setStep(6);
    } else {
      setStep(5);
    }
  };
  const handleIntentSelect = (intent) => {
    setData((prev) => ({ ...prev, intent }));
    setStep(6);
  };

  const handleFinalSubmit = async () => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);
    formData.append("goalType", data.goalType);
    formData.append("teamSize", data.teamSize);
    formData.append("intent", data.intent);
    if (file) {
      formData.append("img", file);
    }

    try {
      await axios.post("http://localhost:8800/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const loginRes = await axios.post(
        "http://localhost:8800/api/auth/login",
        {
          username: data.username,
          password: data.password,
        },
        { withCredentials: true }
      );

      localStorage.setItem("currentUser", JSON.stringify(loginRes.data));
    } catch (err) {
      console.error("Signup/Login error", err);

      
      if (
        err.response &&
        err.response.data &&
        err.response.data.message?.toLowerCase().includes("already")
      ) {
        toast.error(
          "User already exists. Please use a different email/username."
        );
      } else {
        toast.error(err.response?.data?.message || "Signup/Login failed");
      }

      return; 
    }
  };

  return (
    <div>
      <button onClick={handleOpen} className=" hover:underline">
        Become a seller
      </button>


      <dialog id="join_modal" className="modal">
        <div className="modal-box relative p-0 max-w-[120vh] max-h-[100vh]">
          <button
            onClick={handleClose}
            className="absolute top-1 right-1 btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>

          {step === 1 && (
            <Step1
              data={data}
              onChange={handleChange}
              onNext={handleSubmitStep1}
              file={file}
              setFile={setFile}
            />
          )}
          {step === 2 && (
            <Step2
              data={data}
              onSelectRole={handleRoleSelect}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3
              data={data}
              onSelect={(goalType) =>
                setData((prev) => ({ ...prev, goalType }))
              }
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && (
            <Step4
              data={data}
              onSelect={(teamSize) =>
                setData((prev) => ({ ...prev, teamSize }))
              }
              onNext={() => setStep(data.role === "freelancer" ? 6 : 5)}
              onBack={() => setStep(3)}
            />
          )}

          {step === 5 && data.role === "client" && (
            <Step5
              data={data}
              onSelect={(intent) => setData((prev) => ({ ...prev, intent }))}
              onNext={() => setStep(6)}
              onBack={() => setStep(4)}
            />
          )}
          {step === 6 && (
            <Step6
              data={data}
              onSubmitFinal={handleFinalSubmit}
              onClose={handleClose}
            />
          )}
        </div>
      </dialog>
    </div>
  );
}
