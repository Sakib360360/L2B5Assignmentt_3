import { Request, Response, NextFunction } from "express";
import { Borrow } from "../models/borrow.model";
import { Book } from "../models/book.model";
import { successResponse, errorResponse } from "../utils/response";

/** 6) borrow a book */
export const borrowBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book: bookId, quantity, dueDate } = req.body;
    if (!bookId || !quantity || !dueDate) {
      return res.status(400).json(errorResponse("Missing required fields", "Missing book/quantity/dueDate"));
    }

    // enforce business logic through Book static method
    try {
      await Book.borrowCopies(bookId, quantity); // this checks & deducts
      const borrow = await Borrow.create({ book: bookId, quantity, dueDate });
      return res.status(201).json(successResponse("Book borrowed successfully", borrow));
    } catch (err: any) {
      return res.status(400).json(errorResponse(err.message || "Borrow failed", err.message || err));
    }
  } catch (err) {
    return next(err);
  }
};

/** 7) borrowed books summary (aggregation) */
export const borrowedSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookInfo"
        }
      },
      { $unwind: "$bookInfo" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookInfo.title",
            isbn: "$bookInfo.isbn"
          },
          totalQuantity: 1
        }
      }
    ]);

    return res.json(successResponse("Borrowed books summary retrieved successfully", data));
  } catch (err) {
    return next(err);
  }
};
