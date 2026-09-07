# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# react-native-config reads every Config.* value via reflection over the
# generated BuildConfig class (RNCConfigModuleImpl.java: Class.forName +
# getDeclaredFields). R8 can't see that reflection use, so without this
# rule it can rename/strip BuildConfig in a minified release build,
# silently making every Config.* value (Mapbox token, API_URL,
# SOCKET_URL, ...) resolve to undefined at runtime — the app "works" in
# debug builds and crashes/misbehaves only in release.
-keep class com.moto_customer.BuildConfig { *; }
