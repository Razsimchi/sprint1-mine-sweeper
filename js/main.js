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
const LIFE = '❤️'



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
var gSec
var gClockInterval



function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard, '.container')
    renderMinesCount()
    gIsWin = false
    gSec = 0
    renderEmoji()
    time()
    renderLife()

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
function renderMinesCount() {
    const minesCountDown = gLevel.MINES - gGame.markedCount
    const elCounter = document.querySelector('.counter')
    elCounter.innerHTML = minesCountDown

}
function onCellClicked(elCell, cellI, cellJ) {
    if (gGame.shownCount === 0) {
        addRndMinespos(cellI, cellJ)
        setMinesNegsCount()
        gClockInterval = setInterval(time, 1000)
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
}
function isAllMinesMark() {
    for (var i = 0; i < gMinesPos.length; i++) {
        const location = gMinesPos[i]
        if (!gBoard[location.i][location.j].isMarked) return false
    }
    return true

}
function checkWin() {
    const amountOfCells = (gLevel.SIZE ** 2) - gLevel.MINES
    if ((gGame.shownCount === amountOfCells) && (isAllMinesMark())) {
        gGame.isOn = false
        gIsWin = true
        clearInterval(gClockInterval)
        time()
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
            var value = (gBoard[i][j].minesAroundCount) ? gBoard[i][j].minesAroundCount : ''
            if (!gBoard[i][j].isShown) {
                gGame.shownCount++
                gBoard[i][j].isShown = true
                if(!value) expandShown(i,j)
            }
            gBoard[i][j].isShown = true
            changeOpenCellColor(i,j)
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
    clearInterval(gClockInterval)
    time()


}
function playSound() {
    const audio = new Audio()
    audio.src = 'sound/failure.mp3'
    audio.play()
}
function hundleMine(cellI, cellJ) {
    const location = { i: cellI, j: cellJ }
    gCountLife++
    renderLife()
    if (isGameOver()) gameOver()
    else {
        playSound()
        renderCell(location, MINE)
        setTimeout(() => {
            renderCell(location, '')
        }, 1500);
    }


}
function openCell(cellI, cellJ) {
    const location = { i: cellI, j: cellJ }
    gBoard[cellI][cellJ].isShown = true
    gGame.shownCount++
    changeOpenCellColor(cellI,cellJ)
    renderCell(location, gBoard[cellI][cellJ].minesAroundCount)

}
function changeOpenCellColor(cellI,cellJ){
    const elTd=document.querySelector(`.cell-${cellI}-${cellJ}`)
    elTd.style.backgroundColor = 'gray'

}
function getRndMinesPos(cellI, cellJ) {
    var locations = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (cellI === i && cellJ === j) continue
            locations.push({ i, j })
        }
    }
    for (var idx = 0; idx < gLevel.MINES; idx++) {
        var rndIdx = getRandomInt(0, locations.length)
        gMinesPos.push(locations[rndIdx])
        locations.splice(rndIdx, 1)
    }
}
function addRndMinespos(cellI, cellJ) {
    getRndMinesPos(cellI, cellJ)
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
    if(gBoard[cellI][cellJ].isShown) return
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
function restart() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
    gMinesPos = []
    gCountLife = 0
    clearInterval(gClockInterval)
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
function onEmojiClick() {
    restart()
}
function renderEmoji() {
    var elEmoji = document.querySelector('.emoji')
    var msg = NORMAL
    if (gIsWin) msg = WIN
    else if (isGameOver()) msg = LOSE
    elEmoji.innerHTML = msg

}
function time() {
    gSec = checkTime(gSec)
    document.querySelector('.sec').innerHTML = gSec;
    gSec++

}
function checkTime(time) {
    if (time < 10) time = '00' + time
    else if (time < 100) time = '0' + time
    return time
}
function renderLife() {
    var msg
    switch (gCountLife) {
        case 0:
            msg = LIFE + LIFE + LIFE
            break
        case 1:
            msg = LIFE + LIFE
            break
        case 2:
            msg = LIFE
            break
        default:
            msg = ''
            break
    }

    document.querySelector('.life').innerHTML=msg
}
