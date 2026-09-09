# SAHAYAK AI – FastAPI Intelligent Processing Microservice
# Converts natural speech / text input to structured citizen profile, powers conversational assistant, and Bhashini multilingual abstraction.

import re
import os
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="SAHAYAK AI Intelligence Service",
    description="FastAPI service for Natural Language Profile Extraction, Conversational Assistant, and Bhashini Multilingual Integration",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request/Response Models
class ParseIntentRequest(BaseModel):
    text: str
    language: Optional[str] = "en"

class StructuredProfile(BaseModel):
    age: Optional[int] = 30
    annual_income: Optional[int] = 250000
    occupation: Optional[str] = "Citizen"
    district: Optional[str] = "Pune"
    state: Optional[str] = "Maharashtra"
    category: Optional[str] = "General"
    gender: Optional[str] = "General"
    landholding_acres: Optional[float] = 0.0
    requirement: Optional[str] = ""

class ParseIntentResponse(BaseModel):
    success: bool
    confidence: float
    intent: str
    structured_profile: StructuredProfile
    extracted_keywords: List[str]
    suggested_categories: List[str]

class ChatMessage(BaseModel):
    role: str
    content: str

class AssistantRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    history: Optional[List[ChatMessage]] = []

class AssistantResponse(BaseModel):
    success: bool
    response: str
    quick_actions: List[str]
    language: str
    intent: str

class ExplainRuleRequest(BaseModel):
    scheme_name: str
    status: str
    satisfied_rules: List[Dict[str, Any]]
    failed_rules: List[Dict[str, Any]]
    missing_info: List[Dict[str, Any]]
    language: Optional[str] = "en"

class TranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str

@app.get("/api/ai/health")
def health_check():
    return {
        "status": "UP",
        "service": "SAHAYAK AI FastAPI Service",
        "engine": "Intent Extraction + Multilingual Engine",
        "bhashini_ready": True
    }

