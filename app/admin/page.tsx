"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { getMovies, createMovie, updateMovie, deleteMovie, type Movie } from "@/lib/api"

export default function AdminPage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string; role: string } | null>(null)

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  // Form states
  const [title, setTitle] = useState("")
  const [genres, setGenres] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    const userData = localStorage.getItem("currentUser")

    if (!isAuth || !userData) {
      router.push("/")
      return
    }

    const user = JSON.parse(userData)

    // Check if user is superadmin
    if (user.role !== "superadmin") {
      router.push("/browse")
      return
    }

    setCurrentUser(user)
    fetchMovies()
  }, [router])

  const fetchMovies = async () => {
    try {
      const data = await getMovies(100, 0)
      setMovies(data)
    } catch (error) {
      console.error("Failed to fetch movies:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!title.trim() || !genres.trim()) return

    setSubmitting(true)
    try {
      const genresArray = genres.split(",").map((g) => g.trim())
      await createMovie(title, genresArray)
      await fetchMovies()
      setIsCreateOpen(false)
      setTitle("")
      setGenres("")
    } catch (error) {
      console.error("Failed to create movie:", error)
      alert("Failed to create movie. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async () => {
    if (!selectedMovie || !title.trim()) return

    setSubmitting(true)
    try {
      const genresArray = genres ? genres.split(",").map((g) => g.trim()) : undefined
      await updateMovie(selectedMovie.id, title, genresArray)
      await fetchMovies()
      setIsEditOpen(false)
      setSelectedMovie(null)
      setTitle("")
      setGenres("")
    } catch (error) {
      console.error("Failed to update movie:", error)
      alert("Failed to update movie. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMovie) return

    setSubmitting(true)
    try {
      await deleteMovie(selectedMovie.id)
      await fetchMovies()
      setIsDeleteOpen(false)
      setSelectedMovie(null)
    } catch (error) {
      console.error("Failed to delete movie:", error)
      alert("Failed to delete movie. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const openEditDialog = (movie: Movie) => {
    setSelectedMovie(movie)
    setTitle(movie.title)
    setGenres(movie.genres.join(", "))
    setIsEditOpen(true)
  }

  const openDeleteDialog = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsDeleteOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/browse")}
            className="text-foreground hover:text-muted-foreground gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Browse
          </Button>
          <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          <div className="w-32" />
        </div>
      </header>

      {/* Page Content */}
      <div className="pt-24 px-8 pb-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Movie Management</h1>
            <p className="text-muted-foreground">Create, edit, and delete movies</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="h-5 w-5" />
            Add Movie
          </Button>
        </div>

        {/* Movies Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Genres</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-muted-foreground">{movie.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{movie.title}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{movie.genres.join(", ")}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(movie)} className="gap-2">
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(movie)}
                          className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Movie Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogDescription>Create a new movie entry in the database.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-title">Title</Label>
              <Input
                id="create-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-genres">Genres</Label>
              <Input
                id="create-genres"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Action, Sci-Fi, Adventure"
              />
              <p className="text-xs text-muted-foreground">Separate multiple genres with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting || !title.trim() || !genres.trim()}>
              {submitting ? "Creating..." : "Create Movie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>Update the movie title and genres.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter movie title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-genres">Genres</Label>
              <Input
                id="edit-genres"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Action, Sci-Fi, Adventure"
              />
              <p className="text-xs text-muted-foreground">Separate multiple genres with commas</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={submitting || !title.trim()}>
              {submitting ? "Updating..." : "Update Movie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Movie Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Movie</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMovie?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {submitting ? "Deleting..." : "Delete Movie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
