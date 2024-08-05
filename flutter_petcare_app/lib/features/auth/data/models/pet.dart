

class Pet {
  final String id;
  final String name;
  final String age;
  final String weigh;
  final String breedId;
  final String ownerId;
  final String sex;
  final String breedType;
  final String img;

  Pet({
    required this.id,
    required this.name,
    required this.age,
    required this.weigh,
    required this.breedId,
    required this.ownerId,
    required this.sex,
    required this.breedType,
    required this.img,
  });

  factory Pet.fromJson(Map<String, dynamic> json) {
    return Pet(
      id: json['_id'],
      name: json['name'],
      age: json['age'],
      weigh: json['weigh'],
      breedId: json['breed_id'],
      ownerId: json['owner_id'],
      sex: json['sex'],
      breedType: json['breed_type'],
      img: json['img'],
    );
  }
}