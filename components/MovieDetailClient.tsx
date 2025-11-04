"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Plus, ThumbsUp, ThumbsDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const movieDatabase: Record<
  number,
  { id: number; title: string; image: string; description: string; genre: string; year: number; duration: string }
> = {
  1: {
    id: 1,
    title: "Stellar Odyssey",
    image: "/sci-fi-space-movie-poster.png",
    description:
      "A breathtaking journey across the cosmos as a crew of explorers ventures into uncharted space to discover the origins of humanity. Facing impossible odds and mysterious alien forces, they must decide the fate of our species.",
    genre: "Sci-Fi, Adventure",
    year: 2024,
    duration: "2h 28m",
  },
  2: {
    id: 2,
    title: "The Last Kingdom",
    image: "/medieval-epic-movie-poster.jpg",
    description:
      "In a war-torn medieval realm, a young warrior must unite the fractured kingdoms against an ancient evil that threatens to consume the world. Epic battles and legendary heroes collide in this sweeping fantasy adventure.",
    genre: "Fantasy, Action",
    year: 2024,
    duration: "2h 45m",
  },
  3: {
    id: 3,
    title: "Neon Dreams",
    image: "/cyberpunk-neon-city-movie-poster.jpg",
    description:
      "In a dystopian future where memories can be bought and sold, a rogue hacker discovers a conspiracy that could reshape reality itself. A visually stunning cyberpunk thriller that questions the nature of consciousness.",
    genre: "Sci-Fi, Thriller",
    year: 2024,
    duration: "2h 15m",
  },
  4: {
    id: 4,
    title: "Ocean's Mystery",
    image: "/ocean-adventure-movie-poster.jpg",
    description:
      "Deep beneath the ocean's surface lies a secret that could change everything we know about our planet. A team of marine biologists races against time to uncover an ancient underwater civilization.",
    genre: "Adventure, Mystery",
    year: 2024,
    duration: "2h 10m",
  },
  5: {
    id: 5,
    title: "Desert Storm",
    image: "/desert-action-movie-poster.jpg",
    description:
      "When a covert operation goes wrong in the heart of the desert, a special forces team must fight their way through enemy territory. An intense action thriller that never lets up.",
    genre: "Action, Thriller",
    year: 2024,
    duration: "1h 58m",
  },
  6: {
    id: 6,
    title: "Winter's Tale",
    image: "/winter-fantasy-movie-poster.jpg",
    description:
      "A magical story set in an eternal winter, where a young girl discovers she has the power to bring back spring. But dark forces seek to keep the world frozen forever.",
    genre: "Fantasy, Family",
    year: 2024,
    duration: "2h 5m",
  },
  7: {
    id: 7,
    title: "Quantum Leap",
    image: "/quantum-physics-thriller-poster.jpg",
    description:
      "A brilliant physicist accidentally creates a device that allows him to jump between parallel universes. But each jump brings him closer to a reality where humanity never existed.",
    genre: "Sci-Fi, Thriller",
    year: 2024,
    duration: "2h 20m",
  },
  8: {
    id: 8,
    title: "Shadow Hunter",
    image: "/dark-hunter-action-poster.jpg",
    description:
      "In a world where supernatural creatures hide in plain sight, one hunter stands between humanity and the darkness. A gritty action horror that redefines the monster hunting genre.",
    genre: "Action, Horror",
    year: 2024,
    duration: "2h 12m",
  },
  9: {
    id: 9,
    title: "City Lights",
    image: "/urban-drama-movie-poster.jpg",
    description:
      "A powerful drama following three interconnected lives in the heart of a bustling metropolis. Love, loss, and redemption collide in this emotional journey through urban life.",
    genre: "Drama, Romance",
    year: 2024,
    duration: "2h 18m",
  },
  10: {
    id: 10,
    title: "Wild Hearts",
    image: "/romance-adventure-poster.jpg",
    description:
      "Two strangers from different worlds embark on an unexpected adventure across untamed wilderness. A heartwarming tale of love, survival, and self-discovery.",
    genre: "Romance, Adventure",
    year: 2024,
    duration: "2h 8m",
  },
  11: {
    id: 11,
    title: "The Heist",
    image: "/heist-thriller-movie-poster.jpg",
    description:
      "The perfect crime requires the perfect team. When a master thief assembles an elite crew for one last job, nothing goes according to plan. A clever thriller full of twists.",
    genre: "Thriller, Crime",
    year: 2024,
    duration: "2h 15m",
  },
  12: {
    id: 12,
    title: "Mystic Forest",
    image: "/mystical-forest-fantasy-poster.jpg",
    description:
      "Deep in an enchanted forest, ancient magic awakens. A young guardian must protect the balance between the human world and the realm of mythical creatures.",
    genre: "Fantasy, Adventure",
    year: 2024,
    duration: "2h 22m",
  },
  13: {
    id: 13,
    title: "Thunder Strike",
    image: "/action-explosion-movie-poster.jpg",
    description:
      "When terrorists threaten a major city, an elite tactical team must stop them before it's too late. Explosive action and high-stakes drama in this adrenaline-fueled thriller.",
    genre: "Action, Thriller",
    year: 2024,
    duration: "2h 5m",
  },
  14: {
    id: 14,
    title: "Velocity",
    image: "/fast-cars-racing-poster.jpg",
    description:
      "In the underground world of illegal street racing, one driver seeks redemption and revenge. High-octane action and stunning racing sequences push the limits of speed.",
    genre: "Action, Drama",
    year: 2024,
    duration: "1h 55m",
  },
  15: {
    id: 15,
    title: "Iron Fist",
    image: "/martial-arts-action-poster.jpg",
    description:
      "A martial arts master returns to his homeland to compete in a legendary tournament. But the competition hides a darker purpose that threatens everything he holds dear.",
    genre: "Action, Martial Arts",
    year: 2024,
    duration: "2h 10m",
  },
  16: {
    id: 16,
    title: "Rogue Agent",
    image: "/spy-action-thriller-poster.jpg",
    description:
      "A disavowed spy must clear his name while uncovering a conspiracy that reaches the highest levels of government. Intense espionage action with shocking revelations.",
    genre: "Action, Spy",
    year: 2024,
    duration: "2h 18m",
  },
  17: {
    id: 17,
    title: "Warzone",
    image: "/military-war-movie-poster.jpg",
    description:
      "Based on true events, a squad of soldiers fights for survival behind enemy lines. A gripping war drama that honors the courage and sacrifice of those who serve.",
    genre: "War, Drama",
    year: 2024,
    duration: "2h 35m",
  },
  18: {
    id: 18,
    title: "Apex Predator",
    image: "/survival-action-poster.jpg",
    description:
      "Stranded in hostile territory, a survival expert must outwit both nature and human hunters. A tense thriller about the will to survive against impossible odds.",
    genre: "Action, Survival",
    year: 2024,
    duration: "2h 2m",
  },
  19: {
    id: 19,
    title: "Galactic Empire",
    image: "/space-empire-sci-fi-poster.jpg",
    description:
      "An epic space opera spanning multiple star systems as rebels fight against a tyrannical empire. Massive space battles and political intrigue on a galactic scale.",
    genre: "Sci-Fi, Epic",
    year: 2024,
    duration: "2h 48m",
  },
  20: {
    id: 20,
    title: "AI Uprising",
    image: "/sci-fi-space-movie-poster.png",
    description:
      "When artificial intelligence gains consciousness, humanity faces its greatest challenge. A thought-provoking sci-fi thriller about the future of human-AI coexistence.",
    genre: "Sci-Fi, Thriller",
    year: 2024,
    duration: "2h 15m",
  },
  21: {
    id: 21,
    title: "Time Paradox",
    image: "/quantum-physics-thriller-poster.jpg",
    description:
      "A time traveler discovers that changing the past creates devastating consequences in the present. A mind-bending thriller that explores the dangers of temporal manipulation.",
    genre: "Sci-Fi, Thriller",
    year: 2024,
    duration: "2h 12m",
  },
  22: {
    id: 22,
    title: "Mars Colony",
    image: "/sci-fi-space-movie-poster.png",
    description:
      "The first human colony on Mars faces extinction when their life support systems fail. A gripping survival story set on the red planet.",
    genre: "Sci-Fi, Drama",
    year: 2024,
    duration: "2h 8m",
  },
  23: {
    id: 23,
    title: "Cyber Realm",
    image: "/cyberpunk-neon-city-movie-poster.jpg",
    description:
      "In a world where people live more in virtual reality than the real world, a detective must solve a murder that spans both realms. A stylish cyberpunk mystery.",
    genre: "Sci-Fi, Mystery",
    year: 2024,
    duration: "2h 18m",
  },
  24: {
    id: 24,
    title: "Alien Contact",
    image: "/space-empire-sci-fi-poster.jpg",
    description:
      "First contact with an alien civilization changes everything. A team of scientists and diplomats must navigate the complexities of interstellar relations.",
    genre: "Sci-Fi, Drama",
    year: 2024,
    duration: "2h 25m",
  },
}

