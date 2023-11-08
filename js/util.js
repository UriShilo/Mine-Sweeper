'use strict'
console.log('Util is Connected')


function getPosOfRandomSafeCell(matrix) {
  var cellsPos = []
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j].isMine === false) {
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


