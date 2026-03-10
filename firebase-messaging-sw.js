importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  messagingSenderId: "871697042781",
  databaseURL: "https://arkanlab-99711-default-rtdb.firebaseio.com/"
});

const messaging = firebase.messaging();

// معالجة الإشعارات عندما تكون الخلفية مغلقة
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
