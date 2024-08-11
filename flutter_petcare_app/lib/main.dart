import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/theme.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/splashScreen/intro_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: AppTheme.darkThemeMode,
      darkTheme: AppTheme.darkThemeMode,
      home: const IntroPage(),
    );
  }
}
class Ip{
  static const String serverIP = '172.16.0.83';
}