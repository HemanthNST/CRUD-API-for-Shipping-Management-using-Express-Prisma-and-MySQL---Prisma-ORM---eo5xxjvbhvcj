const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { verifySecret } = require("../middleware/authMiddleware");
const router = express.Router();
const prisma = new PrismaClient();

router.use(verifySecret);

router.post("/create", async (req, res) => {
  const { userId, productId, count } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(404).json({ error: "All fields required" });
  }

  if (userId === undefined || userId === null) {
    return res.status(404).json({ error: "All fields required" });
  }
  if (productId === undefined || productId === null) {
    return res.status(404).json({ error: "All fields required" });
  }
  if (count === undefined || count === null) {
    return res.status(404).json({ error: "All fields required" });
  }

  if (
    typeof userId !== "number" ||
    typeof productId !== "number" ||
    typeof count !== "number"
  ) {
    return res.status(400).json({ error: "All fields must be integers" });
  }

  try {
    const shipping = await prisma.shipping.create({
      data: { userId, productId, count },
    });
    return res.status(201).json(shipping);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/cancel", async (req, res) => {
  const { shippingId } = req.body;
  if (shippingId === undefined || shippingId === null) {
    return res.status(404).json({ error: "Missing shippingId" });
  }
  try {
    const shipping = await prisma.shipping.update({
      where: { id: shippingId },
      data: { status: "cancelled" },
    });
    return res.status(200).json(shipping);
  } catch (err) {
    console.error("Database error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Shipping record not found" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/get", async (req, res) => {
  const { userId } = req.query;
  try {
    const where = userId ? { userId: Number(userId) } : {};
    const shippings = await prisma.shipping.findMany({ where });
    return res.status(200).json(shippings);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = router;
