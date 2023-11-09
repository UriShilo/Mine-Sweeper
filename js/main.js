'use strict'
console.log('Main is Connected')

const MINE = '💣'
const EXPLOSION = '🔥'
const SAFE = ''
const FLAG = '🚩'
const gLevel = {
  size: 4,
  mines: 2,
}
const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 2
}

var gBoard

function setLevel(size = 4, mines = 2, lives = 2) {
  gGame.lives = lives
  gLevel.size = size
  gLevel.mines = mines
  updateLivesCounter
  initGame()

}
function initGame() {

  const elButton = document.querySelector('.smiley-button')
  elButton.innerText = '😀'
  gGame.shownCount = 0
  updateLivesCounter()
  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
  gGame.isOn = true

}

function buildBoard(size) {

  var board = []
  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i].push({
        isShown: false,
        isMine: false,
        isMarked: false
      })
    }
  }
  return board
}

function setMines(board, mineAmount, rowIdx, colIdx) {
  for (var i = 0; i < mineAmount; i++) {
    const cellPos = getPosOfRandomSafeCell(board, rowIdx, colIdx)
    board[cellPos.i][cellPos.j].isMine = true
  }

  setMineNegsCount(board)
  console.log('the game has began')
  console.log(gBoard)
}

function setMineNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      cell.minesAroundCount = countMineNegs(board, i, j)
    }
  }
}

function renderBoard(board) {
  var strHTML = ``
  for (var i = 0; i < board.length; i++) {
    strHTML += `\n<tr>\n`

    for (var j = 0; j < board[i].length; j++) {
      const className = `cell`
      const data = `data-i ="${i}" data-j ="${j}"`
      const position = JSON.stringify({ i, j })
      strHTML += `\t<td class="${className}" ${data} 
      onclick="onCellClicked(this,gBoard)"
      oncontextmenu='toggleFlag(gBoard,${position});return false;'></td>\n`
    }
    strHTML += `</tr>\n`
  }
  const elBoard = document.querySelector('.board')

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, board) {
  const i = +elCell.dataset.i
  const j = +elCell.dataset.j
  /////////////////////////////////////////////

  if (!gGame.isOn) return
  if (gGame.shownCount === 0) setMines(board, gLevel.mines, i, j)



  ///////////////////////////////////////////////
  const cell = board[i][j]
  if (cell.isMarked) {
    console.error('you can not revel flagged cells!')
    return
  }
  if (cell.isShown) {
    console.error('this cell is already reveled')
    return
  }

  cell.isShown = true

  if (cell.isMine) {
    //model
    gGame.lives--
    gLevel.mines--
    gGame.shownCount++
    //DOM
    updateLivesCounter()
    elCell.innerText = MINE
    setTimeout(() => { elCell.innerText = EXPLOSION }, 400)
    ifGameOver()
    return
  }

  if (cell.minesAroundCount === 0) {
    clickSurroundingCells(i, j, board)
  }

  gGame.shownCount++
  elCell.innerText = (cell.minesAroundCount) ? cell.minesAroundCount : ''
  elCell.classList.add('reveled')

  ifGameOver()
}

function toggleFlag(board, pos) {
  if (!gGame.isOn) return
  const i = pos.i
  const j = pos.j

  const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
  if (elCell.innerText !== FLAG &&
    elCell.innerText !== SAFE) {
    console.error(i, j, 'you can not flag previously reveled cells!')
    return
  }

  console.log('flag toggled at', i, j)
  //model
  board[i][j].isMarked ^= true
  //DOM
  elCell.innerText = board[i][j].isMarked ? FLAG : SAFE
  ifGameOver()
}

function updateLivesCounter() {
  const livesCounter = document.querySelector('.lives-counter span')
  livesCounter.innerText = gGame.lives
}

function ifGameOver() {
  if (gGame.lives === 0) {
    gGame.isOn = false
    console.log('you lost')
    revelAllCells(gBoard)

    const elButton = document.querySelector('.smiley-button')
    elButton.innerText = '🤯'
    return
  }
  console.log('flagged mines:', countFlaggedMines(gBoard), '|', 'mines on board:', gLevel.mines)
  console.log('are all the safe cells reveled?:', gGame.shownCount === gLevel.size ** 2 - gLevel.mines)
  console.log(gGame.shownCount)

  const safeCellsOnBoard = gLevel.size ** 2 - gLevel.mines

  if (gGame.shownCount === safeCellsOnBoard &&
    countFlaggedMines(gBoard) === gLevel.mines) {
    gGame.isOn = false
    console.log('you won')
    const elButton = document.querySelector('.smiley-button')
    elButton.innerText = '😎'

  }
}

function revelAllCells(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      for (var j = 0; j < board[i].length; j++) {
        const cell = board[i][j]
        const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

        elCell.innerText = cell.isMine ? MINE : cell.minesAroundCount

      }
    }
  }
}
