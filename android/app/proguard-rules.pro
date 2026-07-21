# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Keep line numbers for readable Play Console / Crashlytics stacks.
-keepattributes SourceFile,LineNumberTable,JavascriptInterface,*Annotation*
-renamesourcefileattribute SourceFile

# Capacitor / Cordova bridge (required — minify must not strip these).
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }
-keep class capacitor.android.plugins.** { *; }
-keep class capacitor.cordova.android.plugins.** { *; }
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**

# WebView JS bridges
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# App entry
-keep class com.pandagarde.familyhub.** { *; }
