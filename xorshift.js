let xorshiftRandState = 1

function xorshiftRand () {
  const MAX_X = 0x0fffffff

  let x = xorshiftRandState

  x ^= x << 13
  x ^= x >> 17
  x ^= x << 5

  x &= MAX_X

  xorshiftRandState = x

  return x / (MAX_X + 1)
}

module.exports = { xorshiftRand }
