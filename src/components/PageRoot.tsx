import React from 'react'

export function PageRoot({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className={className} style={style} {...props}>
      {children}
    </main>
  )
}
