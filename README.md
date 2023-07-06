# Floralens Mobile App

## Description
Biolens is a set of tensorflow models, capable of automatic identification of biological species based on photos using **deep neural networks**. 
It has been developed by *Luís Lopes* and *Eduardo R. B. Marques*, professors at **DCC/FCUP**, with the help of members of **CRACS/INESC-TEC** and with students
*Tomás Mamede*, *Miguel Marques*, *Manuel Coutinho* and *António Filgueiras*.

At the moment there are four different main models, which are:
  1. **Dragonlens**: For *dragonfly* classifications;
  2. **Floralens**: For *plant* and *flower* classifications;
  3. **Lepilens**: For *butterfly* classifications;
  4. **Mothlens**: For *moth* classifications;

An earlier version of the **Lepilens** model can also be using by the already existing Lepilens iOS app.

This project consists in bringing the **Floralens** model for iOS and Android platforms, without the need to construct two different versions of source-code and instead
using the Ionic Framework with Angular for the implementation of the mobile app.

---

## Tools used for development
Alongside Ionic and Angular, this app uses:
  - **Capacitor**: Puglins for the camera and filesystem implementations;
  - **Tensorflow JS**: Used for importing the **Floralens** Model to the app;
  - **Leaflet**: Map generation into the photo-detail page;
  - awesome-cordova-puglin/(sqlite/ngx and sqlite-porter/ngx) and also ionic-native/sqlite for database implementation;

All instalation guides are available below.

---

## Instalation and Deployment guide
Users who fork this repository should have these installed and ready to go:
  - [Ionic](https://ionicframework.com/docs/intro/cli)
  - [Capacitor](https://capacitorjs.com/docs/getting-started): Filesystem and Camera plugins
  - [Angular](https://angular.io/guide/setup-local): Normally Ionic already installs Angular automatically if it is the selected framework
  - [Leaflet](https://leafletjs.com/download.html)
  - [Sqlite](https://danielsogl.gitbook.io/awesome-cordova-plugins/sqlite) / [Sqlite-Porter](https://danielsogl.gitbook.io/awesome-cordova-plugins/sqlite) / Ionic Native Sqlite
  - [Android Studio](https://developer.android.com/studio?gclid=CjwKCAjwzJmlBhBBEiwAEJyLu5ptG4N9jQZ9ma6SSSBxDD0IfRrJv4lrqyKOR7tzQm1VetsSWqR9DBoCzdsQAvD_BwE&gclsrc=aw.ds) / [Xcode](https://developer.apple.com/xcode/resources/): App deployment

For deployment, it is recommend the use of an external mobile device or device simulator as the app is only constructed for mobile devices.

To run the app in your device in live reload, it is recommended the use in the terminal of the command 
- `ionic cap run [android or ios] --l --external`

Deploy the app by:
  1. Syncronize project for both platforms in the terminal with:
  - `npm run build`
  - `npx cap sync`
  2. Connect device to computer;
  3. Open the IDE:
  - `ionic cap open android` , for Android Studio
  - `ionic cap open ios` , for Xcode
  4. Configure device connection to the IDE.
  5. Sync with the native project and run.

In case of doubt, you can check the ionic documentation for Android/iOS Deployment [here](https://ionicframework.com/docs/angular/your-first-app/deploying-mobile).

---

## App Structure
The App is divided in different tabs, each one with separate implementations all grouped in the src directory, the main ones being:
  - Camera page
  - Home page (empty at the moment)
  - Library page
  - Photo Detail pages

The implementation of code is divided in two main types of files apart from the HTML and CSS implementations:
  - **Page files**: Files that make the connection with the HTML file of each page;
  - **Service files**: Files that contain the implementation of the different components the app has (camera, filesystem, database and evaluation model)
    > This types of files are all grouped in a single directory and should only be used by page files

---

## Bugs
- Error in obtaining images by path given by the database, making the app unable to load images on to HTML.
