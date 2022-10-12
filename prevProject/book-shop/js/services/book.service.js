'use strict'
const STORAGE_KEY = 'bookDB'
const STORAGE_2KEY = 'readDB'
const PAGE_SIZE = 4
const NAMES = ['the Lightning Thief', 'The Sea Of Monsters', 'The Titans Curse', 'The Last Olympian', 'The Labyrinth']
var gPageIdx = 0
var gFilterBy = { price: 100, rate: 0, txt: '' }
var gBooks

_createBooks()
 function checkIfReadOn(){
   const isRead= loadFromStorage(STORAGE_2KEY)
   if(isRead) onReadBook(isRead)
   
    return

 }

function checkFavLayout(){
   return loadFromStorage('favLayout')

}

 function FavLayout(text){
if(text==="Cards Layout"){
    saveToStorage('favLayout', 'cards')
}else saveToStorage('favLayout', 'table')
 }

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = []
        for (let i = 0; i < NAMES.length; i++) {
            const name = NAMES[i]
            books.push(_createBook(name))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
    if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
    if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
    return gFilterBy
}

function _createBook(name) {
    return {
        id: makeId(),
        name,
        price: getRandomIntInclusive(100, 9999)/100,
        imgUrl: "img/${name}.png",
        rate: 0
    }
}

function decreaseRate(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    if (book.rate === 0) return
    book.rate--
    _saveBooksToStorage()
}

function increaseRate(bookId) {
    const book = gBooks.find(book => book.id === bookId)
    if (book.rate === 10) return
    book.rate++
    _saveBooksToStorage()
}

function setBookSort(text) {
    if (text === "Title") {
        gBooks.sort((c1, c2) => c1.name.localeCompare(c2.name))
    } else if (text === "Price") {
        gBooks.sort((c1, c2) => (c1.price - c2.price))
    }
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}
function addBook(name, price) {
    const book = {
        id: makeId(),
        name,
        price,
        imgUrl: "img/${name}.jpg",
        rate: 0
    }
    gBooks.unshift(book)
    _saveBooksToStorage()
    return book
}


function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
function _saveReadToStorage(modal) {
    saveToStorage(STORAGE_2KEY, modal)
}

 function _removeFromStorage(){
    removeFromStorage(STORAGE_2KEY)
 }


function getBooks() {

    // Filtering:
    var books = gBooks.filter(book => book.rate >= gFilterBy.rate)
    books = books.filter(book => book.price <= gFilterBy.price)
    books = books.filter(book => book.name.toLowerCase().includes(gFilterBy.txt.toLowerCase()))


    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function nextPage() {
    if (gPageIdx * PAGE_SIZE + 1 >= gBooks.length||PAGE_SIZE === gBooks.length) return
    gPageIdx++
}

function getGbooks(){
    console.log(`gBooks = `, gBooks)
    return gBooks
}

function numPage(numOfPage) {
    gPageIdx= numOfPage
}

function PrevPage() {
    if (gPageIdx === 0) return
    gPageIdx--
}