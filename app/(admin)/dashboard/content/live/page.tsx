"use client"

import { LivePreview } from "@/components/admin/live-preview"
import { ContentManager } from "@/components/admin/content-manager"

export default function LiveContentEditorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 max-w-7xl mx-auto">
        {/* Content Management Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">محرر المحتوى المباشر</h1>
              <p className="text-sm text-muted-foreground">
                تحرير المحتوى مع معاينة مباشرة للتغييرات
              </p>
            </div>
          </div>
          
          <ContentManager />
        </div>

        {/* Live Preview Panel */}
        <div className="xl:sticky xl:top-6">
          <LivePreview />
        </div>
      </div>
    </div>
  )
}
