import 'dart:convert';
import 'package:flutter_petcare_app/main.dart';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarPage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  const CalendarPage({Key? key, this.userName, this.email, this.imageURLs}) : super(key: key);

  @override
  State<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends State<CalendarPage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;
  late final ValueNotifier<List<Event>> _selectedEvents;

  final Map<DateTime, List<Event>> _events = {};

  @override
  void initState() {
    super.initState();
    _selectedDay = _focusedDay;
    _selectedEvents = ValueNotifier(_getEventsForDay(_selectedDay!));
    _fetchAppointments(); // Fetch appointments on initialization
  }

  @override
  void dispose() {
    _selectedEvents.dispose();
    super.dispose();
  }

  Future<String> _getUserIdFromEmail(String email) async {
    final String url =
        'http://${Ip.serverIP}:3000/api/usersApp/userInfo/userId/$email'; // Create an endpoint in your backend to fetch user by email

    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['_id']; // Adjust according to the structure of the response
      } else {
        throw Exception('Failed to load user: ${response.reasonPhrase}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error fetching user ID: $e')));
      return ''; // Return an empty string or handle it as you wish
    }
  }

  Future<void> _fetchAppointments() async {
    if (widget.email == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Email is null')),
      );
      return; // Exit early if email is null
    }

    final String email = widget.email!;
    String userId = await _getUserIdFromEmail(email);
    if (userId.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('UserId is null')),
      );
      return;
    }

    try {
      final response = await http.get(Uri.parse(
          'http://${Ip.serverIP}:3000/api/schedule/appointments/calendar/$email'));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        for (var appointment in data) {
          String title = appointment['vetId']['name'];
          DateTime eventDate = DateTime.parse(appointment['date']).toLocal();
          String time = TimeOfDay.fromDateTime(eventDate).format(context);
          String description = appointment['note'] ?? '';
          String bookingId = appointment['_id']; // Extract booking_id
          String type = 'LH'; // Extract type

          DateTime normalizedDate = _normalizeDate(eventDate);

          // Check if the event already exists in _events based on booking_id
          bool eventExists = _events[normalizedDate]?.any((event) =>
                  event.type == type &&
                  event.title == title &&
                  event.description == description &&
                  appointment['_id'] == bookingId) ??
              false;

          if (!eventExists) {
            // Add event to the _events map
            _events.putIfAbsent(normalizedDate, () => []).add(
                  Event(title, time, description, type),
                );

            // Save the appointment to the backend
            await _saveAppointmentToBackend(userId, bookingId, title,
                description, eventDate, type); // Pass userId here
          } else {
            // Nếu sự kiện đã tồn tại, bạn có thể thêm một thông báo hoặc xử lý khác ở đây
            print('Event with booking_id $bookingId already exists.');
          }
        }
        // Update the selected events after fetching
        _selectedEvents.value = _getEventsForDay(_selectedDay!);
      } else {
        throw Exception(
            'Failed to load appointments: ${response.reasonPhrase}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  Future<void> _saveAppointmentToBackend(String userId, String bookingId,
      String title, String description, DateTime eventDate, String type) async {
    final String url =
        'http://${Ip.serverIP}:3000/api/schedule/addEvent'; // Replace with your actual endpoint
    final body = json.encode({
      'owner_id': userId,
      'booking_id': bookingId,
      'title': title,
      'description': description,
      'datetime': eventDate.toIso8601String(),
      'type': type,
    });

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      );

      if (response.statusCode != 201) {
        throw Exception('Failed to save appointment: ${response.reasonPhrase}');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error saving appointment: $e')));
    }
  }

  List<Event> _getEventsForDay(DateTime day) {
    return _events[_normalizeDate(day)] ?? [];
  }

  DateTime _normalizeDate(DateTime date) {
    return DateTime.utc(date.year, date.month, date.day);
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

  Future<void> _showAddEventDialog(BuildContext context) async {
    String title = '';
    String time = '';
    String description = '';

    TextEditingController timeController = TextEditingController();

    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Thêm sự kiện'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              TextField(
                decoration: InputDecoration(labelText: 'Tiêu đề: '),
                onChanged: (value) {
                  title = value;
                },
              ),
              TextField(
                readOnly: true,
                decoration: InputDecoration(labelText: 'Chọn thời gian: '),
                controller: timeController,
                onTap: () async {
                  TimeOfDay? pickedTime = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.now(),
                  );
                  if (pickedTime != null) {
                    time = pickedTime.format(context);
                    timeController.text = time;
                  }
                },
              ),
              TextField(
                decoration: InputDecoration(labelText: 'Mô tả:'),
                onChanged: (value) {
                  description = value;
                },
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Confirm'),
              onPressed: () {
                setState(() {
                  final normalizedDate = _normalizeDate(_selectedDay!);
                  _events.putIfAbsent(normalizedDate, () => []).add(
                      Event(title, time, description, '')); // Set default type
                  _selectedEvents.value = _getEventsForDay(_selectedDay!);
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _showEditDeleteDialog(BuildContext context, Event event,
      {required DateTime normalizedDate, required int eventIndex}) async {
    if (event.type == 'LH') {
      // If the type is 'LH', show only event details
      return showDialog<void>(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text('Chi tiết lịch hẹn'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment:
                  CrossAxisAlignment.start, // Align content to the start (left)
              children: <Widget>[
                Text('Phòng khám: ${event.title}'),
                Text('Thời gian: ${event.time}'),
                Text('Mô tả: ${event.description}'),
              ],
            ),
            actions: <Widget>[
              TextButton(
                child: Text('Close'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
            ],
          );
        },
      );
    }
    // For other types, show edit/delete options
    String newTitle = event.title;
    String newTime = event.time;
    String newDescription = event.description;

    TextEditingController timeController = TextEditingController(text: newTime);

    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Thông tin sự kiện'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              TextField(
                decoration: InputDecoration(labelText: 'Tiêu đề:'),
                controller: TextEditingController(text: newTitle),
                onChanged: (value) {
                  newTitle = value;
                },
              ),
              TextField(
                readOnly: true,
                decoration: InputDecoration(labelText: 'Thời gian:'),
                controller: timeController,
                onTap: () async {
                  TimeOfDay? pickedTime = await showTimePicker(
                    context: context,
                    initialTime: TimeOfDay.now(),
                  );
                  if (pickedTime != null) {
                    newTime = pickedTime.format(context);
                    timeController.text = newTime;
                  }
                },
              ),
              TextField(
                decoration: InputDecoration(labelText: 'Mô tả:'),
                controller: TextEditingController(text: newDescription),
                onChanged: (value) {
                  newDescription = value;
                },
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              child: Text('Xóa sự kiện'),
              onPressed: () {
                setState(() {
                  _events[normalizedDate]!.removeAt(eventIndex);
                  _selectedEvents.value = _getEventsForDay(_selectedDay!);
                });
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Cập nhật'),
              onPressed: () {
                setState(() {
                  _events[normalizedDate]![eventIndex] =
                      Event(newTitle, newTime, newDescription, event.type);
                  _selectedEvents.value = _getEventsForDay(_selectedDay!);
                });
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
        imageURLs: widget.imageURLs
      ),
      body: Column(
        children: [
          TableCalendar<Event>(
            firstDay: DateTime.now().subtract(Duration(days: 365)),
            lastDay: DateTime.now().add(Duration(days: 365)),
            focusedDay: _focusedDay,
            selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
            onDaySelected: (selectedDay, focusedDay) {
              if (!isSameDay(_selectedDay, selectedDay)) {
                setState(() {
                  _selectedDay = selectedDay;
                  _focusedDay = focusedDay;
                  _selectedEvents.value = _getEventsForDay(selectedDay);
                });
              }
            },
            eventLoader: _getEventsForDay,
            onFormatChanged: (format) {},
            onPageChanged: (focusedDay) {
              _focusedDay = focusedDay;
            },
            // Customizing the calendar builders
            calendarBuilders: CalendarBuilders(
              // Customize the day builder
              todayBuilder: (context, day, focusedDay) {
                return Container(
                  margin: const EdgeInsets.all(4.0),
                  decoration: BoxDecoration(
                    color: Colors.blueAccent, // Color for today
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Center(
                    child: Text(
                      '${day.day}',
                      style: TextStyle(color: Colors.white),
                    ),
                  ),
                );
              },
              // Custom builder for days with events
              markerBuilder: (context, day, events) {
                if (events.isNotEmpty) {
                  return Container(
                    margin: const EdgeInsets.all(4.0),
                    decoration: BoxDecoration(
                      color: Colors.red, // Change the color here
                      shape: BoxShape.circle,
                    ),
                    width: 8.0,
                    height: 8.0,
                  );
                }
                return SizedBox(); // Return an empty widget for days without events
              },
            ),
          ),
          const SizedBox(height: 8.0),
          ValueListenableBuilder<List<Event>>(
            valueListenable: _selectedEvents,
            builder: (context, value, _) {
              return Expanded(
                child: ListView.builder(
                  itemCount: value.length,
                  itemBuilder: (context, index) {
                    final event = value[index];
                    return ListTile(
                      title: Text("Tiêu đề: " + event.title),
                      subtitle: Text("Thời gian: " +
                          event.time +
                          "\nMô tả: " +
                          event.description),
                      onTap: () {
                        final normalizedDate = _normalizeDate(_selectedDay!);
                        final eventIndex =
                            _events[normalizedDate]!.indexOf(event);
                        _showEditDeleteDialog(context, event,
                            normalizedDate: normalizedDate,
                            eventIndex: eventIndex);
                      },
                    );
                  },
                ),
              );
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          _showAddEventDialog(context);
        },
        child: Icon(Icons.add),
      ),
    );
  }
}

class Event {
  final String title;
  final String time;
  final String description;
  final String type;

  Event(this.title, this.time, this.description, this.type);
}
