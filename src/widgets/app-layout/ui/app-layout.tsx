import { Link, useNavigate } from '@tanstack/react-router'
import { FilmIcon, LogOutIcon, UserIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { useSession } from '@/features/auth'
import { ThemeToggle } from '@/features/theme'
import { useWatchlistCount } from '@/features/watchlist'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'

const linkClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'
const activeLinkClass = 'font-medium text-foreground'

function MainNav() {
  const count = useWatchlistCount()

  return (
    <nav className="flex items-center gap-4">
      <Link
        to="/"
        activeOptions={{ exact: true }}
        className={linkClass}
        activeProps={{ className: activeLinkClass }}
      >
        Descoberta
      </Link>
      <Link
        to="/watchlist"
        className={cn(linkClass, 'flex items-center gap-1.5')}
        activeProps={{ className: activeLinkClass }}
      >
        Minha lista
        {count > 0 ? (
          <span className="rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground tabular-nums">
            {count}
          </span>
        ) : null}
      </Link>
    </nav>
  )
}

function UserMenu() {
  const { user, signOut } = useSession()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu do usuário">
          <UserIcon className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium">{user.name}</span>
          <span className="block text-xs text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => {
            signOut()
            void navigate({ to: '/login' })
          }}
        >
          <LogOutIcon className="size-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <FilmIcon className="size-5 text-primary" />
              CineDash
            </Link>
            {isAuthenticated ? <MainNav /> : null}
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  )
}
