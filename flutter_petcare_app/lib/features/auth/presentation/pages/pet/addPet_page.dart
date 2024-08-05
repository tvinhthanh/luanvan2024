import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_petcare_app/main.dart';


class AddPetPage extends StatefulWidget {
  final String? email;
  final String? userName;
  final String breedId;
  final String breedType;
  const AddPetPage(
      {Key? key,
      required this.email,
       this.userName,
      required this.breedId,
      required this.breedType})
      : super(key: key);

  @override
  State<AddPetPage> createState() => _AddPetPageState();
}

class _AddPetPageState extends State<AddPetPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final TextEditingController nameController = TextEditingController();
  final TextEditingController ageController = TextEditingController();
  final TextEditingController weightController = TextEditingController();
  final TextEditingController sexController = TextEditingController();
  final TextEditingController imgController = TextEditingController();
  final TextEditingController breedIdController = TextEditingController();
  final TextEditingController breedTypeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    breedIdController.text =
        widget.breedId; // Gán giá trị từ widget vào controller
    breedTypeController.text =
        widget.breedType; // Gán giá trị từ widget vào controller
  }

  Future<void> addPet() async {
    final String url =
        'http://${Ip.serverIP}:3000/api/pet/add/${widget.email}';
    final Map<String, String> body = {
      'name': nameController.text,
      'age': ageController.text,
      'weight': weightController.text,
      'breed_id': widget
          .breedId, // Thay thế giá trị từ controller bằng giá trị từ widget
      'sex': sexController.text,
      'breed_type': widget
          .breedType, // Thay thế giá trị từ controller bằng giá trị từ widget
      'img': imgController.text,
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
        // Thêm thành công, hiển thị dialog
        showAddPetResultDialog(true);
      } else {
        // Hiển thị dialog với thông báo thất bại
        showAddPetResultDialog(false);
        print('Failed to add pet: ${response.statusCode}');
      }
    } catch (error) {
      // Hiển thị dialog với thông báo thất bại
      showAddPetResultDialog(false);
      print('Error adding pet: $error');
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
                Navigator.of(context).pop(); // Đóng dialog
                if (success) {
                  // Chuyển đến trang HomePage khi thêm pet thành công
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => HomePage(
                            userName: widget.userName,
                            email: widget.email)),
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
      barrierDismissible:
          false, // Ngăn người dùng đóng dialog bằng cách nhấn bên ngoài
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
                Navigator.of(context).pop(); // Đóng dialog
              },
            ),
            TextButton(
              child: Text('Logout'),
              onPressed: () {
                Navigator.push(
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
                  labelText: 'Name',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: ageController,
                
                decoration: InputDecoration(
                  labelText: 'Age',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: weightController,
                decoration: InputDecoration(
                  labelText: 'Weight',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: breedIdController,
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Breed ID',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: sexController,
                decoration: InputDecoration(
                  labelText: 'Sex',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: breedTypeController,
                enabled: false,
                decoration: InputDecoration(
                  labelText: 'Breed Type',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              TextField(
                controller: imgController,
                decoration: InputDecoration(
                  labelText: 'Image URL',
                  labelStyle: TextStyle(color: Colors.white),
                ),
                style: TextStyle(color: Colors.white),
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: addPet,
                child: Text(
                  'Add Pet',
                  style: TextStyle(color: Colors.white),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                ),
              ),
            ],
          ),
        ),
      ),
      drawer: CustomDrawer(userName: widget.userName, email: widget.email,),
    );
  }
}
