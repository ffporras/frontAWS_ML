"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Info, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMovies, type Movie } from "@/lib/api"
import { signOut } from "aws-amplify/auth"

export default function BrowsePage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: string } | null>(null)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("currentUser")

    if (!isAuth || !userData) {
      router.push("/")
      return
    }

    setCurrentUser(JSON.parse(userData))

    const fetchMovies = async () => {
      try {
        const data = await getMovies(50, 0)
        setMovies(data)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [router])

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`)
  }

  const handleLogout = async () => {
    try {
      await signOut()
    } catch {}

    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("currentUser")

    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID
    const logoutUri = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT || "/"

    if (domain && clientId) {
      window.location.href = `https://${domain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`
      return
    }

    router.push("/")
  }

  const categorizeMovies = () => {
    const forYou = movies.slice(0, 6)
    const trending = movies.slice(6, 12)
    const action = movies.filter((m) => m.genres.some((g) => g.toLowerCase().includes("action"))).slice(0, 6)
    const sciFi = movies
      .filter((m) => m.genres.some((g) => g.toLowerCase().includes("sci-fi") || g.toLowerCase().includes("science")))
      .slice(0, 6)

    return { forYou, trending, action, sciFi }
  }

  const categories = categorizeMovies()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading movies...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-primary">MovieMatch</h1>
            <nav className="flex gap-6 text-sm">
              <a href="/browse" className="text-foreground hover:text-muted-foreground transition-colors">
                Home
              </a>
              <a href="/watched" className="text-muted-foreground hover:text-foreground transition-colors">
                Watched It
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                My List
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {currentUser?.role === "superadmin" && (
              <Button
                onClick={() => router.push("/admin")}
                variant="ghost"
                className="text-foreground hover:text-muted-foreground gap-2"
              >
                <Settings className="h-5 w-5" />
                Admin
              </Button>
            )}
            <Button onClick={handleLogout} variant="ghost" className="text-foreground hover:text-muted-foreground">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(/placeholder.svg?height=1080&width=1920&query=epic+cinematic+movie+scene+hero+banner)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-8 max-w-2xl">
          <h2 className="text-6xl font-bold mb-4 text-foreground">Featured Title</h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Discover amazing movies and rate your favorites. Explore our vast collection of films across all genres.
          </p>
          <div className="flex gap-4">
            <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 gap-2">
              <Play className="h-5 w-5" fill="currentColor" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="gap-2 bg-muted/50 hover:bg-muted/70 text-foreground">
              <Info className="h-5 w-5" />
              More Info
            </Button>
          </div>
        </div>
      </section>

      {/* Movie Categories */}
      <section className="relative z-20 -mt-32 px-8 pb-16 space-y-12">
        <MovieRow title="For You" movies={categories.forYou} onMovieClick={handleMovieClick} />
        <MovieRow title="Trending Now" movies={categories.trending} onMovieClick={handleMovieClick} />
        <MovieRow title="Action & Adventure" movies={categories.action} onMovieClick={handleMovieClick} />
        <MovieRow title="Sci-Fi & Fantasy" movies={categories.sciFi} onMovieClick={handleMovieClick} />
      </section>
    </div>
  )
}

function MovieRow({
  title,
  movies,
  onMovieClick,
}: {
  title: string
  movies: Movie[]
  onMovieClick: (id: number) => void
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  if (movies.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
      <div className="relative group">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 scroll-smooth">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-[200px] cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => onMovieClick(movie.id)}
              onMouseEnter={() => setHoveredId(movie.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative rounded-md overflow-hidden bg-muted aspect-[2/3]">
                <img
                  src={`/.jpg?height=450&width=300&query=${encodeURIComponent(movie.title + " movie poster")}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                {hoveredId === movie.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity">
                    <Play className="h-12 w-12 text-foreground" fill="currentColor" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground font-medium truncate">{movie.title}</p>
              <p className="text-xs text-muted-foreground truncate">{movie.genres.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
