const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // Ambil token dari header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Masukkan ke request agar bisa dipakai di controller
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

module.exports = auth;
