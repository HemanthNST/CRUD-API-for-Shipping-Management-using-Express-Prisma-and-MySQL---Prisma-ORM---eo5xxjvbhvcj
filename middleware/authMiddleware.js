const verifySecret = (req, res, next) => {
  const secretKey = req.headers && req.headers["shipping_secret_key"];
  const validSecretKey = "a1b2c3d4e5f67890123456789abcdef";

  if (
    !secretKey ||
    secretKey == undefined ||
    secretKey == null ||
    secretKey == ""
  ) {
    return res.status(403).json({
      error: "apiauthkey is missing or invalid",
    });
  }

  if (secretKey != validSecretKey) {
    return res.status(403).json({
      error: "Failed to authenticate apiauthkey",
    });
  }

  next();
};

module.exports = verifySecret;
