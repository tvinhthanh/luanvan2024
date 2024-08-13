import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_petcare_app/main.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'dart:convert';

class AddPetPage extends StatefulWidget {
  final String? email;
  final String? userName;
  final String? imageURLs;
  final String breedId;
  final String breedType;

  const AddPetPage({
    Key? key,
    this.imageURLs,
    required this.email,
    this.userName,
    required this.breedId,
    required this.breedType,
  }) : super(key: key);

  @override
  State<AddPetPage> createState() => _AddPetPageState();
}

class _AddPetPageState extends State<AddPetPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  final TextEditingController weightController = TextEditingController();
  final TextEditingController imgController = TextEditingController();
  final TextEditingController breedTypeController = TextEditingController();

  String? selectedSex; // To store the selected sex
  final ImagePicker _picker = ImagePicker(); // Image picker instance

  @override
  void initState() {
    super.initState();
    breedTypeController.text = widget.breedType;
    imgController.text =
        widget.imageURLs ?? ''; // Show existing image URL if available
  }

  Future<void> addPet() async {
    final String url = 'http://${Ip.serverIP}:3000/api/pet/add/${widget.email}';
    final Map<String, String> body = {
      'name': nameController.text,
      'age': ageController.text,
      'weight': weightController.text,
      'breed_id': widget.breedId,
      'sex': selectedSex ?? '', // Use selected sex
      'breed_type': widget.breedType,
      'img': imgController.text, // Use the uploaded image URL
    };

    try {
      final response = await http.post(
        Uri.parse('$url'),
        body: {
          ...body,
          'email': widget.email,
        },
      );

      if (response.statusCode == 201) {
        showAddPetResultDialog(true);
      } else {
        showAddPetResultDialog(false);
        print('Failed to add pet: ${response.statusCode}');
      }
    } catch (error) {
      showAddPetResultDialog(false);
      print('Error adding pet: $error');
    }
  }

  Future<String> uploadImage(File image) async {
    final url =
        Uri.parse('https://api.cloudinary.com/v1_1/dop4jetlx/image/upload');
    const uploadPreset = 'ftpphxq2';

    final request = http.MultipartRequest('POST', url)
      ..fields['upload_preset'] = uploadPreset
      ..files.add(await http.MultipartFile.fromPath('file', image.path));

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

  Future<void> _selectImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      try {
        String imageUrl = await uploadImage(File(image.path));
        setState(() {
          imgController.text = imageUrl; // Store the uploaded image URL
        });
      } catch (e) {
        print('Error uploading image: $e');
      }
    }
  }

  Future<void> showAddPetResultDialog(bool success) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(success ? 'Success' : 'Failed'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text(success
                    ? 'Pet added successfully!'
                    : 'Failed to add pet. Please try again.'),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('OK'),
              onPressed: () {
                Navigator.of(context).pop();
                if (success) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => HomePage(
                              userName: widget.userName,
                              email: widget.email,
                              imageURLs: widget.imageURLs,
                            )),
                  );
                }
              },
            ),
          ],
        );
      },
    );
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
                await FirebaseAuth.instance.signOut();
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

  void _logout() {
    _showLogoutConfirmationDialog(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: const Color(0xFF2A3240),
      appBar: AppBar(
        backgroundColor: const Color(0xFF2A3240),
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
              _logout();
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Tên thú cưng:',
                  labelStyle: TextStyle(color: Colors.white, fontSize: 18),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: ageController,
                decoration: InputDecoration(
                  labelText: 'Tuổi thú cưng:',
                  labelStyle: TextStyle(color: Colors.white, fontSize: 18),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: weightController,
                decoration: InputDecoration(
                  labelText: 'Cân nặng:',
                  labelStyle: TextStyle(color: Colors.white, fontSize: 18),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: breedTypeController,
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Giống thú cưng:',
                  labelStyle: TextStyle(color: Colors.white, fontSize: 24),
                ),
                style: TextStyle(color: Colors.white),
              ),
              // Radio buttons for selecting sex
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Text('Giới tính:',
                      style: TextStyle(color: Colors.white, fontSize: 18)),
                  Radio<String>(
                    value: 'Male',
                    groupValue: selectedSex,
                    onChanged: (value) {
                      setState(() {
                        selectedSex = value;
                      });
                    },
                    activeColor: Colors.blue,
                  ),
                  Text('Đực',
                      style: TextStyle(color: Colors.white, fontSize: 18)),
                  Radio<String>(
                    value: 'Female',
                    groupValue: selectedSex,
                    onChanged: (value) {
                      setState(() {
                        selectedSex = value;
                      });
                    },
                    activeColor: Colors.blue,
                  ),
                  Text('Cái',
                      style: TextStyle(color: Colors.white, fontSize: 18)),
                ],
              ),
              TextField(
                controller: imgController,
                decoration: InputDecoration(
                  labelText: 'Nhấp vào để chọn hình ảnh',
                  labelStyle: TextStyle(color: Colors.white, fontSize: 18),
                ),
                style: TextStyle(color: Colors.white),
                onTap: _selectImage, // Open image picker on tap
                readOnly: true, // Make the text field read-only
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: addPet,
                child: Text(
                  'Add Pet',
                  style: TextStyle(color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                    backgroundColor: AppPallete.button),
              ),
            ],
          ),
        ),
      ),
      drawer: CustomDrawer(userName: widget.userName),
    );
  }
}
