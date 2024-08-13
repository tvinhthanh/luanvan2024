import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/info_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/forgotPass/forgotPassword_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/googleAuth/google_auth.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/phoneAuth/phone_login.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/signup_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/button.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/snackbar.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/text_field.dart';
import 'package:flutter_petcare_app/features/auth/service/authentiation.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_petcare_app/main.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  var existingUser1 = '';
  bool isLoading = false;

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  // Hàm đăng nhập
  void loginUser() async {
    setState(() {
      isLoading = true;
    });

    // Log in user using AuthMethod
    String res = await AuthMethod().loginUser(
        email: emailController.text, password: passwordController.text);

    if (res == "success") {
      setState(() {
        isLoading = false;
      });

      // Check if user information already exists in MongoDB
      final existingUser = await getUserInfo(emailController.text);
      final nameEmail =
          FirebaseAuth.instance.currentUser!.displayName.toString();
      String typeUser = "User";
      if (existingUser != null) {
        // Information exists, navigate to HomePage
        existingUser1 = existingUser['name'];
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => HomePage(
              userName: existingUser['name'],
              email: emailController.text,
              imageURLs: existingUser['img'],
            ),
          ),
        );
      } else {
        // Information doesn't exist, navigate to BasicInfoPage
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => BasicInfoPage(
              email: emailController.text,
              name: nameEmail,
              type: typeUser, // Pass the type as "User"
            ),
          ),
        );
      }
    } else {
      setState(() {
        isLoading = false;
      });
      // Show error
      showSnackBar(context, res);
    }
  }

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
    double height = MediaQuery.of(context).size.height;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: AppPallete.backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          // Wrap with SingleChildScrollView
          child: SizedBox(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  height: height / 2.7,
                  child: Image.asset('assets/Image/LogoContainer.png'),
                ),
                TextFieldInput(
                  icon: Icons.person,
                  textEditingController: emailController,
                  hintText: 'Enter your email',
                  textInputType: TextInputType.text,
                ),
                TextFieldInput(
                  icon: Icons.lock,
                  textEditingController: passwordController,
                  hintText: 'Enter your password',
                  textInputType: TextInputType.text,
                  isPass: true,
                ),
                // Gọi quên mật khẩu bên dưới nút đăng nhập
                const ForgotPassword(),
                MyButtons(onTap: loginUser, text: "Log In"),
                Row(
                  children: [
                    Expanded(
                      child: Container(height: 1, color: Colors.black26),
                    ),
                    const Text("  or  "),
                    Expanded(
                      child: Container(height: 1, color: Colors.black26),
                    )
                  ],
                ),
                // Đăng nhập bằng Google
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                    ),
                    onPressed: () async {
                      try {
                        await FirebaseServices().signInWithGoogle();

                        final user = FirebaseAuth.instance.currentUser;

                        if (user != null) {
                          // User is logged in
                          final email = user.email ?? "";
                          final existingUser = await getUserInfo(email);

                          if (existingUser != null) {
                            // Information already exists, navigate to HomePage
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
                                  email: user.email ?? "",
                                  name: user.displayName ?? "",
                                  phoneNumber: user.phoneNumber ?? "",
                                ),
                              ),
                            );
                          }
                        } else {
                          // Handle the case when the user is null (e.g., sign-in failed)
                          showSnackBar(
                              context, "Sign-in failed. Please try again.");
                        }
                      } catch (e) {
                        // Handle any errors that occur during sign-in
                        showSnackBar(
                            context, "An error occurred: ${e.toString()}");
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
                          "Continue with Google",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Colors.black,
                          ),
                        )
                      ],
                    ),
                  ),
                ),
                // Đăng nhập bằng điện thoại
                const PhoneAuthentication(),
                // Không có tài khoản? Đi đến đăng ký
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      child: const Text(
                        "Don't have an account? ",
                        style: TextStyle(fontSize: 18),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute(
                            builder: (context) => const SignupPage(),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: const Text(
                          "Sign Up.",
                          style: TextStyle(
                            color: Colors.blue,
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
