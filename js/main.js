'use strict'
console.log('Main is Connected')

const MINE = '💣'
const SAFE = ''
const FLAG = '🚩'


var gBoard

function initGame() {
  console.log('the game has began')

  gBoard = buildBoard(4, 4)
  setMines(gBoard, 2)
  setMineNegsCount(gBoard)

  renderBoard(gBoard)


}


function buildBoard(rows, cols) {

  var board = []
  for (var i = 0; i < rows; i++) {
    board.push([])
    for (var j = 0; j < cols; j++) {
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
  // board[0][0].isMine = true
  // board[2][2].isMine = true

  //dynamic code
  for (var i = 0; i < mineAmount; i++) {
    const cellPos = getPosOfRandomSafeCell(board)
    board[cellPos.i][cellPos.j].isMine = true
  }

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
  const cell = board[elCell.dataset.i][elCell.dataset.j]
  if (cell.isShown || cell.isMarked) {
    console.error('you can not revel flagged cells!')
    return
  }

  console.log(elCell)

  cell.isShown = true

  if (cell.isMarked === true) return
  if (cell.isMine) {
    elCell.innerText = MINE
  } else {
    elCell.innerText = cell.minesAroundCount
  }
}

function toggleFlag(board, i, j) {
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
}

