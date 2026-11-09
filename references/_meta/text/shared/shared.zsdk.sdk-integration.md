# Adding the ZSDK to an app: Android, iOS, React Native and SwiftUI packages, prerequisites and sample apps (shared.zsdk.sdk-integration)
Also called: zsdk react native; zsdk swiftui quick start; zsdk android gradle; zsdk ios swift package; zsdk cocoapods; zscaler-sdk-android; zscaler-sdk-ios; zsdk sample app; zsdk github packages; zscalersdk-android; ZscalerSDK.xcframework; zsdk minimum ios version

The vendor publishes one public repository per platform. Each holds the install instructions and a sample app; the Android repository publishes the library as a package, and the iOS repository holds the binary itself. The API and the registration steps are in [The ZSDK developer API: classes, tunnels, lifecycle and notifications](kb:shared.zsdk.developer-api) and [Configuring ZSDK: registered apps and app keys, segments and access policy](kb:shared.zsdk.configuration).

## Android

The Android SDK is a Gradle dependency, `com.zscaler.sdk:zscalersdk-android:latest.release`, resolved from the GitHub Packages Maven repository `https://maven.pkg.github.com/zscaler/zscaler-sdk-android`, and the sample app builds against the floating `latest.release` version. [shared.zsdk.sdk-integration:android-package] Fetching the Android SDK requires a GitHub username and access token: the README has gpr.user and gpr.key set in the global gradle.properties file at ~/.gradle/gradle.properties and falls back to the GITHUB_USERNAME and GITHUB_TOKEN environment variables, while the sample app reads those environment variables first and the gradle properties second. [shared.zsdk.sdk-integration:android-registry-credentials] The Android sample app is built with compileSdk 35, minSdk 28, targetSdk 35, the ABI filters armeabi-v7a and arm64-v8a (x86 and x86_64 excluded) and Gradle 8.10.2. [shared.zsdk.sdk-integration:android-sample-baseline] The Android integration guide requires Android 9 or later (minimum API level 28) and an app that works on 32-bit and 64-bit ARM devices (armeabi-v7a or arm64-v8a); ZSDK supports Java or Kotlin. [shared.zsdk.sdk-integration:android-prerequisites]

The Android integration guide has gpr.user and gpr.key set to the GitHub username and access token in local.properties, and adds a dependencyResolutionManagement repository to the GitHub repository in settings.gradle. [shared.zsdk.sdk-integration:android-credentials-location] Where the credentials are set is in dispute [divergence:shared.zsdk.sdk-integration:android-credentials-file]. The Android manual import downloads the latest ZSDK .aar file from the GitHub package assets, places it in a libs directory renamed to zscalersdk.aar, and adds implementation(files("libs/zscalersdk.aar")) to build.gradle(:app). [shared.zsdk.sdk-integration:android-manual-import] The Android integration guide says Semi-Automatic or Manual network configuration is selected by setting automaticallyConfigureRequests or automaticallyConfigureWebViews to false; in Manual mode with WebView the proxy settings must be configured after a tunnel starts. [shared.zsdk.sdk-integration:android-network-modes] The option names are in dispute [divergence:shared.zsdk.sdk-integration:android-auto-configure-names]. Android WebView connections are not guaranteed to use new proxy settings immediately, so a page should be loaded only after a successful listener callback; with ProxyAuth enabled the WebViewClient must override the HTTP auth request handler. [shared.zsdk.sdk-integration:android-webview-proxy-timing]

## iOS

The iOS SDK supports Swift Package Manager, CocoaPods and manual integration; manual integration adds the xcframework under Frameworks, Libraries, and Embedded Content with the embed option set to Embed & Sign. [shared.zsdk.sdk-integration:ios-install-paths] The iOS package declares iOS 15 as its minimum platform in both Package.swift and the podspec, and Package.swift needs swift-tools-version 5.9. [shared.zsdk.sdk-integration:ios-minimum-version] The iOS SDK ships as a prebuilt binary, Zscaler.xcframework, which SwiftPM wraps as a binaryTarget and the podspec lists under vendored_frameworks; the podspec is version 5.0.0 with a Commercial licence type, and the xcframework carries an ios-arm64 device slice and an ios-arm64_x86_64-simulator slice. [shared.zsdk.sdk-integration:ios-prebuilt-binary] The iOS integration guide requires iOS 15 or later and offers SwiftPM (zscaler-sdk-ios repository), CocoaPods (pod 'ZscalerSDK') or manual import of a downloaded xcframework with Embed & Sign. [shared.zsdk.sdk-integration:ios-prerequisite-and-import] The iOS integration guide's manual import adds a downloaded ZscalerSDK.xcframework, and its code imports the module as Zscaler. [shared.zsdk.sdk-integration:ios-help-manual-framework] [gap:shared.zsdk.sdk-integration:ios-manual-framework-name] The module name is in dispute [divergence:shared.zsdk.sdk-integration:ios-module-import-name].

