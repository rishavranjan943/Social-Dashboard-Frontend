import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css'; 

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    socialMediaHandle: '',
    images: []
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const { name, socialMediaHandle, images } = formData;

  const onChange = e => {
    if (e.target.name === 'images') {
      setFormData({ ...formData, images: e.target.files });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const data = new FormData();
    data.append('name', name);
    data.append('socialMediaHandle', socialMediaHandle);
    for (let i = 0; i < images.length; i++) {
      data.append('images', images[i]);
    }

    try {
      await axios.post('https://social-dashboard-backend.onrender.com/api/users/submit', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Submission successful!');
      setFormData({
        name: '',
        socialMediaHandle: '',
        images: []
      });
    } catch (err) {
      console.error('Error submitting form:', err.response.data);
      setMessage(err.response.data.message || 'Error submitting form.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>User Submission Form</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Social Media Handle:</label>
          <input
            type="text"
            name="socialMediaHandle"
            value={socialMediaHandle}
            onChange={onChange}
            required
            placeholder="Enter your social media handle"
          />
        </div>
        <div className="form-group">
          <label>Upload Images:</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" disabled={uploading}>
          {uploading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
