'use strict'


function onInit() {
    checkIfReadOn()
    renderFilterByQueryStringParams()
    renderBooks()
}




function renderBooks() {
    var books = getBooks()
   if(checkFavLayout()==="cards"){
    var strHtmls = books.map(book => `
        <article class="book-preview">
            <button class="btn-remove" onclick="onRemoveBook('${books.id}')">X</button>
            <h5>${book.name}</h5>
            <h6>price: <span>${book.price}</span></h6>
            <div class="rateCon">
            <bookrate class="bookrate"> Rate:</bookrate>
            </div>
            <button onclick="onReadBook('${book.id}')">Read</button>
            <button onclick="onUpdateBook('${book.id}')">Update</button>
            <img src="img/${book.name}.jpg" alt="book by ${book.name}">
        </article> 
        `
    )
    document.querySelector('.books-container').innerHTML = strHtmls.join('')

   }else{
    var strHTML = '<table border="1" id="table"><tbody class="board">'
    strHTML += '\n<tr>\n' + `\t<th>Id</th>\n` + `\t<th><button onclick="onSortBy(this)">Title</button</th>\n` + `\t<th><button onclick="onSortBy(this)">Price</button></th>\n` + `\t<th>Actions</th>\n` + '\n</tr>'
    for (var i = 0; i < books.length; i++) {
        strHTML += '\n<tr>\n'
        for (var prop in books[0]) {
            if (prop === 'rate') continue
            else if (prop === 'imgUrl') {
                var cell = `<button class="readBtn" onclick="onReadBook('${books[i].id}')">Read</button>
            <button class="updateBtn" onclick="onUpdateBook('${books[i].id}')">Update</button>
            <button class="btn-remove" onclick="onRemoveBook('${books[i].id}')">X</button>`
            }
            else {
                var cell = books[i][prop]
            }
            strHTML += `\t<td>${cell}</td>\n`
        }
        strHTML += '\n</tr>'
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector('.books-container')
    elContainer.innerHTML = strHTML
}
}

function onFavLayout(text){
    FavLayout(text.innerText)
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Removed`)
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price
    elModal.querySelector('h5 span').innerText = bookId
    elModal.querySelector('h2 span').innerText = book.rate
    elModal.querySelector('rate').innerText = book.rate
    elModal.querySelector('img').src = "img/" + book.name + ".jpg"
    elModal.classList.add('open')
    _saveReadToStorage(bookId)
}

function onChangeRate(value) {
    var elModal = document.querySelector('.modal')
    var bookId = elModal.querySelector('h5 span').innerText
    if (value === '-') decreaseRate(bookId)
    else increaseRate(bookId)
    var book = getBookById(bookId)
    makeStars(book)
    elModal.querySelector('h2 span').innerText = book.rate
    elModal.querySelector('rate').innerText = book.rate
}

function makeStars(book){
    var elRate=document.querySelector('bookrate')
    var rateStar=''
    elRate.innerText=''
    for(var i=0;i<book.rate;i++){
        rateStar+='⭐'
    }
    elRate.innerText='Rate:'+rateStar
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    _removeFromStorage()
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)

    var newPrice = +prompt('New Price?', book.price)
    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${book.price}`)
    }
}

function onAddBook() {
    var name = prompt('Name?').trim()
    var price = +prompt('Price?')
    if (name && price) {
        const book = addBook(name, price)
        renderBooks()
        flashMsg(`book Added (id: ${book.id})`)
    } else flashMsg(`wrong name or price`)
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()
    const queryStringParams = `?price=${filterBy.price}&rate=${filterBy.rate}&txt=${filterBy.txt}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)

}

function onSortBy(value) {
    setBookSort(value.innerText)
    renderBooks()
}

// function onSetFilterByTxt(txt) {
//     setFilterByTxt(txt)
//     renderBooks()
// }
function onNumPage(num) {
    switch (+num.innerText) {
        case 0:
            numPage(num=0)
            renderBooks()
            break;
        case 1:
            numPage(num=1)
            renderBooks()
            break;
        case 2:
            numPage(num=2)
            renderBooks()
            break;
        default:
        
    }
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    PrevPage()
    renderBooks()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        price: +queryStringParams.get('price') || 100,
        rate: +queryStringParams.get('rate') || 0,
        txt: queryStringParams.get('txt') || ''
    }
    if (!filterBy.price && !filterBy.rate&& !filterBy.txt) return

    document.querySelector('.filter-price-range').value = filterBy.price
    document.querySelector('.filter-rate-range').value = filterBy.rate
    document.querySelector('.filter-text').value = filterBy.txt

    setBookFilter(filterBy)
}