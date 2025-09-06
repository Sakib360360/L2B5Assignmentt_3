import { Request, Response, NextFunction } from "express";
import { Book } from "../models/book.model";
import { successResponse, errorResponse } from "../utils/response";

/** 1) create book */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.create(req.body);
    return res.status(201).json(successResponse("Book created successfully", book));
  } catch (err) {
    return next(err);
  }
};

/** 2) get all books (filter + sort + limit) */
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query.filter as string | undefined;          // genre
    const sortBy = (req.query.sortBy as string) || "createdAt";     // field
    const sortDir = (req.query.sort as string) === "asc" ? 1 : -1;  // asc/desc
    const limit = parseInt((req.query.limit as string) || "10", 10);

    const query: any = {};
    if (filter) query.genre = filter;

    const books = await Book.find(query)
      .sort({ [sortBy]: sortDir })
      .limit(limit);

    return res.json(successResponse("Books retrieved successfully", books));
  } catch (err) {
    return next(err);
  }
};

/** 3) get book by id */
export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json(errorResponse("Book not found", "Book not found"));
    }
    return res.json(successResponse("Book retrieved successfully", book));
  } catch (err) {
    return next(err);
  }
};

/** 4) update book */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.bookId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!book) {
      return res.status(404).json(errorResponse("Book not found", "Book not found"));
    }
    return res.json(successResponse("Book updated successfully", book));
  } catch (err) {
    return next(err);
  }
};

/** 5) delete book */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.bookId);
    if (!book) {
      return res.status(404).json(errorResponse("Book not found", "Book not found"));
    }
    return res.json(successResponse("Book deleted successfully", null));
  } catch (err) {
    return next(err);
  }
};
