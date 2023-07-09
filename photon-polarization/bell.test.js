const {
  measureByClassicalRules,
  measureByQuantumRules,
  runExperiment
} = require('./bell')

const { xorshiftRand } = require('../xorshift')

function runConfiguredExperiment (measure) {
  const nIterations = 10000
  return runExperiment(nIterations, measure, xorshiftRand)
}

function runTest (measure, expectedResult) {
  const epsilon = 0.05

  const result = runConfiguredExperiment(measure)

  it('Should have proper result value', () => {
    expect(result).toBeGreaterThanOrEqual(expectedResult - epsilon)
    expect(result).toBeLessThanOrEqual(expectedResult + epsilon)
  })
}

describe('Experiment using classical rules', () => {
  runTest(measureByClassicalRules, 2)
})

describe('Experiment using quantum rules', () => {
  runTest(measureByQuantumRules, 2.84)
})
