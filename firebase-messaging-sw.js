// ════════════════════════════════════════════════════════
//  firebase-messaging-sw.js
//  Service Worker للإشعارات الخارجية — منظومة النخب
//  يجب وضع هذا الملف في نفس مجلد index.html (الجذر)
// ════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// ── نفس إعدادات Firebase في index.html ──
firebase.initializeApp({
  apiKey:            "AIzaSyApPJjEWPfz5njRS714IuleqJ6fzrroEZE",
  authDomain:        "arkanlab-99711.firebaseapp.com",
  databaseURL:       "https://arkanlab-99711-default-rtdb.firebaseio.com",
  projectId:         "arkanlab-99711",
  storageBucket:     "arkanlab-99711.firebasestorage.app",
  messagingSenderId: "871697042781",
  appId:             "1:871697042781:web:74e6fbdd5f1196aeba2cb4",
  measurementId:     "G-JBC3R7SN7G"
});

const messaging = firebase.messaging();

// ══════════════════════════════════════════
//  1. استقبال الإشعارات في الخلفية
//     (عندما يكون التطبيق مغلقاً أو في تاب آخر)
// ══════════════════════════════════════════
messaging.onBackgroundMessage(payload => {
  console.log('[SW] Background message received:', payload);

  const { title, body, icon, image, click_action } = payload.notification || {};
  const data = payload.data || {};

  const notifTitle = title || '📢 منظومة النخب';
  const notifBody  = body  || data.text || 'لديك إشعار جديد';
  const notifIcon  = icon  || 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png';
  const notifBadge = 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png';

  const options = {
    body:             notifBody,
    icon:             notifIcon,
    badge:            notifBadge,
    image:            image || undefined,
    tag:              data.tag || 'arkan-notif',
    renotify:         true,
    requireInteraction: data.requireInteraction === 'true' || false,
    vibrate:          [200, 100, 200],
    dir:              'rtl',
    lang:             'ar',
    data: {
      url:  click_action || data.url || '/',
      type: data.type || 'general',
      key:  data.key  || ''
    },
    actions: _getActions(data.type)
  };

  return self.registration.showNotification(notifTitle, options);
});

// ══════════════════════════════════════════
//  2. النقر على الإشعار — فتح التطبيق
// ══════════════════════════════════════════
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const data    = event.notification.data || {};
  const action  = event.action;
  const url     = data.url || '/';

  // إذا ضغط على زر "تجاهل"
  if (action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // إذا كان التطبيق مفتوحاً → ركّز عليه
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          // أرسل رسالة للتطبيق لفتح القسم المناسب
          client.postMessage({
            type:    'NOTIF_CLICK',
            payload: data
          });
          return;
        }
      }
      // إذا كان مغلقاً → افتحه
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// ══════════════════════════════════════════
//  3. إغلاق الإشعار
// ══════════════════════════════════════════
self.addEventListener('notificationclose', event => {
  console.log('[SW] Notification closed:', event.notification.tag);
});

// ══════════════════════════════════════════
//  4. تثبيت وتفعيل الـ Service Worker
// ══════════════════════════════════════════
self.addEventListener('install', event => {
  console.log('[SW] Installed — منظومة النخب');
  self.skipWaiting(); // تفعيل فوري بدون انتظار
});

self.addEventListener('activate', event => {
  console.log('[SW] Activated');
  event.waitUntil(clients.claim()); // السيطرة على جميع التابات فوراً
});

// ══════════════════════════════════════════
//  Helper — أزرار الإشعار حسب النوع
// ══════════════════════════════════════════
function _getActions(type) {
  switch (type) {
    case 'admin_broadcast':
      return [
        { action: 'open',    title: '📖 فتح التطبيق' },
        { action: 'dismiss', title: '✖ إغلاق'         }
      ];
    case 'event':
      return [
        { action: 'open',    title: '📅 عرض الفعالية' },
        { action: 'dismiss', title: '✖ لاحقاً'        }
      ];
    case 'poll':
      return [
        { action: 'open',    title: '📊 التصويت الآن' },
        { action: 'dismiss', title: '✖ إغلاق'         }
      ];
    default:
      return [
        { action: 'open',    title: '📖 فتح'   },
        { action: 'dismiss', title: '✖ إغلاق'  }
      ];
  }
}
