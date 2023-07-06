# Floralens Mobile App
## Description
Biolens is a set of tensorflow models, capable of automatic identification of biological species based on photos using **deep neural networks**. 
It has been developed by Luís Lopes and Eduardo R. B. Marques, professors at DCC/FCUP, with the help of members of CRACS/INESC-TEC and with students
Tomás Mamede, Miguel Marques, Manuel Coutinho and António Filgueiras.

At the moment there are four different main models, which are:
  1. Dragonlens: For dragonfly classifications;
  2. Floralens: For plant and flower classifications;
  3. Lepilens: For butterfly classifications;
  4. Mothlens: For moth classifications;

An earlier version of the Lepilens model can also be using by the already existing Lepilens iOS app.

This project consists in bringing the Floralens model for iOS and Android platforms, without the need to construct two different versions of source-code and instead
using the Ionic Framework with Angular for the implementation of the mobile app.


## Tools used for development
Alongside Ionic and Angular, this app uses:
  - Capacitor: Puglins for the camera and filesystem implementations;
  - Tensorflow JS: Used for importing the Floralens Model to the app;
  - Leaflet: Map generation into the photo-detail page;
  - awesome-cordova-puglin/(sqlite/ngx and sqlite-porter/ngx) and also ionic-native/sqlite for database implementation;
All instalation guides are available below.


## Instalation and Deployment guide
Users who fork this repository should have these installed and ready to go:
  - Ionic;
  - Capacitor: Filesystem and Camera plugins;
  - Angular;
  - Leaflet;
  - Sqlite / Sqlite-Porter / Native-Sqlite;
  - Android Studio / Xcode: For app deployment, Android Studio for Android devices and Xcode for iOS devices;

For deployment, it is recommend the use of an external mobile device or device simulator as the app is only constructed for mobile devices.

To run the app in your device in live reload, it is recommended the use of `ionic cap run [android or ios] --l --external` in the terminal.
For real deployment of the app:
  1. Syncronize project for both platforms in the terminal with:
    - `npm run build`
    - `npx cap sync`
  2. Connect device to computer;
  3. Open the IDE:
    - `ionic cap open android`, for Android Studio
    - `ionic cap open ios`, for Xcode
  4. Configure device connection to the IDE.
  5. Sync with the native project and run.

In case of doubt, you can check the ionic documentation for Android Development and iOS development in these links.
