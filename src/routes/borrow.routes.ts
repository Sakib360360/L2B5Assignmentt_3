import { Router } from "express";
import * as BorrowController from "../controllers/borrow.controller";

const router = Router();

router.get("/", BorrowController.borrowedSummary);
router.post("/", BorrowController.borrowBook);

export default router;
