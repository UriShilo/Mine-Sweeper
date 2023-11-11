'use strict'
console.log('Main is Connected')

const MINE = '💣'
const EXPLOSION = '🔥'
const SAFE = ''
const FLAG = '🚩'


var gLevel
var gGame
var gBoard
var timerInterval

function initGame(size = 4, mines = 2, lives = 2) {
  clearInterval(timerInterval)
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    lives: lives,
    secsPassed: 0,
    timerInterval: null
  }
  gLevel = {
    size: size,
    mines: mines,
  }

  gBoard = buildBoard(gLevel.size)
  renderBoard(gBoard)
  renderLivesCounter()
  renderTimer()
  renderReplayButtons(size, mines, lives)
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

function renderReplayButtons(size, mines, lives) {
  const elSmileyButton = document.querySelector('.smiley-button')
  elSmileyButton.onclick = () => { initGame(size, mines, lives) }
  elSmileyButton.innerText = '😀'

  const elReplayButton = document.querySelector('.modal button')
  elReplayButton.onclick = () => { initGame(size, mines, lives) }
}

function onCellClicked(elCell, board) {
  if (!gGame.isOn) return

  const i = +elCell.dataset.i
  const j = +elCell.dataset.j
  const cell = board[i][j]

  if (cell.isMarked || cell.isShown) return

  if (isFirstClick()) {
    setMines(board, gLevel.mines, i, j)
    timerInterval = setInterval(() => { UpdateTimer() }, 1000)
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
}

function getPosOfRandomSafeCell(board, rowIdx, colIdx) {
  // console.log('i:', rowIdx, 'j:', colIdx)
  var cellsPos = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {


      const isStartingArea = i >= rowIdx - 1 && i <= rowIdx + 1 && j >= colIdx - 1 && j <= colIdx + 1
      //old condition: i === rowIdx && j === colIdx

      if (isStartingArea) {
        continue
      }
      if (!board[i][j].isMine) {
        cellsPos.push({
          i,
          j,
        })
      }
    }
  }

  if (cellsPos.length === 0) return null

  const safePosition = cellsPos.splice(getRandomInt(0, cellsPos.length), 1)[0]
  return safePosition
}

function setMineNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      cell.minesAroundCount = countMineNegs(board, i, j)
    }
  }
}

function UpdateTimer() {
  gGame.secsPassed++
  renderTimer()
}

function renderTimer() {
  const timer = document.querySelector('.timer span')
  timer.innerText = gGame.secsPassed
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

  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = (colIdx - 1); j <= (colIdx + 1); j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue

      const cell = board[i][j]
      if (cell.isShown) continue
      const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
      onCellClicked(elCell, board)
    }
  }
}

function toggleFlag(board, pos) {
  if (!gGame.isOn) return
  const i = pos.i
  const j = pos.j

  const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)

  if (board[i][j].isShown) return

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
    clearInterval(timerInterval)
    showModal('you lost\n🤯\n\n')
    elSmileyButton.innerText = '🤯'
  } else {

    // console.log('flagged mines:', countFlaggedMines(gBoard), '|', 'mines on board:', gLevel.mines)
    // console.log('are all the safe cells reveled?:', gGame.shownCount === gLevel.size ** 2 - gLevel.mines)
    // console.log(gGame.shownCount)


    const safeCellsOnBoard = gLevel.size ** 2 - gLevel.mines

    if (gGame.shownCount === safeCellsOnBoard &&
      countFlaggedMines(gBoard) === gLevel.mines) {
      gGame.isOn = false
      elSmileyButton.innerText = '😎'
      clearInterval(timerInterval)
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

function toggleDisplayMode() {
  const body = document.querySelector('body')
  body.classList.toggle('dark-mode')

  const header = document.querySelector('h1')
  header.classList.toggle('dark-mode')

  const livesCounter = document.querySelector('.lives-counter')
  livesCounter.classList.toggle('dark-mode')

  const displayModeButtonSpan = document.querySelector('.display-mode span')
  const newText = (displayModeButtonSpan.innerText === 'Dark mode') ? 'Light mode' : 'Dark mode'
  displayModeButtonSpan.innerText = newText
}

