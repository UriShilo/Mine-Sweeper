'use strict'
console.log('Util is Connected')


function getPosOfRandomSafeCell(board, rowIdx, colIdx) {
  console.log('i:',rowIdx,'j:',colIdx)
  var cellsPos = []

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {

      //the clicked cell can not be a mine?
      
      // console.log('i:',i,'j:',j)
      if (i === rowIdx && j === colIdx){
        // console.log('skipped')
        continue
      } 

      if (board[i][j].isMine === false) {
        cellsPos.push({
          i,
          j,
        })
      }
    }
  }
  if (cellsPos.length === 0) return null
  // const randomCellPos =cellsPos.splice(getRandomInteger(0, cellsPos.length), 1)[0]
  // const randomCellPos = cellsPos.splice(Math.floor(Math.random() * cellsPos.length), 1)[0]
  const randomCellPos = cellsPos.splice(getRandomInt(0, cellsPos.length), 1)[0]

  return randomCellPos
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
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
// function getPosOfRandomCell(matrix, value) {
//   var cellsPos = []
//   for (var i = 0; i < matrix.length; i++) {
//     for (var j = 0; j < matrix[i].length; j++) {
//       if (matrix[i][j] === value) {
//         cellsPos.push({
//           i,
//           j,
//         })
//       }
//     }
//   }
//   if (cellsPos.length === 0) return null
//   // const randomCellPos =cellsPos.splice(getRandomInteger(0, cellsPos.length), 1)[0]
//   // const randomCellPos = cellsPos.splice(Math.floor(Math.random() * cellsPos.length), 1)[0]
//   const randomCellPos = cellsPos.splice(getRandomInt(0, cellsPos.length), 1)[0]

//   return randomCellPos
// }


