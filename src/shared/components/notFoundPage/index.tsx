import { Link } from '@tanstack/react-router'

import { Button } from '@/shared/ui/button'

interface IProps {
  title?: string
  buttonText?: string
  description?: string
}

export const NotFound = ({ description, title, buttonText }: IProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-5xl font-bold tracking-tight text-muted-foreground">
        404
      </p>
      {title && <h1 className="text-xl font-semibold">{title}</h1>}
      {description && (
        <p className="max-w-sm text-muted-foreground">{description}</p>
      )}
      {description && (
        <Button asChild>
          <Link to="/">{buttonText}</Link>
        </Button>
      )}
    </section>
  )
}
