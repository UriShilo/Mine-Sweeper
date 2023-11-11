'use strict'
console.log('Util is Connected')

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function copyMatrix(matrix) {
  const copy = []
  for (var i = 0; i < matrix.length; i++) {
    copy.push([])
    for (var j = 0; j < matrix[i].length; j++) {
      const cell = matrix[i][j]
      const cellCopy = {}

      for (var property in cell) {
        cellCopy[property] = cell[property]
      }

      copy[i].push(cellCopy)
    }
  }
  console.log(copy)
  return copy
}
