export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-neutral-600 dark:text-neutral-300">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500 me-2" />
      <span>Loading dashboard…</span>
    </div>
  )
}
