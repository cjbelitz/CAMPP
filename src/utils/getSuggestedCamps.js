// Maps camp category → environment type
const CATEGORY_ENVIRONMENT = {
  Surf:    'outdoor',
  Sports:  'outdoor',
  Outdoors:'outdoor',
  STEM:    'indoor',
  Arts:    'indoor',
  Music:   'indoor',
}

// Maps camp category → energy/stimulation level
const CATEGORY_STIMULATION = {
  Surf:    'high',
  Sports:  'high',
  Outdoors:'high',
  STEM:    'moderate',
  Arts:    'moderate',
  Music:   'low',
}

// Maps camp category → challenge level
const CATEGORY_CHALLENGE = {
  STEM:    'challenging',
  Sports:  'challenging',
  Surf:    'moderate',
  Outdoors:'moderate',
  Arts:    'easy',
  Music:   'easy',
}

export function getSuggestedCamps(kid, allCamps, savedIds) {
  const pastIds = kid.pastCampIds ?? []

  // Only eligible camps: right age, not already saved, not already attended
  const eligible = allCamps.filter((c) =>
    kid.age >= c.ageMin &&
    kid.age <= c.ageMax &&
    !savedIds.includes(c.id) &&
    !pastIds.includes(c.id)
  )

  const scored = eligible.map((c) => {
    let score = 0

    // Interest / category match — highest weight
    if (kid.interests.includes(c.category)) score += 4

    // Environment preference match
    const campEnv = CATEGORY_ENVIRONMENT[c.category]
    if (kid.environment === 'both') {
      score += 1 // slight bonus, no penalty
    } else if (campEnv === kid.environment) {
      score += 2
    }
    // environment mismatch → no points (natural de-ranking)

    // Stimulation preference match
    const campStim = CATEGORY_STIMULATION[c.category]
    if (campStim === kid.stimulation) score += 1

    // Challenge preference match
    const campChallenge = CATEGORY_CHALLENGE[c.category]
    if (campChallenge === kid.challenge) score += 1

    // Quality signal — rating as tiebreaker (0–1 range)
    score += (c.rating ?? 0) / 10

    return { camp: c, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .map((x) => x.camp)
}
