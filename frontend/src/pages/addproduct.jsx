// pages/AddProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });
    
    // Preview image
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData for multipart/form-data
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Get token from localStorage
      const token = localStorage.getItem('access');
      
      const response = await axios.post(
        'http://127.0.0.1:8000/api/products/add/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Response:', response.data);
      
      if (response.data.success) {
        toast.success('Product added successfully!');
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          image: null
        });
        setPreview(null);
        
        // Navigate to products page
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please login as admin');
        navigate('/login');
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key]}`);
        });
      } else {
        toast.error('Failed to add product');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Add New Product</h1>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Name */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={styles.input}
            placeholder="Enter product name"
          />
        </div>

        {/* Price */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Price (₹) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            style={styles.input}
            placeholder="Enter price"
          />
        </div>

        {/* Description */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            style={styles.textarea}
            placeholder="Enter product description"
          />
        </div>

        {/* Image */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
          />
          
          {/* Image Preview */}
          {preview && (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.preview} />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    background: '#1a1a1a',
    borderRadius: '8px',
    color: '#fff'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '30px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '0.9rem',
    color: '#888'
  },
  input: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #333',
    background: '#222',
    color: '#fff',
    fontSize: '1rem'
  },
  textarea: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #333',
    background: '#222',
    color: '#fff',
    fontSize: '1rem',
    resize: 'vertical'
  },
  fileInput: {
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #333',
    background: '#222',
    color: '#fff',
    cursor: 'pointer'
  },
  previewContainer: {
    marginTop: '10px',
    textAlign: 'center'
  },
  preview: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '4px'
  },
  button: {
    padding: '14px',
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  buttonDisabled: {
    background: '#666',
    cursor: 'not-allowed'
  }
};

export default AddProduct;