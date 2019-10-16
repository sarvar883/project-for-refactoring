if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// function configurePushSub() {
//   if ('serviceWorker' in navigator) {
//     let reg;
//     navigator.serviceWorker.ready
//       .then(swreg => {
//         reg = swreg;
//         return swreg.pushManager.getSubscription();
//       })
//       .then(sub => {
//         if (sub === null) {
//           // create new subscription
//           const vapidPublicKey = 'BEyIbOUShP-vZj7DDUq9_qwOJT07Rbz6agXHEI5f0APvr7oj0kugV2wbFcIGiFL_I4G9T1v8YK6V-SzNvwQsFVM';
//           let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
//           return reg.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: convertedVapidPublicKey
//           });
//         } else {
//           // we have a subscription
//         }
//       })
//       .then(newSub => {

//       });
//   } else {
//     return;
//   }
// }

// if ('Notification' in window) {
//   // ask for notification permission
//   Notification.requestPermission(res => {
//     if (res === 'granted' && 'serviceWorker' in navigator) {
//       configurePushSub();

//       // display confirm notification
//       // navigator.serviceWorker.ready
//       //   .then(swreg => {
//       //     let options = {
//       //       body: 'Уведомления Pro Team включены',
//       //       vibrate: [100, 50, 200],
//       //       tag: 'confirm-notification',
//       //       renotify: true
//       //     }
//       //     swreg.showNotification('Уведомления включены', options);
//       //   });
//     }
//   });
// }



// function urlBase64ToUint8Array(base64String) {
//   var padding = '='.repeat((4 - base64String.length % 4) % 4);
//   var base64 = (base64String + padding)
//     .replace(/\-/g, '+')
//     .replace(/_/g, '/');

//   var rawData = window.atob(base64);
//   var outputArray = new Uint8Array(rawData.length);

//   for (var i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }