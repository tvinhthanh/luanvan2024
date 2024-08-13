import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/info_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/googleAuth/google_auth.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/signup_page.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class GoogleAuthentication extends StatefulWidget {
  const GoogleAuthentication({super.key});

  @override
  State<GoogleAuthentication> createState() => _GoogleAuthenticationState();
}

class _GoogleAuthenticationState extends State<GoogleAuthentication> {
  // Function to fetch user information from MongoDB
  Future<Map<String, dynamic>?> getUserInfo(String email) async {
    final Uri url =
        Uri.parse('http://${Ip.serverIP}:3000/api/usersApp/userInfo/$email');

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

  Future<void> handleGoogleSignIn() async {
    try {
      final email =
          await getGoogleUserEmail(); // Function to get Google user email

      final existingUser = await getUserInfo(email);

      if (existingUser != null) {
        // User exists in the database, show dialog
        await FirebaseServices().googleSignOut();
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Account Exists'),
              content: const Text(
                  'This account has already been registered. You cannot log in.'),
              actions: [
                TextButton(
                  onPressed: () {
                    
                    Navigator.of(context).pop(); // Close the dialog
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
        return; // Exit the method to prevent further actions
      }

      // If the user does not exist, proceed to sign in with Google
      await FirebaseServices().signInWithGoogle();
      final user = FirebaseAuth.instance.currentUser;

      if (user == null) {
        // Handle sign-in error
        throw Exception('User not signed in');
      }

      // User does not exist, navigate to SignupPage
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => BasicInfoPage(
            email: user.email,
            name: user.displayName ?? "",
            phoneNumber: user.phoneNumber ?? "",
            type: "google", 
          ),
        ),
      );
    } catch (e) {
      // Handle any errors during sign-in or user check
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('đăng ký thất bại: ${e.toString()}'),
        ),
      );
    }
  }

  Future<String> getGoogleUserEmail() async {
    final GoogleSignIn googleSignIn = GoogleSignIn();

    try {
      // Start the Google Sign-In process
      final GoogleSignInAccount? googleUser = await googleSignIn.signIn();

      // Get the email from the signed-in account
      if (googleUser != null) {
        return googleUser.email; // Return the email
      } else {
        
        throw Exception('Google sign-in was canceled');
      }
    } catch (error) {
      // Handle any errors during the sign-in process
      throw Exception('Failed to get Google user email: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
        ),
        onPressed: handleGoogleSignIn,
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
              "Đăng ký bằng Google",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
