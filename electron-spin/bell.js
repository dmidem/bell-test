/*
Simulation of a quantum experiment with entangled particles to check Bell's theorem

Description:

This code simulates a quantum experiment involving entangled particles to investigate and validate Bell's theorem.
Bell's theorem is a fundamental concept in quantum mechanics that tests the limits of classical physics and supports the idea of quantum entanglement.

The experiment involves two settings (measurement angles) labeled as "A", "B", and "C".
Each setting has three possible outcomes: "Up" and "Down".
The goal is to measure and compare the outcome statistics based on different measurement rules.

The code contains the following components:

1. Generation of Random Choices:
   - The getRandomChoice() function selects a random item from an array of choices.
   - The getRandomSetting() function generates a random setting (measurement angle).
   - The getRandomOutcome() function generates a random outcome (measurement result).

2. Generation of Predetermined Outcomes:
   - The generatePredeterminedOutcomesV1() function generates a set of predetermined outcomes using random choices.
   - The generatePredeterminedOutcomesV2() function generates a set of predetermined outcomes with different outcomes only (no repetitions).

3. Measurement Based on Classical Rules:
   - The generateClassicalOutcome() function determines the outcome based on a given setting and predetermined outcomes.
   - The measureByClassicalRules() function measures the outcomes based on classical rules using predetermined outcomes.
   - The measureByClassicalRulesV1() function performs the measurement with a full set of predetermined outcomes.
   - The measureByClassicalRulesV2() function performs the measurement with a reduced set of predetermined outcomes.

4. Measurement Based on Quantum Rules:
   - The generateQuantumOutcomeByAngle() function generates a quantum outcome based on the measurement angle and choices.
   - The measureByQuantumRules() function performs the measurement based on quantum rules.

5. Experiment Execution and Results:
   - The runExperiment() function runs the simulation for a specified number of iterations, using a given measurement method.
   - The formatPercentage() function formats the result percentages for display.
   - The console.log statements execute the experiments and display the results.

6. Bell's Theorem:
   - Bell's theorem is a fundamental concept in quantum mechanics that challenges classical physics and tests the existence of local hidden variables.
   - It states that certain predictions made by quantum mechanics are incompatible with the assumptions of local realism, which implies the existence of local hidden variables.
   - Bell's theorem has been experimentally verified and supports the notion of quantum entanglement and non-locality.
*/

const nSettings = 3
const nOutcomes = 2

// Detector settings: possible test angles (in degrees) for the left (a) and right (b) detectors
const testAngles = [0, 120, 240]

const generateRandomIndex = (upperBound, rand) =>
  Math.floor(rand() * upperBound)

const generateRandomSettingIndex = (rand) =>
  generateRandomIndex(nSettings, rand)

const generateRandomOutcomeIndex = (rand) =>
  generateRandomIndex(nOutcomes, rand)

const generatePredeterminedOutcomeIndexesV1 = (rand) =>
  [...Array(nSettings)].map((_) => generateRandomOutcomeIndex(rand))

function generatePredeterminedOutcomeIndexesV2 (rand) {
  while (true) {
    const outcomeIndexes = generatePredeterminedOutcomeIndexesV1(rand)

    // Return outcomes if they contain at least two defferent items
    if (new Set(outcomeIndexes).size > 1) {
      return outcomeIndexes
    }
  }
}

const generateClassicalOutcome = (settingIndex, predeterminedOutcomes) =>
  predeterminedOutcomes[settingIndex]

// See https://bingweb.binghamton.edu/~suzuki/QuantumMechanicsFiles/10-1_Quantum_entanglement.pdf, pages 18-19
const generateQuantumChoiceByAngleDiff = (angleDiffDeg, choices, rand) =>
  choices[
    rand() < 0.5 * (1 + Math.cos((Math.PI * angleDiffDeg) / 180)) ? 0 : 1
  ]

const measureByClassicalRules = (
  settingAIndex,
  settingBIndex,
  predeterminedOutcomes
) => [
  generateClassicalOutcome(settingAIndex, predeterminedOutcomes),
  generateClassicalOutcome(settingBIndex, predeterminedOutcomes)
]

const measureByClassicalRulesV1 = (settingAIndex, settingBIndex, rand) =>
  measureByClassicalRules(
    settingAIndex,
    settingBIndex,
    generatePredeterminedOutcomeIndexesV1(rand)
  )

const measureByClassicalRulesV2 = (settingAIndex, settingBIndex, rand) =>
  measureByClassicalRules(
    settingAIndex,
    settingBIndex,
    generatePredeterminedOutcomeIndexesV2(rand)
  )

function measureByQuantumRules (settingAIndex, settingBIndex, rand) {
  const outcomeAIndex = generateRandomOutcomeIndex(rand)
  const outcomeAIndexOpposite = 1 - outcomeAIndex

  const outcomeBIndex = generateQuantumChoiceByAngleDiff(
    testAngles[settingBIndex] - testAngles[settingAIndex],
    [outcomeAIndex, outcomeAIndexOpposite],
    rand
  )

  return [outcomeAIndex, outcomeBIndex]
}

function runExperiment (nIterations, measure, rand) {
  let nSameSettings = 0
  let nMatchingOutcomesForSameSettings = 0

  let nDiffSettings = 0
  let nMatchingOutcomesForDiffSettings = 0

  for (let i = 0; i < nIterations; i++) {
    const settingAIndex = generateRandomSettingIndex(rand)
    const settingBIndex = generateRandomSettingIndex(rand)

    const [outcomeAIndex, outcomeBIndex] = measure(
      settingAIndex,
      settingBIndex,
      rand
    )

    if (settingAIndex === settingBIndex) {
      if (outcomeAIndex === outcomeBIndex) {
        nMatchingOutcomesForSameSettings++
      }
      nSameSettings++
    } else {
      if (outcomeAIndex === outcomeBIndex) {
        nMatchingOutcomesForDiffSettings++
      }
      nDiffSettings++
    }
  }

  return {
    nSameSettings,
    nMatchingOutcomesForSameSettings,
    nDiffSettings,
    nMatchingOutcomesForDiffSettings
  }
}

module.exports = {
  measureByClassicalRulesV1,
  measureByClassicalRulesV2,
  measureByQuantumRules,
  runExperiment
}
