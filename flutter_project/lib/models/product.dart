class Product {
  final String id;
  final String name;
  final String brand;
  final String description;
  final String imageUrl;
  final double originalPrice;
  final double discountPrice;
  final double rating;
  final int reviewCount;
  final String categoryId;
  final bool isBestSeller;
  final bool isTrending;
  final List<String> shades;

  Product({
    required this.id,
    required this.name,
    required this.brand,
    required this.description,
    required this.imageUrl,
    required this.originalPrice,
    required this.discountPrice,
    required this.rating,
    required this.reviewCount,
    required this.categoryId,
    this.isBestSeller = false,
    this.isTrending = false,
    this.shades = const [],
  });

  double get discountPercentage {
    if (originalPrice <= 0) return 0.0;
    return ((originalPrice - discountPrice) / originalPrice) * 100;
  }

  // Convert for cart or local database storage if needed
  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'brand': brand,
      'description': description,
      'imageUrl': imageUrl,
      'originalPrice': originalPrice,
      'discountPrice': discountPrice,
      'rating': rating,
      'reviewCount': reviewCount,
      'categoryId': categoryId,
      'isBestSeller': isBestSeller ? 1 : 0,
      'isTrending': isTrending ? 1 : 0,
      'shades': shades,
    };
  }
}
