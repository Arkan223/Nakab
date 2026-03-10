importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "m58OJf1mYVHGuO1SJa2QydGIbL0gFnjQ6babKb5ayME",
    messagingSenderId: "871697042781",
    projectId: "arkanlab-99711"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png'
    };
    self.registration.showNotification(notificationTitle, notificationOptions);
});
