const express = require('express');
const router = express.Router();
const { store } = require('../db/db');
const { evaluateSchemeEligibility } = require('../services/ruleEngine');

// POST /api/eligibility/check - evaluate citizen profile against schemes
router.post('/check', (req, res) => {
  try {
    const {
      citizen = {},
      scheme_id,
      marginalized_only
    } = req.body;

    if (scheme_id) {
      const scheme = store.schemes.find(s => s.id === Number(scheme_id));
      if (!scheme) {
        return res.status(404).json({ success: false, message: 'Scheme not found' });
      }
      const rules = store.rules.filter(r => r.scheme_id === scheme.id);
      const evaluation = evaluateSchemeEligibility(citizen, scheme, rules);
      return res.json({
        success: true,
        evaluation
      });
    }

    // Determine candidate schemes (filtered for marginalized entrepreneurs if requested)
    const isMarginalizedOnly = marginalized_only === true || citizen.marginalized_only === true;
    let candidateSchemes = store.schemes;
    if (isMarginalizedOnly) {
      candidateSchemes = candidateSchemes.filter(s => s.is_marginalized_entrepreneur);
    }

    // Evaluate candidate schemes
    const results = candidateSchemes.map(scheme => {
      const rules = store.rules.filter(r => r.scheme_id === scheme.id);
      return evaluateSchemeEligibility(citizen, scheme, rules);
    });

    // Sort by status priority (ELIGIBLE > MORE INFO > NOT ELIGIBLE) then match_score desc
    const statusPriority = {
      'ELIGIBLE': 3,
      'MORE INFORMATION REQUIRED': 2,
      'NOT ELIGIBLE': 1
    };

    results.sort((a, b) => {
      const pDiff = statusPriority[b.status] - statusPriority[a.status];
      if (pDiff !== 0) return pDiff;
      return b.match_score - a.match_score;
    });

    const eligibleCount = results.filter(r => r.status === 'ELIGIBLE').length;
    const moreInfoCount = results.filter(r => r.status === 'MORE INFORMATION REQUIRED').length;

    res.json({
      success: true,
      summary: {
        total_evaluated: results.length,
        eligible: eligibleCount,
        more_information_required: moreInfoCount,
        not_eligible: results.length - eligibleCount - moreInfoCount
      },
      recommendations: results
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
