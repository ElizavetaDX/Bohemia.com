import React from 'react'

export function Wrapper({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <main className={className} style={style}>{children}</main>
}
