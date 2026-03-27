export function getSuggestedCamps(kid, allCamps, savedIds) {
  const ageFits = allCamps
    .filter((c) => kid.age >= c.ageMin && kid.age <= c.ageMax)
    .filter((c) => !savedIds.includes(c.id))
    .sort((a, b) => b.rating - a.rating)

  const interestMatches = ageFits.filter((c) =>
    kid.interests.includes(c.category)
  )

  return interestMatches.length >= 3 ? interestMatches : ageFits
}
