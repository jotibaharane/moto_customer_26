if(NOT TARGET react-native-nitro-modules::NitroModules)
add_library(react-native-nitro-modules::NitroModules SHARED IMPORTED)
set_target_properties(react-native-nitro-modules::NitroModules PROPERTIES
    IMPORTED_LOCATION "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-nitro-modules/android/build/intermediates/cxx/RelWithDebInfo/6640284l/obj/x86/libNitroModules.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-nitro-modules/android/build/headers/nitromodules"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

