import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:bcrypt/bcrypt.dart';

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
        // Hash the password
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());

        // Register user in Firebase Authentication
        UserCredential cred = await _auth.createUserWithEmailAndPassword(
          email: email,
          password: password,
        );

        // Add user to Firestore database
        await _firestore.collection("users").doc(cred.user!.uid).set({
          'name': name,
          'email': email,
          'password': hashedPassword, // Store the hashed password
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
        UserCredential userCredential =
            await _auth.signInWithEmailAndPassword(
          email: email,
          password: password,
        );

        // Retrieve the user's hashed password from Firestore
        DocumentSnapshot userDoc = await _firestore
            .collection("users")
            .doc(userCredential.user!.uid)
            .get();
        String storedHashedPassword = userDoc['password'];

        // Verify the password
        if (BCrypt.checkpw(password, storedHashedPassword)) {
          return "success";
        } else {
          return "Invalid password";
        }
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