export default function MovieDetailClient({ movieId }: { movieId: number }) {
  const router = useRouter()
  const movie = movieDatabase[movieId]

  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [hasRated, setHasRated] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    if (!isAuth) {
      router.push("/")
    }

    const savedRating = localStorage.getItem(`movie-${movieId}-rating`)
    if (savedRating) {
      setRating(Number(savedRating))
      setHasRated(true)
    }
  }, [router, movieId])

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

  const handleRating = (stars: number) => {
    setRating(stars)
    setHasRated(true)
    localStorage.setItem(`movie-${movieId}-rating`, String(stars))
  }

  return (
    <div className="min-h-screen bg-background">
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
          <h1 className="text-2xl font-bold text-primary">StreamFlix</h1>
          <div className="w-20" />
        </div>
      </header>

      <section className="relative h-[70vh] flex items-end pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${movie.image})`,
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
            <span className="text-foreground font-semibold">{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span>{movie.genre}</span>
          </div>
        </div>
      </section>

      <section className="px-8 py-12 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-2xl" />
          </div>

          <div className="md:col-span-2 space-y-8">
            <div className="flex gap-4">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Plus className="h-5 w-5" />
                Watch List
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Check className="h-5 w-5" />
                Watched It
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <ThumbsUp className="h-5 w-5" />
                Like
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <ThumbsDown className="h-5 w-5" />
                Don't Like
              </Button>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{movie.description}</p>
            </div>

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

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Genre</h4>
                <p className="text-foreground">{movie.genre}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Release Year</h4>
                <p className="text-foreground">{movie.year}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Duration</h4>
                <p className="text-foreground">{movie.duration}</p>
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



