import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

class AuthMethod {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String> signupUser({
    required String email,
    required String password,
    required String name,
  }) async {
    try {
      if (email.isNotEmpty && password.isNotEmpty && name.isNotEmpty) {
        // Register user in Firebase Authentication
        UserCredential cred = await _auth.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );

        // Add user to Firestore database
        await _firestore.collection("users").doc(cred.user!.uid).set({
          'name': name,
          'email': email,
          'createdAt': Timestamp.now(), // Example of timestamp field
        });

        return "success";
      } else {
        return "Please enter all the fields";
      }
    } catch (e) {
      // Handle specific exceptions
      return "Error: ${e.toString()}";
    }
  }

  Future<String> loginUser({
    required String email,
    required String password,
  }) async {
    try {
      if (email.isNotEmpty && password.isNotEmpty) {
        // Log in user with Firebase Authentication
        await _auth.signInWithEmailAndPassword(
          email: email,
          password: password,
        );

        return "success";
      } else {
        return "Please enter all the fields";
      }
    } catch (e) {
      // Handle specific exceptions
      return "Error: ${e.toString()}";
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
