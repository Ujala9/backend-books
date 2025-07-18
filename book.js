const express = require("express")
const cors = require('cors');
const app = express()

const { initializeDb } = require("./db/db.connect")

initializeDb();

const Book = require("./schema/book.model")


app.use(cors())
app.use(express.json());


async function CreateBook(newBook){
    try{
      const book = new Book(newBook)
      const saveBook = await book.save()
      return saveBook
    }catch(error){
      throw error
    }
}



app.post("/books", async(req,res) => {
    try{
     const savedBook = await CreateBook(req.body)
     res.status(201).json({message: "Book added successfully", book: savedBook})
    }catch(error){
     res.status(500).json({error: "Failed to add book"})
    }
})

async function readAllBooks(){
    try{
     const allBooks = await Book.find()
     return allBooks
    }catch (error){
       throw error
    }
}

app.get("/books", async (req,res) => {
    try{
     const books = await readAllBooks()
     if(books && books.length > 0){
        res.json(books)
     } else {
        res.status(404).json({error: "No Book Found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch books"})
    }
})

async function readBookByTitle(bookTitle){
    try{
        const book = await Book.findOne({ title: bookTitle })
        return book
    } catch (error){
       throw error 
    }
}

app.get("/books/:title", async (req,res) => {
    try{
    const books = await readBookByTitle(req.params.title)
     if(books){
        res.json(books)
     } else {
        res.status(404).json({error: "No Book Found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch books"})
    }
})

async function readBookByAuthor(authorName){
    try{
      const book = await Book.find({ author: authorName })
      return book
    }catch (error){
        throw error
    }
}

app.get("/books/author/:authorName", async (req,res) => {
    try{
    const books = await readBookByAuthor(req.params.authorName)
     if(books){
        res.json(books)
     } else {
        res.status(404).json({error: "No Book Found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch books"})
    }
})

//Create an API to get all the books which are of "Business" genre.

async function readBookByGenre(bookGenre){
    try{
      const book = await Book.find({ genre: bookGenre})
      return book
    }catch (error){
        throw error
    }
}

app.get("/books/genre/:genreName", async (req,res) => {
    try{
    const books = await readBookByGenre(req.params.genreName)
     if(books){
        res.json(books)
     } else {
        res.status(404).json({error: "No Book Found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch books"})
    }
})

// Create an API to get all the books which was released in the year 2012.

async function readBookByYear(yearName){
    try{
      const book = await Book.find({publishedYear: yearName})
      return book
    }catch (error){
        throw error
    }
}

app.get("/books/year/:bookYear", async (req,res) => {
    try{
    const books = await readBookByYear(req.params.bookYear)
     if(books){
        res.json(books)
     } else {
        res.status(404).json({error: "No Book Found"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to fetch books"})
    }
})

async function updateBookRating(bookId, dataToUpdate) {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,  dataToUpdate ,                                 
            { new: true }                     
        );

        return updatedBook;
    } catch (error) {
        throw error;
    }
}

app.post("/books/:bookId", async (req,res) => {
    try{
    const updatedbook = await updateBookRating(req.params.bookId, req.body)
     if(updatedbook){
        res.status(200).json({message: "Books Updated Successfully"})
     } else {
        res.status(404).json({error: "Book does not Exist"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to Update books"})
    }
})

async function updateBookByTitle(bookTitle,dataToUpdate){
    try{
    const updatedBook = await Book.findOneAndUpdate({title: bookTitle}, dataToUpdate,{
        new: true
    })
    return updatedBook
    }catch (error) {
        throw error;
    }
}

app.post("/book/:bookTitle", async (req,res) => {
    try{
    const updatedbook = await updateBookByTitle(req.params.bookTitle, req.body)
     if(updatedbook){
        res.status(200).json({message: "Books Updated Successfully"})
     } else {
        res.status(404).json({error: "Book does not Exist"})
     }
    }catch (error){
       res.status(500).json({error: "Failed to Update books"})
    }
})



async function deleteBookById(bookId){
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return deletedBook
  } catch (error) {
     console.log(error)
  }
};

app.delete("/books/:bookId", async (req, res) => {
 
  try {
    const deletedBook = await deleteBookById(req.params.bookId);
    if (deletedBook) {
       res.status(200).json({ message: "Book deleted successfully", deletedBook });
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error" });
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});




