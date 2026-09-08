import { UserRoundIcon } from 'lucide-react'

import { type CastMember, posterUrl } from '@/entities/movie'

export function MovieCast({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Elenco</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.map((member) => {
          const photo = posterUrl(member.profilePath, 'w185')
          return (
            <li key={member.id} className="space-y-1.5">
              <div className="aspect-[2/3] overflow-hidden rounded-md bg-muted">
                {photo ? (
                  <img
                    src={photo}
                    alt={member.name}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <UserRoundIcon className="size-6" />
                  </div>
                )}
              </div>
              <p className="text-sm font-medium leading-tight">{member.name}</p>
              {member.character ? (
                <p className="text-xs text-muted-foreground leading-tight">
                  {member.character}
                </p>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
