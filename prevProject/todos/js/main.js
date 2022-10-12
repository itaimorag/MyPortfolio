'use strict'



function onInit() {
    renderTodos()
}


function renderTodos() {
    const todos = getTodosForDisplay()
    var elH2=document.querySelector('h2')
    elH2.innerText = ''
    if (!todos.length) {
        if (getTotalCount() === 0) {
            elH2.innerText = 'No todos!'
        } else if (getgFilterByStatus() === 'done') {
            elH2.innerText = 'No Done Todos!'
        } else { elH2.innerText = 'No Active Todos!' }
    }
    const strHTMLs = todos.map(todo => `
        <li class="${(todo.isDone) ? 'done' : ''}" onclick="onToggleTodo('${todo.id}')">
            ${todo.txt}
            <button onclick="onRemoveTodo(event,'${todo.id}')" >X</button>
        </li>
    `)

    document.querySelector('ul').innerHTML = strHTMLs.join('')
    document.querySelector('span.total').innerText = getTotalCount()
    document.querySelector('span.active').innerText = getActiveCount()
}


function onRemoveTodo(ev, todoId) {
    ev.stopPropagation()
    if(!confirm()) return
    console.log('Removing:', todoId)
    removeTodo(todoId)
    renderTodos()
}

function onToggleTodo(todoId) {
    console.log('Toggling:', todoId)
    toggleTodo(todoId)
    renderTodos()
}

function onAddTodo(ev) {
    ev.preventDefault()
    const elTxt = document.querySelector('[name=txt]')
    const txt = elTxt.value
    const elImp = document.querySelector('[name=imp]')
    const imp = +elImp.value
    if (txt && (3 >= imp && imp >= 1)) {
        addTodo(txt, imp)
        renderTodos()
        elTxt.value = ''
        elImp.value = ''
    } 
}

function onSetFilter(filterBy) {
    console.log('filterBy:', filterBy)
    setFilter(filterBy)
    renderTodos()
}
function onSortBy(sort) {
    console.log('sortBy:', sort)
    sortBy(sort)
    renderTodos()
}


function onSetFilterByTxt(txt) {
    console.log('Filtering by txt', txt)
    setFilterByTxt(txt)
    renderTodos()
}
