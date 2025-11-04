"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRatings, getMovie, type Movie, type Rating } from "@/lib/api"

interface MovieWithRating extends Movie {
  userRating: number
}

export default function WatchedPage() {
  const router = useRouter()
  const [likedMovies, setLikedMovies] = useState<MovieWithRating[]>([])
  const [dislikedMovies, setDislikedMovies] = useState<MovieWithRating[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: string } | null>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("currentUser")

    if (!isAuth || !userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)

    // Fetch user's ratings and corresponding movies
    const fetchWatchedMovies = async () => {
      try {
        const ratings = await getRatings(user.id)

        // Fetch movie details for each rating
        const moviesWithRatings = await Promise.all(
          ratings.map(async (rating: Rating) => {
            try {
              const movie = await getMovie(rating.movieId)
              return { ...movie, userRating: rating.rating }
            } catch {
              return null
            }
          }),
        )

        // Filter out null values and separate into liked/disliked
        const validMovies = moviesWithRatings.filter((m): m is MovieWithRating => m !== null)
        const liked = validMovies.filter((m) => m.userRating >= 3)
        const disliked = validMovies.filter((m) => m.userRating < 3)

        setLikedMovies(liked)
        setDislikedMovies(disliked)
      } catch (error) {
        console.error("Failed to fetch watched movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWatchedMovies()
  }, [router])

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading your watched movies...</div>
      </div>
    )
  }

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
            Back to Browse
          </Button>
          <h1 className="text-2xl font-bold text-primary">StreamFlix</h1>
          <div className="w-32" />
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Watched It</h1>
        <p className="text-muted-foreground mb-12">Movies you've rated and watched</p>

        {/* Liked Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <ThumbsUp className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-semibold text-foreground">Liked</h2>
            <span className="text-muted-foreground">({likedMovies.length})</span>
          </div>

          {likedMovies.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground text-lg">You haven't liked any movies yet.</p>
              <Button onClick={() => router.push("/browse")} className="mt-4">
                Browse Movies
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {likedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onMovieClick={handleMovieClick} />
              ))}
            </div>
          )}
        </section>

        {/* Didn't Like Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ThumbsDown className="h-6 w-6 text-red-500" />
            <h2 className="text-3xl font-semibold text-foreground">Didn't Like</h2>
            <span className="text-muted-foreground">({dislikedMovies.length})</span>
          </div>

          {dislikedMovies.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground text-lg">You haven't disliked any movies yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {dislikedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onMovieClick={handleMovieClick} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function MovieCard({
  movie,
  onMovieClick,
}: {
  movie: MovieWithRating
  onMovieClick: (id: number) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="cursor-pointer transition-transform duration-300 hover:scale-105"
      onClick={() => onMovieClick(movie.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-md overflow-hidden bg-muted aspect-[2/3]">
        <img
          src="/peli.jpg"
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity">
            <Play className="h-12 w-12 text-foreground mb-2" fill="currentColor" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < movie.userRating ? "bg-primary" : "bg-muted-foreground"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm text-foreground font-medium truncate">{movie.title}</p>
        <p className="text-xs text-muted-foreground truncate">{movie.genres.join(", ")}</p>
        <p className="text-xs text-primary mt-1">Your rating: {movie.userRating}/5</p>
      </div>
    </div>
  )
}
