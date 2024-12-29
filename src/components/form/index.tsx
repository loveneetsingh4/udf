import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import "./index.css";
import CardView from "../email/index";
import UdfLogo from "../../assets/udf.jpeg";

const GoogleForm = () => {
  const [image1, setImage1] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    fname: Yup.string()
      .required("Father's Name is required")
      .min(2, "Father's Name must be at least 2 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    dob: Yup.date()
      .required("Date of birth is required")
      .typeError("Invalid date format")
      .min(new Date(1900, 0, 1), "Date cannot be before 01/01/1900")
      .max(new Date(), "Date cannot be in the future"),
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
    address: Yup.string().required("Address is required"),
    qualification: Yup.string().required("Qualification is required"),
    certify: Yup.boolean().oneOf(
      [true],
      "You must certify that the information provided is correct"
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const uploadImage = async (imageFile: any) => {
    if (!imageFile) return null;
    const storageRef = ref(storage, `images/${imageFile.name}_${Date.now()}`);
    await uploadBytes(storageRef, imageFile);
    return getDownloadURL(storageRef);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if e.target.files is not null
    const files = e.target.files;
    if (files && files.length > 0) {
      setImage1(files[0]); // Set the first file in the state
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const submissionsCollection = collection(db, "users");
      const mobileQuery = query(
        submissionsCollection,
        where("mobile", "==", data.mobile)
      );
      const querySnapshot = await getDocs(mobileQuery);
      if (!querySnapshot.empty) {
        alert("This mobile number is already registered.");
        return;
      }
      const lastDocQuery = query(
        submissionsCollection,
        orderBy("uniqueKey", "desc"),
        limit(1)
      );
      const lastDocSnapshot = await getDocs(lastDocQuery);
      let uniqueKey = 1;

      if (!lastDocSnapshot.empty) {
        const lastDoc = lastDocSnapshot.docs[0];
        uniqueKey = lastDoc.data().uniqueKey + 1; // Increment the last uniqueKey by 1
      }

      if (image1) {
        const image1Url = await uploadImage(image1);
        const formData = { ...data, imageUrl: image1Url, uniqueKey };

        await addDoc(submissionsCollection, {
          ...formData,
          timestamp: serverTimestamp(),
        });

        setSubmittedData(formData);
        alert("Form submitted successfully!");
        reset();
        setImage1(null);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {submittedData ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CardView data={submittedData} />
        </div>
      ) : (
        <div className="google-form-container">
          <div className="logo-container">
            <img src={UdfLogo} alt="Logo" className="logo" />
          </div>

          <h2 className="form-title">JOIN UDF</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="google-form">
            {/* Name */}
            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                {...register("name")}
                className={`input ${errors.name ? "error" : ""}`}
              />
              <p className="error-text">{errors.name?.message}</p>
            </div>

            {/* Father Name */}
            <div className="form-field">
              <label>Father's Name</label>
              <input
                type="text"
                {...register("fname")}
                className={`input ${errors.fname ? "error" : ""}`}
              />
              <p className="error-text">{errors.fname?.message}</p>
            </div>

            {/* Email */}
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                {...register("email")}
                className={`input ${errors.email ? "error" : ""}`}
              />
              <p className="error-text">{errors.email?.message}</p>
            </div>

            {/* Mobile */}
            <div className="form-field">
              <label>Mobile Number</label>
              <input
                type="text"
                {...register("mobile")}
                className={`input ${errors.mobile ? "error" : ""}`}
              />
              <p className="error-text">{errors.mobile?.message}</p>
            </div>

            {/* Date of Birth */}
            <div className="form-field">
              <label>Date of Birth</label>
              <input
                type="date"
                {...register("dob")}
                className={`input ${errors.dob ? "error" : ""}`}
              />
              <p className="error-text">{errors.dob?.message}</p>
            </div>

            {/* Address */}
            <div className="form-field">
              <label>Address</label>
              <textarea
                {...register("address")}
                className={`input ${errors.address ? "error" : ""}`}
              ></textarea>
              <p className="error-text">{errors.address?.message}</p>
            </div>

            {/* Qualification */}
            <div className="form-field">
              <label>Qualification/Institution Details:</label>
              <textarea
                {...register("qualification")}
                className={`input ${errors.qualification ? "error" : ""}`}
              ></textarea>
              <p className="error-text">{errors.qualification?.message}</p>
            </div>

            {/* Image Upload */}
            <div className="form-field">
              <label>Upload Image</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                className="input"
              />
            </div>
            <div className="form-field" style={{ textAlign: "left" }}>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  {...register("certify", {
                    required: "You must certify the information is correct",
                  })}
                  className="checkbox"
                />
                <label className="checkbox-label">
                  I certify that the above-provided information is correct and
                  there is no mistake. I know that all further communication
                  will be done on the above-provided details.
                </label>
              </div>
              <p className="error-text">{errors.certify?.message}</p>
            </div>

            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <button type="submit" className="submit-button">
                Submit
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default GoogleForm;
