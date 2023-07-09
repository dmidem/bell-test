const {
  measureByClassicalRulesV1,
  measureByClassicalRulesV2,
  measureByQuantumRules,
  runExperiment
} = require('./bell')

const formatPercentage = (value, total) =>
  `${value}/${total} = ${((value / total) * 100).toFixed(2)}%`

function dumpStatistics ({
  nSameSettings,
  nMatchingOutcomesForSameSettings,
  nDiffSettings,
  nMatchingOutcomesForDiffSettings
}) {
  console.log(
    `Matching outcomes: ${formatPercentage(
      nMatchingOutcomesForSameSettings + nMatchingOutcomesForDiffSettings,
      nSameSettings + nDiffSettings
    )}`
  )
  console.log(
    `Matching outcomes for same settings: ${formatPercentage(
      nMatchingOutcomesForSameSettings,
      nSameSettings
    )}`
  )
  console.log(
    `Matching outcomes for diff settings: ${formatPercentage(
      nMatchingOutcomesForDiffSettings,
      nDiffSettings
    )}`
  )
}

function runConfiguredExperiment (measure) {
  const nIterations = 10000
  dumpStatistics(runExperiment(nIterations, measure, Math.random))
}

console.log(
  '*** Bell test experiment for electrons with entangled spin values ***'
)

console.log(
  '\nExperiment by classical rules (version 1 - full set of predetermined outcomes)'
)
runConfiguredExperiment(measureByClassicalRulesV1)

console.log(
  '\nExperiment by classical rules (version 2 - reduced set of predetermined outcomes (with different outcomes only)'
)
runConfiguredExperiment(measureByClassicalRulesV2)

console.log('\nExperiment by quantum rules')
runConfiguredExperiment(measureByQuantumRules)

console.log()
