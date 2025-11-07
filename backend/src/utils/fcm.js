const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

if (process.env.FCM_SERVICE_ACCOUNT) {
  const serviceAccount = require(path.resolve(process.env.FCM_SERVICE_ACCOUNT));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

/**
 * Sends a push notification to a device token.
 */
async function sendPush(token, title, body) {
  if (!admin.apps.length) return; // FCM disabled
  const message = {
    token,
    notification: { title, body },
    android: { priority: 'high' },
    apns: { payload: { aps: { sound: 'default' } } }
  };
  const resp = await admin.messaging().send(message);
  console.log('📲 Push sent', resp);
}

module.exports = { sendPush };