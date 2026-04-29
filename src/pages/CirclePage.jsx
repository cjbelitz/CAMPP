import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCircle } from '../context/CircleContext'
import { MOCK_MOMS, MOCK_CONVERSATIONS } from '../data/mockCircle'
import { formatRelativeTime } from '../utils/formatRelativeTime'

const GROUP_CHATS = Object.entries(MOCK_CONVERSATIONS)
  .filter(([id]) => id.startsWith('group-'))
  .map(([id, conv]) => ({ id, ...conv }))

function MemberSheet({ mom, onClose, onMessage }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white font-garet shrink-0 shadow-md"
            style={{ backgroundColor: mom.avatarColor }}
          >
            {mom.name[0]}
          </div>
          <div>
            <h3 className="font-garet font-bold text-capp-dark text-xl uppercase">{mom.name}</h3>
            <p className="font-garet text-sm text-capp-dark/50">{mom.location}</p>
            <p className="font-garet text-xs text-violet-600 font-semibold mt-0.5">Connected via camp circle</p>
          </div>
        </div>

        {/* Kids */}
        <div className="bg-capp-warm-bg rounded-2xl px-4 py-3.5 mb-5">
          <p className="font-garet text-[10px] font-semibold text-capp-dark/40 uppercase tracking-wide mb-2">Kids</p>
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white font-garet"
              style={{ backgroundColor: mom.avatarColor }}
            >
              {mom.kidName[0]}
            </div>
            <div>
              <p className="font-garet text-sm font-semibold text-capp-dark">{mom.kidName}</p>
              <p className="font-garet text-xs text-capp-dark/45">Age {mom.kidAge}</p>
            </div>
          </div>
        </div>

        {/* Message button */}
        <button
          onClick={() => { onMessage(mom); onClose() }}
          className="w-full py-4 bg-capp-coral text-capp-dark font-garet font-semibold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
        >
          Message {mom.name.split(' ')[0]}
        </button>
      </div>
    </div>
  )
}

export default function CirclePage() {
  const navigate = useNavigate()
  const { getLastMessage, getUnreadCount } = useCircle()
  const [selectedMom, setSelectedMom] = useState(null)

  function handleMessage(mom) {
    navigate(`/circle/dm/${mom.id}`)
  }

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-capp-dark/5 bg-white">
        <h1 className="font-garet font-bold text-capp-dark text-2xl uppercase">My Circle</h1>
        <p className="font-garet text-sm text-capp-dark/50 mt-0.5">
          {MOCK_MOMS.length} moms · North County San Diego
        </p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-5">

        {/* Group chats — only shown when real chats exist */}
        {GROUP_CHATS.length > 0 && (
          <section>
            <h2 className="font-garet text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-2.5">Group Chats</h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-capp-dark/5">
              {GROUP_CHATS.map(({ id, campId, campName, campIcon, members }) => {
                const unread = getUnreadCount(id)
                const last = getLastMessage(id)
                const cid = campId ?? id.replace('group-', '')
                return (
                  <button
                    key={id}
                    onClick={() => navigate(`/circle/group/${cid}`)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-violet-100 flex items-center justify-center text-2xl shrink-0">
                      campIcon ?? ''
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-garet text-sm font-semibold text-capp-dark truncate">
                        {campName ?? 'Camp Group'}
                      </p>
                      {last && (
                        <p className="font-garet text-xs text-capp-dark/40 truncate mt-0.5">
                          {last.senderId === 'me' ? 'You: ' : ''}{last.body ?? '📎 Carpool post'}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {last && (
                        <span className="font-garet text-[10px] text-capp-dark/30">
                          {formatRelativeTime(last.ts)}
                        </span>
                      )}
                      {unread > 0 && (
                        <span className="min-w-[20px] h-5 bg-capp-coral text-capp-dark text-[10px] font-bold font-garet rounded-full flex items-center justify-center px-1.5">
                          {unread}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* Members */}
        <section>
          <h2 className="font-garet text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-2.5">Members</h2>
          {MOCK_MOMS.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-capp-blue/10 flex items-center justify-center mb-3"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155fcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <p className="font-garet font-bold text-capp-dark text-base uppercase mb-1">No connections yet</p>
              <p className="font-garet text-sm text-capp-dark/50 leading-relaxed">
                Invite friends to join CAMPP and you'll see them here!
              </p>
            </div>
          ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-capp-dark/5">
            {MOCK_MOMS.map(mom => {
              const convId = `dm-${mom.id}`
              const unread = getUnreadCount(convId)
              const last = getLastMessage(convId)
              return (
                <button
                  key={mom.id}
                  onClick={() => setSelectedMom(mom)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white font-garet shrink-0"
                    style={{ backgroundColor: mom.avatarColor }}
                  >
                    {mom.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-garet text-sm font-semibold text-capp-dark">{mom.name}</p>
                    <p className="font-garet text-xs text-capp-dark/40 mt-0.5 truncate">
                      {last ? (last.senderId === 'me' ? 'You: ' : '') + (last.body ?? '📎') : `${mom.location} · ${mom.kidName}'s mom`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {last && (
                      <span className="font-garet text-[10px] text-capp-dark/30">
                        {formatRelativeTime(last.ts)}
                      </span>
                    )}
                    {unread > 0 ? (
                      <span className="min-w-[20px] h-5 bg-capp-coral text-capp-dark text-[10px] font-bold font-garet rounded-full flex items-center justify-center px-1.5">
                        {unread}
                      </span>
                    ) : (
                      <span className="text-capp-dark/20 text-sm">›</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
          )}
        </section>

      </div>

      {selectedMom && (
        <MemberSheet
          mom={selectedMom}
          onClose={() => setSelectedMom(null)}
          onMessage={handleMessage}
        />
      )}
    </div>
  )
}
