// API base URLs
const MOVIES_API = "https://cq6rnraumra73ggndaubv4mslu0uzasy.lambda-url.us-east-1.on.aws"
const USERS_API = "https://uyanvpczmdpromwzbutjdsg4za0lrfwx.lambda-url.us-east-1.on.aws"
const RATINGS_API = "https://vcpkvf6ar6lgd4pbsxm5seg4fq0ujqlx.lambda-url.us-east-1.on.aws"

// Types
export interface Movie {
  id: number
  title: string
  genres: string[]
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id: number
  username: string
  email: string
  role: string
  createdAt?: string
}

export interface Rating {
  userId: number
  movieId: number
  rating: number
  timestamp: number
}

function normalizeMovie(raw: any): Movie {
  const rawGenres = raw?.genres
  const genresArray = Array.isArray(rawGenres)
    ? rawGenres
    : typeof rawGenres === "string"
      ? rawGenres.split(",")
      : []

  const rawId = raw?.id ?? raw?.movieId
  const parsedId = typeof rawId === "number" ? rawId : Number(rawId)

  return {
    id: parsedId,
    title: String(raw?.title ?? ""),
    genres: genresArray
      .map((g: any) => String(g))
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0),
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
  }
}

// Movies API
export async function getMovies(limit = 20, offset = 0, query = ""): Promise<Movie[]> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(query && { q: query }),
  })
  const response = await fetch(`/api/movies?${params}`)
  if (!response.ok) throw new Error("Failed to fetch movies")
  const data = await response.json().catch(() => null)
  if (Array.isArray(data)) return data.map(normalizeMovie)
  if (data && Array.isArray(data.movies)) return data.movies.map(normalizeMovie)
  if (data && Array.isArray(data.items)) return data.items.map(normalizeMovie)
  return []
}

export async function getMovie(id: number): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`)
  if (!response.ok) throw new Error("Failed to fetch movie")
  const data = await response.json()
  return normalizeMovie(data)
}

export async function createMovie(title: string, genres: string[]): Promise<Movie> {
  const response = await fetch(`/api/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, genres }),
  })
  if (!response.ok) throw new Error("Failed to create movie")
  return response.json()
}

export async function updateMovie(id: number, title?: string, genres?: string[]): Promise<Movie> {
  const response = await fetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...(title && { title }), ...(genres && { genres }) }),
  })
  if (!response.ok) throw new Error("Failed to update movie")
  return response.json()
}

export async function deleteMovie(id: number): Promise<void> {
  const response = await fetch(`/api/movies/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete movie")
}

// Users API
export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${USERS_API}/users`)
  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function getUser(id: number): Promise<User> {
  const response = await fetch(`${USERS_API}/users/${id}`)
  if (!response.ok) throw new Error("Failed to fetch user")
  return response.json()
}

export async function createUser(username: string, email: string, password: string, role = "user"): Promise<User> {
  const response = await fetch(`${USERS_API}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, role }),
  })
  if (!response.ok) throw new Error("Failed to create user")
  return response.json()
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const users = await getUsers()
  // Simple authentication - in production, this should be done server-side
  const user = users.find((u) => u.username === username)
  return user || null
}

// Ratings API
export async function getRatings(userId?: number, movieId?: number): Promise<Rating[]> {
  const params = new URLSearchParams()
  if (userId) params.append("userId", userId.toString())
  if (movieId) params.append("movieId", movieId.toString())

  const response = await fetch(`${RATINGS_API}/ratings?${params}`)
  if (!response.ok) throw new Error("Failed to fetch ratings")
  return response.json()
}

export async function getRating(userId: number, movieId: number): Promise<Rating | null> {
  try {
    const response = await fetch(`${RATINGS_API}/ratings/${userId}/${movieId}`)
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function createRating(userId: number, movieId: number, rating: number): Promise<Rating> {
  const response = await fetch(`${RATINGS_API}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, movieId, rating, timestamp: Date.now() }),
  })
  if (!response.ok) throw new Error("Failed to create rating")
  return response.json()
}

export async function updateRating(userId: number, movieId: number, rating: number): Promise<Rating> {
  const response = await fetch(`${RATINGS_API}/ratings/${userId}/${movieId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, timestamp: Date.now() }),
  })
  if (!response.ok) throw new Error("Failed to update rating")
  return response.json()
}

export async function deleteRating(userId: number, movieId: number): Promise<void> {
  const response = await fetch(`${RATINGS_API}/ratings/${userId}/${movieId}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("Failed to delete rating")
}
