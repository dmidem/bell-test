const {
  measureByClassicalRulesV1,
  measureByClassicalRulesV2,
  measureByQuantumRules,
  runExperiment
} = require('./bell')

const { xorshiftRand } = require('../xorshift')

function runConfiguredExperiment (measure) {
  const nIterations = 10000

  const {
    nSameSettings,
    nMatchingOutcomesForSameSettings,
    nDiffSettings,
    nMatchingOutcomesForDiffSettings
  } = runExperiment(nIterations, measure, xorshiftRand)

  const matchingOutcomes =
    ((nMatchingOutcomesForSameSettings + nMatchingOutcomesForDiffSettings) /
      (nSameSettings + nDiffSettings)) *
    100

  const matchingOutcomesForSameSettings =
    (nMatchingOutcomesForSameSettings / nSameSettings) * 100

  const matchingOutcomesForDiffSettings =
    (nMatchingOutcomesForDiffSettings / nDiffSettings) * 100

  return {
    matchingOutcomes,
    matchingOutcomesForSameSettings,
    matchingOutcomesForDiffSettings
  }
}

function runTest (
  measure,
  expectedMatchingOutcomes,
  expectedMatchingOutcomesForDiffSettings
) {
  const epsilon = 2

  const {
    matchingOutcomes,
    matchingOutcomesForSameSettings,
    matchingOutcomesForDiffSettings
  } = runConfiguredExperiment(measure)

  it('Should have proper outcome percentage', () => {
    expect(matchingOutcomes).toBeGreaterThanOrEqual(
      expectedMatchingOutcomes - epsilon
    )
    expect(matchingOutcomes).toBeLessThanOrEqual(
      expectedMatchingOutcomes + epsilon
    )

    expect(matchingOutcomesForSameSettings).toBe(100)

    expect(matchingOutcomesForDiffSettings).toBeGreaterThanOrEqual(
      expectedMatchingOutcomesForDiffSettings - epsilon
    )
    expect(matchingOutcomesForDiffSettings).toBeLessThanOrEqual(
      expectedMatchingOutcomesForDiffSettings + epsilon
    )
  })
}

describe('Experiment using classical rules (version 1 - full set of predetermined outcomes)', () => {
  runTest(measureByClassicalRulesV1, 66.7, 50.0)
})

describe('Experiment using classical rules (version 2 - reduced set of predetermined outcomes, with different outcomes only)', () => {
  runTest(measureByClassicalRulesV2, 55.0, 33.3)
})

describe('Experiment using quantum rules', () => {
  runTest(measureByQuantumRules, 50.0, 25.0)
})
