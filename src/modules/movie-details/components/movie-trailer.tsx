export function MovieTrailer({
  trailerKey,
  title,
}: {
  trailerKey: string | null
  title: string
}) {
  if (!trailerKey) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Trailer</h2>
      <div className="aspect-video overflow-hidden rounded-lg border bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailerKey}`}
          title={`Trailer de ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    </section>
  )
}
