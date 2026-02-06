export type EpisodeStatus = 'FREE' | 'PAID' | 'SOON'

export const EPISODES = [
  { id: 1, title: 'Серія 1', status: 'FREE' as EpisodeStatus, price: 0 },
  { id: 2, title: 'Серія 2', status: 'PAID' as EpisodeStatus, price: 99 },
  { id: 3, title: 'Серія 3', status: 'PAID' as EpisodeStatus, price: 99 },
  { id: 4, title: 'Серія 4', status: 'PAID' as EpisodeStatus, price: 99 },
  { id: 5, title: 'Серія 5', status: 'PAID' as EpisodeStatus, price: 99 },
  { id: 6, title: 'Серія 6', status: 'PAID' as EpisodeStatus, price: 99 },
  { id: 7, title: 'Серія 7', status: 'SOON' as EpisodeStatus, price: 0 },
  { id: 8, title: 'Серія 8', status: 'SOON' as EpisodeStatus, price: 0 },
  { id: 9, title: 'Серія 9', status: 'SOON' as EpisodeStatus, price: 0 },
  { id: 10, title: 'Серія 10', status: 'SOON' as EpisodeStatus, price: 0 },
  { id: 11, title: 'Серія 11', status: 'SOON' as EpisodeStatus, price: 0 },
  { id: 12, title: 'Серія 12', status: 'SOON' as EpisodeStatus, price: 0 },
]
