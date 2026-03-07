import { Router } from "express";

const router = Router();

router.get("/check", (req, res) => {
  console.log(`-> ${req.ip} | ${req.headers["user-agent"]}`);
  res.json({ success: true });
});

export default router;
