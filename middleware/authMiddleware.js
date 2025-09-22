const verifySecret = (req, res, next) => {
  const secretKey = req.headers && req.headers["shipping_secret_key"];
  const validSecretKey = process.env.SHIPPING_SECRET_KEY;

  if (!secretKey) {
    return res.status(403).json({
      error: "SHIPPING_SECRET_KEY is missing or invalid",
    });
  }

  if (secretKey !== validSecretKey) {
    return res.status(403).json({
      error: "Failed to authenticate SHIPPING_SECRET_KEY",
    });
  }

  next();
};

module.exports = verifySecret;
