import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:country_picker/country_picker.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/account/info_page.dart';
import 'package:flutter_petcare_app/features/auth/presentation/pages/phoneAuth/otp_screen_register.dart';

class PhoneRegister extends StatefulWidget {
  const PhoneRegister({Key? key}) : super(key: key);

  @override
  State<PhoneRegister> createState() => _PhoneRegisterState();
}

class _PhoneRegisterState extends State<PhoneRegister> {
  TextEditingController phoneController = TextEditingController();
  bool isLoading = false;
  Country selectedCountry = Country(
    phoneCode: "84",
    countryCode: "VN",
    e164Sc: 0,
    geographic: true,
    level: 1,
    name: "Vietnam",
    example: "0123456789",
    displayName: "Vietnam (+84)",
    displayNameNoCountryCode: "Vietnam",
    e164Key: "VN",
  );

  @override
  Widget build(BuildContext context) {
    phoneController.selection = TextSelection.fromPosition(
        TextPosition(offset: phoneController.text.length));
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 10),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(backgroundColor: Colors.green),
        onPressed: () {
          myDialogBox(context);
        },
        child: Row(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10),
              child: Image.asset(
                "assets/Image/phone-call.png",
                height: 35,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 10),
            const Text(
              "Đăng ký bằng số điện thoại",
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
                color: Colors.white,
              ),
            )
          ],
        ),
      ),
    );
  }

  void myDialogBox(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Dialog(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: Colors.white,
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const SizedBox(),
                        const Text(
                          "Đăng ký số điện thoại",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                            color: Colors.green,
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            Navigator.pop(context);
                          },
                          icon: const Icon(Icons.close),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: phoneController,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                      onChanged: (value) {
                        setState(
                          () {
                            phoneController.text = value;
                          },
                        );
                      },
                      keyboardType: TextInputType.phone,
                      cursorColor: Colors.purple,
                      decoration: InputDecoration(
                        hintText: "Nhập số điện thoại",
                        hintStyle: TextStyle(
                          fontWeight: FontWeight.w500,
                          fontSize: 15,
                          color: Colors.grey.shade600,
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: Colors.black),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                          borderSide: const BorderSide(color: Colors.black),
                        ),
                        prefixIcon: Container(
                          padding: const EdgeInsets.all(10),
                          child: InkWell(
                            onTap: () {
                              showCountryPicker(
                                context: context,
                                countryListTheme: const CountryListThemeData(
                                  bottomSheetHeight: 550,
                                ),
                                onSelect: (value) {
                                  setState(() {
                                    selectedCountry = value;
                                  });
                                },
                              );
                            },
                            child: Text(
                              "${selectedCountry.flagEmoji} + ${selectedCountry.phoneCode}",
                              style: const TextStyle(
                                fontSize: 18,
                                color: Colors.black,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                        suffixIcon: phoneController.text.length > 9
                            ? Container(
                                height: 30,
                                width: 30,
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Colors.green,
                                ),
                                child: const Icon(
                                  Icons.done,
                                  color: Colors.white,
                                  size: 20,
                                ),
                              )
                            : null,
                      ),
                    ),
                    const SizedBox(height: 20),
                    isLoading
                        ? const CircularProgressIndicator()
                        : ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                            ),
                            onPressed: () async {
                              setState(() {
                                isLoading = true;
                              });
                              await FirebaseAuth.instance.verifyPhoneNumber(
                                phoneNumber:
                                    "+${selectedCountry.phoneCode}${phoneController.text}",
                                verificationCompleted:
                                    (phoneAuthCredential) async {
                                  await FirebaseAuth.instance
                                      .signInWithCredential(
                                          phoneAuthCredential);
                                },
                                verificationFailed: (error) {
                                  print(error);
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(
                                    content: Text(
                                        "Verification failed. Please try again."),
                                  ));
                                  setState(() {
                                    isLoading = false;
                                  });
                                },
                                codeSent:
                                    (verificationId, forceResendingToken) {
                                  setState(() {
                                    isLoading = false;
                                  });
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => OTPScreenRegister(
                                        verificationId: verificationId,
                                        phone: phoneController.text,
                                      ),
                                    ),
                                  );
                                },
                                codeAutoRetrievalTimeout: (verificationId) {
                                  ScaffoldMessenger.of(context)
                                      .showSnackBar(SnackBar(
                                    content: Text(
                                        "Code auto-retrieval timed out. Please try again."),
                                  ));
                                },
                              );
                            },
                            child: const Text(
                              "Send Code",
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Colors.white,
                              ),
                            ),
                          ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
