import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/info_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/googleAuth/google_auth.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GooleLogin extends StatefulWidget {
  const GooleLogin({super.key});

  @override
  State<GooleLogin> createState() => _GooleLoginState();
}

class _GooleLoginState extends State<GooleLogin> {
  @override
  // Function to fetch user information from MongoDB
  Future<Map<String, dynamic>?> getUserInfo(String phoneNumber) async {
    final Uri url = Uri.parse(
        'http://${Ip.serverIP}:3000/api/usersApp/userInfo/$phoneNumber');

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      return null;
    }
  }

  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
        ),
        onPressed: () async {
          await FirebaseServices().signInWithGoogle();
          final email = FirebaseAuth.instance.currentUser!.email.toString();
          final existingUser = await getUserInfo(email);
          if (existingUser != null) {
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) => HomePage(
                  userName: existingUser['name'],
                  email: existingUser['email'],
                  imageURLs: existingUser['img'],
                ),
              ),
            );
          } else {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => BasicInfoPage(
                  email: FirebaseAuth.instance.currentUser!.email,
                  name:
                      FirebaseAuth.instance.currentUser!.displayName.toString(),
                  phoneNumber:
                      FirebaseAuth.instance.currentUser!.phoneNumber ?? "",
                      type: "google", 
                ),
              ),
            );
          }
        },
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Image.asset(
                "assets/Image/google-symbol24x24.png",
                height: 35,
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              "Đăng nhập bằng Google",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.black,
              ),
            )
          ],
        ),
      ),
    );
  }
}
