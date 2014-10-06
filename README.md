###Docebo Mobile App

This project is the open source version of the Docebo Mobile App for iOs and Android Smartphones.

The app itself is based on the Apache Cordova project : http://cordova.apache.org/
You will need it installed and configured into your development machine in order to rebuild your own app.

Other framework are included like :
https://github.com/janl/mustache.js
http://app-framework-software.intel.com/



####App description

Docebo Learning Management System (LMS) enables your workforce with just-in-time elearning training.

This APP allows you to attend your Docebo-based elearning courses through your Smartphone.

Using your credentials you will be able to :

- See the elearning courses you are enrolled in
- Access your training content
- Track your progress
- See your progress report

The award-winning Docebo LMS manages, delivers and tracks self-paced online learning, mobile learning, instructor-led and blended learning programs via web and mobile.



####First Setup

After you have cloned or forekd the project into your local you will need to do a few step in order to be able to use the app locally for development.
If you haven't already installed cordova this is a good moment to do it.

The plugin and platforms folder already contain what it's needed, but if you want to build them yourself you can empty them and and perform the followings:

Add require plugins :

```bash
cordova plugin add https://github.com/phonegap-build/PushPlugin.git
cordova plugin add org.apache.cordova.console
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.network-information
cordova plugin add org.apache.cordova.dialogs
cordova plugin add org.apache.cordova.file
cordova plugin add org.apache.cordova.file-transfer
cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.inappbrowser
cordova plugin add org.apache.cordova.statusbar
```

Now you can build your app.



####Build for iOS

*NOTE:* You can build an iOS app only from an apple computer running OSX with XCode installed and configured

Reach the root folder of the project and run the following code to build the app

```bash
cordova build ios
```

Inside the `platform/ios` directory you will find an XCode project that you can manipulate and build with XCode
The normal cordova commands are also available to manipulate your project.

#####Release build

To create a releasable build you will need to set the proper signing profile, to do this:

Open the XCode project file and in the build setting tab selct the corret signing identity, more info on how to create and configure your signing identity can be found on the Apple docs

Also check the following configuration file : `/Users/fabio/Docebo/docebo-app/platforms/ios/cordova/build.xcconfig`

When this setup has been done you can build your ipa file in the following way

```bash
cordova build ios -release -device
/usr/bin/xcrun -sdk iphoneos PackageApplication "$(pwd)/platforms/ios/build/device/Docebo.app" -o "$(pwd)/platforms/ios/build/device/Docebo.ipa"
```


####Build for Android

For android the instruction are similar to the iOS build, reach the project home dir and build with:

```bash
cordova build android
```

To create the app

#####Release build

Build the app with the command

```bash
cordova build ios -release -device
```

To sign it you can follow this process, but others are possible:

Generate the key pair to sign it

```bash
keytool -genkey -v -keystore docebo.keystore -alias docebo -keyalg RSA -keysize 2048 -validity 10000
```

Sign the app
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../../android-release/docebo.keystore DoceboLMS-release-unsigned.apk docebo
```

Check the signature
```bash
jarsigner -verify -verbose -certs DoceboLMS-release-unsigned.apk
```

As mentioned in various places on the internet be sureto install Android SDK Build-tools Rev. 20. If you still have an errore with the next command try : to copy Zipalign from `sdk/build-tools/20.0.0` to `sdk/tools/`

```bash
zipalign -v 4 DoceboLMS-release-unsigned.apk Docebo.apk
```

Now you have your final build