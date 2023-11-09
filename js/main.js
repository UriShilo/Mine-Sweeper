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
  gGame.isOn=false
  gGame.lives = lives
  gGame.shownCount =0
  gLevel.size = size
  gLevel.mines = mines
  updateLivesCounter()
  gBoard = buildBoard(size)
  renderBoard(gBoard)

  //player first click is registered
  //there for i need to edit onCellClicked
  //set mines in not allowed to start unless we registered a click
  // setMines(gBoard, mines)

  // setMineNegsCount(gBoard)
  // gGame.isOn = true
  // console.log('the game has began')
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
  //static code
  // board[2][1].isMine = true
  // board[3][2].isMine = true

  //dynamic code
  for (var i = 0; i < mineAmount; i++) {
    const cellPos = getPosOfRandomSafeCell(board, rowIdx, colIdx)
    board[cellPos.i][cellPos.j].isMine = true
  }

  setMineNegsCount(board)
  gGame.isOn = true
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
      // const cell = (board[i][j].isMine) ? MINE : ''
      const className = `cell`
      const data = `data-i ="${i}" data-j ="${j}"`
      const position = JSON.stringify({ i, j })
      // console.log(pos)
      // console.log(pos.i)
      // console.log(pos.j)
      strHTML += `\t<td class="${className}" ${data} 
      onclick="onCellClicked(this,gBoard)"
      oncontextmenu='toggleFlag(gBoard,${position});return false;'></td>\n`
    }

    strHTML += `</tr>\n`
  }
  // console.log(strHTML)
  const elBoard = document.querySelector('.board')
  // console.log(elBoard)

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, board) {
  const i = +elCell.dataset.i
  const j = +elCell.dataset.j
  // the eddit will be that if the game in not one we register the cell position and sent it to set mines
  // if (!gGame.isOn) return



  if (!gGame.isOn) setMines(board, gLevel.mines, i, j)

  const cell = board[i][j]
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
    clickSurroundingCells(i, j, board)
  }

  gGame.shownCount++
  elCell.innerText = cell.minesAroundCount


  ifGameOver()
}

function toggleFlag(board, pos) {
  // console.log('in')
  if (!gGame.isOn) return
  const i = pos.i
  const j = pos.j
  // console.log(i)
  // console.log(j)

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
  // console.log(gGame.lives)
  if (gGame.lives === 0) {
    gGame.isOn = false
    console.log('you lost')
    revelAllCells(gBoard)
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
