import { Router } from "express";
import * as BookController from "../controllers/book.controller";

const router = Router();

router.post("/", BookController.createBook);
router.get("/", BookController.getAllBooks);
router.get("/:bookId", BookController.getBookById);
router.put("/:bookId", BookController.updateBook);
router.delete("/:bookId", BookController.deleteBook);

export default router;
