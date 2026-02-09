export type Guide = {
  slug: string
  title: string
  description: string
}

export const GUIDES: Guide[] = [
  {
    slug: 'animacia-z-nulya',
    title: 'Анімація з нуля',
    description: 'Покроковий гайд для початківців: інструменти, таймінг, перші кадри.',
  },
  {
    slug: 'storyboard-za-5-krokiv',
    title: 'Сторіборд за 5 кроків',
    description: 'Як перетворити ідею на візуальну послідовність сцен.',
  },
]

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug)
}
