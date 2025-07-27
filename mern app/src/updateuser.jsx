import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3400';

const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: ""
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/getusers/${id}`);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          age: response.data.age
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/updateuser/${id}`, formData);
      navigate('/');
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center align-items-center">
      <div className="card shadow" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 text-primary">Update User</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-bold">Name</label>
              <input 
                type="text" 
                className="form-control form-control-lg" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-bold">Email</label>
              <input 
                type="email" 
                className="form-control form-control-lg" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="age" className="form-label fw-bold">Age</label>
              <input 
                type="number" 
                className="form-control form-control-lg" 
                id="age" 
                name="age" 
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age"
                min="1"
                max="120"
                required
              />
            </div>
            
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-lg me-md-2"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;