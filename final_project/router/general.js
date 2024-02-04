const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login "});
        } else {
        return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

//Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})

//Call the promise and wait for it to be resolved and then print a message.
myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
})



// Get the book list available in the shop
const getAll = () => Promise.resolve(books);
public_users.get('/',function (req, res) {
    getAll()
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
});

// Get book details based on ISBN
const getIsbn = (isbn) => Promise.resolve(books[isbn]);
public_users.get('/isbn/:isbn',function (req, res) {
    getIsbn(req.params.isbn)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
 });
  
// Get book details based on author
const getAuthor = (author) => {
    for (const [key, value] of Object.entries(books)) {
        if(value.author == author){
            Promise.resolve(books[key]);
        }
    }
    Promise.reject(new Error('fail'))
}
public_users.get('/author/:author',function (req, res) {
    getAuthor(req.params.author)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
});

// Get all books based on title
const getTitle = (title) => {
    for (const [key, value] of Object.entries(books)) {
        if(value.title == title){
            Promise.resolve(books[key]);
        }
    }
    Promise.reject(new Error('fail'))
}
public_users.get('/title/:title',function (req, res) {
    getTitle(req.params.title)
    .then(result => res.status(200).send(result))
    .catch(err => res.status(500).send(err));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;
