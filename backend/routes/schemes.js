const express = require('express');
const router = express.Router();
const { store } = require('../db/db');

// GET /api/schemes - list schemes with optional search & category filter
router.get('/', (req, res) => {
  try {
    const { category, search, occupation, marginalized_only } = req.query;
    let schemes = [...store.schemes];

    if (marginalized_only === 'true' || marginalized_only === true) {
      schemes = schemes.filter(s => s.is_marginalized_entrepreneur);
    }

    if (category && category !== 'All') {
      schemes = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (occupation) {
      schemes = schemes.filter(s => 
        s.target_occupations && s.target_occupations.some(occ => 
          occ.toLowerCase().includes(occupation.toLowerCase()) || 
          occupation.toLowerCase().includes(occ.toLowerCase())
        )
      );
    }

    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.name_hi && s.name_hi.includes(q)) ||
        (s.name_mr && s.name_mr.includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    // Attach rule count and partner count
    const enriched = schemes.map(scheme => {
      const schemeRules = store.rules.filter(r => r.scheme_id === scheme.id);
      const partnerCount = store.partners.filter(p => p.supported_schemes && p.supported_schemes.includes(scheme.id)).length;
      return {
        ...scheme,
        rules_count: schemeRules.length,
        eligible_partners_count: partnerCount
      };
    });

    res.json({
      success: true,
      count: enriched.length,
      schemes: enriched
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/schemes/:id - scheme details with rules and partner list
router.get('/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    const scheme = store.schemes.find(s => s.id === id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    const rules = store.rules.filter(r => r.scheme_id === id);
    const partners = store.partners.filter(p => p.supported_schemes && p.supported_schemes.includes(id));

    res.json({
      success: true,
      scheme: {
        ...scheme,
        rules,
        partners
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
