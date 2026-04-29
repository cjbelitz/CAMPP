export default function KidAvatar({ kid, size = 40, rounded = 'full', className = '', style: extraStyle = {} }) {
  const style = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size,
    borderRadius: rounded === 'full' ? '9999px' : rounded === 'xl' ? '12px' : '16px',
    ...extraStyle,
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
      className={`flex items-center justify-center font-garet font-black text-white ${className}`}
      style={{ ...style, backgroundColor: kid.avatarColor ?? '#155fcc', fontSize: Math.round(size * 0.42) }}
    >
      {kid.name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}
