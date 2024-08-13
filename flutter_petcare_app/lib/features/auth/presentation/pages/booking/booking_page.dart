import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class BookingPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  final Map<String, dynamic> clinicName;

  const BookingPage(
      {Key? key,
      this.userName,
      this.email,
      this.imageURLs,
      required this.clinicName})
      : super(key: key);

  @override
  State<BookingPage> createState() => _BookingPageState();
}

class _BookingPageState extends State<BookingPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  DateTime selectedDate = DateTime.now();
  int selectedTimeSlot = 9;
  List<Map<String, dynamic>> services = [];
  Map<String, bool> selectedServices = {};
  List<Map<String, dynamic>> pets = [];
  Map<String, dynamic> selectedPet = {};
  final TextEditingController noteController = TextEditingController();
  late IO.Socket socket; // Socket variable

  @override
  void initState() {
    super.initState();
    fetchPets(widget.email);
    fetchServices(widget.clinicName['_id']);

    // Initialize socket connection
    socket = IO.io('http://${Ip.serverIP}:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });

    // Connect to the socket
    socket.connect();
  }

  @override
  void dispose() {
    socket.dispose();
    noteController.dispose();
    super.dispose();
  }

  Future<void> fetchPets(String? email) async {
    final url = Uri.parse('http://${Ip.serverIP}:3000/api/pet/$email');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        List<dynamic> petData = json.decode(response.body);
        setState(() {
          pets = List<Map<String, dynamic>>.from(petData);
          selectedPet = pets.isNotEmpty ? pets[0] : {};
        });
      } else {
        print('Failed to load pets');
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> fetchServices(String vetId) async {
    final url = Uri.parse('http://${Ip.serverIP}:3000/api/service/show/$vetId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        setState(() {
          services =
              List<Map<String, dynamic>>.from(json.decode(response.body));
          for (var service in services) {
            selectedServices[service['name']] = false;
          }
        });
      } else {
        print('Failed to load services');
      }
    } catch (e) {
      print('Error: $e');
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

  void _selectDate(DateTime date) {
    setState(() {
      selectedDate = date;
    });
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
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
              color: Colors.transparent,
            ),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: selectedPet.isNotEmpty
                      ? NetworkImage(selectedPet['img'].toString())
                      : AssetImage('assets/Image/default_pet.png')
                          as ImageProvider<
                              Object>, // Cast to ImageProvider<Object>
                  radius: 20,
                ),
                SizedBox(width: 8),
                DropdownButton<Map<String, dynamic>>(
                  value: selectedPet,
                  icon: Icon(Icons.arrow_drop_down),
                  underline: Container(
                    height: 0,
                    color: Colors.transparent,
                  ),
                  onChanged: (Map<String, dynamic>? newValue) {
                    setState(() {
                      selectedPet = newValue!;
                    });
                  },
                  items: pets.map((pet) {
                    return DropdownMenuItem<Map<String, dynamic>>(
                      value: pet,
                      child: Text(
                        pet['name'],
                        style: TextStyle(
                          decoration: TextDecoration.none,
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
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
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  padding: EdgeInsets.all(20.0),
                  decoration: BoxDecoration(
                    color: Colors.blueAccent,
                    borderRadius: BorderRadius.circular(20.0),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        widget.clinicName['name'],
                        style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white),
                      ),
                      Text(
                        widget.clinicName['address'],
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                      Text(
                        widget.clinicName['phone'],
                        style: TextStyle(fontSize: 16, color: Colors.white),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 10),
              Text(
                'Ngày hẹn:\n'+DateFormat('EEEE, dd MMMM').format(selectedDate),
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Container(
                height: 65,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 7,
                  itemBuilder: (context, index) {
                    DateTime date = DateTime.now().add(Duration(days: index));
                    bool isSelected = selectedDate.day == date.day &&
                        selectedDate.month == date.month &&
                        selectedDate.year == date.year;
                    return GestureDetector(
                      onTap: () => _selectDate(date),
                      child: Container(
                        margin: EdgeInsets.symmetric(horizontal: 4.0),
                        padding: EdgeInsets.symmetric(
                            vertical: 8.0, horizontal: 16.0),
                        decoration: BoxDecoration(
                          color: isSelected ? Colors.blue : Colors.white,
                          borderRadius: BorderRadius.circular(8.0),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              DateFormat('dd').format(date),
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black,
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              DateFormat('E').format(date),
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Giờ hẹn: ',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List.generate(12, (index) {
                    int time = 9 + index;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4.0),
                      child: ChoiceChip(
                        label: Text('$time:00'),
                        selected: selectedTimeSlot == time,
                        onSelected: (bool selected) {
                          setState(() {
                            selectedTimeSlot = time;
                          });
                        },
                      ),
                    );
                  }),
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Dịch vụ:',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              ...services.map((service) {
                return CheckboxListTile(
                  title: Text('${service['name']} (\$${service['price']})'),
                  value: selectedServices[service['name']],
                  onChanged: (bool? value) {
                    setState(() {
                      selectedServices[service['name']] = value!;
                    });
                  },
                );
              }).toList(),
              SizedBox(height: 16),
              Text(
                '*Hãy ghi tình trạng cơ bản của thú cưng của bạn ở đây. Nếu không có hãy bỏ qua.',
                style: TextStyle(fontSize: 12, color: Colors.grey),
              ),
              SizedBox(height: 5),
              TextField(
                controller: noteController,
                decoration: InputDecoration(
                  labelText: 'Nhập tình trạng thú cưng',
                  border: OutlineInputBorder(),
                ),
                maxLength: 250,
              ),
              SizedBox(height: 16),
              Center(
                child: ElevatedButton(
                  onPressed: () async {
                    // Kết hợp ngày và giờ
                    final DateTime combinedDateTime = DateTime(
                      selectedDate.year,
                      selectedDate.month,
                      selectedDate.day,
                      selectedTimeSlot,
                    );

                    // Xây dựng dữ liệu booking để gửi lên backend
                    final Map<String, dynamic> bookingData = {
                      'note': noteController
                          .text, // Lấy dữ liệu từ TextField 'Add note'
                      'date': DateFormat('yyyy-MM-dd HH:mm')
                          .format(combinedDateTime), // Format ngày và giờ
                      'status': 1, // Giá trị mặc định cho status (Pending)
                    };

                    final String vetID = widget.clinicName['_id'];
                    final String email = widget.email!;
                    final String petID = selectedPet['_id'];

                    final String url =
                        'http://${Ip.serverIP}:3000/api/my-bookings/add/$vetID/$email/$petID';

                    try {
                      final response = await http.post(
                        Uri.parse(url),
                        body: json.encode(bookingData),
                        headers: {'Content-Type': 'application/json'},
                      );

                      if (response.statusCode == 201) {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: Text('Xác nhận lịch hẹn thành công'),
                              content: Text(
                                  'Lịch hẹn của bạn đã được hệ thống gửi thành công đến phòng khám.'),
                              actions: <Widget>[
                                TextButton(
                                  onPressed: () {
                                    // Đóng dialog
                                    Navigator.of(context).pop();
                                    // Chuyển hướng đến trang CalendarPage
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                          builder: (context) => HomePage(
                                                userName: widget.userName,
                                                email: widget.email,
                                              )),
                                    );
                                    ;
                                  },
                                  child: Text('Đóng'),
                                ),
                              ],
                            );
                          },
                        );
                        print('booking confirm');
                      } else {
                        // Xử lý khi có lỗi từ backend
                        print(
                            'Failed to confirm booking: ${response.statusCode}');
                        // Hiển thị thông báo cho người dùng nếu cần
                      }
                    } catch (e) {
                      // Xử lý lỗi khi gọi API
                      print('Error confirming booking: $e');
                      // Hiển thị thông báo cho người dùng nếu cần
                    }
                  },
                  child: Text('Đặt lịch hẹn'),
                ),
              ),
            ],
          ),
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
