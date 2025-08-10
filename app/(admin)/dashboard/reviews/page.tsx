"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/reviews/star-rating"
import { useAppSelector } from "@/lib/redux/store"
import { CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react"

type Review = {
  id: string
  name: string
  email: string
  rating: number
  message: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function ReviewsPage() {
  const ui = useAppSelector((s) => s.ui)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const locale = ui.locale

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to load reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const moderateReview = async (id: string, action: "approve" | "reject") => {
    setProcessing(id)
    try {
      const response = await fetch(`/api/reviews/${id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })
      
      if (response.ok) {
        setReviews(prev => 
          prev.map(review => 
            review.id === id 
              ? { ...review, status: action === "approve" ? "approved" : "rejected" }
              : review
          )
        )
      }
    } catch (error) {
      console.error("Failed to moderate review:", error)
    } finally {
      setProcessing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          {locale === "ar" ? "معتمد" : "Approved"}
        </Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
          {locale === "ar" ? "مرفوض" : "Rejected"}
        </Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          {locale === "ar" ? "في الانتظار" : "Pending"}
        </Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{locale === "ar" ? "جاري التحميل..." : "Loading..."}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {locale === "ar" ? "إدارة التقييمات" : "Manage Reviews"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "ar" 
              ? "راجع واعتمد أو ارفض تقييمات العملاء" 
              : "Review and approve or reject customer reviews"}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {locale === "ar" ? "لا توجد تقييمات متاحة" : "No reviews available"}
              </p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">{review.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{review.email}</p>
                  <StarRating rating={review.rating} />
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(review.status)}
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{review.message}</p>
                
                {review.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => moderateReview(review.id, "approve")}
                      disabled={processing === review.id}
                    >
                      {processing === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      {locale === "ar" ? "اعتماد" : "Approve"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => moderateReview(review.id, "reject")}
                      disabled={processing === review.id}
                    >
                      {processing === review.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {locale === "ar" ? "رفض" : "Reject"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
