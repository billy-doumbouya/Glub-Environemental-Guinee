// src/components/AdminPage/DonationsPage.jsx
// Dons initiés via GeniusPay — visibles dès l'initiation, avant confirmation de paiement

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { donationsService } from "../../../api/services";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DashboardLoadingScreen,
  PageHeader,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

const STATUS_LABEL = {
  pending: "En attente",
  completed: "Confirmé",
  failed: "Échoué",
};

const STATUS_COLOR = {
  pending: "amber",
  completed: "green",
  failed: "red",
};

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await donationsService.getAllAdmin();
      setDonations(res.data.data || []);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = donations.filter((d) => !d.isRead).length;
  const totalAmount = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + d.amount, 0);

  const markRead = async (id) => {
    try {
      await donationsService.markAsRead(id);
      setDonations((prev) =>
        prev.map((d) => (d._id === id ? { ...d, isRead: true } : d)),
      );
    } catch {
      toast.error("Erreur lors du marquage");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await donationsService.remove(deleteItem._id);
      toast.success("Don supprimé");
      setDeleteItem(null);
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <PageHeader
          title={
            <span className="inline-flex items-center gap-2">
              <i className="ti ti-coin" aria-hidden="true" /> Dons
            </span>
          }
          subtitle={`${donations.length} don(s) — ${unreadCount} non lu(s) — ${totalAmount.toLocaleString("fr-FR")} GNF confirmés`}
        />

        {loading ? (
          <DashboardLoadingScreen />
        ) : (
          <Card>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {[
                    "Statut",
                    "Notif",
                    "Donateur",
                    "Contact",
                    "Montant",
                    "Reçu le",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[13px] font-semibold text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr
                    key={d._id}
                    className={`border-b border-gray-100 ${
                      !d.isRead ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Badge color={STATUS_COLOR[d.status]}>
                        {STATUS_LABEL[d.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {!d.isRead && <Badge color="amber">Nouveau</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-gray-900">
                        {d.donorName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d.transactionId}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      <div>{d.donorEmail}</div>
                      <div className="text-xs text-gray-500">
                        {d.phone || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {d.amount.toLocaleString("fr-FR")} GNF
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {!d.isRead && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markRead(d._id)}
                          >
                            <i
                              className="ti ti-check mr-1"
                              aria-hidden="true"
                            />
                            Marquer lu
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteItem(d)}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Aucun don pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le don"
          message={`Êtes-vous sûr de vouloir supprimer l'enregistrement du don de "${deleteItem?.donorName}" ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}
