import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, updateAvatar } from '../services/api';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    location: '',
    dateOfBirth: '',
    socialLinks: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      const user = response.data;
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        socialLinks: user.socialLinks || ''
      });
      setAvatarPreview(user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`);
    } catch (err) {
      showNotification('error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    // Simple age check
    if (formData.dateOfBirth) {
       const dob = new Date(formData.dateOfBirth);
       const ageDifMs = Date.now() - dob.getTime();
       const ageDate = new Date(ageDifMs);
       const age = Math.abs(ageDate.getUTCFullYear() - 1970);
       if (age < 13) newErrors.dateOfBirth = 'You must be at least 13 years old';
    }

    if (formData.socialLinks && !/^https?:\/\//.test(formData.socialLinks)) {
        newErrors.socialLinks = 'URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optimistic preview
    setAvatarPreview(URL.createObjectURL(file));

    const data = new FormData();
    data.append('avatar', file);

    try {
      const res = await updateAvatar(data);
      // Update with server URL to ensure consistency
      setAvatarPreview(res.data.avatar); 
      showNotification('success', 'Avatar updated successfully');
    } catch (err) {
      showNotification('error', 'Failed to update avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await updateProfile(formData);
      showNotification('success', 'Profile updated successfully');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) return <div className="loading-overlay">Loading...</div>;

  return (
    <div className="card container">
      {notification && (
        <div className={`toast ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <h1>Edit Profile</h1>
      
      <div className="avatar-container">
        <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
        <label className="avatar-upload-label" htmlFor="avatar-upload">
          Change Photo
        </label>
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          className="avatar-upload-input"
          onChange={handleAvatarChange}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Name *</label>
          <input 
            className="form-input" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea 
            className="form-input" 
            name="bio" 
            rows="3"
            value={formData.bio} 
            onChange={handleChange}
            maxLength={500} 
          />
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#999' }}>
            {formData.bio.length}/500
          </div>
        </div>

        <div className="info-grid">
          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input 
              className="form-input" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <input 
              className="form-input" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
            />
            {errors.location && <div className="error-text">{errors.location}</div>}
          </div>
        </div>

        <div className="info-grid">
            <div className="form-group">
            <label className="form-label">Date of Birth *</label>
            <input 
                type="date"
                className="form-input" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleChange} 
            />
            {errors.dateOfBirth && <div className="error-text">{errors.dateOfBirth}</div>}
            </div>

            <div className="form-group">
            <label className="form-label">Social Links (URL)</label>
            <input 
                className="form-input" 
                name="socialLinks" 
                value={formData.socialLinks} 
                onChange={handleChange} 
                placeholder="https://..."
            />
            {errors.socialLinks && <div className="error-text">{errors.socialLinks}</div>}
            </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/profile')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
