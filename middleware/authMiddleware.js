const verifySecret = (req, res, next) => {
  const secretKey = req.headers && req.headers["shipping_secret_key"];
  const validSecretKey = process.env.SHIPPING_SECRET_KEY;

  // If no secret key is provided at all
  if (
    !secretKey ||
    secretKey === undefined ||
    secretKey === null ||
    secretKey === ""
  ) {
    return res.status(403).json({
      error: "apiauthkey is missing or invalid",
    });
  }

  // If secret key is provided but invalid
  if (secretKey !== validSecretKey) {
    return res.status(403).json({
      error: "Failed to authenticate apiauthkey",
    });
  }

  // If secret key is valid, proceed
  next();
};

module.exports = verifySecret;
