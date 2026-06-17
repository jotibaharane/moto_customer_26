if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-worklets/android/build/intermediates/cxx/Debug/1m3a6y5p/obj/x86_64/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/motohelp/jotiba/moto_customer_26/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

