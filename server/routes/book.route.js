const express = require("express");
const bookRouter = express.Router();
const bookModel = require("../models/book.model");
const roleAuth = require("../middleware/role.middleware")

bookRouter.get("/", roleAuth(["viewer" , "view_all" , "creator"]) , async (req, res) => {
    try {
      const { old, new: isNew } = req.query;
      const userId = req.user.userId ; 
      const userRole = req.user.role  ;

      let query = {};

      if (old) {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        query.createdAt = { $lt: tenMinutesAgo };
      } else if (isNew) {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        query.createdAt = { $gte: tenMinutesAgo };
      }
      if(userRole === "viewer"){
        query.createdBy = userId ; 
      }
      const books = await bookModel.find(query);
      res.json(books);
    } catch (error) {
      return res.status(500).send({ message: "Error While Fetching Books", error });
    }
  });


bookRouter.post("/add", roleAuth([ "viewer" , "creator"]) , async (req, res) => {
  try {
    const { title, description, price } = req.body;
    console.log("REQ USER : ");
    const book = new bookModel({
      title,
      description,
      price,
      createdBy: req.user.userId,
    });
    await book.save();
    return res.status(200).send({message : "Book Successfully Added" , book});
  } catch (error) {
    return res.status(500).send({ message: "Error While Adding New Book", error });
  }
});

bookRouter.delete("/delete/:id", roleAuth(["creator"]), async (req, res) => {
    try {
      const bookId = req.params.id; 
      const deletedBook = await bookModel.findByIdAndDelete(bookId);
      if (!deletedBook) {
        return res.status(404).send({ message: "Book not found" });
      }
      return res.status(200).send({ message: "Book Successfully Deleted", deletedBook });
    } catch (error) {
      return res.status(500).send({ message: "Error while deleting the book", error });
    }
  });

bookRouter.patch("/update/:id", roleAuth([ "creator"]) , async (req, res) => {
    try {
      const payload = req.body;
      const bookId = req.params.id;
      const book = await bookModel.findOne({ _id: bookId });
      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }
        const updatedBook = await bookModel.findByIdAndUpdate(bookId, payload, { new: true });
        return res.status(200).send({ message: "Book Successfully Updated", updatedBook });
    } catch (error) {
      return res.status(500).send({ message: "Error While Updating the Book", error });
    }
  });

module.exports = bookRouter;
