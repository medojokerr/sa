export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-center text-neutral-700 dark:text-neutral-300">
      <div>
        <div className="mb-2 text-2xl font-bold">الصفحة غير موجودة</div>
        <p className="mb-4 text-sm opacity-80">تحقق من الرابط أو ارجع إلى الصفحة الرئيسية</p>
        <a href="/" className="rounded bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">العودة للرئيسية</a>
      </div>
    </div>
  )
}
