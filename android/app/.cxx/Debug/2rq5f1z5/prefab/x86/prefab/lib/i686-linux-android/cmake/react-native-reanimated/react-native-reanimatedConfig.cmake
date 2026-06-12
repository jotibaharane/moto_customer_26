if(NOT TARGET react-native-reanimated::reanimated)
add_library(react-native-reanimated::reanimated SHARED IMPORTED)
set_target_properties(react-native-reanimated::reanimated PROPERTIES
    IMPORTED_LOCATION "C:/Users/abhis/Desktop/moto_customer_26/node_modules/react-native-reanimated/android/build/intermediates/cxx/Debug/1o3d293h/obj/x86/libreanimated.so"
    INTERFACE_INCLUDE_DIRECTORIES "C:/Users/abhis/Desktop/moto_customer_26/node_modules/react-native-reanimated/android/build/prefab-headers/reanimated"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

