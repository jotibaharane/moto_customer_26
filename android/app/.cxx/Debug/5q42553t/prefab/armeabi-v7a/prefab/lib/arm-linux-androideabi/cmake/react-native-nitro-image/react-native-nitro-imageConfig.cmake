if(NOT TARGET react-native-nitro-image::NitroImage)
add_library(react-native-nitro-image::NitroImage SHARED IMPORTED)
set_target_properties(react-native-nitro-image::NitroImage PROPERTIES
    IMPORTED_LOCATION "C:/Users/cs/Desktop/jotiba/moto_customer/node_modules/react-native-nitro-image/android/build/intermediates/cxx/Debug/f1v5i4fd/obj/armeabi-v7a/libNitroImage.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/cs/Desktop/jotiba/moto_customer/node_modules/react-native-nitro-image/android/build/headers/nitroimage"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

