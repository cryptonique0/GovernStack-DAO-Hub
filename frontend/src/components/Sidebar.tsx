import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Vault, 
  Coins, 
  Settings 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Proposals', href: '/proposals', icon: FileText },
  { name: 'Treasury', href: '/treasury', icon: Vault },
  { name: 'Staking', href: '/staking', icon: Coins },
  { name: 'Governance', href: '/governance', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