## React Native

The React Native integration guide lists Android 9 or later (API level 28) on ARM devices (armeabi-v7a or arm64-v8a) and iOS 15 or later as prerequisites. [shared.zsdk.sdk-integration:react-native-prerequisites] The React Native package is fetched from the npm.pkg.github.com registry with a GitHub token (manual tarball download then npm install), or installed as an NPM package with a version pinned in package.json; the Android side adds a Gradle repository named ZscalerSDKAndroid and the iOS side a Podfile helper (configure_zscalersdk_pod). [shared.zsdk.sdk-integration:react-native-package-source] The React Native page names the package zscalersdk-reactnative in the registry URL but @zscaler/zscaler-sdk-reactnative in the package.json example. [shared.zsdk.sdk-integration:react-native-package-name-mismatch]

## SwiftUI quick start

The SwiftUI quick start asks for Xcode version 16 or later if using Xcode, iOS version 15.0 or later if using an iOS device, Auth0 client credentials and internet access to Zscaler's sample API endpoint; a call to the protected endpoint without a Zero Trust tunnel is expected to fail because DNS resolution and the connection fail. [shared.zsdk.sdk-integration:swiftui-quickstart-prerequisites] The quick start's sample Auth0 IdP issues a temporary JWT that expires after 24 hours and can be refreshed by rerunning the request. [shared.zsdk.sdk-integration:swiftui-sample-token-lifetime] In Step 5 (Retry the API Call) of the quick start, if the request failed, the guide says to verify and validate the access token and app key, check the Xcode console output for ZSDK error messages and check ZSDK error messages; its optional Step 6 verifies mTLS in Wireshark with the filter tls and tcp;port==443. [shared.zsdk.sdk-integration:swiftui-troubleshooting-and-verification]

## Release history

The April 15, 2025 ZSDK Platform 2.0 release notes list React Native support, merging the Prelogin tunnel and Zero Trust tunnel into a User tunnel, and updated notification naming conventions. [shared.zsdk.sdk-integration:platform-2-release]

## Sample apps

Both sample apps need an App key and an Access Token entered, and the iOS sample builds through CocoaPods (platform iOS 15.0, with ZscalerSDK taken from the local repository path). [shared.zsdk.sdk-integration:sample-app-credentials]

What to check:
1. Whether the build can reach the GitHub Packages repository: a GitHub username and access token present as gpr.user and gpr.key or as the environment variables.
2. That the iOS deployment target is 15.0 or later before adding the package.
3. Which integration route the iOS app uses (SwiftPM, CocoaPods or manual), and for manual that the framework is set to Embed & Sign.

Sources disagree (name both sides):
- Which file holds gpr.user and gpr.key for the Android SDK's GitHub Packages repository. [divergence:shared.zsdk.sdk-integration:android-credentials-file]
  - zsdk-android: The Android repository README says gpr.user and gpr.key are set in the global gradle.properties file at ~/.gradle/gradle.properties.
  - zscaler-help: The help integration guide says gpr.user and gpr.key are set in the local.properties.
  Impact: Credentials placed in only one of the two files may not be found by the build that follows the other source; the repository's sample settings read environment variables first and gradle properties second.
- Which option names switch ZSDK network auto-configuration on Android. [divergence:shared.zsdk.sdk-integration:android-auto-configure-names]
  - zscaler-help: The Android integration guide says Semi-Automatic or Manual mode is selected by setting automaticallyConfigureRequests or automaticallyConfigureWebViews to false.
  - zscaler-help: The developer reference lists shouldAutomaticallyConfigureRequests and shouldAutomaticallyConfigureWebviews as iOS options.
  Impact: An Android app cannot tell from either page alone which option name, if any, controls auto-configuration on Android.
- The module name an iOS app imports. [divergence:shared.zsdk.sdk-integration:ios-module-import-name]
  - zscaler-help: The iOS integration guide's manual import code is import Zscaler.
  - zscaler-help: The SwiftUI quick start's tunnel code is import ZscalerSDK.
  Impact: Code copied from one guide may not compile against the module the other guide expects.

Not known (open gaps):
- Which xcframework name the manual iOS integration expects [gap:shared.zsdk.sdk-integration:ios-manual-framework-name]: settled by source-read. Blocks: following the manual integration steps literally

Area: shared.zsdk, its subjects in references/_meta/spine/shared/shared.zsdk.json

Linked (open a file only if the answer needs it):
- links-to references/_meta/text/shared/shared.zsdk.configuration.md (Configuring ZSDK: registered apps and app keys, segments and access policy)
- links-to references/_meta/text/shared/shared.zsdk.developer-api.md (The ZSDK developer API: classes, tunnels, lifecycle and notifications)
