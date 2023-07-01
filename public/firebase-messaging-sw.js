// importScripts(
//   "https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js"
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyBjhzML-N5DjEW1DHwkbS2vYi5h8HJhUF8",
//   authDomain: "webchatbyhulff.firebaseapp.com",
//   projectId: "webchatbyhulff",
//   storageBucket: "webchatbyhulff.appspot.com",
//   messagingSenderId: "972828551178",
//   appId: "1:972828551178:web:823d0843820f84f18e97f3",
//   measurementId: "G-GQW3KQNN8X",
// };
// firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// // messaging.onBackgroundMessage((payload) => {
// //   console.log("serviceworker Recieved msg", payload);
// //   const notificationTitle = payload.notification.title;
// //   const notificationOptions = {
// //     body: payload.notification.body,
// //     icon: payload.notification.image,
// //   };
// //   self.registration.showNotification(notificationTitle, notificationOptions);
// // });

// // Configurar as ações para manipular as notificações recebidas
// self.addEventListener("push", (event) => {
//   const payload = event.data.json();
//   console.log("serviceworker Recieved msg", payload);
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   event.waitUntil(
//     self.registration.showNotification(
//       payload.notification.title,
//       notificationOptions
//     )
//   );
// });

// // // Tratar as interações do usuário com as notificações
// // self.addEventListener("notificationclick", (event) => {
// //   // Manipule o clique na notificação conforme necessário
// //   // Por exemplo: redirecione para uma página específica
// // });
