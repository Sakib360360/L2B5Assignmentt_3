import mongoose, { Document, Model, Schema } from "mongoose";

export type Genre = "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY";

export interface IBook extends Document {
  title: string;
  author: string;
  genre: Genre;
  isbn: string;
  description?: string;
  copies: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface BookModel extends Model<IBook> {
  borrowCopies(bookId: string, quantity: number): Promise<IBook>;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: [true, "Title is required"] },
  author: { type: String, required: [true, "Author is required"] },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"]
  },
  isbn: { type: String, required: [true, "ISBN is required"], unique: true },
  description: { type: String, default: "" },
  copies: {
    type: Number,
    required: [true, "Copies is required"],
    min: [0, "Copies must be a positive number"],
    validate: {
      validator: Number.isInteger,
      message: "Copies must be an integer"
    }
  },
  available: { type: Boolean, default: true }
}, { timestamps: true });

/** middleware: before save, ensure available matches copies */
BookSchema.pre<IBook>("save", function (next) {
  this.available = this.copies > 0;
  next();
});

/** middleware: after save (just log for learning) */
BookSchema.post<IBook>("save", function (doc) {
  console.log(`Book saved: ${doc.title} (copies: ${doc.copies})`);
});

/** static method: business logic for borrowing copies */
BookSchema.statics.borrowCopies = async function (bookId: string, quantity: number) {
  const Book = this as BookModel;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const book = await Book.findById(bookId).session(session);
    if (!book) throw new Error("Book not found");
    if (quantity <= 0) throw new Error("Quantity must be > 0");
    if (book.copies < quantity) throw new Error("Not enough copies available");

    book.copies = book.copies - quantity; // pre-save will fix `available`
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();
    return book;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const Book = mongoose.model<IBook, BookModel>("Book", BookSchema);
