'use strict'

const STORAGE_KEY = 'todoDB'
var gFilterBy = {
    txt: '',
    status: ''
}
var gTodos

_createTodos()

function getTodosForDisplay() {
    
    var todos = gTodos

    if (gFilterBy.status) {
        todos = todos.filter(todo =>
            (todo.isDone && gFilterBy.status === 'done') ||
            (!todo.isDone && gFilterBy.status === 'active')
        )
    }
    todos = todos.filter(todo => todo.txt.toLowerCase().includes(gFilterBy.txt.toLowerCase()))
    return todos
}
function getgFilterByStatus(){
    return gFilterBy.status
}
function removeTodo(todoId) {
    const todoIdx = gTodos.findIndex(todo => todo.id === todoId)
    gTodos.splice(todoIdx, 1)
    _saveTodosToStorage()
}

function toggleTodo(todoId) {
    const todo = gTodos.find(todo => todo.id === todoId)
    todo.isDone = !todo.isDone
    _saveTodosToStorage()
}


function addTodo(txt, imp) {
    // const todo = {
    //     id: _makeId(),
    //     txt,
    //     isDone: false
    // }
    // THE SAME
    const todo = _createTodo(txt, imp)
    gTodos.push(todo)
    _saveTodosToStorage()
}

function setFilter(status) {
    gFilterBy.status = status
}

function sortBy(sortBy) {
    switch (sortBy) {
        case 'txt':
            sortByTxt()
            break;
        case 'created':
            sortByTimeCreated()
            break;
        case 'importance':
            sortByImportance()
            break;
        default: return
    }
}
function sortByTxt(){
    gTodos.sort((a, b) => {
        const nameA = a.txt.toUpperCase()
        const nameB = b.txt.toUpperCase()
        return nameA.localeCompare(nameB)
      });
    
}

function sortByTimeCreated(){
    gTodos.sort((a, b) => a.createdAt - b.createdAt)  
}

function sortByImportance(){
    gTodos.sort((a, b) => a.imp - b.imp);

}

    function setFilterByTxt(txt) {
        gFilterBy.txt = txt
    }

    function getTotalCount() {
        return gTodos.length
    }

    function getActiveCount() {
        return gTodos.filter(todo => !todo.isDone).length
    }


    function _createTodos() {
        var todos = loadFromStorage(STORAGE_KEY)

        if (!todos || !todos.length) {
            todos = [
                {
                    id: 't101',
                    txt: 'Learn HTML',
                    isDone: true,
                    createdAt: Date.now(),
                    imp: 2
                },
                {
                    id: 't102',
                    txt: 'Master JS',
                    isDone: false,
                    createdAt: Date.now(),
                    imp: 1
                },
                {
                    id: 't103',
                    txt: 'Study CSS',
                    isDone: false,
                    createdAt: Date.now(),
                    imp: 2
                },
            ]
        }

        gTodos = todos
        _saveTodosToStorage()
    }


    function _createTodo(txt, imp) {
        const todo = {
            id: _makeId(),
            txt,
            isDone: false,
            createdAt: Date.now(),
            imp
        }
        return todo
    }


    function _saveTodosToStorage() {
        saveToStorage(STORAGE_KEY, gTodos)
    }

    function _makeId(length = 5) {
        var txt = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            txt += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return txt;
    }