import { MOCK_MOMS } from '../data/mockCircle'
import { camps } from '../data/camps'

// Returns array of CircleGroup for a given kid based on their pastCampIds
// CircleGroup: { campId, campName, campIcon, campAccent, conversationId, members: MOM[] }
export function buildCircles(kid) {
  if (!kid?.pastCampIds?.length) return []
  return kid.pastCampIds
    .map((campId) => {
      const camp = camps.find((c) => c.id === campId)
      if (!camp) return null
      const members = MOCK_MOMS.filter((m) => m.campIds.includes(campId))
      if (!members.length) return null
      return {
        campId,
        campName: camp.name,
        campIcon: camp.icon,
        campAccent: camp.accent,
        conversationId: `group-${campId}`,
        members,
      }
    })
    .filter(Boolean)
}
