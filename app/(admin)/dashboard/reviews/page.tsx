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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reviews Moderation</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search name or comment…"
              className="h-9 w-56"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="h-9 rounded-md border bg-transparent px-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="all">all</option>
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
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
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No reviews</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
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
