import 'product.dart';

class CartItem {
  final Product product;
  int quantity;
  String? selectedShade;

  CartItem({
    required this.product,
    this.quantity = 1,
    this.selectedShade,
  });

  double get totalPrice {
    return product.discountPrice * quantity;
  }
}
