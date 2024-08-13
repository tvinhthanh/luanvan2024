import 'dart:convert';
import 'dart:io';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/contact/contactToPet_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/medicalRecord/record_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

class DetailPetPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final Map<String, dynamic> pet;

  const DetailPetPage({Key? key, this.userName, this.email, required this.pet})
      : super(key: key);

  @override
  State<DetailPetPage> createState() => _DetailPetPageState();
}

class _DetailPetPageState extends State<DetailPetPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  // Dummy appointment history data for demonstration
  List<Map<String, dynamic>> appointmentHistory = [];

  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _ageController;
  late TextEditingController _weightController;
  late TextEditingController _sexController;
  String? _selectedImagePath;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.pet['name']);
    _ageController = TextEditingController(text: widget.pet['age'].toString());
    _weightController =
        TextEditingController(text: widget.pet['weight'].toString());
    _sexController = TextEditingController(text: widget.pet['sex']);
    _fetchAppointmentHistory();
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _weightController.dispose();
    _sexController.dispose();
    super.dispose();
  }

  Future<void> _fetchAppointmentHistory() async {
    final String apiUrl =
        'http://${Ip.serverIP}:3000/api/pet/showContacts/${widget.pet['_id']}';

    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);

        setState(() {
          // Filter out duplicates
          final uniqueAppointments = <String>{};
          appointmentHistory = data.where((item) {
            final idPair = '${item['vetId']['_id']}-${widget.pet['_id']}';
            if (uniqueAppointments.contains(idPair)) {
              return false;
            } else {
              uniqueAppointments.add(idPair);
              return true;
            }
          }).map((item) {
            return {
              'clinic_id': item['vetId']['_id'],
              'clinic_name': item['vetId']['name'],
            };
          }).toList();
        });
      } else {
        print('Failed to load appointment history: ${response.statusCode}');
      }
    } catch (error) {
      print('Error loading appointment history: $error');
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
    final pickedFile =
        await ImagePicker().pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        _selectedImagePath = pickedFile.path;
      });
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

   Future<void> _showUpdateDialog(BuildContext context) async {
    String? tempSelectedImagePath = _selectedImagePath;

    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Update Pet Info'),
          content: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  TextFormField(
                    controller: _nameController,
                    decoration: InputDecoration(labelText: 'Name'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a name';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _ageController,
                    decoration: InputDecoration(labelText: 'Age'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter an age';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _weightController,
                    decoration: InputDecoration(labelText: 'Weight'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a weight';
                      }
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _sexController,
                    decoration: InputDecoration(labelText: 'Sex'),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter a sex';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: 10),
                  // Button to pick image
                  TextButton(
                    onPressed: () async {
                      final pickedFile = await ImagePicker().pickImage(source: ImageSource.gallery);
                      if (pickedFile != null) {
                        setState(() {
                          tempSelectedImagePath = pickedFile.path;
                        });
                      }
                    },
                    child: Icon(Icons.add_a_photo, size: 50),
                  ),
                  SizedBox(height: 10),
                  // Display selected image
                  if (tempSelectedImagePath != null)
                    Image.file(File(tempSelectedImagePath!), height: 100),
                  if (_selectedImagePath != null && tempSelectedImagePath == null)
                    Image.network(_selectedImagePath!, height: 100), // Display existing image
                ],
              ),
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Hủy'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Cập nhật'),
              onPressed: () async {
                if (_formKey.currentState!.validate()) {
                  String? imageUrl;
                  if (tempSelectedImagePath != null) {
                    // Upload the image and get the URL
                    imageUrl = await uploadImage(File(tempSelectedImagePath!));
                  }

                  // Prepare updated data
                  Map<String, dynamic> updatedData = {
                    'name': _nameController.text,
                    'age': int.parse(_ageController.text),
                    'weight': double.parse(_weightController.text),
                    'sex': _sexController.text,
                    'img': imageUrl ?? widget.pet['img'], // Use uploaded URL or existing
                  };

                  // Call backend update API
                  bool updateSuccess = await _updatePetInfo(updatedData);

                  if (updateSuccess) {
                    setState(() {
                      _selectedImagePath = tempSelectedImagePath; // Update selected image path
                    });
                    // Update successful
                    Navigator.of(context).pop(true); // Pass success result
                  } else {
                    // Handle update failure
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                      content: Text('Failed to update pet info. Please try again.'),
                      duration: Duration(seconds: 2),
                    ));
                  }
                }
              },
            ),
          ],
        );
      },
    );
  }

  Future<bool> _updatePetInfo(Map<String, dynamic> updatedData) async {
    final String apiUrl =
        'http://${Ip.serverIP}:3000/api/pet/update/${widget.pet['_id']}';

    try {
      final response = await http.put(
        Uri.parse(apiUrl),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode(updatedData),
      );

      if (response.statusCode == 200) {
        // Update successful
        return true;
      } else {
        // Update failed
        print('Failed to update pet info: ${response.statusCode}');
        return false;
      }
    } catch (error) {
      // Handle error
      print('Error updating pet info: $error');
      return false;
    }
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
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  image: _selectedImagePath != null
                      ? DecorationImage(
                          fit: BoxFit.cover,
                          image: FileImage(File(_selectedImagePath!)),
                        )
                      : DecorationImage(
                          fit: BoxFit.cover,
                          image:
                              NetworkImage('${widget.pet['img'].toString()}'),
                        ),
                ),
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Tên thú cưng: ${widget.pet['name']}',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            Text(
              'Giống thú cưng: ${widget.pet['breed_type']}',
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 10),
            Text(
              'Tuổi: ${widget.pet['age']} year',
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 10),
            Text(
              'Giới tính: ${widget.pet['sex']}',
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 10),
            Text(
              'Cân nặng: ${widget.pet['weight']}',
              style: TextStyle(fontSize: 18),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                ElevatedButton(
                  onPressed: () {
                    _showUpdateDialog(context);
                  },
                  child: Text('Cập nhật'),
                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.pushReplacement(
                      context,
                      MaterialPageRoute(
                          builder: (context) => ContactToPetPage(
                                pet: widget.pet,
                                userName: widget.userName,
                                email: widget.email,
                              )),
                    );
                  },
                  child: Text('Đặt lịch'),
                ),
              ],
            ),
            SizedBox(height: 20),
            Text(
              'Hồ sơ bệnh án',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 10),
            DataTable(
              columns: <DataColumn>[
                DataColumn(label: Text('STT')),
                DataColumn(
                  label: Container(
                    width: 90, // Adjust this width as needed
                    child: Text('Phòng khám', overflow: TextOverflow.ellipsis),
                  ),
                ),
                DataColumn(label: Text('Chi tiết')),
              ],
              rows: appointmentHistory.asMap().entries.map((entry) {
                int index = entry.key;
                Map<String, dynamic> appointment = entry.value;
                return DataRow(cells: [
                  DataCell(Text((index + 1).toString())),
                  DataCell(
                    Container(
                      width: 90, // Adjust this width as needed
                      child: Text(
                        appointment['clinic_name'],
                        overflow: TextOverflow
                            .visible, // Ensure long names are truncated
                      ),
                    ),
                  ),
                  DataCell(
                    ElevatedButton(
                      onPressed: () {
                        // Navigate to PetProfilePage with idPet and idVet
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => PetProfilePage(
                              email: widget.email,
                              userName: widget.userName,
                              petId: widget.pet['_id'],
                              vetID: appointment['clinic_id'].toString(),
                              vetName: appointment['clinic_name'].toString(),
                              petName: widget.pet['name'],
                              petBreed: widget.pet['breed_type'],
                              petAge: widget.pet['age'],
                              petGender: widget.pet['sex'],
                              petWeight: widget.pet['weight'],
                              petImage: widget.pet['img'],
                            ),
                          ),
                        );
                      },
                      child: Text('Xem'),
                    ),
                  ),
                ]);
              }).toList(),
            ),
          ],
        ),
      ),
      drawer: CustomDrawer(userName: widget.userName, email: widget.email),
    );
  }
}
