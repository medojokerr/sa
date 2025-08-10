export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-neutral-600 dark:text-neutral-300">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 me-3" />
      <span>جاري التحميل...</span>
    </div>
  )
}
