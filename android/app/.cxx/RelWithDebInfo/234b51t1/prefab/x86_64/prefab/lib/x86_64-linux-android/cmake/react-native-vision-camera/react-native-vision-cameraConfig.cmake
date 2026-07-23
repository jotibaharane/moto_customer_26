if(NOT TARGET react-native-vision-camera::VisionCamera)
add_library(react-native-vision-camera::VisionCamera SHARED IMPORTED)
set_target_properties(react-native-vision-camera::VisionCamera PROPERTIES
    IMPORTED_LOCATION "/home/motohelp2/Desktop/jotiba/moto_customer_26/node_modules/react-native-vision-camera/android/build/intermediates/cxx/RelWithDebInfo/4y3d233t/obj/x86_64/libVisionCamera.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp2/Desktop/jotiba/moto_customer_26/node_modules/react-native-vision-camera/android/build/headers/visioncamera"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

