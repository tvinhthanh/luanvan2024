import 'dart:convert';
import 'dart:io';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;

class AccountPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  const AccountPage({Key? key, this.userName, this.email, this.imageURLs}) : super(key: key);

  @override
  _AccountPageState createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  File? _image;
  String _imageUrl = '';

  @override
  void initState() {
    super.initState();
    _fetchUserInfo();
  }

  Future<void> _fetchUserInfo() async {
    final response = await http.get(Uri.parse('http://${Ip.serverIP}:3000/api/usersApp/userInfo/${widget.email}'));

    if (response.statusCode == 200) {
      final user = jsonDecode(response.body);
      setState(() {
        _nameController.text = user['name'] ?? '';
        _emailController.text = user['email'] ?? '';
        _phoneController.text = user['phone'] ?? '';
        _imageUrl = user['img'] ?? '';
      });
    } else {
      // Handle error
    }
  }

  Future<void> _showLogoutConfirmationDialog(BuildContext context) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirm Logout'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Are you sure you want to log out?'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Logout'),
              onPressed: () async {
                // Sign out from Firebase
                await FirebaseAuth.instance.signOut();

                // Navigate to LoginPage
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => LoginPage()),
                );
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _pickImage() async {
    final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });

      // Upload image to Cloudinary
      await _uploadImageToCloudinary(_image!);
    }
  }

  Future<void> _uploadImageToCloudinary(File image) async {
    final cloudinaryUrl = 'https://api.cloudinary.com/v1_1/dop4jetlx/image/upload';
    final preset = 'ftpphxq2'; // Set this up in your Cloudinary account

    final request = http.MultipartRequest('POST', Uri.parse(cloudinaryUrl));
    request.fields['upload_preset'] = preset;
    request.files.add(await http.MultipartFile.fromPath('file', image.path));

    final response = await request.send();

    if (response.statusCode == 200) {
      final responseData = await response.stream.bytesToString();
      final jsonData = jsonDecode(responseData);
      setState(() {
        _imageUrl = jsonData['secure_url']; // Update image URL with Cloudinary URL
      });
    } else {
      print('Failed to upload image to Cloudinary');
    }
  }

  Future<void> _updateUserInfo() async {
    final String apiUrl = 'http://${Ip.serverIP}:3000/api/usersApp/userInfo/update/${widget.email}';
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
    };

    final Map<String, dynamic> userData = {
      'name': _nameController.text,
      'img': _imageUrl, // Use the Cloudinary image URL
    };

    try {
      final response = await http.put(
        Uri.parse(apiUrl),
        headers: headers,
        body: jsonEncode(userData),
      );

      if (response.statusCode == 200) {
        final updatedUser = jsonDecode(response.body);
        setState(() {
          _imageUrl = updatedUser['img'] ?? _imageUrl; // Update _imageUrl from server response
        });
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Đã cập nhật thông tin thành công'),
          duration: Duration(seconds: 2),
        ));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
          content: Text('Cập nhật thông tin thất bại'),
          duration: Duration(seconds: 2),
        ));
      }
    } catch (error) {
      print('Error updating user: $error');
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Failed to update user information. Please try again later.'),
        duration: Duration(seconds: 2),
      ));
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        backgroundColor: AppPallete.backgroundColor,
        leading: IconButton(
          icon: const Icon(Icons.menu),
          color: Colors.white,
          onPressed: () {
            _scaffoldKey.currentState?.openDrawer();
          },
        ),
        actions: [
          IconButton(
            icon: Icon(
              Icons.exit_to_app_outlined,
              color: Colors.white,
            ),
            onPressed: () {
              _showLogoutConfirmationDialog(context);
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            GestureDetector(
              onTap: _pickImage,
              child: CircleAvatar(
                radius: 50,
                backgroundImage: _image != null
                    ? FileImage(_image!)
                    : (_imageUrl.isNotEmpty ? NetworkImage(_imageUrl) as ImageProvider : null),
                child: (_image == null && _imageUrl.isEmpty) ? Icon(Icons.add_a_photo, size: 50) : null,
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Tên người dùng',
                border: OutlineInputBorder(),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Địa chỉ email',
                border: OutlineInputBorder(),
              ),
              readOnly: true,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _phoneController,
              decoration: InputDecoration(
                labelText: 'Số điện thoại',
                border: OutlineInputBorder(),
              ),
              readOnly: true,
            ),
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: _updateUserInfo,
              child: Text('Lưu'),
            ),
          ],
        ),
      ),
      drawer: CustomDrawer(userName: _nameController.text, email: _emailController.text, imageURLs: _imageUrl,),
    );
  }
}
