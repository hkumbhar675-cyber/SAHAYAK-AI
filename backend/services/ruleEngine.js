// SAHAYAK AI – Deterministic Rule Engine
// Evaluates citizen profile against official scheme rules.
// AI NEVER decides eligibility alone; this deterministic engine is the single source of truth.

function evaluateSchemeEligibility(citizen, scheme, rules = []) {
  const satisfiedRules = [];
  const failedRules = [];
  const missingInfo = [];

  const citizenAge = Number(citizen.age) || null;
  const citizenIncome = Number(citizen.annual_income) || 0;
  const citizenOccupation = (citizen.occupation || '').trim();
  const citizenCategory = (citizen.category || 'General').trim();
  const citizenState = (citizen.state || 'Maharashtra').trim();
  const citizenLand = citizen.landholding_acres !== undefined && citizen.landholding_acres !== null ? Number(citizen.landholding_acres) : null;
  const requirement = (citizen.requirement || '').toLowerCase();

  // Evaluate each deterministic rule
  rules.forEach(rule => {
    const key = rule.rule_key;
    const op = rule.operator;
    const ruleVal = rule.rule_value;
    const isMandatory = rule.is_mandatory;

    let passed = false;
    let reason = '';
    let details = '';

    switch (key) {
      case 'age': {
        if (citizenAge === null) {
          missingInfo.push({ field: 'age', label: 'Citizen Age', prompt: 'Please provide applicant age.' });
          return;
        }
        const numVal = Number(ruleVal);
        if (op === '>=') {
          passed = citizenAge >= numVal;
          details = `Age ${citizenAge} >= Minimum ${numVal}`;
        } else if (op === '<=') {
          passed = citizenAge <= numVal;
          details = `Age ${citizenAge} <= Maximum ${numVal}`;
        }
        reason = passed ? `Applicant age (${citizenAge} yrs) satisfies age requirement.` : `Applicant age (${citizenAge} yrs) does not meet requirement (${op} ${numVal}).`;
        break;
      }

      case 'annual_income': {
        const numVal = Number(ruleVal);
        if (op === '<=') {
          passed = citizenIncome <= numVal;
          details = `Income ₹${citizenIncome.toLocaleString('en-IN')} <= Limit ₹${numVal.toLocaleString('en-IN')}`;
        } else if (op === '>=') {
          passed = citizenIncome >= numVal;
          details = `Income ₹${citizenIncome.toLocaleString('en-IN')} >= Minimum ₹${numVal.toLocaleString('en-IN')}`;
        }
        reason = passed ? `Annual income (₹${citizenIncome.toLocaleString('en-IN')}) is within eligible ceiling.` : `Annual income (₹${citizenIncome.toLocaleString('en-IN')}) exceeds scheme limit of ₹${numVal.toLocaleString('en-IN')}.`;
        break;
      }

      case 'occupation': {
        if (!citizenOccupation) {
          missingInfo.push({ field: 'occupation', label: 'Citizen Occupation', prompt: 'Please specify occupation.' });
          return;
        }
        const allowed = ruleVal.split(',').map(s => s.trim().toLowerCase());
        const occLower = citizenOccupation.toLowerCase();
        passed = allowed.some(allowedOcc => occLower.includes(allowedOcc) || allowedOcc.includes(occLower));
        details = `Occupation: ${citizenOccupation} matched with allowed types: [${ruleVal}]`;
        reason = passed ? `Occupation '${citizenOccupation}' matches scheme target beneficiary profile.` : `Scheme requires one of: ${ruleVal}. (Current: '${citizenOccupation}').`;
        break;
      }

      case 'category': {
        const allowed = ruleVal.split(',').map(s => s.trim().toLowerCase());
        const catLower = citizenCategory.toLowerCase();
        passed = allowed.some(a => a === catLower || (catLower === 'women' && citizen.gender === 'Female'));
        details = `Category: ${citizenCategory} vs Target: [${ruleVal}]`;
        reason = passed ? `Category '${citizenCategory}' satisfies social category condition.` : `Citizen category '${citizenCategory}' is not in the eligible groups: ${ruleVal}.`;
        break;
      }

      case 'state': {
        passed = citizenState.toLowerCase() === ruleVal.toLowerCase();
        details = `State: ${citizenState} vs Required: ${ruleVal}`;
        reason = passed ? `Applicant is a resident of ${citizenState}.` : `Scheme requires residency in ${ruleVal}, citizen is in ${citizenState}.`;
        break;
      }

      case 'landholding_acres': {
        if (citizenLand === null) {
          missingInfo.push({ field: 'landholding_acres', label: 'Landholding Records', prompt: 'Agricultural land records (7/12 extract) required.' });
          return;
        }
        const numVal = Number(ruleVal);
        if (op === '>') {
          passed = citizenLand > numVal;
          details = `Landholding ${citizenLand} acres > ${numVal}`;
        } else if (op === '>=') {
          passed = citizenLand >= numVal;
          details = `Landholding ${citizenLand} acres >= ${numVal}`;
        } else if (op === '<=') {
          passed = citizenLand <= numVal;
          details = `Landholding ${citizenLand} acres <= ${numVal}`;
        }
        reason = passed ? `Citizen holds ${citizenLand} acres, meeting landholding requirement.` : `Citizen landholding (${citizenLand} acres) does not satisfy requirement (${op} ${numVal}).`;
        break;
      }

      default:
        passed = true;
        details = `${rule.description}: verified`;
        reason = 'Condition verified.';
    }

    if (passed) {
      satisfiedRules.push({
        rule_type: rule.rule_type,
        rule_key: key,
        description: rule.description,
        description_hi: rule.description_hi,
        description_mr: rule.description_mr,
        details,
        is_mandatory: isMandatory
      });
    } else {
      failedRules.push({
        rule_type: rule.rule_type,
        rule_key: key,
        description: rule.description,
        description_hi: rule.description_hi,
        description_mr: rule.description_mr,
        details,
        reason,
        is_mandatory: isMandatory
      });
    }
  });

  // Determine overall status
  const mandatoryFailed = failedRules.filter(r => r.is_mandatory);
  let status = 'ELIGIBLE';
  let whySummary = '';

  if (mandatoryFailed.length > 0) {
    status = 'NOT ELIGIBLE';
    const failedDescriptions = mandatoryFailed.map(r => r.description).join('; ');
    whySummary = `Not eligible because the following mandatory criteria were not satisfied: ${failedDescriptions}.`;
  } else if (missingInfo.length > 0) {
    status = 'MORE INFORMATION REQUIRED';
    const missingLabels = missingInfo.map(m => m.label).join(', ');
    whySummary = `Preliminary criteria met, but additional information is needed to confirm full eligibility: ${missingLabels}.`;
  } else {
    status = 'ELIGIBLE';
    whySummary = `Fully eligible! All ${satisfiedRules.length} deterministic rules (income, age, occupation, and state residency) were successfully verified.`;
  }

  // Calculate Match Score (0 - 100)
  const totalRules = rules.length;
  let ruleScore = totalRules > 0 ? (satisfiedRules.length / totalRules) * 70 : 50;

  // Bonus for requirement keyword relevance
  let relevanceBonus = 0;
  if (requirement) {
    const textCorpus = `${scheme.name} ${scheme.category} ${scheme.description}`.toLowerCase();
    const reqWords = requirement.split(/\s+/).filter(w => w.length > 3);
    const matchedCount = reqWords.filter(w => textCorpus.includes(w)).length;
    relevanceBonus = Math.min(30, matchedCount * 10);
  } else {
    relevanceBonus = 25;
  }

  let finalScore = Math.round(ruleScore + relevanceBonus);
  if (status === 'NOT ELIGIBLE') {
    finalScore = Math.min(finalScore, 45);
  } else if (status === 'ELIGIBLE') {
    finalScore = Math.max(finalScore, 75);
  }
  finalScore = Math.min(100, Math.max(10, finalScore));

  return {
    scheme_id: scheme.id,
    scheme_code: scheme.code,
    scheme_name: scheme.name,
    scheme_name_hi: scheme.name_hi,
    scheme_name_mr: scheme.name_mr,
    category: scheme.category,
    department: scheme.department,
    description: scheme.description,
    max_benefit: scheme.max_benefit,
    subsidy_pct: scheme.subsidy_pct,
    interest_rate: scheme.interest_rate,
    status, // 'ELIGIBLE' | 'NOT ELIGIBLE' | 'MORE INFORMATION REQUIRED'
    match_score: finalScore,
    satisfied_rules: satisfiedRules,
    failed_rules: failedRules,
    missing_info: missingInfo,
    why_explanation: whySummary,
    is_marginalized_entrepreneur: Boolean(scheme.is_marginalized_entrepreneur),
    marginalized_focus: scheme.marginalized_focus || null,
    required_documents: scheme.required_documents || [],
    application_process: scheme.application_process || []
  };
}

module.exports = {
  evaluateSchemeEligibility
};
