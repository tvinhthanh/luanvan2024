import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/pet/addPet_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_petcare_app/main.dart';

class BreedType {
  final String id;
  final String name;
  final List<Breed> breeds;

  BreedType({required this.id, required this.name, required this.breeds});

  factory BreedType.fromJson(Map<String, dynamic> json) {
    return BreedType(
      id: json['_id'],
      name: json['name'],
      breeds: (json['breeds'] as List)
          .map((breed) => Breed.fromJson(breed))
          .toList(),
    );
  }
}

class Breed {
  final String name;
  Breed({required this.name});

  factory Breed.fromJson(Map<String, dynamic> json) {
    return Breed(
      name: json['name'],
    );
  }
}

class ChooseBreedTypePage extends StatefulWidget {
  final String? userName;
  final String? email;
  const ChooseBreedTypePage({super.key, this.userName, this.email});

  @override
  State<ChooseBreedTypePage> createState() => _ChooseBreedTypePageState();
}

class _ChooseBreedTypePageState extends State<ChooseBreedTypePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late Future<List<BreedType>> breedTypesFuture;
  BreedType? selectedBreedType;
  Breed? selectedBreed;
  String selectedBreedName = "";

  @override
  void initState() {
    super.initState();
    breedTypesFuture = fetchData();
  }

  Future<List<BreedType>> fetchData() async {
    final response =
        await http.get(Uri.parse('http://${Ip.serverIP}:3000/api/breedType/'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      final breedTypes = data.map((json) => BreedType.fromJson(json)).toList();
      if (breedTypes.isNotEmpty) {
        setState(() {
          selectedBreedType = breedTypes.first;
        });
      }
      return breedTypes;
    } else {
      throw Exception('Failed to load data');
    }
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
        title: Text(
          'Add Pet Profile',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF2A3240),
        centerTitle: true, // Center align the title text
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
      drawer: CustomDrawer(userName: widget.userName, email: widget.email,),
      body: Stack(
        children: [
          Positioned(
            top: 10,
            left: 150,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    'Breed',
                    style: TextStyle(color: Colors.white, fontSize: 20),
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            top: 100,
            left: 20,
            right: 20,
            bottom: 0,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: FutureBuilder<List<BreedType>>(
                    future: breedTypesFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return Center(
                          child: CircularProgressIndicator(),
                        );
                      } else if (snapshot.hasError) {
                        return Center(
                          child: Text('Error: ${snapshot.error}'),
                        );
                      } else {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: MediaQuery.of(context)
                                  .size
                                  .width, // Chiều rộng bằng màn hình
                              child: DropdownButton<BreedType>(
                                isExpanded:
                                    true, // Mở rộng DropdownButton để chiếm toàn bộ chiều rộng
                                value: selectedBreedType,
                                onChanged: (newValue) {
                                  setState(() {
                                    selectedBreedType = newValue;
                                    selectedBreed = null;
                                  });
                                },
                                items: snapshot.data!
                                    .map<DropdownMenuItem<BreedType>>(
                                        (BreedType breedType) {
                                  return DropdownMenuItem<BreedType>(
                                    value: breedType,
                                    child: Row(
                                      children: [
                                        Text(
                                          breedType.name,
                                          style: TextStyle(color: Colors.cyan),
                                        ),
                                      ],
                                    ),
                                  );
                                }).toList(),
                                hint: Text(
                                  'Select Breed Type',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                            SizedBox(height: 20),
                            Container(
                              width: MediaQuery.of(context)
                                  .size
                                  .width, // Chiều rộng bằng màn hình
                              child: DropdownButton<Breed>(
                                value: selectedBreed,
                                isExpanded: true,
                                onChanged: (newValue) {
                                  setState(() {
                                    selectedBreed = newValue;
                                    selectedBreedName = newValue!.name;
                                  });
                                },
                                items: selectedBreedType?.breeds
                                        .map<DropdownMenuItem<Breed>>(
                                            (Breed breed) {
                                      return DropdownMenuItem<Breed>(
                                        value: breed,
                                        child: Text(
                                          breed.name,
                                          style: TextStyle(color: Colors.cyan),
                                        ),
                                      );
                                    }).toList() ??
                                    [],
                                hint: Text(
                                  'Select Breed',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                            SizedBox(height: 20),
                            // Container(
                            //   width: MediaQuery.of(context).size.width - 40,
                            //   height: 50,
                            //   decoration: BoxDecoration(
                            //     border: Border.all(color: Colors.grey),
                            //     borderRadius: BorderRadius.circular(10),
                            //   ),
                            //   child: Padding(
                            //     padding:
                            //         const EdgeInsets.symmetric(horizontal: 10),
                            //     child: Text(
                            //       selectedBreedName.isEmpty
                            //           ? 'Enter something'
                            //           : selectedBreedName,
                            //       style: TextStyle(color: Colors.grey),
                            //     ),
                            //   ),
                            // ),
                          ],
                        );
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            top: 400,
            left: 20,
            right: 20,
            bottom: 0,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => AddPetPage(email: widget.email,userName: widget.userName, breedId: selectedBreedType!.id, breedType: selectedBreedName,)),
                    );
                  },
                  child: Text('Continue'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}