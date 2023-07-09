const {
  measureByClassicalRules,
  measureByQuantumRules,
  runExperiment
} = require('./bell')

function dumpResult (result) {
  console.log(`Result: ${result}`)
}

function runConfiguredExperiment (measure) {
  const nIterations = 10000
  dumpResult(runExperiment(nIterations, measure, Math.random))
}

console.log(
  '*** Bell test experiment for photons with entangled polarization values ***'
)

console.log('\nExperiment by classical rules')
runConfiguredExperiment(measureByClassicalRules)

// https://en.wikipedia.org/wiki/Tsirelson%27s_bound
console.log('\nExperiment by quantum rules')
runConfiguredExperiment(measureByQuantumRules)

console.log()
