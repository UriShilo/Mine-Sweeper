'use strict'
console.log('Test is Connected')

function test() {
  
  if (!testGetPosOfRandomCell()) {
    console.error('getPosOfRandomCell() is not functioning correctly')
  }



  return 'Test is done'
}

function testGetPosOfRandomCell() {
  const matrix = [
    [1, 2],
    [3, 1]
  ]
  const value = 1

  const res = getPosOfRandomCell(matrix, value)

  return res.i === 0 && res.j === 0 || res.i === 1 && res.j === 1

}