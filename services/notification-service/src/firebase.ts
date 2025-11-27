import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com',
    }),
  });
}

const messaging = admin.messaging();

// Function to send FCM notification
export const sendFCMNotification = async (token: string, title: string, body: string, data?: any) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    data: data || {},
  };

  try {
    const response = await messaging.send(message);
    console.log('Successfully sent FCM message:', response);
    return response;
  } catch (error) {
    console.error('Error sending FCM message:', error);
    throw error;
  }
};

export { messaging };