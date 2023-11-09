'use strict'
console.log('Main is Connected')

const MINE = '💣'
const EXPLOSION = '🔥'
const SAFE = ''
const FLAG = '🚩'

var gLevel = {
  size: 4,
  mines: 2,
}
var gGame
var gBoard

function setLevel(size = 4, mines = 2) {
  gLevel.mines = mines
  gLevel.size = size
  initGame()
}

function initGame() {
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
  }

  const elSmileyButton = document.querySelector('.smiley-button')
  elSmileyButton.innerText = '😀'

  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
  renderLivesCounter()
  hideModal()
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
                  oncontextmenu='toggleFlag(gBoard,${position}); return false;'></td>\n`
    }
    strHTML += `</tr>\n`
  }

  const elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function renderLivesCounter() {
  const livesCounter = document.querySelector('.lives-counter span')
  livesCounter.innerText = gGame.lives
}

function onCellClicked(elCell, board) {
  if (!gGame.isOn) return

  const i = +elCell.dataset.i
  const j = +elCell.dataset.j

  if (isFirstClick()) setMines(board, gLevel.mines, i, j)

  const cell = board[i][j]
  if (cell.isMarked) {
    console.log('you can not revel flagged cells!')
    return
  }
  if (cell.isShown) {
    console.log('this cell is already reveled')
    return
  }

  cell.isShown = true
  gGame.shownCount++

  if (cell.isMine) {
    handleMineClick(elCell)
  } else {
    if (cell.minesAroundCount === 0) {
      clickSurroundingCells(i, j, board)
    }

    elCell.innerText = (cell.minesAroundCount) ? cell.minesAroundCount : ''
    elCell.classList.add('reveled')
  }

  ifGameOver()
}

function isFirstClick() {
  return gGame.shownCount === 0
}

function setMines(board, mineAmount, rowIdx, colIdx) {
  for (var i = 0; i < mineAmount; i++) {
    const cellPos = getPosOfRandomSafeCell(board, rowIdx, colIdx)
    board[cellPos.i][cellPos.j].isMine = true
  }

  setMineNegsCount(board)
  console.log('the game has begun')
  console.log(gBoard)
}

function getPosOfRandomSafeCell(board, rowIdx, colIdx) {
  console.log('i:', rowIdx, 'j:', colIdx)
  var cellsPos = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {

      if (i === rowIdx && j === colIdx) {
        continue
      }

      if (board[i][j].isMine===false) {
        cellsPos.push({
          i,
          j,
        })
      }
    }
  }

  if (cellsPos.length === 0) return null

  return cellsPos.splice(getRandomInt(0, cellsPos.length), 1)[0]
}

function setMineNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      cell.minesAroundCount = countMineNegs(board, i, j)
    }
  }
}

function countMineNegs(board, rowIdx, colIdx) {
  var mineCount = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue
      const cell = board[i][j]
      if (cell.isMine === true) mineCount++
    }
  }
  return mineCount
}

function handleMineClick(elCell) {
  //model
  gGame.lives--
  gLevel.mines--
  //DOM
  renderLivesCounter()
  elCell.innerText = MINE
  setTimeout(() => { elCell.innerText = EXPLOSION }, 400)
}

function clickSurroundingCells(rowIdx, colIdx, board) {
  console.log(rowIdx)
  console.log(colIdx)

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      console.log(j)
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue

      const cell = board[i][j]
      if (cell.isShown) continue
      const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
      // console.log(elCell)
      onCellClicked(elCell, board)
    }
  }
}

function toggleFlag(board, pos) {
  if (!gGame.isOn) return
  const i = pos.i
  const j = pos.j

  const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

  if (board[i][j].isShown) {
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

function ifGameOver() {
  const elSmileyButton = document.querySelector('.smiley-button')

  if (gGame.lives === 0) {
    gGame.isOn = false
    revelAllCells(gBoard)
    showModal('you lost\n🤯\n\n')
    elSmileyButton.innerText = '🤯'
  } else {
    const safeCellsOnBoard = gLevel.size ** 2 - gLevel.mines

    if (gGame.shownCount === safeCellsOnBoard &&
      countFlaggedMines(gBoard) === gLevel.mines) {
      gGame.isOn = false
      elSmileyButton.innerText = '😎'
      showModal('you won!\n😎\n\n')
    }
  }
}

function showModal(message) {
  const elMessage = document.querySelector('.message')
  const elModal = document.querySelector('.modal')

  elMessage.innerText = message
  elModal.classList.remove('hidden')

}

function hideModal() {
  const elModal = document.querySelector('.modal')
  elModal.classList.add('hidden')
}


function revelAllCells(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

      elCell.innerText = cell.isMine ? MINE : cell.minesAroundCount

    }
  }
}


function countFlaggedMines(board) {
  var count = 0
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      if (cell.isMine && cell.isMarked) count++
    }
  }
  return count
}

