import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/booking/booking_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart'; // Import the rating bar package
import 'package:http/http.dart' as http;
import 'dart:convert';

class ContactDetailPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  final Map<String, dynamic> clinicName;

  const ContactDetailPage(
      {Key? key, this.userName, this.email, required this.clinicName, this.imageURLs})
      : super(key: key);

  @override
  State<ContactDetailPage> createState() => _ContactDetailPageState();
}

class _ContactDetailPageState extends State<ContactDetailPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  double _userRating = 0.0;
  TextEditingController _commentController = TextEditingController();

  Future<List<dynamic>> fetchServices(String vetId) async {
    final url = Uri.parse('http://${Ip.serverIP}:3000/api/service/show/$vetId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('Failed to load services');
        return [];
      }
    } catch (e) {
      print('Error: $e');
      return [];
    }
  }

  Future<List<dynamic>> fetchRatings(String vetId) async {
    final url = Uri.parse('http://${Ip.serverIP}:3000/api/review/rating/show/$vetId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('Failed to load ratings');
        return [];
      }
    } catch (e) {
      print('Error: $e');
      return [];
    }
  }

  Future<void> submitRating(String vetId, double rating, String comment) async {
    final url = Uri.parse('http://${Ip.serverIP}:3000/api/review/add');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'vetId': vetId,
        'rating': rating,
        'comment': comment,
        'userName': widget.userName,
      }),
    );

    if (response.statusCode == 200) {
      print('Rating submitted successfully');
    } else {
      print('Failed to submit rating');
    }
  }

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
        child: FutureBuilder<List<dynamic>>(
          future: fetchServices(widget.clinicName['_id'].toString()),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Center(
                  child: Text('Error loading services: ${snapshot.error}'));
            } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(child: Text('No available services'));
            } else {
              return ListView(
                children: [
                  Container(
                    height: 200,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      image: DecorationImage(
                        image: NetworkImage(
                            '${widget.clinicName['image']}'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    widget.clinicName['name'],
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    widget.clinicName['address'],
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    widget.clinicName['phone'],
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 20),
                  // Booking Button
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BookingPage(
                            clinicName: widget.clinicName,
                            email: widget.email,
                            imageURLs: widget.imageURLs,
                            userName: widget.userName,
                          ),
                        ),
                      );
                    },
                    child: Text('Đặt lịch hẹn',style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppPallete.button,
                      padding: EdgeInsets.symmetric(vertical: 15),
                      textStyle: TextStyle(fontSize: 18),
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Availability
                  Text(
                    'Phòng khám hoạt động',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: 'T2 T3 T4 T5 T6 T7 CN'.split(' ').map((day) {
                      bool isAvailable = day != 'CN';
                      return CircleAvatar(
                        backgroundColor:
                            isAvailable ? Colors.blue : Colors.grey,
                        child: Text(day, style: TextStyle(color: Colors.white)),
                      );
                    }).toList(),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Thời gian hoạt động: 09:00 - 20:00',
                    style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                  ),
                  const SizedBox(height: 20),
                  // Services
                  Text(
                    'Dịch vụ:',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: snapshot.data!.map<Widget>((service) {
                      return ListTile(
                        title: Text(service['name']),
                        subtitle: Text(
                            '${service['duration']} - ${service['price']}.000 VNĐ'),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 20),
                  // Ratings and Comments
                  Text(
                    'Đánh giá từ người dùng:',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  FutureBuilder<List<dynamic>>(
                    future: fetchRatings(widget.clinicName['_id'].toString()),
                    builder: (context, ratingSnapshot) {
                      if (ratingSnapshot.connectionState ==
                          ConnectionState.waiting) {
                        return Center(child: CircularProgressIndicator());
                      } else if (ratingSnapshot.hasError) {
                        return Center(
                            child: Text(
                                'Error loading ratings: ${ratingSnapshot.error}'));
                      } else if (!ratingSnapshot.hasData ||
                          ratingSnapshot.data!.isEmpty) {
                        return Center(child: Text('No ratings yet'));
                      } else {
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: ratingSnapshot.data!.map<Widget>((rating) {
                            return ListTile(
                              title: Text(
                                  '${rating['userName']} (${rating['rating']}/5)'),
                              subtitle: Text(rating['comment']),
                            );
                          }).toList(),
                        );
                      }
                    },
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'Đánh giá phòng khám:',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 10),
                  RatingBar.builder(
                    initialRating: _userRating,
                    minRating: 1,
                    direction: Axis.horizontal,
                    allowHalfRating: true,
                    itemCount: 5,
                    itemPadding: EdgeInsets.symmetric(horizontal: 4.0),
                    itemBuilder: (context, _) => Icon(
                      Icons.star,
                      color: Colors.amber,
                    ),
                    onRatingUpdate: (rating) {
                      setState(() {
                        _userRating = rating;
                      });
                    },
                  ),
                  SizedBox(height: 10),
                  TextField(
                    controller: _commentController,
                    decoration: InputDecoration(
                      hintText: 'Enter your comment',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  SizedBox(height: 10),
                  ElevatedButton(
                    onPressed: () {
                      submitRating(widget.clinicName['_id'].toString(),
                          _userRating, _commentController.text);
                    },
                    child: Text('Submit Rating'),
                  ),
                ],
              );
            }
          },
        ),
      ),
      drawer: CustomDrawer(
        userName: widget.userName,
        email: widget.email,
        imageURLs: widget.imageURLs,
      ),
    );
  }
}
