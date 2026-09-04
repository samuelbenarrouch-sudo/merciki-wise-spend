import type { ReactNode } from "react";

/**
 * Tableau de leads PUREMENT PRÉSENTATIONNEL.
 *
 * Il ne lit aucune donnée : ni Supabase, ni backoffice.ts, ni myLeads.ts.
 * Chaque écran (administration, consultation) lui passe ses propres lignes
 * déjà mises en forme, et son propre rendu de statut.
 */

export interface LeadTableRow {
  id: string;
  reference: string;
  dateLabel: string;
  productLabel: string;
  prospectName: string;
  phone: string;
  postalCode: string;
  commercialName: string;
  status: ReactNode;
}

export function LeadsTable({
  rows,
  showCommercial = true,
  onRowClick,
}: {
  rows: LeadTableRow[];
  showCommercial?: boolean;
  onRowClick: (id: string) => void;
}) {
  return (
    <>
      {/* Bureau : tableau dense */}
      <div className="mt-3 hidden overflow-x-auto rounded-2xl border border-mist md:block">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-mist/60 text-label uppercase text-slate">
            <tr>
              <th className="px-4 py-3">Référence</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Prospect</th>
              <th className="px-4 py-3">Téléphone</th>
              <th className="px-4 py-3">CP</th>
              {showCommercial && <th className="px-4 py-3">Commercial</th>}
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className="cursor-pointer border-t border-mist transition-colors hover:bg-mist/40"
              >
                <td className="px-4 py-3 font-medium text-ink">{row.reference}</td>
                <td className="px-4 py-3 text-slate">{row.dateLabel}</td>
                <td className="px-4 py-3 text-slate">{row.productLabel}</td>
                <td className="px-4 py-3 text-ink">{row.prospectName}</td>
                <td className="px-4 py-3 text-slate">{row.phone}</td>
                <td className="px-4 py-3 text-slate">{row.postalCode}</td>
                {showCommercial && (
                  <td className="px-4 py-3 text-slate">{row.commercialName}</td>
                )}
                <td className="px-4 py-3">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile : repli en cartes */}
      <ul className="mt-3 space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onRowClick(row.id)}
              className="w-full rounded-2xl border border-mist bg-background p-4 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-small font-medium text-ink">{row.reference}</span>
                {row.status}
              </div>
              <p className="mt-2 text-body text-ink">{row.prospectName}</p>
              <p className="mt-1 text-small text-slate">
                {row.productLabel} · {row.dateLabel} · {row.postalCode}
              </p>
              {showCommercial && (
                <p className="mt-1 text-small text-slate">
                  Commercial : {row.commercialName}
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
