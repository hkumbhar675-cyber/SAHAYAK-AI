// SAHAYAK AI – 6-Factor Partner Eligibility Scorer
// Weighs: Scheme Compatibility (20%), Location (20%), Fund Availability (20%), NPA (15%), Overdue (15%), Authorization (10%)
// Does NOT simply recommend the nearest partner; evaluates comprehensive institution health & capability.

function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal
}

function scorePartner(partner, userLocation = { latitude: 18.5204, longitude: 73.8567 }, targetSchemeId = null) {
  const reasons = [];

  // 1. Scheme Compatibility (20%)
  let compatibilityScore = 0;
  const supportsScheme = targetSchemeId
    ? partner.supported_schemes && partner.supported_schemes.includes(Number(targetSchemeId))
    : true;

  if (targetSchemeId) {
    if (supportsScheme) {
      compatibilityScore = 20;
      reasons.push('Directly authorized and active quota for selected scheme (+20/20)');
    } else {
      compatibilityScore = 4;
      reasons.push('Partner does not have active allocation quota for this specific scheme (+4/20)');
    }
  } else {
    // General portfolio score
    const count = partner.supported_schemes ? partner.supported_schemes.length : 1;
    compatibilityScore = Math.min(20, Math.round((count / 5) * 20));
    reasons.push(`Broad scheme portfolio with ${count} active government programs (+${compatibilityScore}/20)`);
  }

  // 2. Location Proximity (20%)
  const distanceKm = calculateHaversineDistance(
    userLocation.latitude,
    userLocation.longitude,
    partner.latitude,
    partner.longitude
  );

  let proximityScore = 0;
  if (distanceKm <= 2.5) {
    proximityScore = 20;
  } else if (distanceKm <= 5.0) {
    proximityScore = 18;
  } else if (distanceKm <= 10.0) {
    proximityScore = 14;
  } else if (distanceKm <= 20.0) {
    proximityScore = 9;
  } else {
    proximityScore = 5;
  }
  reasons.push(`Located ${distanceKm} km from citizen location (+${proximityScore}/20)`);

  // 3. Fund Availability (20%)
  // Range: ₹30 Cr to ₹150 Cr
  let fundScore = 0;
  const funds = Number(partner.fund_available);
  if (funds >= 120000000) {
    fundScore = 20;
  } else if (funds >= 80000000) {
    fundScore = 18;
  } else if (funds >= 50000000) {
    fundScore = 15;
  } else {
    fundScore = 12;
  }
  reasons.push(`Available scheme liquidity ₹${(funds / 10000000).toFixed(1)} Cr ensures rapid disbursal (+${fundScore}/20)`);

  // 4. NPA Health (15%) - Lower is better
  let npaScore = 0;
  const npa = Number(partner.npa_percentage);
  if (npa < 2.0) {
    npaScore = 15;
  } else if (npa < 3.0) {
    npaScore = 13;
  } else if (npa < 4.0) {
    npaScore = 10;
  } else if (npa < 5.0) {
    npaScore = 7;
  } else {
    npaScore = 3;
  }
  reasons.push(`Low NPA of ${npa}% indicates excellent credit quality & low processing friction (+${npaScore}/15)`);

  // 5. Overdue Rate (15%) - Lower is better
  let overdueScore = 0;
  const overdue = Number(partner.overdue_rate);
  if (overdue < 2.5) {
    overdueScore = 15;
  } else if (overdue < 3.5) {
    overdueScore = 13;
  } else if (overdue < 5.0) {
    overdueScore = 10;
  } else if (overdue < 6.5) {
    overdueScore = 7;
  } else {
    overdueScore = 3;
  }
  reasons.push(`Overdue rate of ${overdue}% reflects healthy recovery track record (+${overdueScore}/15)`);

  // 6. Authorization (10%)
  let authScore = 0;
  if (partner.is_authorized) {
    authScore = 10;
    reasons.push('Verified & empanelled by State/Central Government (+10/10)');
  } else {
    authScore = 0;
    reasons.push('Pending empanelment certification (+0/10)');
  }

  const totalScore = Math.round(compatibilityScore + proximityScore + fundScore + npaScore + overdueScore + authScore);

  return {
    partner_id: partner.id,
    name: partner.name,
    type: partner.type,
    district: partner.district,
    address: partner.address,
    latitude: partner.latitude,
    longitude: partner.longitude,
    distance_km: distanceKm,
    rating: partner.rating,
    contact_phone: partner.contact_phone,
    contact_email: partner.contact_email,
    is_demo_data: partner.is_demo_data,
    is_eligible: supportsScheme && partner.is_authorized,
    total_score: totalScore,
    score_breakdown: {
      scheme_compatibility: { score: compatibilityScore, max: 20, pct: '20%' },
      location_proximity: { score: proximityScore, max: 20, pct: '20%' },
      fund_availability: { score: fundScore, max: 20, pct: '20%' },
      npa_health: { score: npaScore, max: 15, pct: '15%' },
      overdue_rate: { score: overdueScore, max: 15, pct: '15%' },
      authorization: { score: authScore, max: 10, pct: '10%' }
    },
    metrics: {
      fund_available_cr: (funds / 10000000).toFixed(1),
      npa_percentage: npa,
      overdue_rate: overdue,
      is_authorized: partner.is_authorized
    },
    reasons,
    why_recommended: `Ranked with a score of ${totalScore}/100. Combines ${distanceKm} km proximity with high fund availability (₹${(funds / 10000000).toFixed(1)} Cr) and strong NPA health (${npa}%).`
  };
}

module.exports = {
  scorePartner,
  calculateHaversineDistance
};
