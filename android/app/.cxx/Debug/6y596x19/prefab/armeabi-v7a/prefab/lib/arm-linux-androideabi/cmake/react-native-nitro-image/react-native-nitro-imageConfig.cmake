if(NOT TARGET react-native-nitro-image::NitroImage)
add_library(react-native-nitro-image::NitroImage SHARED IMPORTED)
set_target_properties(react-native-nitro-image::NitroImage PROPERTIES
    IMPORTED_LOCATION "/home/motohelp/jotiba/New/moto_customer_26/node_modules/react-native-nitro-image/android/build/intermediates/cxx/Debug/6g653i3j/obj/armeabi-v7a/libNitroImage.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp/jotiba/New/moto_customer_26/node_modules/react-native-nitro-image/android/build/headers/nitroimage"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

