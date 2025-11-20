/* eslint-disable no-unused-vars */
import Lottie from "lottie-react";
import LoginJson from "../../Lotties/Login.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import { useFormik } from "formik";

const SignUp = () => {
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z\s]+$/, "Only letters allowed"),

    lastName: Yup.string().matches(/^[A-Za-z\s]*$/, "Only letters allowed"),

    emailId: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        "Invalid email format"
      ),

    password: Yup.string()
      .required("Password is required")
      .matches(
        // eslint-disable-next-line no-useless-escape
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-\=\[\]\{\}|;:'",\.<>\/\?])[A-Za-z\d!@#\$%\^&\*\(\)_\+\-\=\[\]\{\}|;:'",\.<>\/\?]{8,}$/,
        "Weak password — must include uppercase, lowercase, number & special char"
      ),

    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords do not match"),

    about: Yup.string()
      .required("About is required")
      .matches(
        /^[A-Za-z0-9\s.,'@#!&-]{10,500}$/,
        "Only letters, numbers and basic punctuation"
      )
      .min(10, "Minimum 10 characters")
      .max(500, "Maximum 500 characters"),

    skills: Yup.array()
      .min(1, "Add at least one skill")
      .max(8, "Maximum 8 skills allowed"),

    age: Yup.string()
      .required("Age is required")
      .matches(/^[0-9]{1,2}$/, "Only numbers allowed"),

    gender: Yup.string().required("Select your gender"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      photoUrl: "",
      about: "",
      skills: [],
      age: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleAddSkill = () => {
    const input = document.getElementById("signupSkillInput");
    const value = input.value.trim();

    if (!value) return;

    if (formik.values.skills.length >= 8) return;

    formik.setFieldValue("skills", [...formik.values.skills, value]);
    input.value = "";
  };

  const handleSubmit = async (values) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "")
      );
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/signup`,
        payload,
        {
          withCredentials: true,
        }
      );
      if (res.data.msg === "user added") navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  useEffect(() => {
    if (error) setError("");
  }, [formik.values]);

  // STEP 1 VALIDATION BEFORE GOING NEXT
  const handleNext = async () => {
    const step1Fields = [
      "firstName",
      "lastName",
      "emailId",
      "password",
      "confirmPassword",
    ];

    step1Fields.forEach((f) => formik.setFieldTouched(f, true));
    await formik.validateForm();

    const hasErrors = step1Fields.some((field) => formik.errors[field]);
    if (!hasErrors) setStep(2);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      {/* Left side - Lottie */}
      <div className="flex justify-center items-center md:w-1/2 w-full p-6">
        <Lottie
          animationData={JSON.parse(JSON.stringify(LoginJson))}
          loop
          autoplay
          className="w-[75%] md:w-[80%] max-h-[80vh]"
        />
      </div>

      {/* Right side - Form */}
      <div className="flex justify-center items-center md:w-1/2 w-full p-6">
        <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl p-8 text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
              Create Account ✨
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Step {step} of 2 — Let's get to know you!
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-center space-y-4"
          >
            {/* STEP 1 */}
            {step === 1 && (
              <>
                {/* First Name */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    className="input input-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("firstName")}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <span className="text-red-400 text-xs">
                      {formik.errors.firstName}
                    </span>
                  )}
                </div>

                {/* Last Name */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    className="input input-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("lastName")}
                  />
                </div>

                {/* Email */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="your@gmail.com"
                    className="input input-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("emailId")}
                  />
                  {formik.touched.emailId && formik.errors.emailId && (
                    <span className="text-red-400 text-xs">
                      {formik.errors.emailId}
                    </span>
                  )}
                </div>

                {/* PASSWORD + CONFIRM PASSWORD */}
                <div className="w-[320px] max-w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Password */}
                    <div>
                      <label className="block text-xs mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="Minimum 8 characters"
                        className="input input-sm w-full bg-white/20 border text-white"
                        {...formik.getFieldProps("password")}
                      />
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Re-enter password"
                        className="input input-sm w-full bg-white/20 border text-white"
                        {...formik.getFieldProps("confirmPassword")}
                      />
                    </div>
                  </div>

                  {/* SINGLE FULL-WIDTH ERROR LINE */}
                  {(formik.touched.password && formik.errors.password) ||
                  (formik.touched.confirmPassword &&
                    formik.errors.confirmPassword) ? (
                    <span className="text-red-400 text-xs block mt-1">
                      {formik.errors.password || formik.errors.confirmPassword}
                    </span>
                  ) : null}
                </div>

                {/* NEXT BUTTON */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn w-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white mt-4"
                >
                  Next →
                </button>

                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-sm">
                    Existing user?{" "}
                    <button
                      className="text-fuchsia-400 underline"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                {/* Photo URL */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">Photo URL</label>
                  <input
                    type="text"
                    placeholder="Paste your photo URL"
                    className="input input-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("photoUrl")}
                  />
                </div>

                {/* About */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">About</label>
                  <textarea
                    placeholder="Tell something about yourself"
                    className="textarea textarea-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("about")}
                  />
                  {formik.touched.about && formik.errors.about && (
                    <span className="text-red-400 text-xs">
                      {formik.errors.about}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {/* Skills */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">Skills</label>

                  {/* Selected skills */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formik.values.skills.map((skill, i) => (
                      <div
                        key={i}
                        className="bg-fuchsia-500/20 text-fuchsia-100 text-xs px-2 py-1 rounded-full flex items-center gap-2"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() =>
                            formik.setFieldValue(
                              "skills",
                              formik.values.skills.filter((_, idx) => idx !== i)
                            )
                          }
                          className="text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Input + Add button for mobile support */}
                  <div className="flex gap-2">
                    <input
                      id="signupSkillInput"
                      type="text"
                      placeholder="Add a skill"
                      className="input input-sm bg-white/20 border text-white flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="btn btn-sm bg-fuchsia-500 text-white"
                    >
                      Add
                    </button>
                  </div>

                  {formik.touched.skills && formik.errors.skills && (
                    <span className="text-red-400 text-xs">
                      {formik.errors.skills}
                    </span>
                  )}
                </div>

                {/* Age */}
                <div className="w-[320px] max-w-full">
                  <label className="block text-xs mb-1">Age</label>
                  <input
                    type="text"
                    placeholder="Enter your age"
                    className="input input-sm w-full bg-white/20 border text-white"
                    {...formik.getFieldProps("age")}
                  />
                  {formik.touched.age && formik.errors.age && (
                    <span className="text-red-400 text-xs">
                      {formik.errors.age}
                    </span>
                  )}
                </div>

                {/* Gender */}
                <div className="w-[320px] max-w-full relative">
                  <button
                    type="button"
                    onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                    className="input input-sm w-full text-left bg-white/20 border text-white flex justify-between"
                  >
                    {formik.values.gender || "Select Gender"}
                  </button>

                  {showGenderDropdown && (
                    <div className="absolute mt-1 w-full bg-[#1e293b] border border-white/20 rounded-lg shadow-lg">
                      {["Male", "Female", "Others"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            formik.setFieldValue("gender", g);
                            setShowGenderDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10"
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-outline w-[150px]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="btn bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white w-[150px]"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
