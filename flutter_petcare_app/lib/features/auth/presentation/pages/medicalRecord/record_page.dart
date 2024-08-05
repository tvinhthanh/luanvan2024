import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/core/theme/app_pallete.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/loginSignup/login_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/widgets/custom_drawer.dart';
import 'package:flutter_petcare_app/main.dart';
import 'health_page.dart';
import 'insurance_page.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PetProfilePage extends StatefulWidget {
  final String? userName;
  final String? email;
  final String vetID;
  final String vetName;
  final String petId;
  final String petName;
  final String petBreed;
  final String petAge;
  final String petGender;
  final String petWeight;
  final String petImage;

  const PetProfilePage({
    Key? key,
    required this.userName,
    required this.email,
    required this.petId,
    required this.vetID,
    required this.vetName,
    required this.petName,
    required this.petBreed,
    required this.petAge,
    required this.petGender,
    required this.petWeight,
    required this.petImage,
  }) : super(key: key);

  @override
  _PetProfilePageState createState() => _PetProfilePageState();
}

class _PetProfilePageState extends State<PetProfilePage> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  late String selectedVet;
  int selectedIndex = 0;
  List<Map<String, dynamic>> pets = [];
  Map<String, dynamic> selectedPet = {};
  List<Map<String, dynamic>> medicalInterventions = [];
  List<Map<String, dynamic>> appointments = []; // Danh sách lịch hẹn
  bool showMedicalInterventions = false; // Biến trạng thái

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

  Future<void> fetchMedicalInterventions() async {
    final url = Uri.parse(
        'http://${Ip.serverIP}:3000/api/medic/show/${widget.petId}/${widget.vetID}');

    print('Fetching medical interventions from: $url'); // In ra URL để kiểm tra

    try {
      final response = await http.get(url);
      print(
          'Response status: ${response.statusCode}'); // In ra mã trạng thái của phản hồi

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        print(
            'Fetched medical interventions: $data'); // In ra dữ liệu đã lấy được
        setState(() {
          medicalInterventions = List<Map<String, dynamic>>.from(data);
          showMedicalInterventions =
              true; // Đặt trạng thái để hiển thị thông tin
        });
      } else {
        print(
            'Failed to load medical interventions: ${response.reasonPhrase}'); // In ra lý do thất bại
      }
    } catch (e) {
      print('Error: $e'); // In ra lỗi nếu có
    }
  }

  Future<void> fetchAppointments() async {
    final url = Uri.parse(
        'http://${Ip.serverIP}:3000/api/my-bookings/appointments/${widget.petId}/${widget.vetID}');

    print('Fetching appointments from: $url'); // In ra URL để kiểm tra

    try {
      final response = await http.get(url);
      print(
          'Response status: ${response.statusCode}'); // In ra mã trạng thái của phản hồi

      if (response.statusCode == 200) {
        List<dynamic> data = json.decode(response.body);
        print('Fetched appointments: $data'); // In ra dữ liệu đã lấy được
        setState(() {
          appointments = List<Map<String, dynamic>>.from(data);
        });
      } else {
        print(
            'Failed to load appointments: ${response.reasonPhrase}'); // In ra lý do thất bại
      }
    } catch (e) {
      print('Error: $e'); // In ra lỗi nếu có
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
              onPressed: () {
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
  void initState() {
    super.initState();
    selectedVet = widget.petName;
    print(widget.vetID);
    print(widget.vetName);
    fetchMedicalInterventions();
    fetchAppointments(); // Gọi hàm để lấy danh sách lịch hẹn
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Center(
            child: Text(
          '${widget.vetName}',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
            color: Colors.amber,
          ),
        )),
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
        child: Column(
          children: [
            _buildProfileHeader(),
            SizedBox(height: 16),
            _buildTabs(),
            SizedBox(height: 16),
            Expanded(
              child: IndexedStack(
                index: selectedIndex,
                children: [
                  _buildPetDetails(),
                  _buildHealthOptions(context),
                  _buildAppointmentHistory(), // Hiển thị lịch hẹn ở đây
                ],
              ),
            ),
          ],
        ),
      ),
      drawer: CustomDrawer(userName: widget.userName, email: widget.email),
    );
  }

  Widget _buildProfileHeader() {
    return Column(
      children: [
        CircleAvatar(
          radius: 60,
          backgroundImage: AssetImage('assets/Image/${widget.petImage}'),
        ),
        SizedBox(height: 8),
        Text(
          widget.petName,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 4),
        Text(
          '${widget.petBreed}',
          style: TextStyle(
            fontSize: 18,
            color: Colors.grey[700],
          ),
        ),
      ],
    );
  }

  Widget _buildTabs() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildTabButton('About', 0),
        _buildTabButton('Health', 1),
        _buildTabButton('History', 2),
      ],
    );
  }

  Widget _buildTabButton(String title, int index) {
    return TextButton(
      onPressed: () {
        setState(() {
          selectedIndex = index;
        });
      },
      child: Text(
        title,
        style: TextStyle(
          color: selectedIndex == index ? AppPallete.button : Colors.grey[600],
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildPetDetails() {
    return ListView(
      children: [
        Divider(),
        _buildDetailRow('Gender', widget.petGender),
        _buildDetailRow('Weight', '${widget.petWeight} kg'),
        Divider(),
        Text(
          'Important Dates',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        SizedBox(height: 8),
        _buildDateRow(Icons.cake, 'Birthday', '3 November 2019',
            '${widget.petAge} years old'),
        _buildDateRow(Icons.home, 'Adoption Day', '6 January 2020'),
      ],
    );
  }

  Widget _buildDetailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          Text(value, style: TextStyle(fontSize: 16)),
        ],
      ),
    );
  }

  Widget _buildDateRow(IconData icon, String title, String date,
      [String? additionalInfo]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 24),
          SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              Text(date, style: TextStyle(fontSize: 16)),
              if (additionalInfo != null)
                Text(additionalInfo,
                    style: TextStyle(fontSize: 16, color: Colors.grey[700])),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildHealthOptions(BuildContext context) {
    return ListView(
      children: [
        _buildHealthOption(
            Icons.security, 'Insurance', 'Insurance details here...'),
        _buildHealthOption(
            Icons.vaccines, 'Vaccines', 'Vaccination details here...'),
        _buildHealthOption(
            Icons.bug_report,
            'Anti-parasitical treatments',
            showMedicalInterventions
                ? _buildMedicalInterventions()
                : _buildLoadButton()),
        _buildHealthOption(
            Icons.medical_services,
            'Medical interventions',
            showMedicalInterventions
                ? _buildMedicalInterventions()
                : _buildLoadButton()),
        _buildHealthOption(
            Icons.healing,
            'Treatment Plan',
            showMedicalInterventions
                ? _buildTreatmentPlan()
                : _buildLoadButton()),
      ],
    );
  }

  Widget _buildLoadButton() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: GestureDetector(
        onTap: () async {
          await fetchMedicalInterventions(); // Gọi hàm để lấy dữ liệu
        },
        child: Text(
          'Tap to load medical interventions',
          style: TextStyle(color: Colors.blue),
        ),
      ),
    );
  }

  Widget _buildHealthOption(IconData icon, String title, dynamic content) {
    return ExpansionTile(
      leading: Icon(icon),
      title: Text(title),
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: content is Widget
              ? content // Nếu nội dung là widget, hiển thị trực tiếp
              : Text(content.toString()), // Hiển thị văn bản khác
        ),
      ],
    );
  }

  Widget _buildAppointmentHistory() {
    if (appointments.isEmpty) {
      return Center(child: Text('No appointments found.'));
    }
    return ListView(
      children: appointments.map((appointment) {
        // Định dạng lại ngày tháng và giờ
        final appointmentDateTime = DateTime.parse(appointment['date']);
        final formattedAppointmentDateTime =
            '${appointmentDateTime.day}/${appointmentDateTime.month}/${appointmentDateTime.year} ${appointmentDateTime.hour}:${appointmentDateTime.minute.toString().padLeft(2, '0')}';

        // Xử lý status
        String statusText;
        switch (appointment['status']) {
          case 1:
            statusText = 'Pending';
            break;
          case 0:
            statusText = 'Canceled';
            break;
          case 2:
            statusText = 'Confirmed';
            break;
          case 3:
            statusText = 'Complete';
            break;
          default:
            statusText = 'Unknown';
        }

        return Card(
          child: ListTile(
            title: Text('Appointment on $formattedAppointmentDateTime'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Owner Phone: ${appointment['phoneOwner']}'),
                Text('Status: $statusText'),
                if (appointment['note'] != null)
                  Text('Note: ${appointment['note']}'),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMedicalInterventions() {
    if (medicalInterventions.isEmpty) {
      return Center(child: Text('No medical interventions found.'));
    }
    return Column(
      children: medicalInterventions.map((intervention) {
        // Định dạng lại ngày tháng và giờ
        final visitDateTime = DateTime.parse(intervention['visitDate']);
        final formattedVisitDateTime =
            '${visitDateTime.day}/${visitDateTime.month}/${visitDateTime.year} ${visitDateTime.hour}:${visitDateTime.minute.toString().padLeft(2, '0')}';

        return Card(
          child: ListTile(
            title: Text(intervention['reasonForVisit']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Date: $formattedVisitDateTime'),
                Text('Symptoms: ${intervention['symptoms']}'),
                Text('Diagnosis: ${intervention['diagnosis']}'),
                Text('Treatment Plan: ${intervention['treatmentPlan']}'),
                Text('Medication: ${intervention['medications']}'),
                if (intervention['notes'] != null)
                  Text('Notes: ${intervention['notes']}'),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildTreatmentPlan() {
    if (medicalInterventions.isEmpty) {
      return Center(child: Text('No medical interventions found.'));
    }
    return Column(
      children: medicalInterventions.map((intervention) {
        final visitDateTime = DateTime.parse(intervention['visitDate']);
        final formattedVisitDateTime =
            '${visitDateTime.day}/${visitDateTime.month}/${visitDateTime.year} ${visitDateTime.hour}:${visitDateTime.minute.toString().padLeft(2, '0')}';

        return Card(
          child: ListTile(
            title: Text(intervention['reasonForVisit']),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Date: $formattedVisitDateTime'),
                Text('Treatment Plan: ${intervention['treatmentPlan']}'),
                if (intervention['notes'] != null)
                  Text('Notes: ${intervention['notes']}'),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
