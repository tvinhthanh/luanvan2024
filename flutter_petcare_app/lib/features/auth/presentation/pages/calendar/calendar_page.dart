import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/main.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;

  const CalendarPage({Key? key, this.userName, this.email, this.imageURLs})
      : super(key: key);

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  List<Map<String, dynamic>> _events = []; // Danh sách lưu trữ sự kiện
  List<Map<String, dynamic>> _filteredEvents = []; // Danh sách sự kiện đã lọc

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _fetchEvents(); // Lọc sự kiện cho ngày đã chọn trong initState
  }

  Future<void> _fetchEvents() async {
    final response = await http.get(Uri.parse(
        'http://${Ip.serverIP}:3000/api/schedule/appointment/${widget.email}'));

    if (response.statusCode == 200) {
      final List<dynamic> fetchedEvents = json.decode(response.body);
      setState(() {
        _events = fetchedEvents.map((event) {
          DateTime dateTime =
              DateTime.parse(event['datetime']); // Convert string to DateTime
          return {
            '_id': event['_id'],
            'title': event['title'],
            'description':
                event['description'] ?? '', // Handle description if it's null
            'time': TimeOfDay.fromDateTime(
                dateTime), // Create TimeOfDay from DateTime
            'date': dateTime, // Keep the DateTime for filtering
            'type': event['type'], // Include event type
          };
        }).toList();
      });
      _filterEvents(); // Filter events after fetching
    } else {
      // Handle error response
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Failed to load events: ${response.reasonPhrase}'),
      ));
    }
  }

  // Phương thức xác nhận đăng xuất
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
                Text('Bạn có chắc chắn muốn đăng xuất không?'),
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

  // Phương thức thêm sự kiện
  Future<void> _addEvent(BuildContext context) async {
    TextEditingController titleController = TextEditingController();
    TextEditingController descriptionController = TextEditingController();
    TimeOfDay? selectedTime;

    return showDialog<void>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Thêm sự kiện'),
          content: StatefulBuilder(
            builder: (BuildContext context, StateSetter setState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  TextField(
                    controller: titleController,
                    decoration: InputDecoration(labelText: 'Tiêu đề sự kiện'),
                  ),
                  TextField(
                    controller: descriptionController,
                    decoration: InputDecoration(labelText: 'Mô tả'),
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(selectedTime != null
                          ? 'Thời gian: ${selectedTime!.format(context)}'
                          : 'Chọn thời gian'),
                      IconButton(
                        icon: Icon(Icons.access_time),
                        onPressed: () async {
                          final TimeOfDay? time = await showTimePicker(
                            context: context,
                            initialTime: TimeOfDay.now(),
                          );
                          if (time != null) {
                            setState(() {
                              selectedTime = time; // Cập nhật thời gian đã chọn
                            });
                          }
                        },
                      ),
                    ],
                  ),
                ],
              );
            },
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Hủy'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Thêm'),
              onPressed: () async {
                String title = titleController.text;
                String description = descriptionController.text;
                if (selectedTime != null && _selectedDay != null) {
                  // Create a DateTime object for the selected event time
                  DateTime eventDateTime = DateTime(
                    _selectedDay!.year,
                    _selectedDay!.month,
                    _selectedDay!.day,
                    selectedTime!.hour,
                    selectedTime!.minute,
                  );

                  // Call your API to add the event
                  final response = await http.post(
                    Uri.parse(
                        'http://${Ip.serverIP}:3000/api/schedule/events/add/${widget.email}'),
                    headers: {'Content-Type': 'application/json'},
                    body: json.encode({
                      'title': title,
                      'description': description,
                      'datetime': eventDateTime
                          .toIso8601String(), // Convert to ISO string
                    }),
                  );

                  if (response.statusCode == 201) {
                    // If the event was added successfully
                    setState(() {
                      _events.add({
                        'title': title,
                        'description': description,
                        'time': selectedTime!,
                        'date': _selectedDay, // Lưu trữ ngày của sự kiện
                      });
                      _filterEvents(); // Lọc sự kiện sau khi thêm mới
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Sự kiện "$title" đã được thêm!')),
                    );
                  } else {
                    // Handle API error response
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text(
                              'Không thể thêm sự kiện: ${response.reasonPhrase}')),
                    );
                  }
                }
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  // Phương thức hiển thị chi tiết sự kiện chỉ để xem
  void _showViewEventDialog(BuildContext context, Map<String, dynamic> event) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Chi tiết lịch hẹn'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment:
                CrossAxisAlignment.start, // Align text to the left
            children: [
              Text('Phòng khám: ${event['title']}'),
              Text('Mô tả: ${event['description']}'),
              Text('Thời gian hẹn: ${event['time'].format(context)}'),
              Text(
                  'Ngày hẹn: ${event['date'].toLocal().toString().split(' ')[0]}'), // Display date in a more readable format
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Đóng'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

// Phương thức hiển thị chi tiết sự kiện cho việc cập nhật và xóa
  void _showEditEventDialog(BuildContext context, Map<String, dynamic> event) {
    TextEditingController titleController =
        TextEditingController(text: event['title']);
    TextEditingController descriptionController =
        TextEditingController(text: event['description']);
    TimeOfDay selectedTime = event['time']; // Initialize with event time

    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Chi tiết sự kiện'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: titleController,
                decoration: InputDecoration(labelText: 'Tiêu đề'),
              ),
              TextField(
                controller: descriptionController,
                decoration: InputDecoration(labelText: 'Mô tả'),
                maxLines: 2,
              ),
              Text('Thời gian: ${selectedTime.format(context)}'),
              Text(
                  'Ngày: ${event['date'].toLocal().toString().split(' ')[0]}'), // Display date in a more readable format
              SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(selectedTime.format(context)), // Show selected time
                  IconButton(
                    icon: Icon(Icons.access_time),
                    onPressed: () async {
                      final TimeOfDay? time = await showTimePicker(
                        context: context,
                        initialTime: selectedTime,
                      );
                      if (time != null) {
                        setState(() {
                          selectedTime = time; // Update selected time
                        });
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Xóa'),
              onPressed: () {
                _deleteEvent(event); // Call delete function
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Cập nhật'),
              onPressed: () {
                // Include selectedTime in the update function
                _updateEvent(event, titleController.text,
                    descriptionController.text, selectedTime);
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Hủy'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  // Phương thức hiển thị chi tiết sự kiện
  void _showEventDetails(BuildContext context, Map<String, dynamic> event) {
    if (event['type'] == 'LH') {
      // Nếu loại sự kiện là 'LH', hiển thị dialog chỉ để xem
      _showViewEventDialog(context, event);
    } else {
      // Ngược lại, hiển thị dialog cho việc cập nhật và xóa
      _showEditEventDialog(context, event);
    }
  }

// Phương thức cập nhật sự kiện
  // Method to update the event
  Future<void> _updateEvent(Map<String, dynamic> event, String updatedTitle,
      String updatedDescription, TimeOfDay? updatedTime) async {
    final String email = widget.email!;
    final String scheduleId = event['_id']; // Assuming you have the schedule ID in the event map

    // Create a DateTime object for the updated event time
    DateTime updatedDateTime = DateTime(
      event['date'].year,
      event['date'].month,
      event['date'].day,
      updatedTime?.hour ?? event['time'].hour,
      updatedTime?.minute ?? event['time'].minute,
    );

    final response = await http.put(
      Uri.parse(
          'http://${Ip.serverIP}:3000/api/schedule/events/update/$email/$scheduleId'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode({
        'title': updatedTitle,
        'description': updatedDescription,
        'datetime': updatedDateTime
            .toIso8601String(), // Ensure to format the date properly
      }),
    );

    if (response.statusCode == 200) {
      // Update the local event list
      setState(() {
        event['title'] = updatedTitle;
        event['description'] = updatedDescription;
        event['date'] = updatedDateTime; // Update the date with the new time
        event['time'] =
            TimeOfDay.fromDateTime(updatedDateTime); // Update the time as well
      });

      // Show confirmation message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sự kiện đã được cập nhật!')),
      );
    } else {
      // Handle error response
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Failed to update event: ${response.reasonPhrase}')),
      );
    }
  }

// Phương thức xóa sự kiện
  // Delete event method
  Future<void> _deleteEvent(Map<String, dynamic> event) async {
    final String email = widget.email!;
    final String scheduleId =
        event['_id']; // Assuming you have the schedule ID in the event map

    final response = await http.delete(
      Uri.parse(
          'http://${Ip.serverIP}:3000/api/schedule/events/delete/$email/$scheduleId'),
    );

    if (response.statusCode == 200) {
      setState(() {
        _events.remove(event); // Remove the event from the list
      });

      // Show confirmation message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sự kiện đã được xóa!')),
      );
    } else {
      // Handle error response
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text('Failed to delete event: ${response.reasonPhrase}')),
      );
    }
  }

  // Phương thức lọc sự kiện theo ngày đã chọn
  void _filterEvents() {
    _filteredEvents = _events.where((event) {
      return isSameDay(event['date'], _selectedDay);
    }).toList();
  }

  // Phương thức kiểm tra xem ngày có sự kiện không
  bool _hasEvent(DateTime day) {
    return _events.any((event) => isSameDay(event['date'], day));
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
              Icons.exit_to_app,
              color: Colors.white,
            ),
            onPressed: () {
              _showLogoutConfirmationDialog(context);
            },
          ),
        ],
        title: Text(
          'LỊCH BIỂU',
          style: TextStyle(color: Colors.white),
        ),
      ),
      drawer: CustomDrawer(
        userName: widget.userName,
        email: widget.email,
        imageURLs: widget.imageURLs,
      ),
      body: Column(
        children: [
          TableCalendar(
            firstDay: DateTime.utc(2020, 1, 1),
            lastDay: DateTime.utc(2030, 12, 31),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            onDaySelected: (selectedDay, focusedDay) {
              if (!isSameDay(_selectedDay, selectedDay)) {
                setState(() {
                  _selectedDay = selectedDay;
                  _focusedDay = focusedDay;
                  _filterEvents(); // Lọc sự kiện khi ngày được chọn
                });
              }
            },
            calendarFormat: _calendarFormat,
            onFormatChanged: (format) {
              setState(() {
                _calendarFormat = format;
              });
            },
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            calendarBuilders: CalendarBuilders(
              defaultBuilder: (context, day, focusedDay) {
                final hasEvent = _hasEvent(day);
                final isSelected = isSameDay(day, _selectedDay);
                return Container(
                  decoration: BoxDecoration(
                    color: hasEvent ? AppPallete.errorColor : null,
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Center(
                    child: Text(
                      '${day.day}',
                      style: TextStyle(
                        color: isSelected ? Colors.white : null,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          const Text(
            'Nội dung sự kiện',
            style: TextStyle(
                fontSize: 18, color: Colors.green, fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _filteredEvents.length,
              itemBuilder: (context, index) {
                final event = _filteredEvents[index];
                return InkWell(
                  // Use InkWell to make the ListTile tappable
                  onTap: () {
                    _showEventDetails(
                        context, event); // Call the event details dialog
                  },
                  child: ListTile(
                    title: Text('Tiêu đề: ' + event['title']),
                    subtitle: Text(
                      'Mô tả: ${event['description']}\nGiờ: ${event['time'].format(context)}',
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _addEvent(context);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
