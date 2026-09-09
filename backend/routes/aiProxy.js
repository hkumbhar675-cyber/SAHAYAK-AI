const express = require('express');
const router = express.Router();
const axios = require('axios');
const { store } = require('../db/db');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Built-in intelligent rule-based intent parser (used directly or as fallback)
function parseCitizenIntentFallback(text) {
  const lower = text.toLowerCase();
  
  // Extract age
  let age = 30;
  const ageMatch = lower.match(/(?:age|aged|i am|i'm)\s*(\d{1,2})/i) || lower.match(/(\d{1,2})\s*(?:years|yr|yrs|वर्ष|वय)/i);
  if (ageMatch) {
    age = parseInt(ageMatch[1], 10);
  }

  // Extract income
  let annual_income = 250000;
  const incomeLakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|लाख)/i);
  const incomeNumMatch = lower.match(/(?:income|earning|कमाई|उत्पन्न|₹|rs\.?)\s*(\d+[\d,]*)/i);
  if (incomeLakhMatch) {
    annual_income = Math.round(parseFloat(incomeLakhMatch[1]) * 100000);
  } else if (incomeNumMatch) {
    annual_income = parseInt(incomeNumMatch[1].replace(/,/g, ''), 10);
  }

  // Extract occupation
  let occupation = 'Citizen';
  if (lower.includes('farm') || lower.includes('kisan') || lower.includes('किसान') || lower.includes('शेतकरी') || lower.includes('tractor') || lower.includes('crop')) {
    occupation = 'Farmer';
  } else if (lower.includes('vendor') || lower.includes('street') || lower.includes('thela') || lower.includes('फेरीवाला') || lower.includes('दुकानदार') || lower.includes('hawker')) {
    occupation = 'Street Vendor';
  } else if (lower.includes('business') || lower.includes('shop') || lower.includes('enterprise') || lower.includes('व्यवसाय') || lower.includes('व्यापार')) {
    occupation = 'Small Business';
  } else if (lower.includes('artisan') || lower.includes('weaver') || lower.includes('handicraft') || lower.includes('कारागीर') || lower.includes('बुनकर')) {
    occupation = 'Artisan / Weaver';
  } else if (lower.includes('student') || lower.includes('graduate') || lower.includes('college') || lower.includes('विद्यार्थी') || lower.includes('छात्र')) {
    occupation = 'Student / Graduate';
  } else if (lower.includes('woman') || lower.includes('women') || lower.includes('mahila') || lower.includes('महिला')) {
    occupation = 'Small Business';
  }

  // Extract location
  let district = 'Pune';
  if (lower.includes('pune') || lower.includes('पुणे')) district = 'Pune';
  else if (lower.includes('mumbai') || lower.includes('मुंबई')) district = 'Mumbai';
  else if (lower.includes('nagpur') || lower.includes('नागपूर')) district = 'Nagpur';
  else if (lower.includes('nashik') || lower.includes('नाशिक')) district = 'Nashik';

  // Category
  let category = 'General';
  let gender = 'Male';
  if (lower.includes('woman') || lower.includes('women') || lower.includes('female') || lower.includes('महिला') || lower.includes('स्त्री')) {
    category = 'Women';
    gender = 'Female';
  } else if (lower.includes('sc') || lower.includes('dalit')) {
    category = 'SC';
  } else if (lower.includes('st') || lower.includes('tribal') || lower.includes('adivasi')) {
    category = 'ST';
  } else if (lower.includes('obc')) {
    category = 'OBC';
  }

  // Landholding
  let landholding_acres = occupation === 'Farmer' ? 2.5 : 0;
  const landMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़|एकर)/i);
  if (landMatch) {
    landholding_acres = parseFloat(landMatch[1]);
  }

  return {
    structured_profile: {
      age,
      annual_income,
      occupation,
      district,
      state: 'Maharashtra',
      category,
      gender,
      landholding_acres,
      requirement: text
    },
    confidence: 0.92,
    parsed_entities: {
      age_detected: age,
      income_detected: annual_income,
      occupation_detected: occupation,
      location_detected: district
    }
  };
}

// POST /api/ai/parse-intent - NLP Profile Extractor
router.post('/parse-intent', async (req, res) => {
  const { query, text, language = 'en' } = req.body;
  const inputText = text || query || '';

  try {
    const response = await axios.post(`${FASTAPI_URL}/api/ai/parse-intent`, {
      text: inputText,
      language
    }, { timeout: 3000 });

    return res.json(response.data);
  } catch (err) {
    // Graceful fallback to local structured NLP extractor
    const fallbackResult = parseCitizenIntentFallback(inputText);
    return res.json({
      success: true,
      source: 'local_nlp_engine',
      ...fallbackResult
    });
  }
});

