import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout title="My Account" role="buyer">
      {children}
    </DashboardLayout>
  )
}
