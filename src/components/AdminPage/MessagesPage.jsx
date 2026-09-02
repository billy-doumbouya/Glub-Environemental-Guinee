// src/components/AdminPage/MessagesPage.jsx
// Messages reçus via le formulaire de contact — lecture, marquage lu, suppression

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { contactService } from "../../../api/services";
import {
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DashboardLoadingScreen,
  Modal,
  PageHeader,
} from "../ui";
import { DashboardLayout } from "../../layouts/DashboardLayout";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const res = await contactService.getAllAdmin();
      setMessages(res.data.data || []);
    } catch {
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const openView = async (msg) => {
    setViewItem(msg);
    if (!msg.isRead) {
      try {
        await contactService.markAsRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m)),
        );
      } catch {
        // silencieux — le marquage lu n'est pas bloquant pour la lecture
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await contactService.remove(deleteItem._id);
      toast.success("Message supprimé");
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
              <i className="ti ti-mail" aria-hidden="true" /> Messages
            </span>
          }
          subtitle={`${messages.length} message(s) — ${unreadCount} non lu(s)`}
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
                    "Nom",
                    "Email",
                    "Sujet",
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
                {messages.map((m) => (
                  <tr
                    key={m._id}
                    className={`border-b border-gray-100 ${
                      !m.isRead ? "bg-amber-50/40" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Badge color={m.isRead ? "gray" : "amber"}>
                        {m.isRead ? "Lu" : "Nouveau"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-gray-900">
                        {m.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {m.phone || "—"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      {m.email}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700 max-w-[220px] truncate">
                      {m.subject}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-700">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openView(m)}
                        >
                          <i className="ti ti-eye mr-1" aria-hidden="true" />
                          Voir
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => setDeleteItem(m)}
                        >
                          <i className="ti ti-trash" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      Aucun message pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        )}

        {/* Modal détail message */}
        <Modal
          isOpen={!!viewItem}
          onClose={() => setViewItem(null)}
          title="Détail du message"
          size="lg"
        >
          {viewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Nom
                  </div>
                  <div className="text-sm text-gray-900">{viewItem.name}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Email
                  </div>
                  <div className="text-sm text-gray-900">{viewItem.email}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Téléphone
                  </div>
                  <div className="text-sm text-gray-900">
                    {viewItem.phone || "Non renseigné"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Sujet
                  </div>
                  <div className="text-sm text-gray-900">
                    {viewItem.subject}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Message
                </div>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-xl p-4 border border-gray-100">
                  {viewItem.message}
                </p>
              </div>
              <div className="flex justify-end pt-2 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={() =>
                    (window.location.href = `mailto:${viewItem.email}?subject=Re: ${viewItem.subject}`)
                  }
                >
                  <i className="ti ti-mail mr-1" aria-hidden="true" />
                  Répondre par email
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Supprimer le message"
          message={`Êtes-vous sûr de vouloir supprimer le message de "${deleteItem?.name}" ? Cette action est irréversible.`}
        />
      </div>
    </DashboardLayout>
  );
}
