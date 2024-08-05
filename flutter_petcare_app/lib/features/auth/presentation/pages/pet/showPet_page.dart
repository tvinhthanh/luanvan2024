import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ShowPetPage extends StatefulWidget {
  final String email;

  const ShowPetPage({Key? key, required this.email}) : super(key: key);

  @override
  _ShowPetPageState createState() => _ShowPetPageState();
}

class _ShowPetPageState extends State<ShowPetPage> {
  List<dynamic> pets = [];

  @override
  void initState() {
    super.initState();
    _fetchPets();
  }

  Future<void> _fetchPets() async {
    try {
      final response = await http.get(Uri.parse('http://172.16.0.57:3000/api/pet/show/${widget.email}'));

      if (response.statusCode == 200) {
        setState(() {
          pets = jsonDecode(response.body);
        });
      } else {
        print('Failed to load pets: ${response.statusCode}');
      }
    } catch (error) {
      print('Error fetching pets: $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Pet Profiles'),
      ),
      body: ListView.builder(
        itemCount: pets.length,
        itemBuilder: (context, index) {
          return _buildPetCard(pets[index]);
        },
      ),
    );
  }

  Widget _buildPetCard(dynamic pet) {
    return Card(
      elevation: 5,
      margin: EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: NetworkImage(pet['img']),
        ),
        title: Text(pet['name']),
        subtitle: Text(pet['breed_type']),
        onTap: () {
          // Navigate to pet detail page or perform action on tap
        },
      ),
    );
  }
}
