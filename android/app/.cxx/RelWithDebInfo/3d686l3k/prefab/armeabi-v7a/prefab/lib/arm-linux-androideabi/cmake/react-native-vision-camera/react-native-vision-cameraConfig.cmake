if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-vision-camera/android/build/intermediates/cxx/RelWithDebInfo/401v2p5k/obj/armeabi-v7a/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

