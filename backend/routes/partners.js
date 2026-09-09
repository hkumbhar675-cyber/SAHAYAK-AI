const express = require('express');
const router = express.Router();
const { store } = require('../db/db');
const { scorePartner } = require('../services/partnerScorer');

// GET /api/partners - list all channel partners
router.get('/', (req, res) => {
  try {
    const { scheme_id } = req.query;
    let partners = [...store.partners];

    if (scheme_id) {
      const sId = Number(scheme_id);
      partners = partners.filter(p => p.supported_schemes && p.supported_schemes.includes(sId));
    }

    res.json({
      success: true,
      count: partners.length,
      partners
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/partners/rank - rank partners using 6-factor algorithm
router.post('/rank', (req, res) => {
  try {
    const {
      latitude = 18.5204,
      longitude = 73.8567,
      scheme_id = null,
      filter_eligible_only = false
    } = req.body;

    const userLocation = {
      latitude: Number(latitude),
      longitude: Number(longitude)
    };

    let ranked = store.partners.map(partner => 
      scorePartner(partner, userLocation, scheme_id)
    );

    if (filter_eligible_only && scheme_id) {
      ranked = ranked.filter(p => p.is_eligible);
    }

    // Sort by total_score descending
    ranked.sort((a, b) => b.total_score - a.total_score);

    // Identify top recommended partner
    const topPartner = ranked.length > 0 ? ranked[0] : null;

    res.json({
      success: true,
      count: ranked.length,
      user_location: userLocation,
      scheme_id: scheme_id ? Number(scheme_id) : null,
      top_recommended_partner: topPartner,
      partners: ranked
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
