'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '/', label: 'головна' },
  { href: '/services', label: 'креатив' },
  { href: '/important', label: 'нам важливо' },
  { href: '/price', label: 'прайс' },
  { href: '/learn', label: 'навчатися' },
  { href: '/series', label: 'хх' },
]

const socialLinks = [
  { href: 'https://t.me/dasha_dorsh', label: 'Telegram', icon: 'tg' },
]

export function MobileMenu({
  isOpen,
  onClose,
  onHomeClick,
}: {
  isOpen: boolean
  onClose: () => void
  onHomeClick?: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] w-full h-full min-h-screen min-w-full bg-black md:hidden"
          style={{ backgroundColor: '#000000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute p-2 min-h-[48px] min-w-[48px] flex items-center justify-center text-white z-10"
            style={{ top: 'max(1rem, env(safe-area-inset-top))', right: 'max(1rem, env(safe-area-inset-right))' }}
            aria-label="Закрити меню"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <nav className="flex flex-col items-center gap-1 w-full max-w-sm">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.25 }}
                  className="w-full"
                >
                  {link.href === '/' ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                        onHomeClick ? onHomeClick() : (window.location.href = '/')
                      }}
                      className="flex items-center justify-center min-h-[48px] py-3 px-4 text-2xl sm:text-3xl uppercase tracking-[0.2em] transition-colors active:bg-white active:text-black w-full rounded-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center justify-center min-h-[48px] py-3 px-4 text-2xl sm:text-3xl uppercase tracking-[0.2em] transition-colors active:bg-white active:text-black w-full rounded-lg"
                      style={{ color: '#ffffff' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {socialLinks.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-full border-2 border-white uppercase text-xs tracking-widest transition-colors active:bg-white active:text-black"
                  style={{ color: '#ffffff' }}
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
