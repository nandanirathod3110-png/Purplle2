import 'package:flutter/material.dart';
import '../models/cart.dart';
import '../models/product.dart';
import '../models/offer.dart';

class CartService with ChangeNotifier {
  final List<CartItem> _items = [];
  Offer? _appliedOffer;

  List<CartItem> get items => _items;
  Offer? get appliedOffer => _appliedOffer;

  int get cartCount {
    return _items.fold(0, (sum, item) => sum + item.quantity);
  }

  double get subtotal {
    return _items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  double get discountAmount {
    if (_appliedOffer == null) return 0.0;
    if (subtotal < _appliedOffer!.minPurchaseAmount) return 0.0;
    return (subtotal * _appliedOffer!.discountPercent) / 100.0;
  }

  double get deliveryFee {
    if (subtotal == 0 || subtotal >= 499) return 0.0;
    return 49.00;
  }

  double get grandTotal {
    double total = subtotal - discountAmount + deliveryFee;
    return total < 0 ? 0.0 : total;
  }

  void addToCart(Product product, {String? shade}) {
    int index = _items.indexWhere((item) => item.product.id == product.id && item.selectedShade == shade);
    if (index >= 0) {
      _items[index].quantity++;
    } else {
      _items.add(CartItem(product: product, selectedShade: shade, quantity: 1));
    }
    notifyListeners();
  }

  void updateQuantity(String id, int quantity, {String? shade}) {
    int index = _items.indexWhere((item) => item.product.id == id && item.selectedShade == shade);
    if (index >= 0) {
      if (quantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = quantity;
      }
      notifyListeners();
    }
  }

  void removeFromCart(String id, {String? shade}) {
    _items.removeWhere((item) => item.product.id == id && item.selectedShade == shade);
    notifyListeners();
  }

  bool applyCoupon(String code, List<Offer> availableOffers) {
    try {
      Offer match = availableOffers.firstWhere(
        (off) => off.code.toUpperCase() == code.toUpperCase().trim(),
      );
      if (subtotal >= match.minPurchaseAmount) {
        _appliedOffer = match;
        notifyListeners();
        return true;
      }
    } catch (_) {
      // Coupon code not found in the list
    }
    return false;
  }

  void removeCoupon() {
    _appliedOffer = null;
    notifyListeners();
  }

  void clearCart() {
    _items.clear();
    _appliedOffer = null;
    notifyListeners();
  }
}
