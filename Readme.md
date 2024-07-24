# Time Wave App
This is a React Native app using Expo framework and written in Typescript.

## Prerequisites

- Java 11.0.21
- Nodejs v16.20.2
- Android emulator

## Run project in development

1. Clone this git repository
2. Install dependencies: `npm install` 
(all dependencies need to be compatible with the version in package.json)
3. Install development build version on Android to use Firebase: `npx expo run:android` 
(if build failed then must be the version in package.json not compatible, 
please check for it by run `npx expo install --fix` 
but for "react-native": "0.71.14" cannot, need "react-native": "0.71.8")
https://blog.expo.dev/expo-sdk-48-ccb8302e231
3.1 can add a 'local.properties' under file 'android'
like：
sdk.dir=C\:\\Users\\USER\\AppData\\Local\\Android\\sdk

4. After first time install dev build version, can use this command to open easily: `npx expo start --dev-client`

# Development tips

1. Press ctrl+m developer menu can quickly reload app in emulator

---

This is an Expo project. https://docs.expo.dev/

A development build is required in order for the app to run properly.
Make sure that android studio is installed to run the development build on an android emulator or on a physical device.

Follow this https://reactnative.dev/docs/environment-setup?os=windows&guide=quickstart to setup a development environment for an Expo project.

The project is integrated with the React-Native-Firebase package.
To find out other ways to integrate Firebase with an Expo project: https://docs.expo.dev/guides/using-firebase/

1.The easiest way is to create a firebase project.
2.Create an android app in the firebase project.
3.Download the android credentials.
4.Add the config plugins of React-Native-Firebase and the android credentials path into the app.json.
5.Follow the guide for managed workflow in the documentation. https://rnfirebase.io/#managed-workflow

After all the necessary tools, Sdk and android studio are installed, make sure the config plugins are configured properly in the app.json file.

Run the command "npx expo run:android" to create a local development build on the emulator.

To know how to upload development build to cloud see https://docs.expo.dev/develop/development-builds/create-a-build/#initialize-eas-build.

Once the development build is installed on the emulator or on a physical device. You can run "npx expo run --dev-client" when running the project subsequently.

If there is new config plugins that needed to be added in the app.json file, run the "npx expo run:android" command again for expo to generate the native files and directories.

For more information about:
Development Build see https://docs.expo.dev/develop/development-builds/introduction/

Config Plugins see https://docs.expo.dev/config-plugins/introduction/

Prebuild and the "run:android" command see https://docs.expo.dev/workflow/prebuild/ and https://docs.expo.dev/guides/adopting-prebuild/#prebuild

This project uses:
React-Native-Firebase - Uses auth and firestore builds
Reduxjs/toolkit - Manages the global app state
React-redux
React navigation - Navigating pages
React-hooks-form - Client side validation for forms
Expo sdks

See package.json file for a comprehensive list.

Progress:

Authentication:
Activity indicator not yet added to indicate the status.
Displaying errors from Sign In and Sign Up process not yet added.

Community:
Add admins from friend list not implemented yet.
Setting pin when creating the community is not implemented yet. This pin must be correctly type when an admin wants to generate a Check-In / Check-Out QR code.
