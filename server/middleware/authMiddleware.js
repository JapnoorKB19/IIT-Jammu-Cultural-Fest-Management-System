const jwt = require('jsonwebtoken');
require('dotenv').config();

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// This is the correct logic that includes all admin roles
const isAdmin = (req, res, next) => {
  const { role } = req.user;
  if (role === 'Head' || role === 'SuperAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// This logic was flawed before, but is now correct
const isHead = (req, res, next) => {
  if (req.user && req.user.role === 'Head') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Head' });
  }
};

// This logic is correct
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'SuperAdmin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Super Admin role required.' });
  }
};

// Use module.exports to match the rest of your backend
module.exports = { protect, isAdmin, isHead, isSuperAdmin };