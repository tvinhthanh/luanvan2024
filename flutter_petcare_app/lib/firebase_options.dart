// File generated by FlutterFire CLI.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        return windows;
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCaK0l0a9L6NZqKtr4EPZxk3jK7GWAOgqg',
    appId: '1:960196858903:web:7f8bd44d515b1d99f63852',
    messagingSenderId: '960196858903',
    projectId: 'petcareapp-87c92',
    authDomain: 'petcareapp-87c92.firebaseapp.com',
    storageBucket: 'petcareapp-87c92.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyCqbYZZpze7eyG4vVoAmpuGe6h5XaEQFF8',
    appId: '1:960196858903:android:f9579b91bb554962f63852',
    messagingSenderId: '960196858903',
    projectId: 'petcareapp-87c92',
    storageBucket: 'petcareapp-87c92.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAgrxdhCrj2mzNlZurs051nqpBxZv6tuIs',
    appId: '1:960196858903:ios:b7b4e523ded74061f63852',
    messagingSenderId: '960196858903',
    projectId: 'petcareapp-87c92',
    storageBucket: 'petcareapp-87c92.appspot.com',
    iosBundleId: 'com.example.flutterPetcareApp',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyAgrxdhCrj2mzNlZurs051nqpBxZv6tuIs',
    appId: '1:960196858903:ios:b7b4e523ded74061f63852',
    messagingSenderId: '960196858903',
    projectId: 'petcareapp-87c92',
    storageBucket: 'petcareapp-87c92.appspot.com',
    iosBundleId: 'com.example.flutterPetcareApp',
  );

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'AIzaSyCaK0l0a9L6NZqKtr4EPZxk3jK7GWAOgqg',
    appId: '1:960196858903:web:33801796b14339f3f63852',
    messagingSenderId: '960196858903',
    projectId: 'petcareapp-87c92',
    authDomain: 'petcareapp-87c92.firebaseapp.com',
    storageBucket: 'petcareapp-87c92.appspot.com',
  );

}