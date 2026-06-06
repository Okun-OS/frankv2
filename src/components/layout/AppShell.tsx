import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#0a0b0f' }} className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto ml-60">
        {children}
      </main>
    </div>
  )
}
