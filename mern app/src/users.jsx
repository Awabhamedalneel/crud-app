import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3400/getusers");
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!id) {
            console.error('Invalid user ID for deletion');
            setError('Invalid user ID. Please try again.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await axios.delete(`http://localhost:3400/deleteuser/${id}`);
                
                if (response.status === 200) {
                    // Only refresh if the deletion was successful
                    await fetchUsers();
                } else {
                    throw new Error('Failed to delete user');
                }
            } catch (err) {
                console.error('Error deleting user:', err);
                const errorMessage = err.response?.data?.message || 'Failed to delete user. Please try again.';
                setError(errorMessage);
                
                // Clear the error after 5 seconds
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex vh-100 justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-0 text-primary">
                                    <FaUser className="me-2" />
                                    Users List
                                </h2>
                                <Link to="/create" className='btn btn-primary btn-lg'>
                                    <FaUserPlus className="me-2" />
                                    Add New User
                                </Link>
                            </div>
                            
                            <div className="card-body p-0">
                                {error && (
                                    <div className="alert alert-danger m-4" role="alert">
                                        {error}
                                    </div>
                                )}

                                {users.length === 0 ? (
                                    <div className="text-center p-5">
                                        <div className="mb-3">
                                            <FaUser size={48} className="text-muted" />
                                        </div>
                                        <h4 className="text-muted mb-3">No users found</h4>
                                        <p className="text-muted mb-0">Get started by adding a new user</p>
                                        <Link to="/create" className="btn btn-primary mt-3">
                                            <FaUserPlus className="me-2" />
                                            Add Your First User
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="bg-light">
                                                <tr>
                                                    <th className="ps-4">
                                                        <span className="d-flex align-items-center">
                                                            <FaUser className="me-2 text-primary" />
                                                            Name
                                                        </span>
                                                    </th>
                                                    <th>
                                                        <span className="d-flex align-items-center">
                                                            <FaEnvelope className="me-2 text-primary" />
                                                            Email
                                                        </span>
                                                    </th>
                                                    <th className="text-center">
                                                        <span className="d-flex align-items-center justify-content-center">
                                                            <FaBirthdayCake className="me-2 text-primary" />
                                                            Age
                                                        </span>
                                                    </th>
                                                    <th className="text-end pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map((user) => (
                                                    <tr key={user._id} className="user-row">
                                                        <td className="ps-4 fw-medium">
                                                            <div className="d-flex align-items-center">
                                                                <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                {user.name}
                                                            </div>
                                                        </td>
                                                        <td className="text-muted">
                                                            <a href={`mailto:${user.email}`} className="text-decoration-none">
                                                                {user.email}
                                                            </a>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge bg-primary bg-opacity-10 text-primary p-2">
                                                                {user.age} years
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <div className="btn-group" role="group">
                                                                <Link 
                                                                    to={`/update/${user._id}`} 
                                                                    className="btn btn-outline-primary btn-sm me-2"
                                                                    title="Edit user"
                                                                >
                                                                    <FaEdit className="me-1" />
                                                                    Edit
                                                                </Link>
                                                                <button 
                                                                    onClick={() => handleDelete(user._id)}
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    title="Delete user"
                                                                >
                                                                    <FaTrash className="me-1" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            
                            {users.length > 0 && (
                                <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
                                    <div className="text-muted small">
                                        Showing <span className="fw-semibold">{users.length}</span> user{users.length !== 1 ? 's' : ''}
                                    </div>
                                  
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .user-row {
                    transition: all 0.2s ease;
                }
                .user-row:hover {
                    background-color: rgba(13, 110, 253, 0.05) !important;
                    transform: translateX(4px);
                }
                .table > :not(caption) > * > * {
                    padding: 1rem 0.5rem;
                }
                .card {
                    border-radius: 0.75rem;
                    overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                .card:hover {
                    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
                }
            `}</style>
        </div>
    );
};

export default Users;