const express = require('express');
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "Invalid username, either taken or contains whitespace"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user, missing username or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(book) {
    return res.status(200).json(book);
  } else {
    return res.status(200).json({message: `No book with ISBN ${req.params.isbn} could be found`});
  } 
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const booksByAuthor = {};
  let isEmpty = true;
  const transformedAuthorName = req.params.author.replaceAll('_', ' ').toLocaleLowerCase();

  for(const [isbn, details] of Object.entries(books)) {
    if(details.author.toLowerCase() == transformedAuthorName) {
      booksByAuthor[isbn] = details;
      isEmpty = false;
    }
  }

  if(!isEmpty) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(200).json({message: "No books available by that author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const booksWithTitle = {};
  let isEmpty = true;
  const transformedTitleName = req.params.title.replaceAll('_', ' ').toLocaleLowerCase();

  for(const [isbn, details] of Object.entries(books)) {
    if(details.title.toLowerCase() == transformedTitleName) {
      booksWithTitle[isbn] = details;
      isEmpty = false;
    }
  }

  if(!isEmpty) {
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(200).json({message: "No books available by that title."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const book = books[req.params.isbn];
  if(book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(200).json({message: `No book with ISBN ${req.params.isbn} could be found`});
  } 
});

module.exports.general = public_users;
