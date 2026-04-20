// import { Alert } from 'react-native';
// import {
//   Asset,
//   CameraOptions,
//   ImagePickerResponse,
//   launchCamera,
// } from 'react-native-image-picker';

// export const openCameraBase64 = async (): Promise<string | null> => {
//   try {
//     const options: CameraOptions = {
//       mediaType: 'photo',
//       cameraType: 'back',
//       saveToPhotos: false,
//       includeBase64: true,
//       quality: 0.3,
//       maxWidth: 400,
//       maxHeight: 400,
//     };

//     const result: ImagePickerResponse = await launchCamera(options);

//     if (result.didCancel) return null;

//     if (result.errorCode) {
//       Alert.alert(
//         'Camera Error',
//         result.errorMessage ?? 'Failed to open camera',
//       );
//       return null;
//     }

//     const asset: Asset | undefined = result.assets?.[0];

//     if (!asset?.base64 || !asset.type) {
//       Alert.alert('Error', 'Unable to process captured image');
//       return null;
//     }

//     return `data:${asset.type};base64,${asset.base64}`;
//   } catch (error) {
//     Alert.alert(
//       'Unexpected Error',
//       'Something went wrong while opening camera',
//     );
//     return null;
//   }
// };
