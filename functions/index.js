const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendScheduledNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const now = new Date();
    const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    const snapshot = await admin.firestore()
      .collection('schedules')
      .where('days', 'array-contains', day)
      .where('time', '==', time)
      .get();

    const notifications = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        notification: {
          title: 'Time to Meditate',
          body: `It's time for your ${data.exerciseName} meditation`,
        },
        token: data.fcmToken,
      });
    });

    for (const notification of notifications) {
      try {
        await admin.messaging().send(notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  });