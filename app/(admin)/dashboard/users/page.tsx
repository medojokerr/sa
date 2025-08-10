"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2 } from 'lucide-react'

type Row = { id: string; name: string; email: string; role: "admin" | "editor" | "viewer"; active: boolean; created_at?: string }

export default function UsersPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState("")
  const [role, setRole] = useState<"all" | Row["role"]>("all")
  const [active, setActive] = useState<"all" | "active" | "inactive">("all")
  const [newestFirst, setNewestFirst] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const r = await fetch("/api/users")
      const j = (await r.json()) as Row[]
      setRows(Array.isArray(j) ? j : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const addRow = async () => {
    setSaving(true)
    try {
      const body = { name: "New User", email: `user${Date.now()}@example.com`, role: "editor", active: true }
      const r = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      if (r.ok) await fetchUsers()
    } finally {
      setSaving(false)
    }
  }

  const update = async (patch: Partial<Row> & { id: string }) => {
    setSaving(true)
    try {
      const r = await fetch(`/api/users/${patch.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) })
      if (r.ok) await fetchUsers()
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    setSaving(true)
    try {
      const r = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (r.ok) await fetchUsers()
    } finally {
      setSaving(false)
    }
  }

  const filtered = useMemo(() => {
    const text = filter.toLowerCase().trim()
    return rows
      .filter((r) => (text ? r.name.toLowerCase().includes(text) || r.email.toLowerCase().includes(text) : true))
      .filter((r) => (role === "all" ? true : r.role === role))
      .filter((r) => (active === "all" ? true : active === "active" ? r.active : !r.active))
      .slice()
      .sort((a, b) => {
        if (!newestFirst) return 0
        const ta = a.created_at ? new Date(a.created_at).getTime() : 0
        const tb = b.created_at ? new Date(b.created_at).getTime() : 0
        return tb - ta
      })
  }, [rows, filter, role, active, newestFirst])

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input placeholder="Filter by name or email…" value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs" />
        <select className="h-9 rounded-md border bg-transparent px-3" value={role} onChange={(e) => setRole(e.target.value as any)}>
          <option value="all">all roles</option>
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
        <select className="h-9 rounded-md border bg-transparent px-3" value={active} onChange={(e) => setActive(e.target.value as any)}>
          <option value="all">all statuses</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={newestFirst} onChange={(e) => setNewestFirst(e.target.checked)} />
          Newest first
        </label>
        <Button onClick={addRow} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Add
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">No users</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Active</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="p-2">
                      <Input value={r.name} onChange={(e) => update({ id: r.id, name: e.target.value })} />
                    </td>
                    <td className="p-2">
                      <Input value={r.email} onChange={(e) => update({ id: r.id, email: e.target.value })} />
                    </td>
                    <td className="p-2">
                      <select
                        className="h-9 rounded-md border bg-transparent px-3"
                        value={r.role}
                        onChange={(e) => update({ id: r.id, role: e.target.value as Row["role"] })}
                      >
                        <option value="admin">admin</option>
                        <option value="editor">editor</option>
                        <option value="viewer">viewer</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <Badge
                        className={r.active ? "bg-emerald-500 hover:bg-emerald-500" : "bg-rose-500 hover:bg-rose-500"}
                        onClick={() => update({ id: r.id, active: !r.active })}
                      >
                        {r.active ? "active" : "inactive"}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="destructive" size="icon" onClick={() => remove(r.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
