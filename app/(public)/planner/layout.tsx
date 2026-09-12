import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plantation Planner',
  description: 'Design your farm, plan your plantation and get a complete investment estimate with ETR Plants.',
}

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