// POST /api/ai/assistant - Conversational Assistant
router.post('/assistant', async (req, res) => {
  const { message, language = 'en', history = [] } = req.body;

  try {
    const response = await axios.post(`${FASTAPI_URL}/api/ai/assistant`, {
      message,
      language,
      history
    }, { timeout: 3000 });

    return res.json(response.data);
  } catch (err) {
    // Intelligent conversational response fallback
    const lower = (message || '').toLowerCase();
    let reply = '';
    let quickActions = [];

    if (lower.includes('farmer') || lower.includes('kisan') || lower.includes('tractor') || lower.includes('कृषी') || lower.includes('किसान')) {
      reply = language === 'mr' 
        ? "महाराष्ट्रातील शेतकऱ्यांसाठी पीएम-किसान (₹६,००० वार्षिक) आणि महाडीबीटी कृषी यांत्रिकीकरण योजना (ट्रॅक्टर आणि अवजारांवर ५०% अनुदान) उपलब्ध आहेत. तुम्ही पात्रता तपासू इच्छिता का?"
        : language === 'hi'
        ? "महाराष्ट्र के किसानों के लिए पीएम-किसान (₹6,000 वार्षिक) और महाडीबीटी कृषि यांत्रिकीकरण योजना (ट्रैक्टर और कृषि यंत्रों पर 50% तक सब्सिडी) उपलब्ध हैं। क्या आप अपनी पात्रता जांचना चाहते हैं?"
        : "For farmers in Maharashtra, PM-KISAN (₹6,000/yr direct income support) and MahaDBT Farm Mechanization Scheme (up to 50% subsidy on tractors & equipment) are available. Would you like to check your eligibility?";
      quickActions = ['Check Eligibility', 'View Farm Schemes', 'Nearby Partners'];
    } else if (lower.includes('business') || lower.includes('shop') || lower.includes('mudra') || lower.includes('loan') || lower.includes('कर्ज')) {
      reply = language === 'mr'
        ? "लहान व्यवसायांसाठी पंतप्रधान मुद्रा योजना (शिशू - ₹५०,००० पर्यंत, किशोर - ₹५ लाखांपर्यंत) आणि PMEGP योजना (३५% भांडवली अनुदान) अत्यंत फायदेशीर आहेत."
        : language === 'hi'
        ? "छोटे व्यवसायों के लिए प्रधानमंत्री मुद्रा योजना (शिशु - ₹50,000 तक, किशोर - ₹5 लाख तक) और PMEGP योजना (35% पूंजीगत सब्सिडी) उपलब्ध हैं।"
        : "For micro and small businesses, Pradhan Mantri MUDRA Yojana (Shishu up to ₹50,000, Kishore up to ₹5 Lakhs) and PMEGP (credit-linked subsidy up to 35%) are ideal choices.";
      quickActions = ['Calculate Loan EMI', 'Find Schemes', 'Nearby Partners'];
    } else if (lower.includes('partner') || lower.includes('bank') || lower.includes('center') || lower.includes('पार्टनर') || lower.includes('शाखा')) {
      reply = language === 'mr'
        ? "पुण्यात जिल्हा वित्त सुविधा केंद्र (कॅम्प), बँक ऑफ महाराष्ट्र (डेक्कन), आणि एसबीआय एसएमई सेंटर (हडपसर) हे अधिकृत चॅनेल भागीदार आहेत."
        : language === 'hi'
        ? "पुणे में जिला वित्त सुविधा केंद्र (कैंप), बैंक ऑफ महाराष्ट्र (डेक्कन), और एसबीआई एसएमई सेंटर (हडपसर) अधिकृत चैनल पार्टनर हैं।"
        : "In Pune, our top-ranked authorized channel partners include District Finance Facilitation Centre (Camp), Bank of Maharashtra (Deccan), and SBI SME Center (Hadapsar).";
      quickActions = ['View Partner Map', 'Find Schemes'];
    } else {
      reply = language === 'mr'
        ? "मी तुम्हाला सरकारी योजना शोधणे, पात्रता नियम तपासणे, आर्थिक मदतीचे गणित करणे आणि जवळचे अधिकृत चॅनेल पार्टनर शोधण्यात मदत करू शकतो. तुमचा व्यवसाय आणि गरजा सांगा."
        : language === 'hi'
        ? "मैं आपको सरकारी योजनाएं खोजने, पात्रता नियम जांचने, वित्तीय सहायता की गणना करने और नजदीकी अधिकृत चैनल पार्टनर खोजने में मदद कर सकता हूँ। अपनी आवश्यकता बताएं।"
        : "I can help you discover verified government schemes, calculate financial subsidies & EMIs, evaluate deterministic eligibility rules, and route you to verified channel partners in Pune.";
      quickActions = ['Find Schemes', 'Check Eligibility', 'Nearby Partners', 'Calculate Assistance'];
    }

    return res.json({
      success: true,
      source: 'local_assistant_engine',
      response: reply,
      quick_actions: quickActions,
      language
    });
  }
});

module.exports = router;
