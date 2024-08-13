import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class BookingDetailPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  final Map<String, dynamic> clinicName;

  const BookingDetailPage(
      {Key? key, this.userName, this.email, required this.clinicName, this.imageURLs})
      : super(key: key);

  @override
  State<BookingDetailPage> createState() => _BookingDetailPageState();
}

class _BookingDetailPageState extends State<BookingDetailPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

 Future<void> _showLogoutConfirmationDialog(BuildContext context) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Xác nhận đăng xuất'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('Bạn xác nhận rằng muốn đăng xuất chứ?'),
              ],
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
              child: Text('Đăng xuất'),
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
        child: ListView(
          children: <Widget>[
            // Image
            Container(
              height: 200,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: AssetImage('assets/dog_grooming.jpg'), // Replace with your image asset path
                  fit: BoxFit.cover,
                ),
              ),
            ),
            SizedBox(height: 16),
            // Clinic Name and Rating
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Shinny Fur Saloon',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Row(
                  children: List.generate(5, (index) {
                    return Icon(
                      index < 4 ? Icons.star : Icons.star_half,
                      color: Colors.amber,
                    );
                  }),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              'Grooming',
              style: TextStyle(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            // Contact Information
            ListTile(
              leading: Icon(Icons.phone),
              title: Text('079 1234 7777'),
            ),
            ListTile(
              leading: Icon(Icons.email),
              title: Text('contactshinnyfur@gmail.com'),
            ),
            // Location Information
            ListTile(
              leading: Icon(Icons.location_on),
              title: Text('70 North Street, London, United Kingdom'),
            ),
            // Availability
            Text(
              'Availability',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: 'MTWTFSS'.split('').map((day) {
                bool isAvailable = day != 'S';
                return CircleAvatar(
                  backgroundColor: isAvailable ? Colors.blue : Colors.grey,
                  child: Text(day, style: TextStyle(color: Colors.white)),
                );
              }).toList(),
            ),
            SizedBox(height: 8),
            Text(
              'Hours: 10:00 - 20:00',
              style: TextStyle(fontSize: 16, color: Colors.grey[600]),
            ),
            // Services
            Text(
              'Services',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            ServiceTile(service: 'Haircut', price: 30),
            ServiceTile(service: 'Bath', price: 20),
            ServiceTile(service: 'Nail Trimming', price: 20),
            // Book a date button
            SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                // Handle booking action
              },
              child: Text('Book a date'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                padding: EdgeInsets.symmetric(vertical: 16),
              ),
            ),
            
            
          ],
        ),
      ),
      drawer: CustomDrawer(userName: widget.userName, email: widget.email, imageURLs: widget.imageURLs,),
    );
  }
}

class ServiceTile extends StatelessWidget {
  final String service;
  final double price;

  const ServiceTile({required this.service, required this.price});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(service),
      trailing: Text('\$$price'),
    );
  }
}
