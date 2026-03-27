export default function KidAvatar({ kid, size = 40, rounded = 'full', className = '' }) {
  const style = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: rounded === 'full' ? '9999px' : rounded === 'xl' ? '12px' : '16px',
  }

  if (kid.photo) {
    return (
      <img
        src={kid.photo}
        alt={kid.name}
        className={`object-cover ${className}`}
        style={style}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center font-[League_Spartan] font-bold text-white ${className}`}
      style={{ ...style, backgroundColor: kid.avatarColor, fontSize: Math.round(size * 0.38) }}
    >
      {kid.name[0].toUpperCase()}
    </div>
  )
}
