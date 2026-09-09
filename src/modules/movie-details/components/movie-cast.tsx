import { UserRoundIcon } from 'lucide-react'

import type { CastMember } from '@/_core/models/responses/movie'
import { TmdbImage } from '@/shared/components/tmdb-image'

export function MovieCast({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Elenco</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.map((member) => (
          <li key={member.id} className="space-y-1.5">
            <TmdbImage
              path={member.profilePath}
              size="w185"
              alt={member.name}
              fallback={<UserRoundIcon className="size-6" />}
              className="aspect-[2/3] rounded-md"
            />
            <p className="text-sm font-medium leading-tight">{member.name}</p>
            {member.character ? (
              <p className="text-xs text-muted-foreground leading-tight">
                {member.character}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
