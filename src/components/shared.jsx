import React from 'react';

export function Sidebar({ current, onNavigate }) {
  const links = [
    { key: 'dashboard', label: 'Vue synthétique' },
    { key: 'opportunities', label: 'Appels à projets' },
    { key: 'sources', label: 'Sources de veille' },
    { key: 'profile', label: 'Profil de l\u2019ONG' },
  ];
  return (
    <nav className="fr-sidebar">
      <div className="fr-sidebar__brand">Veille<br />Financements</div>
      {links.map(l => (
        <button
          key={l.key}
          className={`fr-sidebar__link ${current === l.key ? 'fr-sidebar__link--active' : ''}`}
          onClick={() => onNavigate(l.key)}
        >
          {l.label}
        </button>
      ))}
    </nav>
  );
}

export function EligibilityBadge({ verdict }) {
  const map = {
    eligible: { cls: 'fr-badge--eligible', label: 'Éligible' },
    a_verifier: { cls: 'fr-badge--verify', label: 'À vérifier' },
    non_eligible: { cls: 'fr-badge--not-eligible', label: 'Non éligible' },
  };
  const item = map[verdict] || map.a_verifier;
  return <span className={`fr-badge ${item.cls}`}>{item.label}</span>;
}

export function scoreRowClass(score) {
  if (score >= 70) return 'fr-row--high';
  if (score >= 40) return 'fr-row--mid';
  return 'fr-row--low';
}

export function formatDeadline(deadline) {
  if (!deadline) return null;
  const d = new Date(deadline);
  const daysLeft = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
  const formatted = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  return { formatted, daysLeft, soon: daysLeft <= 14 && daysLeft >= 0 };
}
