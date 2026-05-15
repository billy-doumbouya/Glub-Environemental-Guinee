// src/data/donationData.js

/** Paliers de don en GNF — style ONG internationale */
export const DONATION_TIERS = [
  {
    id:      'tier-1',
    amount:  50000,
    label:   '50 000 GNF',
    title:   'Soutien Vert',
    emoji:   '🌱',
    impact:  'Permet de planter 10 arbres endémiques dans nos zones de reboisement.',
    color:   'border-green-200 hover:border-green-400',
    selected:'border-green-600 bg-green-50 ring-2 ring-green-500',
  },
  {
    id:      'tier-2',
    amount:  100000,
    label:   '100 000 GNF',
    title:   'Protecteur',
    emoji:   '🌿',
    impact:  'Finance une journée de sensibilisation environnementale pour une communauté.',
    color:   'border-blue-200 hover:border-blue-400',
    selected:'border-blue-600 bg-blue-50 ring-2 ring-blue-500',
    popular: true,
  },
  {
    id:      'tier-3',
    amount:  250000,
    label:   '250 000 GNF',
    title:   'Ambassadeur',
    emoji:   '🌍',
    impact:  'Couvre la formation d\'un agriculteur aux techniques agroécologiques résilientes.',
    color:   'border-amber-200 hover:border-amber-400',
    selected:'border-amber-600 bg-amber-50 ring-2 ring-amber-500',
  },
  {
    id:      'tier-4',
    amount:  500000,
    label:   '500 000 GNF',
    title:   'Bienfaiteur',
    emoji:   '🏆',
    impact:  'Permet la construction d\'un point d\'eau potable pour une famille rurale.',
    color:   'border-purple-200 hover:border-purple-400',
    selected:'border-purple-600 bg-purple-50 ring-2 ring-purple-500',
  },
]

export const MIN_AMOUNT = 10000   // 10 000 GNF minimum
export const MAX_AMOUNT = 50000000 // 50 000 000 GNF maximum

/** Impacts globaux affichés sur la page de don */
export const DONATION_IMPACTS = [
  { value: '12 000+', label: 'Bénéficiaires directs',     icon: '👥' },
  { value: '520 ha',  label: 'Hectares reboisés',          icon: '🌳' },
  { value: '15+',     label: 'Projets environnementaux',   icon: '📋' },
  { value: '8',       label: 'Préfectures couvertes',      icon: '📍' },
]

/** Témoignages courts pour la page de don */
export const DONOR_TESTIMONIALS = [
  {
    text: "Soutenir C.E.G, c'est investir directement dans l'avenir de nos forêts guinéennes.",
    author: 'Kadiatou S., donatrice',
  },
  {
    text: "Une organisation sérieuse, transparente et dont l'impact est visible sur le terrain.",
    author: 'Mamadou B., partenaire',
  },
]
