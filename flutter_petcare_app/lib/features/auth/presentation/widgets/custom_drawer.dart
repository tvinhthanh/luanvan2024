import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/infoAccount_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/calendar/calendar_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/contact/contact_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/pet/chooseBreedType_page.dart';

class CustomDrawer extends StatelessWidget {
  final String? userName;
  final String? email;
  const CustomDrawer({super.key, this.userName, this.email});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.black,
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          Container(
            height: 150,
            child: DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.black,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 25,
                        backgroundImage: AssetImage("assets/Image/Icon_User.png"),
                      ),
                      SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Hello',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                          Text(
                            '${userName}',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                        ],
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
          ListTile(
            title: Text(
              'Your Pets',
              style: TextStyle(color: Colors.white),
            ),
          ),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => ChooseBreedTypePage(userName: userName, email: email,)),
              );
            },
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.black,
                      border: Border(
                        bottom: BorderSide(width: 1, color: Colors.grey),
                        top: BorderSide(width: 1, color: Colors.grey),
                        left: BorderSide(width: 1, color: Colors.grey),
                        right: BorderSide(width: 1, color: Colors.grey),
                      )),
                  child: Icon(Icons.add, color: Colors.grey),
                ),
                SizedBox(height: 5),
                Text(
                  'add new',
                  style: TextStyle(color: Colors.grey),
                ),
                SizedBox(height: 10),
              ],
            ),
          ),
          Divider(color: const Color.fromARGB(69, 255, 255, 255)),
          ListTile(
            leading: Icon(Icons.dashboard, color: Colors.white),
            title: Text(
              'Dashboard',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => HomePage(userName: userName, email: email,)),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.contact_phone, color: Colors.white),
            title: Text(
              'Contacts',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => ContactPage(userName: userName, email: email,)),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.calendar_month_outlined, color: Colors.white),
            title: Text(
              'Calendar',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => CalendarPage(userName: userName, email: email)),
              );
            },
          ),
          Divider(color: const Color.fromARGB(69, 255, 255, 255)),
          ListTile(
            leading: Icon(Icons.account_circle_outlined, color: Colors.white),
            title: Text(
              'Account',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => AccountPage(userName: userName, email: email)),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.settings, color: Colors.white),
            title: Text(
              'Settings',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => HomePage(userName: userName, email: email)),
              );
            },
          ),
        ],
      ),
    );
  }
}
