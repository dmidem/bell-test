// https://en.wikipedia.org/wiki/Bell_test

const nSettings = 2
const nOutcomes = 2

// Detector settings: possible test angles (in degrees) for the left (a) and right (b) detectors
const testAngles = {
  a: [0, 45],
  b: [22.5, 67.5]
}

// const sqr = (x) => x * x

const generateRandomIndex = (upperBound, rand) =>
  Math.floor(rand() * upperBound)

const generateRandomOutcomeIndex = (rand) =>
  generateRandomIndex(nOutcomes, rand)

const generatePredeterminedOutcomeIndexes = (rand) =>
  [...Array(nSettings)].map((_) => generateRandomOutcomeIndex(rand))

// Entangled electrons has opposite spins, while entangled photons has orthogonal polarizations,
// so we need to use cos(a)  for electrons and cos(2*a) for photons in formulas of calculation of
// probability of the coincidence/non-coincedence outcomes.
//
// Also note, that in Bell's experiment scheme detector bases are already installed orthogonally to
// detect entangled photons with the same (not oppose) outcome.
//
// From https://en.wikipedia.org/wiki/Aspect%27s_experiment:
// P++(a,b) = P--(a,b) = 1/2*cos(a-b)^2
// P+-(a,b) = P-+(a,b) = 1/2*sin(a-b)^2
// I.e. probability of the coincidece: Pc=cos(angleDiffRad)^2=0.5(1+cos(2*angleDiffRad))
//
// See also: https://en.wikipedia.org/wiki/CHSH_inequality
// And: https://bingweb.binghamton.edu/~suzuki/QuantumMechanicsFiles/10-1_Quantum_entanglement.pdf, pages 18-19
// https://www.scirp.org/pdf/oalibj_2022012716283714.pdf, https://arxiv.org/pdf/2011.09296.pdf
const generateQuantumChoiceByAngleDiff = (angleDiffDeg, choices, rand) =>
  choices[
    rand() < 0.5 * (1 + Math.cos((2 * (Math.PI * angleDiffDeg)) / 180)) ? 0 : 1
    // rand() < sqr(Math.cos((Math.PI * angleDeg) / 180)) ? 0 : 1
  ]

function measureByClassicalRules (settingAIndex, settingBIndex, rand) {
  const predeterminedOutcomeIndexes = generatePredeterminedOutcomeIndexes(rand)

  const outcomeAIndex = predeterminedOutcomeIndexes[settingAIndex]
  const outcomeBIndex = predeterminedOutcomeIndexes[settingBIndex]

  return [outcomeAIndex, outcomeBIndex]
}

function measureByQuantumRules (settingAIndex, settingBIndex, rand) {
  const outcomeAIndex = generateRandomOutcomeIndex(rand)
  const outcomeAIndexOpposite = 1 - outcomeAIndex

  const outcomeBIndex = generateQuantumChoiceByAngleDiff(
    testAngles.b[settingBIndex] - testAngles.a[settingAIndex],
    [outcomeAIndex, outcomeAIndexOpposite],
    rand
  )

  return [outcomeAIndex, outcomeBIndex]
}

function runExperiment (nIterations, measure, rand) {
  const en = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]

  for (let settingAIndex = 0; settingAIndex < 2; ++settingAIndex) {
    for (let settingBIndex = 0; settingBIndex < 2; ++settingBIndex) {
      const eIndex = settingAIndex * 2 + settingBIndex

      for (let i = 0; i < nIterations; i++) {
        const [outcomeAIndex, outcomeBIndex] = measure(
          settingAIndex,
          settingBIndex,
          rand
        )

        const nIndex = outcomeAIndex * 2 + outcomeBIndex

        en[eIndex][nIndex]++
      }
    }
  }

  // To protect from division by zero, if denoiminator === 0 then take quotient as zero
  const e = en
    .map((n) => [n[0] - n[1] - n[2] + n[3], n[0] + n[1] + n[2] + n[3]])
    .map(([num, den]) => (den === 0 ? 0 : num / den))

  return e[0] - e[1] + e[2] + e[3]
}

module.exports = {
  measureByClassicalRules,
  measureByQuantumRules,
  runExperiment
}
