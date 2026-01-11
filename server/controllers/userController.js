const fs = require('fs');
const path = require('path');
const { validateProfile } = require('../utils/validation');

const dataPath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

const saveUsers = (data) => {
  const stringifyData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dataPath, stringifyData);
};

exports.getProfile = (req, res) => {
  try {
    const users = getUsers();
    // For MVP, we assume single user with ID 1
    const user = users.find(u => u.id === '1');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = (req, res) => {
  try {
    const { error } = validateProfile(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === '1');
    
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    // Age validation (13+)
    const dob = new Date(req.body.dateOfBirth);
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    if (age < 13) return res.status(400).json({ message: 'User must be at least 13 years old' });

    const updatedUser = { ...users[userIndex], ...req.body };
    users[userIndex] = updatedUser;
    
    saveUsers(users);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === '1');
    
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    const avatarUrl = `/uploads/${req.file.filename}`;
    users[userIndex].avatar = avatarUrl;
    
    saveUsers(users);
    res.json({ avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
