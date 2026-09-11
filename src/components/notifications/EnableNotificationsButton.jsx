// src/components/notifications/EnableNotificationsButton.jsx

import { Bell } from "lucide-react";
import { useEffect, useState } from 'react';
import { disablePushNotifications, enablePushNotifications, getPushPermissionState } from '../../../services/pushService';

export default function EnableNotificationsButton({ userId , compact = false}) {
  const [state, setState] = useState('checking'); // checking | default | granted | denied | unsupported
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPushPermissionState().then(setState);
  }, []);

  const handleEnable = async () => {
    setBusy(true);
    try {
      const ok = await enablePushNotifications(userId);
      setState(ok ? 'granted' : 'denied');
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDisable = async () => {
    setBusy(true);
    try {
      await disablePushNotifications();
      setState('default');
    } finally {
      setBusy(false);
    }
  };

  if (state === 'unsupported') return null;

  if (state === 'granted') {
    return (
      <button className="btn btn-ghost" onClick={handleDisable} disabled={busy}>
        🔔 Notifications activées
      </button>
    );
  }

  if (state === 'denied') {
    return (
      <span className="muted" style={{ fontSize: '12px' }}>
        Notifications bloquées — active-les dans les réglages du navigateur.
      </span>
    );
  }

  if (compact) { return ( <button type="button" className="notification-nav-button" onClick={handleEnable} aria-label="Activer les notifications" title="Notifications" > <Bell size={21} strokeWidth={2} /> <span>Notifications</span> </button> ); }

  return (
    <button className="btn btn-primary" onClick={handleEnable} disabled={busy}>
      🔔 {busy ? 'Activation…' : 'Activer les notifications'}
    </button>
  );
}