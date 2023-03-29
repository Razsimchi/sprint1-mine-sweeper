'use strict'


const gLevel = {
    SIZE: 4,
    MINES: 2
}
const MINE = '💣'
const FLAG = '🚩'
const NORMAL = '😃'
const LOSE = '💀'
const WIN = '😎'


var gMinesPos = []
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gBoard
var gCountLife = 0
var gMinesCount
var gIsWin 


function onInit() {
    gBoard = buildBoard()
    console.table(gBoard)     
    renderBoard(gBoard, '.container')
    renderMinesCount()
    gIsWin=false
    renderEmoji()
    
    
}
function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) continue
            gBoard[i][j].minesAroundCount = countNeighbors(i, j, gBoard)

        }
    }
}
function renderMinesCount(){
    const minesCountDown = gLevel.MINES - gGame.markedCount
    const elCounter =document.querySelector('.counter')
    elCounter.innerHTML = minesCountDown

}
function onCellClicked(elCell, cellI, cellJ) {
    if(gGame.shownCount===0){
        addRndMinespos(cellI,cellJ)
        setMinesNegsCount()
    }
    if (gBoard[cellI][cellJ].isMarked) return
    if (!gGame.isOn) return

    if (gBoard[cellI][cellJ].isMine) {
        hundleMine(cellI, cellJ)
    }
    else if (gBoard[cellI][cellJ].minesAroundCount !== 0) {
        openCell(cellI, cellJ)
    }
    else expandShown(cellI, cellJ)
    checkWin()
    console.log(gMinesPos)
}
function isAllMinesMark(){
    for (var i = 0; i < gMinesPos.length; i++) {
        const location = gMinesPos[i]
        if (!gBoard[location.i][location.j].isMarked) return false
    }
    return true
    
}
function checkWin() {
    const amountOfCells = (gLevel.SIZE ** 2) - gLevel.MINES
    if ((gGame.shownCount === amountOfCells)&&(isAllMinesMark())) {
        gGame.isOn = false
        gIsWin = true
        renderEmoji()
    }
}
function isGameOver() {
    return gCountLife === 3
}
function expandShown(cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].isMarked) continue
            const location = { i, j }
            var value = (gBoard[i][j].minesAroundCount !== 0) ? gBoard[i][j].minesAroundCount : '0'
            if(!gBoard[i][j].isShown){
                gGame.shownCount++
            } 
            gBoard[i][j].isShown = true
            renderCell(location, value)
        }
    }

}
function gameOver() {
    for (var i = 0; i < gMinesPos.length; i++) {
        const minePos = gMinesPos[i]
        renderCell(minePos, MINE)
    }
    gGame.isOn = false
    renderEmoji()


}
function playSound() {
    const audio = new Audio()
    audio.src = 'sound/failure.mp3'
    audio.play()
}
function hundleMine(cellI, cellJ) {
    const location = { i: cellI, j: cellJ }
    gCountLife++
    if (isGameOver()) gameOver()
    else {
        playSound()
        renderCell(location, MINE)
        setTimeout(() => {
            renderCell(location, '')
        }, 3000);
    }


}
function openCell(cellI, cellJ) {
    const location = { i: cellI, j: cellJ }
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
    renderCell(location, gBoard[cellI][cellJ].minesAroundCount)

}
function getRndMinesPos(cellI,cellJ) {
    var locations = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if(cellI===i&&cellJ===j) continue
            locations.push({ i, j })
        }
    }
    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var rndIdx = getRandomInt(0, locations.length)
        gMinesPos.push(locations[rndIdx])
        locations.splice(rndIdx, 1)
    }
}
function addRndMinespos(cellI,cellJ) {
    getRndMinesPos(cellI,cellJ)
    for (var i = 0; i < gMinesPos.length; i++) {
        const location = gMinesPos[i]
        gBoard[location.i][location.j].isMine = true
    }
}
function onRightClick(cellI, cellJ) {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    }, false)
    const location = { i: cellI, j: cellJ }
    if (gBoard[cellI][cellJ].isMarked) {
        gBoard[cellI][cellJ].isMarked = false
        gGame.markedCount--
        renderCell(location, '')
    }
    else {
        gBoard[cellI][cellJ].isMarked = true
        gGame.markedCount++
        renderCell(location, FLAG)
        checkWin()
    }
    renderMinesCount()
}
function displayGameOverModal() {
    const msg = isGameOver() ? 'Game Over' : 'You Win!'
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'Block'
    elModal.querySelector('h2').innerHTML = msg
}

function hideGameOverModal() {
    const elModal = document.querySelector('.game-over-modal')
    elModal.style.display = 'none'

}
function restart() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gMinesPos = []
    gCountLife = 0
    hideGameOverModal()
    onInit()

}
function onClickLevel(elBtn) {
    if (elBtn.innerHTML === 'Beginner') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    }
    else if (elBtn.innerHTML === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    }
    else {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    restart()
}
function onEmojiClick(){
    restart()
}
function renderEmoji(){
    var elEmoji = document.querySelector('.emoji')
    var msg = NORMAL
    if(gIsWin) msg=WIN 
    else if(isGameOver()) msg=LOSE
    elEmoji.innerHTML=msg
    
}