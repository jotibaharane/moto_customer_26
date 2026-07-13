if(NOT TARGET react-native-nitro-modules::NitroModules)
add_library(react-native-nitro-modules::NitroModules SHARED IMPORTED)
set_target_properties(react-native-nitro-modules::NitroModules PROPERTIES
    IMPORTED_LOCATION "/home/motohelp/jotiba/New/moto_customer_26/node_modules/react-native-nitro-modules/android/build/intermediates/cxx/Debug/j4a1t4m5/obj/arm64-v8a/libNitroModules.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp/jotiba/New/moto_customer_26/node_modules/react-native-nitro-modules/android/build/headers/nitromodules"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

