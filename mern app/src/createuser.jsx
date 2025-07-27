        import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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
      await axios.post("http://localhost:3400/createusers", formData);
      navigate("/");
    } catch (err) {
      console.error('Error creating user:', err);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create user. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
      };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 text-primary">Add New User</h2>
          
          {errors.submit && (
            <div className="alert alert-danger" role="alert">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">Name</label>
              <input 
                type="text" 
                className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                id="name" 
                name="name" 
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <div className="invalid-feedback">
                  {errors.name}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email Address</label>
              <input 
                type="email" 
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                id="email" 
                name="email" 
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="age" className="form-label fw-bold">Age</label>
              <input 
                type="number" 
                className={`form-control form-control-lg ${errors.age ? 'is-invalid' : ''}`}
                id="age" 
                name="age" 
                placeholder="Enter age"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
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
                onClick={() => navigate('/')}
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
                    Adding...
                  </>
                ) : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;