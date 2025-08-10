"use client"

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="fixed top-2 left-20 z-50 rounded bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only"
      >
        Skip to navigation
      </a>
    </div>
  )
}