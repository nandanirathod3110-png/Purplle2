import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../data/dummy_data.dart';
import '../models/offer.dart';

class OffersScreen extends StatefulWidget {
  const OffersScreen({Key? key}) : super(key: key);

  @override
  State<OffersScreen> createState() => _OffersScreenState();
}

class _OffersScreenState extends State<OffersScreen> {
  @override
  Widget build(BuildContext context) {
    final offers = DummyData.offers;
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Offers & Coupons',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: Color(0xFF2C2438),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Prominent Header Banner
            _beautyFestivalHeader(primaryColor),

            // Flash Sale Simulation Container
            _flashSaleTicker(primaryColor),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Exclusive Active Promo Coupons',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: Color(0xFF2C2438),
                  ),
                ),
              ),
            ),

            // Coupons ListView
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16.0, bottom: 24.0),
              itemCount: offers.length,
              itemBuilder: (context, index) {
                final offer = offers[index];
                return _couponCard(offer, primaryColor);
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _beautyFestivalHeader(Color primaryColor) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.all(16.0),
      padding: const EdgeInsets.all(20.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [Color(0xFF6200EE), Colors.pinkAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: const [
          BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(4),
            ),
            child: Text(
              'BEAUTY EXTRAVAGANZA',
              style: TextStyle(
                fontSize: 9,
                fontWeight: FontWeight.bold,
                color: primaryColor,
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Purplle Monsoon Bonanza!',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 22,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Save up to flat ₹750 off on trending skincare grids, styling irons & luxury perfumes',
            style: TextStyle(
              fontSize: 12,
              color: Colors.white80,
            ),
          ),
        ],
      ),
    );
  }

  Widget _flashSaleTicker(Color primaryColor) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, bottom: 16.0),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: Colors.pink[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.pink[100]!),
      ),
      child: Row(
        children: [
          const Icon(Icons.flash_on, color: Colors.pink),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'MIDNIGHT FLASH SALE',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.pink,
                  ),
                ),
                Text(
                  'Extra 15% wallet cashbacks active!',
                  style: TextStyle(fontSize: 10, color: Colors.black54),
                ),
              ],
            ),
          ),
          // Timer Block
          _timerUnit('02'),
          const Text(':', style: TextStyle(fontWeight: FontWeight.bold)),
          _timerUnit('44'),
          const Text(':', style: TextStyle(fontWeight: FontWeight.bold)),
          _timerUnit('18'),
        ],
      ),
    );
  }

  Widget _timerUnit(String time) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
      decoration: BoxDecoration(
        color: Colors.pink,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        time,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _couponCard(Offer offer, Color primaryColor) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      clipBehavior: Clip.antiAlias,
      child: Container(
        height: 120,
        child: Row(
          children: [
            // Image Left side
            AspectRatio(
              aspectRatio: 0.9,
              child: Image.network(
                offer.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => Container(color: Colors.purple[100]),
              ),
            ),

            // Content Right side
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          offer.title,
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF2C2438),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          offer.description,
                          style: const TextStyle(fontSize: 9, color: Colors.grey),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Coupon Code Chip
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: primaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: primaryColor.withOpacity(0.3), style: BorderStyle.solid),
                          ),
                          child: Text(
                            offer.code,
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: primaryColor,
                            ),
                          ),
                        ),

                        // Action button
                        ElevatedButton(
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: offer.code));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Promo Code "${offer.code}" copied! Apply at Checkout.'),
                                duration: const Duration(seconds: 2),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                            minimumSize: const Size(60, 30),
                            backgroundColor: Colors.white,
                            side: BorderSide(color: primaryColor),
                            foregroundColor: primaryColor,
                          ),
                          child: const Text('COPY', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                        )
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
