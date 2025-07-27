import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3400";

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/getusers/${id}`);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          age: response.data.age,
        });
        setErrors({});
      } catch (err) {
        console.error("Error fetching user:", err);
        setErrors((prev) => ({
          ...prev,
          fetch: "Failed to load user data. Please try again.",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.put(`${API_URL}/updateuser/${id}`, formData);
      navigate("/");
    } catch (err) {
      console.error("Error updating user:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to update user. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="card shadow" style={{ width: "100%", maxWidth: "500px" }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 text-primary">
            Update User
          </h2>
          
          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}
          
          {errors.fetch && (
            <div className="alert alert-danger" role="alert">
              {errors.fetch}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                Name
              </label>
              <input
                type="text"
                className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
              {errors.name && (
                <div className="invalid-feedback">
                  {errors.name}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">
                Email Address
              </label>
              <input
                type="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="age" className="form-label fw-bold">
                Age
              </label>
              <input
                type="number"
                className={`form-control form-control-lg ${errors.age ? 'is-invalid' : ''}`}
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="1"
                max="120"
                required
              />
              {errors.age && (
                <div className="invalid-feedback">
                  {errors.age}
                </div>
              )}
            </div>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg me-md-2"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>{" "}
    </div>
  );
};

export default UpdateUser;
