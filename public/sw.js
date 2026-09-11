// public/sw.js
//
// À la racine de /public pour être servi sur /sw.js.
// Gère la réception du push et le clic sur la notification.

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Nouveau message', body: event.data?.text() || '' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nouveau message', {
      body: data.body || '',
      icon: '/icon-192.png', // adapte au chemin réel de ton icône d'app
      badge: '/icon-192.png',
      data: { conversationId: data.conversationId },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const conversationId = event.notification.data?.conversationId;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({ type: 'notification-click', conversationId });
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/messagerie');
      }
    })
  );
});