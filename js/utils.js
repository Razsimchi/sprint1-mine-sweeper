'use strict'

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}
function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}
function renderBoard(mat, selector) {

    var strHTML = `<table class="board" border="0"><tr><th colspan="${gLevel.SIZE}"><span class="counter"></span><span onclick="onEmojiClick()" class="emoji"></span><span class="sec"></span></th></tr><tbody>`
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {
            const className = `cell cell-${i}-${j}`
            strHTML += `<td oncontextmenu="onRightClick(${i},${j})" onclick="onCellClicked(this,${i},${j})" class="${className}">${''}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}
function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}
function getRndColor() {

    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;


}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function findEmptyPosRandom() {
    const emptyLocations = []
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 12; j++) {
            const cell = gBoard[i][j].gameElement
            if (!cell && gBoard[i][j].type !== WALL) {
                const pos = { i, j }
                emptyLocations.push(pos)
            }
        }
    }
    const randIdx = getRandomInt(0, emptyLocations.length)
    return emptyLocations[randIdx]
}
