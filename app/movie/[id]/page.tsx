import MovieDetailClient from '@/components/MovieDetailClient'

export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: 24 }, (_, i) => ({ id: String(i + 1) }))
}

export default function Page({ params }: { params: { id: string } }) {
  return <MovieDetailClient movieId={Number(params.id)} />
}
