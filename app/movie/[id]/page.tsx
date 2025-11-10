"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Play, Plus, ThumbsUp, ThumbsDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMovie, getRating, createRating, updateRating, type Movie } from "@/lib/api"

export default function MovieDetailPage() {
  const router = useRouter()
  const params = useParams()
  const movieIdParam = Array.isArray(params.id) ? params.id[0] : params.id
  const movieId = Number(movieIdParam)

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [hasRated, setHasRated] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: string } | null>(null)
  const [userLiked, setUserLiked] = useState<boolean | null>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("currentUser")

    if (!isAuth || !userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)
    const toNumericId = (s: string) => {
      let hash = 0
      for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0
      }
      return hash || 1
    }
    const numericId =
      typeof user.id === "number" ? user.id : toNumericId(String(user.id || user.email || user.username || "user"))
    const normalizedUser = { ...user, id: numericId }
    setCurrentUser(normalizedUser)

    const fetchData = async () => {
      try {
        const movieData = await getMovie(movieId)
        setMovie(movieData)

        const ratingData = await getRating(normalizedUser.id, movieId)
        if (ratingData) {
          setRating(ratingData.rating)
          setHasRated(true)
          // Determine if user liked or disliked (rating >= 3 is liked)
          setUserLiked(ratingData.rating >= 3)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, movieId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading movie...</div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Movie Not Found</h1>
          <Button onClick={() => router.push("/browse")}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  const handleRating = async (stars: number) => {
    if (!currentUser) return

    try {
      if (hasRated) {
        await updateRating(currentUser.id, movieId, stars)
      } else {
        await createRating(currentUser.id, movieId, stars)
      }

      setRating(stars)
      setHasRated(true)
      setUserLiked(stars >= 3)
    } catch (error) {
      console.error("Failed to save rating:", error)
    }
  }

  const handleLike = () => handleRating(5)
  const handleDislike = () => handleRating(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/browse")}
            className="text-foreground hover:text-muted-foreground gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-primary">MovieMatch</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Movie Hero Section */}
      <section className="relative h-[70vh] flex items-end pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(/placeholder.svg?height=1080&width=1920&query=${encodeURIComponent(movie.title + " movie scene")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-8 pb-12 max-w-3xl">
          <h2 className="text-5xl font-bold mb-4 text-foreground">{movie.title}</h2>
          <div className="flex items-center gap-4 text-muted-foreground mb-4">
            
            <span>{movie.genres.join(", ")}</span>
          </div>
        </div>
      </section>

      {/* Movie Details */}
      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column - Poster */}
          <div className="md:col-span-1">
            <img
              src="/peli.jpg"
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-2">
                <Play className="h-5 w-5" fill="currentColor" />
                Play
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Plus className="h-5 w-5" />
                My List
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`gap-2 ${userLiked === true ? "bg-primary/20 border-primary" : "bg-transparent"}`}
                onClick={handleLike}
              >
                <ThumbsUp className="h-5 w-5" />
                Like
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`gap-2 ${userLiked === false ? "bg-red-500/20 border-red-500" : "bg-transparent"}`}
                onClick={handleDislike}
              >
                <ThumbsDown className="h-5 w-5" />
                Dislike
              </Button>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                An exciting cinematic experience that will keep you on the edge of your seat. This film combines
                stunning visuals with compelling storytelling to create an unforgettable journey. Perfect for fans of{" "}
                {movie.genres.join(" and ")} genres.
              </p>
            </div>

            {/* Rating Section */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-foreground mb-4">Rate This Movie</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredStar || rating)
                          ? "fill-primary text-primary"
                          : "fill-none text-muted-foreground"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              {hasRated && (
                <p className="mt-4 text-sm text-muted-foreground">You rated this movie {rating} out of 5 stars</p>
              )}
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Genres</h4>
                <p className="text-foreground">{movie.genres.join(", ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Your Rating</h4>
                <p className="text-foreground">{rating > 0 ? `${rating}/5 Stars` : "Not rated yet"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
