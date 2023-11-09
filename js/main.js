'use strict'
console.log('Main is Connected')

const MINE = '💣'
const EXPLOSION = '🔥'
const SAFE = ''
const FLAG = '🚩'
const gLevel = {
  size: 4,
  mines: 3,
}
const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3
}

var gBoard

function initGame(size = 4, mines = 2, lives = 2) {
  gLevel.size = size
  gLevel.mines = mines
  gGame.lives = lives

  updateLivesCounter()

  gBoard = buildBoard(size)

  //player first click is registered
  //there for i need to eddit onCellClicked

  //set mines in not alowed to start unless we registered a click

  setMines(gBoard, mines)

  setMineNegsCount(gBoard)

  renderBoard(gBoard)

  gGame.isOn = true
  console.log('the game has began')


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

function setMines(board, mineAmount) {
  //static code
  board[0][0].isMine = true
  board[2][2].isMine = true

  //dynamic code
  // for (var i = 0; i < mineAmount; i++) {
  //   const cellPos = getPosOfRandomSafeCell(board)
  //   board[cellPos.i][cellPos.j].isMine = true
  // }

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
      // const cell = (board[i][j].isMine) ? MINE : ''
      const className = `cell`
      const data = `data-i ="${i}" data-j ="${j}"`
      strHTML += `\t<td class="${className}" ${data} 
      onclick="onCellClicked(this,gBoard)"
      oncontextmenu="toggleFlag(gBoard,${i},${j});return false;"></td>\n`
    }

    strHTML += `</tr>\n`
  }
  // console.log(strHTML)
  const elBoard = document.querySelector('.board')
  // console.log(elBoard)

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, board) {
  // the eddit will be that if the game in not one we register the cell position and sent it to set mines
  if (!gGame.isOn) return
  const cell = board[elCell.dataset.i][elCell.dataset.j]
  if (cell.isMarked) {
    console.error('you can not revel flagged cells!')
    return
  }
  if (cell.isShown) {
    console.error('this cell is already reveled')
    return
  }

  console.log(elCell)

  cell.isShown = true

  // if (cell.isMarked === true) return
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
    clickSurroundingCells(elCell.dataset.i, elCell.dataset.j, board)
  }

  gGame.shownCount++
  elCell.innerText = cell.minesAroundCount


  ifGameOver()
}

function toggleFlag(board, i, j) {
  if (!gGame.isOn) return

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
  console.log(gGame.lives)
  if (gGame.lives === 0) {
    gGame.isOn = false
    console.log('you lost')
    return
  }
  console.log('flagged mines:', countFlaggedMines(gBoard), '|', 'mines on board:', gLevel.mines)
  console.log('are all the safe cells reveled?:', gGame.shownCount === gLevel.size ** 2 - gLevel.mines)
  const safeCellsOnBoard = gLevel.size ** 2 - gLevel.mines

  if (gGame.shownCount === safeCellsOnBoard &&
    countFlaggedMines(gBoard) === gLevel.mines) {
    gGame.isOn = false
    console.log('you won')
  }
}

