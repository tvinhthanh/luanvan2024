import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/button.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/snackbar.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/text_field.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_petcare_app/main.dart';

class BasicInfoPage extends StatefulWidget {
  final String? name;
  final String? email;
  final String? phoneNumber;
  final String? type;
  const BasicInfoPage(
      {Key? key, this.name, this.email, this.phoneNumber, this.type})
      : super(key: key);

  @override
  State<BasicInfoPage> createState() => _BasicInfoPageState();
}

class _BasicInfoPageState extends State<BasicInfoPage> {
  late TextEditingController nameController;
  late TextEditingController emailController;
  late TextEditingController phoneNumberController;
  bool isLoading = false;
  File? _image;

  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.name);
    emailController = TextEditingController(text: widget.email);
    phoneNumberController = TextEditingController(text: widget.phoneNumber);
    print('Name: ${widget.name}');
    print('Email: ${widget.email}');
    print('Phone Number: ${widget.phoneNumber}');
    print('Type: ${widget.type}');
  }

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneNumberController.dispose();
    super.dispose();
  }

  void submitInfo() async {
    setState(() {
      isLoading = true;
    });

    String imageUrl =
        _image != null ? await uploadImage(_image!) : "Icon_User.png";

    final userInfo = {
      "name": nameController.text,
      "email": emailController.text,
      "phone": phoneNumberController.text,
      "img": imageUrl,
      "type": widget.type,
    };

    final response = await saveUserInfo(userInfo);

    setState(() {
      isLoading = false;
    });

    if (response) {
      // Show success message
      showSnackBar(context, "Information submitted successfully!");

      // Navigate to main or another screen
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context) => HomePage(
            userName: nameController.text,
            email: emailController.text,
            imageURLs: imageUrl,
          ),
        ),
      );
    } else {
      showSnackBar(context, "Failed to submit information.");
    }
  }

  Future<String> uploadImage(File image) async {
    final url =
        Uri.parse('https://api.cloudinary.com/v1_1/dop4jetlx/image/upload');
    const uploadPreset = 'ftpphxq2';
    // Create a multipart request to upload the file
    final request = http.MultipartRequest('POST', url)
      ..fields['upload_preset'] = uploadPreset
      ..files.add(await http.MultipartFile.fromPath('file', image.path));

    // Send the request
    final response = await request.send();

    if (response.statusCode == 200) {
      final responseBody = await response.stream.bytesToString();
      final jsonResponse = json.decode(responseBody);
      return jsonResponse['secure_url']; // Return the URL of the uploaded image
    } else {
      throw Exception(
          'Failed to upload image. Status code: ${response.statusCode}');
    }
  }

  Future<bool> saveUserInfo(Map<String, dynamic> userInfo) async {
    final response = await http.post(
      Uri.parse('http://${Ip.serverIP}:3000/api/usersApp/usersInfo'),
      body: jsonEncode(userInfo),
      headers: {
        'Content-Type': 'application/json',
      },
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    return response.statusCode == 201;
  }

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _image = File(pickedFile.path);
      } else {
        showSnackBar(context, "No image selected.");
      }
    });
  }

  Future<bool> _onWillPop() async {
    bool shouldPop = await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("Confirm Exit"),
        content: Text("Are you sure you want to go back?"),
        actions: [
          TextButton(
            onPressed: () async {
              await FirebaseAuth.instance
                  .signOut(); // Sign out before confirming exit
              Navigator.of(context).pop(true); // Confirm exit
            },
            child: Text("Yes"),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(false), // Cancel exit
            child: Text("No"),
          ),
        ],
      ),
    );
    return shouldPop; // Return the result from the dialog
  }

  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    return WillPopScope(
      onWillPop: _onWillPop, // Corrected here
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        backgroundColor: AppPallete.backgroundColor,
        body: SafeArea(
          child: SizedBox(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  height: height / 3,
                  child: Image.asset('assets/Image/LogoContainer.png'),
                ),
                GestureDetector(
                  onTap: _pickImage,
                  child: _image != null
                      ? CircleAvatar(
                          radius: 60,
                          backgroundImage: FileImage(_image!),
                        )
                      : CircleAvatar(
                          radius: 60,
                          backgroundColor: Colors.grey[200],
                          child: Icon(
                            Icons.camera_alt,
                            size: 50,
                            color: Colors.grey[800],
                          ),
                        ),
                ),
                const SizedBox(height: 20),
                TextFieldInput(
                  icon: Icons.person,
                  textEditingController: nameController,
                  hintText: 'Enter your name',
                  textInputType: TextInputType.text,
                ),
                TextFieldInput(
                  icon: Icons.email,
                  textEditingController: emailController,
                  hintText: 'Enter your email',
                  textInputType: TextInputType.text,
                ),
                TextFieldInput(
                  icon: Icons.phone,
                  textEditingController: phoneNumberController,
                  hintText: 'Enter your phone number',
                  textInputType: TextInputType.phone,
                ),
                MyButtons(
                  onTap: submitInfo,
                  text: isLoading ? "Submitting..." : "Submit",
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
