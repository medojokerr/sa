"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

type Row = {
  id: string
  name: string
  rating: number
  comment: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function ReviewsAdminPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<"all" | Row["status"]>("all")
  const [newestFirst, setNewestFirst] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/admin/reviews", { cache: "no-store" })
      const j = await r.json()
      setRows(Array.isArray(j) ? j : [])
    } catch {
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    setBusy(id)
    try {
      const r = await fetch(`/api/reviews/${id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (r.ok) await load()
    } finally {
      setBusy(null)
    }
  }

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    const list = rows
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) =>
        text ? r.name.toLowerCase().includes(text) || r.comment.toLowerCase().includes(text) : true
      )
      .slice()
      .sort((a, b) => {
        if (!newestFirst) return 0
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
    return list
  }, [rows, q, status, newestFirst])

  return (
    <div className="grid gap-4">
      {/* Header with stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{filtered.length}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-amber-600">
              {filtered.filter(r => r.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-emerald-600">
              {filtered.filter(r => r.status === 'approved').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-red-600">
              {filtered.filter(r => r.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="border-neutral-200/60 bg-white/80 backdrop-blur dark:border-neutral-800/60 dark:bg-neutral-900/60">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Reviews Moderation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage customer reviews and feedback
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search name or comment…"
              className="h-9 w-64"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="rounded"
                checked={newestFirst}
                onChange={(e) => setNewestFirst(e.target.checked)}
              />
              Newest first
            </label>
            <Button variant="outline" onClick={load} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Reload
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading reviews...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((r) => (
                <Card key={r.id} className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {r.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{r.name}</div>
                            <div className="flex items-center gap-2">
                              {[1,2,3,4,5].map(star => (
                                <div key={star} className={`h-4 w-4 ${star <= r.rating ? 'text-amber-400' : 'text-muted-foreground/30'}`}>
                                  ★
                                </div>
                              ))}
                              <span className="text-sm text-muted-foreground">({r.rating}/5)</span>
                            </div>
                          </div>
                        </div>
                        <blockquote className="text-muted-foreground italic border-l-4 border-muted pl-4 mb-3">
                          "{r.comment}"
                        </blockquote>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{new Date(r.created_at).toLocaleString()}</span>
                          <Badge
                            variant={
                              r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"
                            }
                          >
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus(r.id, "approved")}
                          disabled={busy === r.id}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          {busy === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setStatus(r.id, "rejected")}
                          disabled={busy === r.id}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          {busy === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Rating</th>
                  <th className="p-2">Comment</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Created</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.rating}</td>
                    <td className="p-2 max-w-[420px] truncate" title={r.comment}>
                      {r.comment}
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={
                          r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setStatus(r.id, "approved")}
                          disabled={busy === r.id}
                        >
                          {busy === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setStatus(r.id, "rejected")}
                          disabled={busy === r.id}
                        >
                          {busy === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
