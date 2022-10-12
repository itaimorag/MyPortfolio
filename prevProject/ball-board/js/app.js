'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'

const GLUE = 'GLUE'
const BALL = 'BALL'
const GAMER = 'GAMER'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'
const GLUE_IMG = '<img src="img/candy.png">'


// Model:
var gBoard
var gGamerPos
var gCounter=0
var gBallsIntervalId
var gGlueIntervalId
var gGlueIntervalIdCopy
var gIsGlued=false

function makeMove(){
	gIsGlued=false
}
function initGame() {
	gGamerPos = { i: 2, j: 9 }
	 document.querySelector('h2').innerText=''
	 document.querySelector('h3').innerText=''
	 gCounter=0
	gBoard = buildBoard()
	var elBtn = document.querySelector('.start-btn')
	elBtn.classList.add('hide')
	renderBoard(gBoard)
	gBallsIntervalId=setInterval (addBall,8000)
	 gGlueIntervalId=setInterval (addGlue,5000)	

	}
	function addGlue(){
		var empty=getEmptyPos(gBoard)
		gBoard[empty.i][empty.j].gameElement = GLUE
		setTimeout(renderGlue,3000,empty)
		var selectorStr = getClassName(empty)
		var elCell = document.querySelector('.' + selectorStr)
		elCell.innerHTML = GLUE_IMG
	}
	function renderGlue(empty){
		if(gBoard[empty.i][empty.j].gameElement ===GAMER) return
		var selectorStr = getClassName(empty)
		gBoard[empty.i][empty.j].gameElement =null
		var elCell = document.querySelector('.' + selectorStr)
		elCell.innerText =''
	}
function addBall(){
	var empty=getEmptyPos(gBoard)
	gBoard[empty.i][empty.j].gameElement = BALL
var selectorStr = getClassName(empty)
var elCell = document.querySelector('.' + selectorStr)
elCell.innerHTML = BALL_IMG
}

function getEmptyPos(board){
	var empties=[]
	for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
if((board[i][j].type===FLOOR)&&(board[i][j].gameElement===null)){
	var holding={
		i:i,
		j:j
	}
	empties.push(holding)
}
}
	}	
	return empties[getRandomIntInclusive(0, empties.length-1)]
}


function buildBoard() {
	// TODO: Create the Matrix 10 * 12 
	const board = createMat(10, 12)

    // TODO: Put FLOOR everywhere and WALL at edges
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            if( i === 0 || i === board.length - 1 || 
                j === 0 || j === board[i].length - 1){
                    board[i][j] = { type: WALL, gameElement: null }
            } else {
                board[i][j] = { type: FLOOR, gameElement: null }
            }
        }
    }
	board[0][5].type = FLOOR
	 board[5][0].type = FLOOR
	 board[5][11].type = FLOOR
	 board[9][5].type = FLOOR
	// TODO: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[4][6].gameElement = BALL
    board[6][3].gameElement = BALL

	console.log(board)
	return board
}

// Render the board to an HTML table
function renderBoard(board) {

	const elBoard = document.querySelector('.board')
	var strHTML = ''

	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n'
		for (var j = 0; j < board[0].length; j++) {
			const currCell = board[i][j]

			var cellClass = getClassName({ i, j })

			if (currCell.type === FLOOR) cellClass += ' floor'
			else if (currCell.type === WALL) cellClass += ' wall'

			strHTML += '\t<td class="cell ' + cellClass + '"  onclick="moveTo(' + i + ',' + j + ')" >\n'

			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG
			}

			strHTML += '\t</td>\n'
		}
		strHTML += '</tr>\n'
	}
	// console.log('strHTML is:')
	// console.log(strHTML)
	elBoard.innerHTML = strHTML
	// if(gCounter===1){
	//  ballsRunner=setInterval (addBalls(),10000)
	// }
}




