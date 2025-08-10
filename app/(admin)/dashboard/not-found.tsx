import Link from 'next/link'

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-center text-neutral-700 dark:text-neutral-300">
      <div>
        <div className="mb-2 text-xl font-semibold">Page not found</div>
        <Link href="/" className="text-emerald-600 hover:underline">Back to home</Link>
      </div>
    </div>
  )
}
