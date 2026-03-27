import { useCircle } from '../context/CircleContext'

export default function CarpoolCard({ msg, isMe }) {
  const { claimCarpool, unclaimCarpool, isClaimed } = useCircle()
  const { role, session, seats, neighborhood } = msg.carpool
  const claimed = isClaimed(msg.id)
  const isDriving = role === 'driving'

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: isDriving ? '#FFF7ED' : '#EFF6FF',
        borderColor: isDriving ? '#FED7AA' : '#BFDBFE',
      }}
    >
      {/* Header strip */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ backgroundColor: isDriving ? '#FFEDD5' : '#DBEAFE' }}
      >
        <span className="text-base">🚗</span>
        <span
          className="font-[DM_Sans] text-xs font-bold uppercase tracking-wide"
          style={{ color: isDriving ? '#C2410C' : '#1D4ED8' }}
        >
          {isDriving ? 'Carpool — offering a ride' : 'Carpool — need a ride'}
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📅</span>
          <span className="font-[DM_Sans] text-xs text-capp-dark/70">{session}</span>
        </div>
        {isDriving && (
          <div className="flex items-center gap-1.5">
            <span className="text-sm">💺</span>
            <span className="font-[DM_Sans] text-xs text-capp-dark/70">
              {seats} seat{seats !== 1 ? 's' : ''} available
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-sm">📍</span>
          <span className="font-[DM_Sans] text-xs text-capp-dark/70">{neighborhood}</span>
        </div>
      </div>

      {/* Action */}
      {!isMe && (
        <div className="px-3 pb-3">
          <button
            onClick={() => claimed ? unclaimCarpool(msg.id) : claimCarpool(msg.id)}
            className={`w-full py-2 rounded-xl font-[DM_Sans] text-xs font-bold transition-colors active:scale-95 ${
              claimed
                ? 'bg-capp-dark/10 text-capp-dark/50'
                : isDriving
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
            }`}
          >
            {claimed
              ? '✓ Claimed — tap to undo'
              : isDriving
                ? 'Claim a seat'
                : 'Offer to drive'}
          </button>
        </div>
      )}
      {isMe && (
        <div className="px-3 pb-3">
          <p className="font-[DM_Sans] text-[10px] text-capp-dark/40 text-center">Your carpool post</p>
        </div>
      )}
    </div>
  )
}
