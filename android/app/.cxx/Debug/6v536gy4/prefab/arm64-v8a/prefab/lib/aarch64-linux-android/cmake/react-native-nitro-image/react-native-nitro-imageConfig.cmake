if(NOT TARGET react-native-nitro-image::NitroImage)
add_library(react-native-nitro-image::NitroImage SHARED IMPORTED)
set_target_properties(react-native-nitro-image::NitroImage PROPERTIES
    IMPORTED_LOCATION "C:/Users/Intel/Desktop/moto_customer_app/node_modules/react-native-nitro-image/android/build/intermediates/cxx/Debug/1n1g4a36/obj/arm64-v8a/libNitroImage.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/Intel/Desktop/moto_customer_app/node_modules/react-native-nitro-image/android/build/headers/nitroimage"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

