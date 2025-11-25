import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getImageSrc } from "../ImageHelper";

const Form = ({ setOpenEditProfile }) => {
  const user = useSelector((store) => store.user);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Name is required")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    lastName: Yup.string().matches(
      /^[a-zA-Z\s]*$/,
      "Name can only contain letters and spaces"
    ),
    photo: Yup.string().required("Photo is required"),
    about: Yup.string().required("About is required"),
    skills: Yup.array()
      .min(1, "Add at least one skill")
      .max(8, "Maximum 8 skills can be added"),
    age: Yup.string().required("Age is required"),
    gender: Yup.string().required("Select your gender"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName ? user.firstName : "",
      lastName: user?.lastName ? user.lastName : "",
      photo: user?.photo ? getImageSrc(user.photo) : "",
      about: user?.about ? user.about : "",
      skills: user?.skills ? user.skills : [],
      age: user?.age ? user.age : "",
      gender: user?.gender ? user.gender : "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
    validateOnChange: true,
  });

  const handleSubmit = async (values) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/profile/edit`,
        values,
        {
          headers: { "Content-Type": "multipart/form-data" },

          withCredentials: true,
        }
      );

      if (
        response.data.msg &&
        response.data.msg.includes("your details updated successfully")
      ) {
        setSuccessMsg(response.data.msg);
        setOpenEditProfile(false);
        dispatch(addUser(response.data.safeLoggedUserData));
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err) {
      if (err?.response?.data?.err === "Token is not valid") {
        setError("Token expired please login again");
        navigate("/login");
      } else {
        setError(
          err?.response?.data?.error || err.message || "Something went wrong"
        );
      }
    }
  };

  const handleAddSkill = () => {
    const input = document.getElementById("skillInput");
    const value = input.value.trim();

    if (!value) return;

    formik.setFieldValue("skills", [...formik.values.skills, value]);
    input.value = "";
  };

  useEffect(() => {
    if (error || successMsg) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMsg("");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, successMsg]);

  return (
    <>
      <div className="flex flex-col gap-4 py-7 md:p-6 px-4 card bg-base-100 w-96 shadow-sm ">
        <div>
          <label className="floating-label">
            <span>First Name</span>
            <input
              type="text"
              placeholder="Enter your first name"
              className="input input-md w-full"
              value={formik.values.firstName}
              onChange={(e) => {
                formik.setFieldTouched("firstName", false, false);
                formik.setFieldValue("firstName", e.target.value);
              }}
            />
          </label>
          {formik.touched.firstName && formik.errors.firstName && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.firstName}
            </span>
          )}
        </div>

        <div>
          <label className="floating-label">
            <span>Last Name</span>
            <input
              type="text"
              placeholder="Enter your last name"
              className="input input-md w-full"
              value={formik.values.lastName}
              onChange={(e) => {
                formik.setFieldTouched("lastName", false, false);
                formik.setFieldValue("lastName", e.target.value);
              }}
            />
          </label>
          {formik.touched.lastName && formik.errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.lastName}
            </span>
          )}
        </div>

        <div className="w-full max-w-full">
          <label className="block text-xs mb-1">Upload Photo</label>

          <label htmlFor="photo" className="input input-md w-full">
            {formik.values.photo
              ? formik.values.firstName + " image uploaded"
              : "Choose File"}
          </label>

          <input
            id="photo"
            type="file"
            accept="image/*"
            className="hidden "
            onChange={(e) => formik.setFieldValue("photo", e.target.files[0])}
          />
          {formik.touched.photo && formik.errors.photo && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.photo}
            </span>
          )}
        </div>

        <div>
          <label className="floating-label">
            <span>Age</span>
            <input
              type="text"
              placeholder="Enter your age"
              className="input input-md w-full"
              value={formik.values.age}
              onChange={(e) => {
                formik.setFieldTouched("age", false, false);
                formik.setFieldValue("age", e.target.value);
              }}
            />
          </label>
          {formik.touched.age && formik.errors.age && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.age}
            </span>
          )}
        </div>

        {/* Gender select */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            className="select select-md w-full"
            value={formik.values.gender}
            onChange={(e) => {
              formik.setFieldTouched("gender", false, false);
              formik.setFieldValue("gender", e.target.value);
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.gender}
            </span>
          )}
        </div>

        <div>
          <label className="floating-label">
            <span>About</span>
            <textarea
              className="textarea textarea-md w-full"
              placeholder="Enter about yourself"
              value={formik.values.about}
              onChange={(e) => {
                formik.setFieldTouched("about", false, false);
                formik.setFieldValue("about", e.target.value);
              }}
            />
          </label>
          {formik.touched.about && formik.errors.about && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.about}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <div
            className={`flex flex-wrap ${
              formik.values.skills?.length ? "gap-2 mb-2" : ""
            }`}
          >
            {formik.values.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-100 text-black text-xs px-3 py-1 rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => {
                    const updated = formik.values.skills.filter(
                      (_, i) => i !== index
                    );
                    formik.setFieldValue("skills", updated);
                  }}
                  className="text-sm text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              id="skillInput"
              type="text"
              placeholder="Add a skill"
              className="input input-md flex-1"
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
              className="btn btn-primary"
            >
              Add
            </button>
          </div>

          {formik.touched.skills && formik.errors.skills && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.skills}
            </span>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <button
            className="btn btn-outline"
            onClick={() => {
              setOpenEditProfile(false);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-outline btn-primary"
            onClick={formik.handleSubmit}
          >
            Save Profile
          </button>
        </div>
      </div>

      <div className="toast toast-top toast-center z-50">
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success">
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Form;
