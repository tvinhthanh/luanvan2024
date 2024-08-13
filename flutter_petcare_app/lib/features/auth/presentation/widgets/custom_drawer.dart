import 'package:flutter/material.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/infoAccount_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/calendar/calendar_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/contact/contact_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/home_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/pet/chooseBreedType_page.dart';

class CustomDrawer extends StatelessWidget {
  final String? userName;
  final String? email;
  final String? imageURLs;
  
  const CustomDrawer({super.key, this.userName, this.email, this.imageURLs});

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
                        backgroundImage: imageURLs != null 
                            ? NetworkImage(imageURLs!)
                            : AssetImage("assets/Image/Icon_User.png") 
                                as ImageProvider,
                      ),
                      SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Xin chào',
                            style: TextStyle(fontSize: 16, color: Colors.white),
                          ),
                          Text(
                            userName ?? 'User',
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
              'Thêm thú cưng',
              style: TextStyle(color: Colors.white),
            ),
          ),
          InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ChooseBreedTypePage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs
                  ),
                ),
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
                    border: Border.all(width: 1, color: Colors.grey),
                  ),
                  child: Icon(Icons.add, color: Colors.grey),
                ),
                SizedBox(height: 5),
                Text(
                  'thêm mới',
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
              'Trang chủ',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => HomePage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs,
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.contact_phone, color: Colors.white),
            title: Text(
              'Liên hệ',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => ContactPage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs,
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.calendar_month_outlined, color: Colors.white),
            title: Text(
              'Lịch biểu',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => CalendarPage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs
                  ),
                ),
              );
            },
          ),
          Divider(color: const Color.fromARGB(69, 255, 255, 255)),
          ListTile(
            leading: Icon(Icons.account_circle_outlined, color: Colors.white),
            title: Text(
              'Tài khoản',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => AccountPage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs,
                  ),
                ),
              );
            },
          ),
          ListTile(
            leading: Icon(Icons.settings, color: Colors.white),
            title: Text(
              'Cài đặt',
              style: TextStyle(color: Colors.white),
            ),
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => HomePage(
                    userName: userName,
                    email: email,
                    imageURLs: imageURLs
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
