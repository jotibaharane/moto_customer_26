// // import Geolocation from '@react-native-community/geolocation';

// // import { store } from '@store/index';

// // import { setDriverLocation } from '@store/slices/driverLocation/driverLocationSlice';

// // import socketService from '@socket/socket.service';

// // import { SOCKET_EVENTS } from '@socket/socket.events';

// // class LocationService {

// //   private watchId: number | null = null;

// //   start() {
// //     if (this.watchId !== null) {
// //       return;
// //     }
// //     this.watchId = Geolocation.watchPosition(
// //       position => {
// //         const payload = {
// //           latitude: position.coords.latitude,
// //           longitude: position.coords.longitude,
// //           heading: position.coords.heading ?? 0,
// //           speed: position.coords.speed ?? 0,
// //           updatedAt: new Date().toISOString(),
// //         };

// //         /**
// //          * Redux
// //          */

// //         store.dispatch(
// //           setDriverLocation(payload),
// //         );

// //         /**
// //          * Socket
// //          */

// //         const socket = socketService.getSocket();

// //         if (socket?.connected) {

// //           socket.emit(
// //             SOCKET_EVENTS.DRIVER_LOCATION,
// //             payload,
// //             (response:any) => {
// //               console.log(
// //                 'Driver Location',
// //                 response,
// //               );

// //             },

// //           );

// //         }

// //       },

// //       error => {

// //         console.log(error);

// //       },

// //       {

// //         enableHighAccuracy: true,

// //         distanceFilter: 10,

// //         interval: 5000,

// //         fastestInterval: 3000,

// //       },

// //     );

// //   }

// //   stop() {

// //     if (this.watchId !== null) {

// //       Geolocation.clearWatch(
// //         this.watchId,
// //       );

// //       this.watchId = null;

// //     }

// //   }

// // }

// // export default new LocationService();

// import Geolocation, {
//   GeolocationResponse,
// } from '@react-native-community/geolocation'
// import { store } from '@store/index';

// class LocationService {
//   private watchId: number | null = null;

//   start() {
//     if (this.watchId !== null) {
//       return;
//     }

//     // 1. Get current location immediately
//     Geolocation.getCurrentPosition(
//       position => {
//         console.log('Initial Location:', position.coords);
//         this.sendLocation(position);
//       },
//       error => {
//         console.log('Initial Location Error:', error);
//       },
//     );

//     // 2. Listen for location updates
//     this.watchId = Geolocation.watchPosition(
//       position => {
//         console.log('Location Updated:', position.coords);
//         this.sendLocation(position);
//       },
//       error => {
//         console.log(error);
//       },
//       {
//         enableHighAccuracy: true,
//         distanceFilter: 10,
//         interval: 5000,
//         fastestInterval: 3000,
//       },
//     );
//   }

//   stop() {
//     if (this.watchId !== null) {
//       Geolocation.clearWatch(this.watchId);
//       this.watchId = null;
//     }
//   }
// }

// export default new LocationService();
