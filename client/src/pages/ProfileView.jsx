import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-overlay">Loading...</div>;
  if (error) return <div className="error-text">{error}</div>;
  if (!user) return null;

  return (
    <div className="card container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="btn btn-primary" onClick={() => navigate('/profile/edit')}>
          Edit Profile
        </button>
      </div>

      <div className="avatar-container">
        <img 
          src={user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
          alt="Profile" 
          className="avatar" 
        />
        <h2>{user.name}</h2>
        <p>{user.bio || 'No bio provided'}</p>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <label>Phone</label>
          <div>{user.phone}</div>
        </div>
        <div className="info-item">
          <label>Location</label>
          <div>{user.location}</div>
        </div>
        <div className="info-item">
          <label>Date of Birth</label>
          <div>{new Date(user.dateOfBirth).toLocaleDateString()}</div>
        </div>
        <div className="info-item">
          <label>Social Links</label>
          <div>
            {user.socialLinks ? (
              <a href={user.socialLinks} target="_blank" rel="noopener noreferrer">
                {user.socialLinks}
              </a>
            ) : 'None'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