@app.post("/api/ai/parse-intent", response_model=ParseIntentResponse)
def parse_citizen_intent(req: ParseIntentRequest):
    """
    Extracts structured citizen demographics and requirement from natural text or voice transcription.
    """
    raw_text = req.text.strip()
    lower = raw_text.lower()

    # 1. Extract Age
    age = 32
    age_match = (
        re.search(r'(?:age|aged|i am|i\'m)\s*(\d{1,2})', lower) or
        re.search(r'(\d{1,2})\s*(?:years|yr|yrs|वर्ष|वय)', lower)
    )
    if age_match:
        age = int(age_match.group(1))

    # 2. Extract Income
    annual_income = 250000
    income_lakh = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|लाख)', lower)
    income_direct = re.search(r'(?:income|earning|कमाई|उत्पन्न|₹|rs\.?)\s*(\d+[\d,]*)', lower)

    if income_lakh:
        annual_income = int(float(income_lakh.group(1)) * 100000)
    elif income_direct:
        digits_only = re.sub(r'[^\d]', '', income_direct.group(1))
        if digits_only:
            annual_income = int(digits_only)

    # 3. Extract Occupation
    occupation = "Citizen"
    suggested_categories = ["Social Welfare"]
    if any(k in lower for k in ['farm', 'kisan', 'agri', 'tractor', 'crop', 'किसान', 'शेतकरी', 'शेती', 'बळीराजा']):
        occupation = "Farmer"
        suggested_categories = ["Agriculture", "Direct Subsidy"]
    elif any(k in lower for k in ['street vendor', 'vendor', 'thela', 'hawker', 'फेरीवाला', 'रेहड़ी', 'भाजी विक्रेता']):
        occupation = "Street Vendor"
        suggested_categories = ["Urban Development", "Micro-credit"]
    elif any(k in lower for k in ['artisan', 'weaver', 'handicraft', 'potter', 'बुनकर', 'कारागीर', 'हस्तकला']):
        occupation = "Artisan / Weaver"
        suggested_categories = ["MSME", "Craft & Handloom"]
    elif any(k in lower for k in ['student', 'graduate', 'iti', 'diploma', 'youth', 'कॉलेज', 'विद्यार्थी', 'छात्र', 'युवा']):
        occupation = "Student / Graduate"
        suggested_categories = ["Skill Development", "Youth Entrepreneurship"]
    elif any(k in lower for k in ['business', 'shop', 'enterprise', 'startup', 'दुकान', 'उद्योग', 'व्यापार']):
        occupation = "Small Business"
        suggested_categories = ["MSME", "Working Capital"]
    elif any(k in lower for k in ['woman', 'women', 'mahila', 'महिला', 'बचत गट', 'shg']):
        occupation = "Small Business"
        suggested_categories = ["Women Empowerment", "MSME"]

    # 4. Extract Location
    district = "Pune"
    if any(k in lower for k in ['pune', 'पुणे']):
        district = "Pune"
    elif any(k in lower for k in ['mumbai', 'मुंबई']):
        district = "Mumbai"
    elif any(k in lower for k in ['nagpur', 'नागपूर']):
        district = "Nagpur"
    elif any(k in lower for k in ['nashik', 'नाशिक']):
        district = "Nashik"
    elif any(k in lower for k in ['kolhapur', 'कोल्हापूर']):
        district = "Kolhapur"

    # 5. Extract Category & Gender
    category = "General"
    gender = "Male"
    if any(k in lower for k in ['woman', 'women', 'female', 'mahila', 'महिला', 'स्त्री']):
        category = "Women"
        gender = "Female"
    elif any(k in lower for k in ['sc', 'scheduled caste', 'dalit', 'मातंग', 'नवबौद्ध']):
        category = "SC"
    elif any(k in lower for k in ['st', 'tribal', 'adivasi', 'आदिवासी']):
        category = "ST"
    elif any(k in lower for k in ['obc', 'कुणबी', 'माळी']):
        category = "OBC"

    # 6. Landholding
    landholding_acres = 2.5 if occupation == "Farmer" else 0.0
    land_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:acre|acres|एकड़|एकर)', lower)
    if land_match:
        landholding_acres = float(land_match.group(1))

    # Determine intent
    intent = "find_matching_schemes"
    if any(k in lower for k in ['partner', 'bank', 'branch', 'center', 'नजदीकी', 'जवळचे']):
        intent = "find_eligible_partners"
    elif any(k in lower for k in ['calculate', 'emi', 'subsidy', 'interest', 'व्याज', 'हप्ता']):
        intent = "calculate_assistance"

    # Extracted keywords
    keywords = [w for w in re.findall(r'\b\w{4,}\b', lower) if w not in ['want', 'need', 'please', 'with', 'from', 'have']]

    return ParseIntentResponse(
        success=True,
        confidence=0.94,
        intent=intent,
        structured_profile=StructuredProfile(
            age=age,
            annual_income=annual_income,
            occupation=occupation,
            district=district,
            state="Maharashtra",
            category=category,
            gender=gender,
            landholding_acres=landholding_acres,
            requirement=raw_text
        ),
        extracted_keywords=keywords[:8],
        suggested_categories=suggested_categories
    )

