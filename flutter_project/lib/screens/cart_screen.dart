import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/dummy_data.dart';
import '../models/cart.dart';
import '../services/cart_service.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({Key? key}) : super(key: key);

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  final TextEditingController _couponController = TextEditingController();

  @override
  void dispose() {
    _couponController.dispose();
    super.dispose();
  }

  void _applyCouponCode(CartService service) {
    final code = _couponController.text.trim();
    if (code.isEmpty) return;

    final success = service.applyCoupon(code, DummyData.offers);
    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Coupon "$code" applied! Saved ₹${service.discountAmount.toStringAsFixed(0)}'),
          backgroundColor: Colors.green,
        ),
      );
      _couponController.clear();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Invalid coupon code or minimum purchase amount of ₹${DummyData.offers.firstWhere((o)=>o.code==code, orElse:()=>DummyData.offers[0]).minPurchaseAmount.toStringAsFixed(0)} is not met!'),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final cartService = Provider.of<CartService>(context);
    final items = cartService.items;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Shopping Cart',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: Color(0xFF2C2438),
          ),
        ),
        actions: [
          if (items.isNotEmpty)
            TextButton.icon(
              onPressed: () {
                cartService.clearCart();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Cart cleared successfully')),
                );
              },
              icon: const Icon(Icons.delete_sweep_outlined, size: 16, color: Colors.red),
              label: const Text('Clear', style: TextStyle(color: Colors.red, fontSize: 13)),
            )
        ],
      ),
      body: items.isEmpty
          ? _emptyCartState(context)
          : Column(
              children: [
                Expanded(
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    itemCount: items.length,
                    itemBuilder: (context, index) {
                      final item = items[index];
                      return _cartItemRow(item, cartService, primaryColor);
                    },
                  ),
                ),

                // Pricing Summary and Coupon inputs
                _checkoutDrawerBar(cartService, primaryColor),
              ],
            ),
    );
  }

  Widget _cartItemRow(CartItem item, CartService service, Color primaryColor) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            // Thumbnail Photo
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                item.product.imageUrl,
                height: 70,
                width: 70,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(color: Colors.grey[200]),
              ),
            ),
            const SizedBox(width: 12),

            // Content Column
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.product.brand.toUpperCase(),
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: primaryColor),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.product.name,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Color(0xFF2C2438)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '₹${item.product.discountPrice.toStringAsFixed(0)}',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF2C2438)),
                  ),
                ],
              ),
            ),

            // Quantity adjusters
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                IconButton(
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  icon: const Icon(Icons.close, size: 14, color: Colors.grey),
                  onPressed: () {
                    service.removeFromCart(item.product.id, shade: item.selectedShade);
                  },
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    InkWell(
                      onTap: () {
                        service.updateQuantity(item.product.id, item.quantity - 1, shade: item.selectedShade);
                      },
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.remove, size: 12),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      '${item.quantity}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(width: 10),
                    InkWell(
                      onTap: () {
                        service.updateQuantity(item.product.id, item.quantity + 1, shade: item.selectedShade);
                      },
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.add, size: 12),
                      ),
                    ),
                  ],
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget _checkoutDrawerBar(CartService service, Color primaryColor) {
    return Container(
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.08), blurRadius: 10, offset: const Offset(0, -3))
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Coupon code Entry block
          if (service.appliedOffer == null)
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _couponController,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.grey[50],
                      hintText: 'Enter promo code (e.g. BEAUTY50)',
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () => _applyCouponCode(service),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).colorScheme.secondary,
                    foregroundColor: primaryColor,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    minimumSize: const Size(60, 44),
                  ),
                  child: const Text('APPLY', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            )
          else
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.green[50],
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.green[150]!),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_outline, color: Colors.green, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Promo Coupon "${service.appliedOffer!.code}" applied!',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 11),
                        ),
                        Text(
                          'Saved ₹${service.discountAmount.toStringAsFixed(0)} on this order',
                          style: TextStyle(color: Colors.green[700], fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      service.removeCoupon();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Coupon removed')),
                      );
                    },
                    child: const Text('REMOVE', style: TextStyle(color: Colors.red, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

          const SizedBox(height: 16),

          // Total Calculation Column list
          _amountRow('Bag Subtotal', '₹${service.subtotal.toStringAsFixed(2)}'),
          if (service.appliedOffer != null)
            _amountRow('Coupon Savings', '-₹${service.discountAmount.toStringAsFixed(2)}', isDiscount: true),
          _amountRow(
            'Estimated Delivery Charge',
            service.deliveryFee == 0.0 ? 'FREE' : '₹${service.deliveryFee.toStringAsFixed(2)}',
            isShipping: service.deliveryFee == 0.0,
          ),
          const Divider(),
          _amountRow('Grand Payable Total', '₹${service.grandTotal.toStringAsFixed(2)}', isBold: true),

          const SizedBox(height: 16),

          // Final Checkout active Button
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: primaryColor,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            onPressed: () => _submitSecureCheckout(service),
            child: const Text('PROCEED TO CHECKOUT'),
          ),
        ],
      ),
    );
  }

  Widget _amountRow(
    String title,
    String value, {
    bool isBold = false,
    bool isDiscount = false,
    bool isShipping = false,
  }) {
    final style = TextStyle(
      fontSize: isBold ? 14 : 12,
      fontWeight: isBold ? FontWeight.bold : FontWeight.normal,
      color: isDiscount
          ? Colors.green
          : isShipping
              ? Colors.green
              : const Color(0xFF2C2438),
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 3.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: style),
          Text(value, style: style),
        ],
      ),
    );
  }

  Widget _emptyCartState(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.shopping_basket_outlined, size: 80, color: Colors.grey[300]),
            const SizedBox(height: 16),
            const Text(
              'Your Shopping Bag is Empty!',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF2C2438)),
            ),
            const SizedBox(height: 6),
            const Text(
              'Fill it with luxurious lipsticks, moisturizers, or aromatic wellness sets!',
              style: TextStyle(fontSize: 12, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _submitSecureCheckout(CartService service) {
    showModalBottomSheet(
      context: context,
      isDismissible: false,
      enableDrag: false,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          height: 320,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.only(topLeft: Radius.circular(24), topRight: Radius.circular(24)),
          ),
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[100],
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check, size: 40, color: Colors.green),
              ),
              const SizedBox(height: 16),
              const Text(
                'Simulating Navigator: Checkout Complete!',
                style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF2C2438)),
              ),
              const SizedBox(height: 6),
              const Text(
                'Flutter e-commerce database integration has validated the secure mock payment successfully.',
                style: TextStyle(color: Colors.grey, fontSize: 12),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: Theme.of(context).primaryColor),
                  onPressed: () {
                    service.clearCart();
                    Navigator.pop(context);
                  },
                  child: const Text('BACK TO SHOPPING'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
