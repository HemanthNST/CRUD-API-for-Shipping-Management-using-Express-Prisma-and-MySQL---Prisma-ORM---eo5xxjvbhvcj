const express = require("express");
const dotenv = require("dotenv");
const { prisma } = require("./db/config");
const verifySecret = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
app.use(express.json());

app.use(verifySecret);

app.post("/api/shipping/create", async (req, res) => {
  try {
    const { userId, productId, count } = req.body;

    if (
      userId === undefined ||
      productId === undefined ||
      count === undefined
    ) {
      return res.status(404).json({
        error: "All fields required",
      });
    }

    const shipping = await prisma.shipping.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
        count: parseInt(count),
        status: "pending",
      },
    });

    res.status(201).json(shipping);
  } catch (error) {
    console.error("Error creating shipping record:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.put("/api/shipping/cancel", async (req, res) => {
  try {
    const { shippingId } = req.body;

    if (!shippingId) {
      return res.status(404).json({
        error: "Missing shippingId",
      });
    }

    const updatedShipping = await prisma.shipping.update({
      where: { id: parseInt(shippingId) },
      data: { status: "cancelled" },
    });

    res.status(200).json(updatedShipping);
  } catch (error) {
    console.error("Error cancelling shipping record:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

app.get("/api/shipping/get", async (req, res) => {
  try {
    const { userId } = req.query;

    let whereClause = {};
    if (userId) {
      whereClause.userId = parseInt(userId);
    }

    const shippingRecords = await prisma.shipping.findMany({
      where: whereClause,
    });

    res.status(200).json(shippingRecords);
  } catch (error) {
    console.error("Error retrieving shipping records:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
