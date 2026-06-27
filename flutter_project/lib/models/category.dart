class Category {
  final String id;
  final String name;
  final String imageUrl;
  final String iconName;

  Category({
    required this.id,
    required this.name,
    required this.imageUrl,
    this.iconName = "",
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'imageUrl': imageUrl,
      'iconName': iconName,
    };
  }
}