@app.post("/api/ai/assistant", response_model=AssistantResponse)
def conversational_assistant(req: AssistantRequest):
    """
    Multilingual conversational assistant for government scheme advice matching the UI prototype.
    """
    lang = req.language or "en"
    msg = req.message.strip().lower()

    if any(k in msg for k in ['farmer', 'kisan', 'tractor', 'agriculture', 'शेती', 'शेतकरी', 'किसान']):
        intent = "schemes_agriculture"
        if lang == "mr":
            response_text = (
                "महाराष्ट्रातील शेतकऱ्यांसाठी पीएम-किसान (₹६,००० थेट बँक खात्यात) आणि महाडीबीटी कृषी यांत्रिकीकरण "
                "योजना (ट्रॅक्टर, रोटाव्हेटरवर ५०% पर्यंत अनुदान) उपलब्ध आहेत. तुमच्याकडे ७/१२ उतारा असल्यास तुम्ही तात्काळ अर्ज करू शकता."
            )
        elif lang == "hi":
            response_text = (
                "महाराष्ट्र के किसान भाइयों के लिए पीएम-किसान सम्मान निधि (₹6,000 वार्षिक सहायता) और महाडीबीटी "
                "कृषि यांत्रिकीकरण योजना (ट्रैक्टर एवं कृषि उपकरणों पर 50% तक पूंजीगत अनुदान) लागू हैं।"
            )
        else:
            response_text = (
                "For farmers in Maharashtra, PM-KISAN provides ₹6,000/year direct financial support, and the MahaDBT "
                "Farm Mechanization Scheme offers up to 50% capital subsidy on tractors and agricultural implements."
            )
        quick_actions = ["Check Eligibility", "Farm Mechanization Subsidy", "Nearby Partner Banks"]

    elif any(k in msg for k in ['business', 'shop', 'mudra', 'loan', 'कर्ज', 'लोन', 'उद्योग', 'दुकान']):
        intent = "schemes_msme"
        if lang == "mr":
            response_text = (
                "लहान व मध्यम व्यवसायांसाठी प्रधानमंत्री मुद्रा योजना (शिशू: ₹५० हजार, किशोर: ₹५ लाख) आणि "
                "PMEGP योजना (३५% पर्यंत अनुदान) कार्यरत आहेत. संपार्श्विक तारण न देता कर्ज उपलब्ध होते."
            )
        elif lang == "hi":
            response_text = (
                "छोटे व्यापारियों और उद्यमियों के लिए प्रधानमंत्री मुद्रा योजना (शिशु: ₹50,000, किशोर: ₹5 लाख) "
                "तथा PMEGP योजना (35% तक सरकारी सब्सिडी) मुख्य विकल्प हैं।"
            )
        else:
            response_text = (
                "For micro and small enterprises, Pradhan Mantri MUDRA Yojana offers collateral-free loans up to ₹5 Lakhs, "
                "while PMEGP provides up to 35% government subsidy for new manufacturing or service setups."
            )
        quick_actions = ["Calculate Loan EMI", "Check Eligibility", "Partner Facilitation Centers"]

    elif any(k in msg for k in ['partner', 'bank', 'locator', 'center', 'नजदीक', 'जवळचे', 'शाखा']):
        intent = "partner_locator"
        if lang == "mr":
            response_text = (
                "पुणे जिल्ह्यात जिल्हा वित्त सुविधा केंद्र (कॅम्प), बँक ऑफ महाराष्ट्र (डेक्कन), आणि एसबीआय एसएमई सेंटर "
                "(हडपसर) हे उच्च आर्थिक मानांकन आणि कमी एनपीए असलेले अधिकृत चॅनेल भागीदार आहेत."
            )
        elif lang == "hi":
            response_text = (
                "पुणे में जिला वित्त सुविधा केंद्र (कैंप), बैंक ऑफ महाराष्ट्र (डेक्कन) और एसबीआई एसएमई सेंटर (हडपसर) "
                "उच्च वित्तीय क्षमता वाले प्रमाणित चैनल पार्टनर हैं।"
            )
        else:
            response_text = (
                "In Pune, our top-scored channel partners include District Finance Facilitation Centre (Camp - 2.4 km), "
                "Bank of Maharashtra (Deccan Gymkhana - 3.2 km), and SBI SME Center (Hadapsar - 7.5 km)."
            )
        quick_actions = ["Open Partner Map", "Calculate Assistance", "Apply Now"]

    elif any(k in msg for k in ['calculate', 'emi', 'subsidy', 'गणिती', 'हप्ता', 'सब्सिडी']):
        intent = "calculator"
        if lang == "mr":
            response_text = (
                "आमच्या आर्थिक कॅल्क्युलेटरचा वापर करून तुम्ही कर्जाची रक्कम, सरकारी अनुदान, मासिक हप्ता (EMI) "
                "आणि निव्वळ व्याजाची बचत त्वरित तपासू शकता."
            )
        elif lang == "hi":
            response_text = (
                "हमारे वित्तीय कैलकुलेटर से आप ऋण राशि, सरकारी सब्सिडी, प्रभावी मासिक किस्त (EMI) और ब्याज बचत का सटीक अनुमान लगा सकते हैं।"
            )
        else:
            response_text = (
                "You can use our Financial Calculator to instantly compute loan subsidy deductions, effective borrower liability, and monthly EMIs."
            )
        quick_actions = ["Calculate Assistance", "Find Schemes"]

    else:
        intent = "general_assistance"
        if lang == "mr":
            response_text = (
                "नमस्कार! मी तुमचा SAHAYAK AI सहाय्यक आहे. मी तुम्हाला योग्य सरकारी योजना शोधणे, पात्रता नियमांची खात्री करणे, "
                "आर्थिक अनुदानाची गणना करणे आणि पुणे जिल्ह्यातील अधिकृत चॅनेल भागीदारांशी जोडण्यात मदत करतो."
            )
        elif lang == "hi":
            response_text = (
                "नमस्ते! मैं आपका SAHAYAK AI सहायक हूँ। मैं आपको उपयुक्त सरकारी योजनाएं खोजने, पात्रता नियम सत्यापित करने, "
                "सब्सिडी व ईएमआई की गणना करने और अधिकृत चैनल पार्टनर से संपर्क करने में सहायता कर सकता हूँ।"
            )
        else:
            response_text = (
                "Hello! I am your SAHAYAK AI assistant. I can help you discover government schemes, verify eligibility "
                "using deterministic rules, calculate subsidies & loan EMIs, and connect you with high-ranking channel partners."
            )
        quick_actions = ["Find Schemes", "Check Eligibility", "Nearby Partners", "Calculate Assistance"]

    return AssistantResponse(
        success=True,
        response=response_text,
        quick_actions=quick_actions,
        language=lang,
        intent=intent
    )

