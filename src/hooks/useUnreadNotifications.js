// src/hooks/useUnreadNotifications.js
import { useEffect, useState, useCallback } from "react";
import { contactService, donationsService } from "../../api/services";

export function useUnreadNotifications() {
  const [messages, setMessages] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [msgRes, donRes] = await Promise.all([
        contactService.getAllAdmin(),
        donationsService.getAllAdmin(),
      ]);
      setMessages((msgRes.data.data || []).filter((m) => !m.isRead));
      setDonations((donRes.data.data || []).filter((d) => !d.isRead));
    } catch {
      // silencieux : notifications non bloquantes
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = messages.length + donations.length;

  return { messages, donations, total, loading, refresh: load };
}
