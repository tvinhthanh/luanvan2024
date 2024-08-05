import 'package:flutter/material.dart';
import 'insurance_page.dart';

class HealthPage extends StatefulWidget {
  @override
  _HealthPageState createState() => _HealthPageState();
}

class _HealthPageState extends State<HealthPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Health'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          DropdownButton<String>(
            value: 'Max',
            icon: CircleAvatar(
              backgroundImage: AssetImage('assets/Image/Akita.png'),
            ),
            items: <String>['Max', 'Other Pet'].map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onChanged: (_) {},
          ),
        ],
      ),
      body: Column(
        children: [
          _buildTabs(context),
          _buildHealthOptions(context),
        ],
      ),
    );
  }

  Widget _buildTabs(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        TextButton(
          onPressed: () {
            Navigator.pop(context);
          },
          child: Text('About'),
        ),
        TextButton(
          onPressed: () {},
          child: Text('Health'),
        ),
        TextButton(
          onPressed: () {},
          child: Text('Nutrition'),
        ),
      ],
    );
  }

  Widget _buildHealthOptions(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: Icon(Icons.security),
          title: Text('Insurance'),
          trailing: Icon(Icons.add),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => InsurancePage()),
            );
          },
        ),
        ListTile(
          leading: Icon(Icons.vaccines),
          title: Text('Vaccines'),
          trailing: Icon(Icons.add),
          onTap: () {
            // Navigate to Vaccines Page
          },
        ),
        ListTile(
          leading: Icon(Icons.bug_report),
          title: Text('Anti-parasitical treatments'),
          trailing: Icon(Icons.add),
          onTap: () {
            // Navigate to Anti-parasitical treatments Page
          },
        ),
        ListTile(
          leading: Icon(Icons.medical_services),
          title: Text('Medical interventions'),
          trailing: Icon(Icons.add),
          onTap: () {
            // Navigate to Medical interventions Page
          },
        ),
        ListTile(
          leading: Icon(Icons.healing),
          title: Text('Other treatments'),
          trailing: Icon(Icons.add),
          onTap: () {
            // Navigate to Other treatments Page
          },
        ),
      ],
    );
  }
}
