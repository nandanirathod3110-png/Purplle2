class Brand {
  final String id;
  final String name;
  final String logoUrl;
  final String description;
  final bool isPopular;

  Brand({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.description,
    this.isPopular = false,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'logoUrl': logoUrl,
      'description': description,
      'isPopular': isPopular ? 1 : 0,
    };
  }
}
