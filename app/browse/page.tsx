"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock movie data with actual poster images
const movies = {
  forYou: [
    { id: 1, title: "Stellar Odyssey", image: "/sci-fi-space-movie-poster.png", rating: 0 },
    { id: 2, title: "The Last Kingdom", image: "/medieval-epic-movie-poster.jpg", rating: 0 },
    { id: 3, title: "Neon Dreams", image: "/cyberpunk-neon-city-movie-poster.jpg", rating: 0 },
    { id: 4, title: "Ocean's Mystery", image: "/ocean-adventure-movie-poster.jpg", rating: 0 },
    { id: 5, title: "Desert Storm", image: "/desert-action-movie-poster.jpg", rating: 0 },
    { id: 6, title: "Winter's Tale", image: "/winter-fantasy-movie-poster.jpg", rating: 0 },
  ],
  trending: [
    { id: 7, title: "Quantum Leap", image: "/quantum-physics-thriller-poster.jpg", rating: 0 },
    { id: 8, title: "Shadow Hunter", image: "/dark-hunter-action-poster.jpg", rating: 0 },
    { id: 9, title: "City Lights", image: "/urban-drama-movie-poster.jpg", rating: 0 },
    { id: 10, title: "Wild Hearts", image: "/romance-adventure-poster.jpg", rating: 0 },
    { id: 11, title: "The Heist", image: "/heist-thriller-movie-poster.jpg", rating: 0 },
    { id: 12, title: "Mystic Forest", image: "/mystical-forest-fantasy-poster.jpg", rating: 0 },
  ],
  action: [
    { id: 13, title: "Thunder Strike", image: "/action-explosion-movie-poster.jpg", rating: 0 },
    { id: 14, title: "Velocity", image: "/fast-cars-racing-poster.jpg", rating: 0 },
    { id: 15, title: "Iron Fist", image: "/martial-arts-action-poster.jpg", rating: 0 },
    { id: 16, title: "Rogue Agent", image: "/spy-action-thriller-poster.jpg", rating: 0 },
    { id: 17, title: "Warzone", image: "/military-war-movie-poster.jpg", rating: 0 },
    { id: 18, title: "Apex Predator", image: "/survival-action-poster.jpg", rating: 0 },
  ],
  sciFi: [
    { id: 19, title: "Galactic Empire", image: "/space-empire-sci-fi-poster.jpg", rating: 0 },
    { id: 20, title: "AI Uprising", image: "/sci-fi-space-movie-poster.png", rating: 0 },
    { id: 21, title: "Time Paradox", image: "/quantum-physics-thriller-poster.jpg", rating: 0 },
    { id: 22, title: "Mars Colony", image: "/sci-fi-space-movie-poster.png", rating: 0 },
    { id: 23, title: "Cyber Realm", image: "/cyberpunk-neon-city-movie-poster.jpg", rating: 0 },
    { id: 24, title: "Alien Contact", image: "/space-empire-sci-fi-poster.jpg", rating: 0 },
  ],
}

export default function BrowsePage() {
  const router = useRouter()

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/")
    }
  }, [router])

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-bold text-primary">StreamFlix</h1>
            <nav className="flex gap-6 text-sm">
              <a href="#" className="text-foreground hover:text-muted-foreground transition-colors">
                Home
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                TV Shows
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Movies
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                My List
              </a>
            </nav>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-foreground hover:text-muted-foreground">
            Sign Out
          </Button>
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
            An epic journey through time and space. When humanity faces its greatest threat, one hero must rise to save
            the universe from total destruction.
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
        <MovieRow title="For You" movies={movies.forYou} onMovieClick={handleMovieClick} />
        <MovieRow title="Trending Now" movies={movies.trending} onMovieClick={handleMovieClick} />
        <MovieRow title="Action & Adventure" movies={movies.action} onMovieClick={handleMovieClick} />
        <MovieRow title="Sci-Fi & Fantasy" movies={movies.sciFi} onMovieClick={handleMovieClick} />
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
  movies: Array<{ id: number; title: string; image: string; rating: number }>
  onMovieClick: (id: number) => void
}) {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

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
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full h-full object-cover" />
                {hoveredId === movie.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity">
                    <Play className="h-12 w-12 text-foreground" fill="currentColor" />
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-foreground font-medium truncate">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