// Move the player to a specific location
function moveTo(i, j) {
	console.log(`i = `, i)
	console.log(`j = `, j)
	// console.log(`gIsGlued = `, gIsGlued)
	if (gIsGlued||document.querySelector('h2').innerText==='game Over!!!'){
		console.log('gIsGlued =',gIsGlued)
		console.log('not wall ')
		return
	}

if(i===5&&j===-1){
	j=0	
}
if(i===5&&j===12){
	j=	12
}
if(i===10&&j===5){
	i=	9
}
if(i===5&&j===5){
	changeLoc(i,j)
}if(i===-1&&j===5){
	i=0
}

		var jAbsDiff=Math.abs(gGamerPos.j-j)
		var IAbsDiff=Math.abs(gGamerPos.i-i)
		const targetCell = gBoard[i][j]
		if(gGamerPos.i===0&&gGamerPos.j===5){
			(i===0&&j===5)? changeLoc(9,5) :changeLoc(1,5)
		}else if(gGamerPos.i===5&&gGamerPos.j===0){
			(i===5&&j===1)?changeLoc(i,j):changeLoc(5,11)			
		}
		else if(gGamerPos.i===5&&gGamerPos.j===11){
			(i===5&&j===12) ?changeLoc(5,0):changeLoc(5,10)			
		}else if(gGamerPos.i===9&&gGamerPos.j===5){
			(i===9&&j===5) ?changeLoc(0,5):changeLoc(8,5)		
			
		}else{
			
			if (targetCell.gameElement === BALL) {
				playSound()
				console.log('Collecting!')
				gCounter++
				var elcounter=document.querySelector('h3')
				elcounter.innerText='counter:'+ gCounter
			}
			else if (targetCell.gameElement === GLUE) {
				gIsGlued=true
				setTimeout(makeMove,3000)
				
			}
			else if (targetCell.type === WALL){
				console.log(`wall `)
				return
			}
			
			// Calculate distance to make sure we are moving to a neighbor cell
			const iAbsDiff = Math.abs(i - gGamerPos.i)
			const jAbsDiff = Math.abs(j - gGamerPos.j)
			
			// If the clicked Cell is one of the four allowed
			// if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {
				
				changeLoc(i,j)
				
				var noBall=0
				for(var k = 0; k < gBoard.length; k++){
					for(var l = 0; l < gBoard[k].length; l++){
						if(gBoard[k][l].gameElement !== BALL){
							noBall++}
						}
					}
					if(noBall===120){
						var elGameOver = document.querySelector('h2')
						elGameOver.innerText='game Over!!!'
						clearInterval(gBallsIntervalId)
						clearInterval(gGlueIntervalId)
						return}
				if (iAbsDiff + jAbsDiff === 1) {
					
		// TODO: Move the gamer
        // Model
		//.נסיון!!!!!!!!
        // gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        
        // // DOM
        // var selectorStr = getClassName(gGamerPos)
        // var elCell = document.querySelector('.' + selectorStr)
        // elCell.innerHTML = ''
        
        // // Model
        // gBoard[i][j].gameElement = GAMER
        // gGamerPos = { i, j }
        
        // // DOM
        // selectorStr = getClassName(gGamerPos)
        // elCell = document.querySelector('.' + selectorStr)
        // elCell.innerHTML = GAMER_IMG
		// var elcounter=document.querySelector('h3')
		// elcounter.innerText='counter:'+ gCounter

	} else console.log('Bad Move', iAbsDiff, jAbsDiff)
}

}
// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	const cellSelector = '.' + getClassName(location)
	const elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

// Move the player by keyboard arrows
function handleKey(event) {
    
	const i = gGamerPos.i
	const j = gGamerPos.j

	switch (event.key) {
		case 'ArrowLeft':
			// if(gBoard[gGamerPos.i]===5&&gBoard[gGamerPos.j]===0 ){
				// moveTo(5,11)
			// 	changeLoc(5,11)
			// }else{
				 moveTo(i, j -1 )
				
				// changeLoc(i,j - 1)}
			break
		case 'ArrowRight':
			// if(gBoard[gGamerPos.i]===5&&gBoard[gGamerPos.j]===11 ){
			// 	moveTo(5,0)}
				// else{
					moveTo(i, j + 1)			
			break
		case 'ArrowUp':
			// if(gBoard[gGamerPos.i]===0&&gBoard[gGamerPos.j]===5){
			// 	moveTo(9,5)}
				// else{
					moveTo(i - 1, j)
			break
		case 'ArrowDown':
			// if(gBoard[gGamerPos.i]===9&&gBoard[gGamerPos.j]===5){
			// 	moveTo(0,5)}
				// else{
					moveTo(i + 1, j)
			break
	}
}

function changeLoc(k,l){

	if(gBoard[gGamerPos.i][gGamerPos.j].gameElement===GLUE) return
	  // Model
	  gBoard[gGamerPos.i][gGamerPos.j].gameElement = null      
	  // DOM
	  var selectorStr = getClassName(gGamerPos)
	  var elCell = document.querySelector('.' + selectorStr)
	  elCell.innerHTML = ''	  
	  // Model
	  gBoard[k][l].gameElement = GAMER
	  gGamerPos = {i: k,j: l }
	  
	  // DOM
	  selectorStr = getClassName(gGamerPos)
	  console.log(`selectorStr = `, selectorStr)
	  elCell = document.querySelector('.' + selectorStr)
	  elCell.innerHTML = GAMER_IMG

  } 



// Returns the class name for a specific cell
function getClassName(location) {
	const cellClass = 'cell-' + location.i + '-' + location.j
	return cellClass
}

function playSound() {
    var sound = new Audio("sound/pop.mp3");
    sound.play();
}
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

//נסיון שלא עבד
// function findEmpty(){
// 	var ranNumI=getRandomIntInclusive(1, 8)
// 	var ranNumJ=getRandomIntInclusive(1, 10)
// var curCell={
// 	i:ranNumI,
// 	j:ranNumJ
// }
// while(!isEmptyCell(curCell)){
// 	var ranNumI=getRandomIntInclusive(1, 8)
// 	var ranNumJ=getRandomIntInclusive(1, 10)
// var curCell={
// 	i:ranNumI,
// 	j:ranNumJ
// }
	
// }

// }