const express = require('express');
const jwt = require('jsonwebtoken');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const usernameTaken = users.findIndex((user) => {
    return username === user.username; 
  });

    if(usernameTaken !== -1) {
      // Any other value, including 0, indicates the username is taken
      return false;
    }

    // Check for invalid characters, particularly whitespace
    if(username.indexOf(' ') !== -1 ) {
      return false;
    }

    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

const foundUser = users.findIndex((user) => {
  return (user.username === username && user.password === password);
});

  if(foundUser != -1) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if( !username || !password) {
    return res.status(404).json({message: "Please provide both a username and password"});
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({data: password}, 'finalProject', {expiresIn: "1h"});

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("Successfully logged in.");
  } else {
    return res.status(200).json({message: "Invalid login, check your username and password."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
