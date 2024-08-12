import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class OTPScreenRegister extends StatefulWidget {
  final String verificationId;
  final String? phone;
  const OTPScreenRegister({super.key, this.phone, required this.verificationId});

  @override
  State<OTPScreenRegister> createState() => _OTPScreenRegisterState();
}

class _OTPScreenRegisterState extends State<OTPScreenRegister> {
  TextEditingController otpController = TextEditingController();
  bool isLoadin = false;

  // Hàm lấy thông tin người dùng từ MongoDB
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Image.asset("assets/Image/Icon_User.png"),
            const Text(
              "OTP Verification",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 25,
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                "We need to register your phone number by using a one-time OTP code verfification.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20.0),
              child: TextField(
                controller: otpController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: "000000",
                  labelText: "Enter the OTP",
                ),
              ),
            ),
            const SizedBox(height: 20),
            isLoadin
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    style:
                        ElevatedButton.styleFrom(backgroundColor: Colors.green),
                    onPressed: () async {
                      setState(() {
                        isLoadin = true;
                      });
                      try {
                        final credential = PhoneAuthProvider.credential(
                          verificationId: widget.verificationId,
                          smsCode: otpController.text,
                        );

                        await FirebaseAuth.instance
                            .signInWithCredential(credential);
                        final existingUser = await getUserInfo(widget.phone!);
                        if (existingUser != null) {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute(
                              builder: (context) => HomePage(
                                userName: existingUser['name'],
                                email: existingUser['email'],
                              ),
                            ),
                          );
                        } else {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                               builder: (context) => HomePage(
                                userName: existingUser?['name'],
                                email: existingUser?['email'],
                              ),
                            ),
                          );
                        }
                      } catch (e) {
                        print(e);
                      }
                      setState(() {
                        isLoadin = false;
                      });
                    },
                    child: const Text(
                      "Send Code",
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: Colors.white,
                      ),
                    ))
          ],
        ),
      ),
    );
  }
}
