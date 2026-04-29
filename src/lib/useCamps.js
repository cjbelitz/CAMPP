import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

export const CATEGORY_STYLE = {
  Sports:           { accent: '#155fcc', accentLight: '#155fcc15' },
  Art:              { accent: '#fca4e0', accentLight: '#fca4e020' },
  STEM:             { accent: '#11a253', accentLight: '#11a25315' },
  Outdoors:         { accent: '#ffd21f', accentLight: '#ffd21f20' },
  Surf:             { accent: '#155fcc', accentLight: '#155fcc15' },
  Music:            { accent: '#826dee', accentLight: '#826dee15' },
  Nature:           { accent: '#11a253', accentLight: '#11a25315' },
  Dance:            { accent: '#fca4e0', accentLight: '#fca4e020' },
  'Multi-activity': { accent: '#f20815', accentLight: '#f2081515' },
  Academic:         { accent: '#ffd21f', accentLight: '#ffd21f20' },
  Leadership:       { accent: '#826dee', accentLight: '#826dee15' },
  Swimming:         { accent: '#155fcc', accentLight: '#155fcc15' },
}
const DEFAULT_STYLE = { accent: '#155fcc', accentLight: '#155fcc15' }

export function mapCamp(row) {
  const style = CATEGORY_STYLE[row.category] ?? DEFAULT_STYLE
  return {
    id:                   row.id,
    name:                 row.name ?? '',
    organization:         row.organization ?? '',
    category:             row.category ?? '',
    description:          row.description ?? '',
    ageMin:               row.min_age ?? 0,
    ageMax:               row.max_age ?? 18,
    costDisplay:          row.cost_display ?? 'Contact for pricing',
    costCents:            row.cost_cents ?? 0,
    locationName:         row.location_name ?? '',
    city:                 row.city ?? '',
    registrationUrl:      row.registration_url ?? '',
    registrationDeadline: row.registration_deadline ?? null,
    tags:                 row.tags ?? [],
    notes:                row.notes ?? '',
    startDate:            row.start_date ?? null,
    endDate:              row.end_date ?? null,
    status:               row.status ?? 'approved',
    ...style,
  }
}

let _cache = null

export function useCamps() {
  const [camps, setCamps] = useState(_cache ?? [])
  const [loading, setLoading] = useState(!_cache)

  useEffect(() => {
    if (_cache) return
    supabase
      .from('camps')
      .select('*')
      .eq('status', 'approved')
      .order('name')
      .then(({ data }) => {
        _cache = (data ?? []).map(mapCamp)
        setCamps(_cache)
        setLoading(false)
      })
  }, [])

  return { camps, loading }
}

export function useCamp(id) {
  const { camps, loading } = useCamps()
  return { camp: camps.find(c => c.id === id) ?? null, loading }
}
