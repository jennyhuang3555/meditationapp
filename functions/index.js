const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Remove the pubsub scheduler for now and just handle the test notification
exports.sendTestNotification = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send('');
    return;
  }

  try {
    const { token } = req.body;
    
    console.log('Received request to send test notification');
    console.log('Token:', token);

    if (!token) {
      throw new Error('No FCM token provided');
    }

    const message = {
      notification: {
        title: 'Test Meditation Reminder',
        body: 'This is a test notification. Your meditation app is working!'
      },
      token: token
    };

    console.log('Sending message:', message);
    
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    
    res.json({ 
      success: true, 
      message: 'Notification sent successfully',
      messageId: response 
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      errorDetails: error
    });
  }
});