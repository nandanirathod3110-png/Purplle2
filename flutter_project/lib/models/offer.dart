class Offer {
  final String id;
  final String title;
  final String code;
  final double discountPercent;
  final double minPurchaseAmount;
  final String imageUrl;
  final String expiryDate;
  final String description;

  Offer({
    required this.id,
    required this.title,
    required this.code,
    required this.discountPercent,
    required this.minPurchaseAmount,
    required this.imageUrl,
    required this.expiryDate,
    required this.description,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'code': code,
      'discountPercent': discountPercent,
      'minPurchaseAmount': minPurchaseAmount,
      'imageUrl': imageUrl,
      'expiryDate': expiryDate,
      'description': description,
    };
  }
}
