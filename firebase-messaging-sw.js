importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD-placeholder",
  authDomain: "arkanlab-99711.firebaseapp.com",
  databaseURL: "https://arkanlab-99711-default-rtdb.firebaseio.com/",
  projectId: "arkanlab-99711",
  storageBucket: "arkanlab-99711.appspot.com",
  messagingSenderId: "871697042781",
  appId: "1:871697042781:web:placeholder"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'منظومة النخب';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [{ action: 'open', title: 'فتح التطبيق' }]
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
