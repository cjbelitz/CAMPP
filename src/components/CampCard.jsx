import { useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80'

const CATEGORY_PHOTOS = {
  Sports:           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  Art:              'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
  STEM:             'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&q=80',
  Outdoors:         'https://images.unsplash.com/photo-1534880606858-c3b6b265a36b?w=400&q=80',
  'Multi-activity': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80',
  Nature:           'https://images.unsplash.com/photo-1534880606858-c3b6b265a36b?w=400&q=80',
  Music:            'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  Dance:            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  Academic:         'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&q=80',
  Surf:             'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
  Swimming:         'https://images.unsplash.com/photo-1560090995-01632a28895b?w=400&q=80',
}

function HeartIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#f20815' : 'none'} stroke={filled ? '#f20815' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={filled ? 1 : 0.3}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

export default function CampCard({ camp }) {
  const navigate = useNavigate()
  const { isSaved, toggle } = useSaved()
  const saved = isSaved(camp.id)
  const photo = CATEGORY_PHOTOS[camp.category] ?? DEFAULT_PHOTO

  return (
    <div
      onClick={() => navigate(`/camps/${camp.id}`)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: camp.accent }} />

      <div className="p-4 flex items-center gap-3">
        {photo ? (
          <img
            src={photo}
            alt={camp.category}
            className="w-11 h-11 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div
            className="w-11 h-11 rounded-xl shrink-0"
            style={{ backgroundColor: camp.accentLight }}
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-garet font-black text-capp-dark text-[15px] leading-tight uppercase truncate">
            {camp.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="font-garet text-xs text-capp-dark/50">
              Ages {camp.ageMin}–{camp.ageMax}
            </span>
            {camp.costDisplay && (
              <>
                <span className="text-capp-dark/20 text-xs">·</span>
                <span className="font-garet text-xs text-capp-dark/50">{camp.costDisplay}</span>
              </>
            )}
          </div>
          {camp.city && (
            <p className="font-garet text-[11px] text-capp-dark/35 mt-0.5 truncate">
              {camp.city}
            </p>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); toggle(camp.id) }}
          className="shrink-0 active:scale-90 transition-transform p-1"
          aria-label={saved ? 'Remove from saved' : 'Save camp'}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
    </div>
  )
}