@app.post("/api/ai/explain")
def explain_eligibility(req: ExplainRuleRequest):
    """
    Synthesizes human-friendly explainable reasoning for citizen rules.
    """
    lang = req.language or "en"
    scheme = req.scheme_name
    status = req.status

    if status == "ELIGIBLE":
        reasons = [f"✓ {r.get('description', '')}" for r in req.satisfied_rules]
        return {
            "success": True,
            "headline": f"Congratulations! You satisfy all eligibility conditions for {scheme}.",
            "bullets": reasons,
            "recommendation": "You are eligible to proceed with the application through an empanelled channel partner."
        }
    elif status == "NOT ELIGIBLE":
        reasons = [f"✗ {r.get('description', '')}: {r.get('reason', '')}" for r in req.failed_rules]
        return {
            "success": True,
            "headline": f"You do not currently meet the mandatory criteria for {scheme}.",
            "bullets": reasons,
            "recommendation": "Consider reviewing alternative schemes matched to your profile or adjusting loan requirements."
        }
    else:
        missing = [f"? {m.get('label', '')}: {m.get('prompt', '')}" for m in req.missing_info]
        return {
            "success": True,
            "headline": f"More information needed to finalize eligibility for {scheme}.",
            "bullets": missing,
            "recommendation": "Please upload or verify the highlighted documents to confirm eligibility."
        }

@app.post("/api/ai/bhashini/translate")
def bhashini_translate(req: TranslationRequest):
    """
    Bhashini translation gateway abstraction with instant fallback.
    """
    # Demo-ready dictionary translations
    translations = {
        ("en", "hi"): {
            "Find the right government scheme for you.": "अपने लिए सही सरकारी योजना खोजें।",
            "Secure • Transparent • Citizen Friendly": "सुरक्षित • पारदर्शी • नागरिक अनुकूल",
            "Find an eligible partner near you": "अपने नजदीकी पात्र भागीदार खोजें",
            "Ask. Understand. Decide.": "पूछें। समझें। निर्णय लें।"
        },
        ("en", "mr"): {
            "Find the right government scheme for you.": "तुमच्यासाठी योग्य सरकारी योजना शोधा.",
            "Secure • Transparent • Citizen Friendly": "सुरक्षित • पारदर्शक • नागरिक स्नेही",
            "Find an eligible partner near you": "तुमच्या जवळील पात्र भागीदार शोधा",
            "Ask. Understand. Decide.": "विचारा. समजा. ठरवा."
        }
    }
    key = (req.source_language, req.target_language)
    translated = translations.get(key, {}).get(req.text, req.text)
    return {
        "success": True,
        "source": req.text,
        "translated": translated,
        "provider": "Bhashini (Mock/Production Ready)"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
