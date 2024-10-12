import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import './AdminDashboard.css';
import { AuthContext } from '../contexts/AuthContext';
import io from 'socket.io-client';

const socket = io('https://social-dashboard-backend.onrender.com'); 

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext); 
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/admin/dashboard');
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); 
    socket.on('newSubmission', (newUser) => {
      setUsers(prevUsers => [newUser, ...prevUsers]);
    });

    return () => {
      socket.off('newSubmission');
    };
  }, [auth.token]); 

  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p>Error loading submissions.</p>;

  return (
    <div className="admin-dashboard-container">
      {users.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Social Media Handle</th>
                <th>Uploaded Images</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.socialMediaHandle}</td>
                  <td>
                    <div className="images-container">
                      {user.images.map((image, index) => (
                        <a
                          key={index}
                          href={`${axiosInstance.defaults.baseURL.replace('/api', '')}/uploads/${image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={`${axiosInstance.defaults.baseURL.replace('/api', '')}/uploads/${image}`}
                            alt={`uploaded-${index}`}
                            className="thumbnail"
                          />
                        </a>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
