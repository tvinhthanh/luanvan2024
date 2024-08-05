import 'package:flutter/material.dart';

class CustomAppBar extends StatelessWidget {
  final GlobalKey<ScaffoldState> scaffoldKey;
  final Function(BuildContext) onLogout;

  const CustomAppBar({
    Key? key,
    required this.scaffoldKey,
    required this.onLogout,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: const Color(0xFF2A3240),
      leading: IconButton(
        icon: const Icon(Icons.menu),
        color: Colors.white,
        onPressed: () {
          scaffoldKey.currentState?.openDrawer();
        },
      ),
      actions: [
        IconButton(
          icon: Icon(
            Icons.exit_to_app_outlined,
            color: Colors.white,
          ),
          onPressed: () {
            onLogout(context);
          },
        ),
      ],
    );
  }
}
