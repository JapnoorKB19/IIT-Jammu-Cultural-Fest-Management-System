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

const isHead = (req, res, next) => {
  if (req.user && req.user.role === 'Head') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as a Head' });
  }
};

const isHeadOrCoHead = (req, res, next) => {
  if (req.user && (req.user.role === 'Head' || req.user.role === 'Co-head')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, isHead, isHeadOrCoHead };