import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/signup_page.dart';

class IntroPage extends StatelessWidget {
  const IntroPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          color: AppPallete.backgroundColor,
        ),
        child: Stack(
          children: [
            // Background Image
            Container(
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/Image/background.png'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            // Logo Image
            const Positioned(
              left: 40,
              right: 30,
              bottom: 600,
              child: Image(image: AssetImage('assets/Image/LogoContainer.png'))
            ),
            // Get Started Button
            Positioned(
              bottom: 70,
              left: 24,
              right: 24,
              child: Center(
                child: SizedBox(
                  width: double.infinity, // Set button width to stretch across the screen
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SignupPage()),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppPallete.button, // Button background color
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(15.0), // Set button border radius
                      ),
                    ),
                    child: const Padding(
                      padding: EdgeInsets.all(16.0), // Padding for the button
                      child: Text(
                        'Get Started',
                        style: TextStyle(
                          color: AppPallete.whiteColor, // Button text color
                          fontSize: 20,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
