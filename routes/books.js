const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const session = require('express-session');
router.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

// All Books Route
router.get('/', async (req, res) => {
  chechUserLoggedIn(req, res);
  let query = Book.find()
  
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Book Route
router.get('/new', async (req, res) => {
  chechUserLoggedIn(req, res);
  renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', async (req, res) => {
  chechUserLoggedIn(req, res);
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  try {
    saveCover(book, req.body.cover)
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
  } catch{
    renderFormPage(res, book, 'new', true)
  }
})

//show book route
router.get('/:id', async(req,res)=>{
  chechUserLoggedIn(req, res);
  try{
    const book = await Book.findById(req.params.id).populate('author').exec();
    res.render('books/show', {book, book})
  }catch{
    res.redirect('/')
  }
})

//edit book route
router.get('/:id/edit', async (req, res) => {
  chechUserLoggedIn(req, res);
  try{
    const book = await Book.findById(req.params.id);
    renderEditPage(res, book);
  }catch{
    res.redirect('/');
  }
})

//update book route
router.put('/:id', async (req, res) => {
  chechUserLoggedIn(req, res);
  let book;
  try {
      book = await Book.findById(req.params.id)
      book.title = req.body.title;
      book.author = req.body.author;
      book.publishDate = new Date(req.body.publishDate);
      book.pageCount = req.body.pageCount;
      book.description = req.body.description;
      
      if(req.body.cover != null && req.body.cover !==''){
        saveCover(book, req.body.cover);
      }
      await book.save();
    res.redirect(`/books/${book.id}`)
  } catch{
    if(book != null){
      renderEditPage(res, book, true)
    }else{
      redirect('/');
    }
  }
})

//delete Book Page
router.delete('/:id', async (req,res) =>{
  chechUserLoggedIn(req, res);
  let book;
  try{
    book = await Book.findById(req.params.id);
    await book.remove();
    res.redirect('/books');
  }catch{
    if(book != null){
      res.render('/books/show',{
        book: book,
        errorMessage: 'Could not remove book'
      })
    }else{
      res.redirect('/');
    }
  }
})

async function renderNewPage(res, book, form, hasError = false) {
  renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, form, hasError = false) {
  renderFormPage(res, book, 'edit', hasError);
}

async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if(hasError){
      (form === 'edit') ? params.errorMessage = 'Error Editing Book' : params.errorMessage = 'Error Creating Book';
    } 
    res.render(`books/${form}`, params)
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

function chechUserLoggedIn(req, res){ 
  if(req.session.user){
    res.locals.userLoggedIn = true;
  }
}

module.exports = router