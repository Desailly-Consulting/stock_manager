export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: 'bg-blue-100' },
    red:    { bg: 'bg-red-50',    text: 'text-red-600',    icon: 'bg-red-100' },
    green:  { bg: 'bg-green-50',  text: 'text-green-600',  icon: 'bg-green-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'bg-orange-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-100' },
  }
  const c = colors[color] ?? colors.blue

  return (
    <div className={`rounded-xl p-5 ${c.bg} border border-white shadow-sm flex items-start gap-4`}>
      {Icon && (
        <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg ${c.icon}`}>
          <Icon size={22} className={c.text} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className={`text-2xl font-bold ${c.text} leading-tight mt-0.5`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
