import { Router } from "express";

const router = Router();
const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:3000";

/** @query redirect - the path to redirect to, including the / */
router.get("/trust", (req, res) => {
  console.log(req.query.redirect);
  res.redirect(`${FRONTEND_URL}${req.query.redirect}`);
});

export default router;
