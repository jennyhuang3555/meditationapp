importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBjCGDwoCNOnAXEn8-3cviwU9o3wC2uV_g",
  authDomain: "meditationapp-484fc.firebaseapp.com",
  projectId: "meditationapp-484fc",
  storageBucket: "meditationapp-484fc.appspot.com",
  messagingSenderId: "816648817051",
  appId: "1:816648817051:web:75ee22283fdf38564c793e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/meditation-icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});