'use strict'
console.log('Main is Connected')

const MINE = '💣'
const SAFE = ''


var gBoard

function initGame() {
  console.log('the game has began')

  gBoard = buildBoard(2, 2)
  setMines(gBoard,2)
  setMineNegsCount(gBoard)

  renderBoard(gBoard)


}


function buildBoard(cols, rows) {
  return [
    [{ isMine: false }, { isMine: false }, { isMine: false }, { isMine: false }],
    [{ isMine: false }, { isMine: false }, { isMine: false }, { isMine: false }],
    [{ isMine: false }, { isMine: false }, { isMine: false }, { isMine: false }],
    [{ isMine: false }, { isMine: false }, { isMine: false }, { isMine: false }]
  ]
}


function setMines(board, mineAmount) {
  //static code
  board[0][0].isMine = true
  board[2][2].isMine = true

  //dynamic code
  // for (var i = 0; i < mineAmount; i++){
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

function countMineNegs(board, rowIdx, colIdx) {
  var mineCount = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue

    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === rowIdx && j === colIdx) continue
      const cell = board[i][j]
      if(cell.isMine === true)mineCount++
    }
  }
  return mineCount
}



function renderBoard(board) {
  var strHTML = ``
  for (var i = 0; i < board.length; i++) {
    strHTML += `\n<tr>\n`

    for (var j = 0; j < board[i].length; j++) {
      const cell = (board[i][j].isMine) ? MINE : ''
      const className = `cell`
      const data = `data-i ="${i}" data-j ="${j}"`
      strHTML += `\t<td class="${className}" ${data} onclick="onCellClicked(this,gBoard)"></td>\n`
    }

    strHTML += `</tr>\n`
  }
  // console.log(strHTML)
  const elBoard = document.querySelector('.board')
  // console.log(elBoard)

  elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, board){
  // console.log(elCell)
  const cell = board[elCell.dataset.i][elCell.dataset.j]
  if(cell.isMine){
    elCell.innerText  = MINE
  }else{
    elCell.innerText  = cell.minesAroundCount 
  }

  
}

