-- Seed Data for SAHAYAK AI – Citizen Benefits Platform
-- 10+ Authentic Schemes, 10+ Channel Partners (Pune / Maharashtra)

-- 1. Demo Citizen Profiles
INSERT INTO users (id, name, phone, email, age, gender, occupation, category, annual_income, district, state, landholding_acres) VALUES
(1, 'Ramesh Tukaram Patil', '+91 98220 12345', 'ramesh.patil@example.in', 38, 'Male', 'Farmer', 'OBC', 220000, 'Pune', 'Maharashtra', 3.5),
(2, 'Priya Santosh Sharma', '+91 98220 54321', 'priya.sharma@example.in', 29, 'Female', 'Small Business', 'General', 380000, 'Pune', 'Maharashtra', 0),
(3, 'Amit Vasant Shinde', '+91 98220 98765', 'amit.shinde@example.in', 24, 'Male', 'Student / Graduate', 'SC', 120000, 'Pune', 'Maharashtra', 0),
(4, 'Sunita Eknath Gaikwad', '+91 98220 11223', 'sunita.gaikwad@example.in', 34, 'Female', 'Artisan / Weaver', 'Women', 180000, 'Pune', 'Maharashtra', 0),
(5, 'Suresh Babu Tambe', '+91 98220 33445', 'suresh.tambe@example.in', 46, 'Male', 'Street Vendor', 'OBC', 150000, 'Pune', 'Maharashtra', 0);

-- 2. Central & Maharashtra Government Schemes (11 Schemes)
INSERT INTO schemes (id, code, name, name_hi, name_mr, category, department, description, description_hi, description_mr, max_benefit, subsidy_pct, interest_rate, min_age, max_age, max_income, target_occupations, required_documents, application_process) VALUES
(1, 'PM-KISAN', 'PM-Kisan Samman Nidhi', 'प्रधानमंत्री किसान सम्मान निधि', 'प्रधानमंत्री किसान सन्मान निधी', 'Agriculture', 'Ministry of Agriculture & Farmers Welfare', 
'Income support of ₹6,000 per year in three equal installments to landholding farmer families across the country for procurement of agricultural inputs.',
'भूमिधारक किसान परिवारों को कृषि सामग्री की खरीद के लिए तीन समान किस्तों में प्रति वर्ष ₹6,000 की आय सहायता।',
'कृषी निविष्ठांच्या खरेदीसाठी देशभरातील जमीनधारक शेतकरी कुटुंबांना दरवर्षी ₹६,००० चे थेट उत्पन्न सहाय्य.',
6000, 100.00, 0.00, 18, 75, 300000, 
'["Farmer", "Agricultural Laborer", "Cultivator"]', 
'["Aadhaar Card", "7/12 Land Record Extract", "Bank Passbook", "Citizen Identity Proof"]', 
'["eKYC verification online", "Land records match by Tehsildar", "Direct DBT transfer to Aadhaar linked bank account"]'),

(2, 'PMEGP', 'Prime Minister Employment Generation Programme', 'प्रधानमंत्री रोजगार सृजन कार्यक्रम', 'पंतप्रधान रोजगार निर्मिती कार्यक्रम', 'MSME', 'Ministry of MSME / KVIC',
'Credit linked subsidy scheme for setting up micro enterprises in manufacturing (up to ₹50 Lakhs) and services (up to ₹20 Lakhs) with capital subsidy ranging from 15% to 35%.',
'विनिर्माण और सेवा क्षेत्र में सूक्ष्म उद्यम स्थापित करने के लिए ऋण-संबद्ध सब्सिडी योजना (15% से 35% पूंजी सब्सिडी)।',
'उत्पादन आणि सेवा क्षेत्रात सूक्ष्म उद्योग सुरू करण्यासाठी १५% ते ३५% भांडवली अनुदानासह क्रेडिट लिंक्ड योजना.',
1750000, 35.00, 8.50, 18, 60, 1200000,
'["Small Business", "Entrepreneur", "Artisan / Weaver", "Unemployed Youth", "Self Employed"]',
'["Project Report", "Educational Certificate (8th pass min for >10L)", "Caste/Special Category Certificate", "Aadhaar & PAN Card", "Skill Training / EDP Certificate"]',
'["Online application on KVIC portal", "District Level Task Force screening", "Sanction by bank branch", "10-day EDP training", "Subsidy release to TDR account"]'),

(3, 'MUDRA-SHISHU', 'Pradhan Mantri MUDRA Yojana (Shishu)', 'प्रधानमंत्री मुद्रा योजना (शिशु)', 'प्रधानमंत्री मुद्रा योजना (शिशू)', 'MSME', 'Department of Financial Services',
'Collateral-free micro loans up to ₹50,000 for small retail vendors, shopkeepers, service enterprises, and home-based artisans at concessional interest.',
'छोटे दुकानदारों, फेरीवालों और कारीगरों के लिए ₹50,000 तक का संपार्श्विक-मुक्त सूक्ष्म ऋण।',
'लहान व्यावसायिक, फेरीवाले आणि कारागिरांसाठी ₹५०,००० पर्यंतचे तारणमुक्त कर्ज.',
50000, 0.00, 8.00, 18, 65, 500000,
'["Street Vendor", "Small Business", "Artisan / Weaver", "Self Employed", "Driver"]',
'["Identity & Address Proof", "Quotation of items to be purchased", "Passport size photos", "Current Business details"]',
'["Select nearest partner bank branch", "Fill simplified 1-page Mudra form", "No processing fee", "Sanction within 7-10 days"]'),

(4, 'MUDRA-KISHORE', 'Pradhan Mantri MUDRA Yojana (Kishore)', 'प्रधानमंत्री मुद्रा योजना (किशोर)', 'प्रधानमंत्री मुद्रा योजना (किशोर)', 'MSME', 'Department of Financial Services',
'Business development loans ranging from ₹50,001 up to ₹5,00,000 for expanding existing small businesses, buying equipment, or working capital.',
'मौजूदा छोटे व्यवसायों के विस्तार और उपकरण खरीदने के लिए ₹50,001 से ₹5,00,000 तक का व्यावसायिक ऋण।',
'विद्यमान लहान व्यवसायांच्या विस्तारासाठी आणि उपकरणांसाठी ₹५०,००१ ते ₹५ लाखांपर्यंतचे व्यावसायिक कर्ज.',
500000, 0.00, 8.75, 18, 65, 800000,
'["Small Business", "Entrepreneur", "Retailer", "Self Employed"]',
'["Last 6 months bank statement", "Proof of business existence", "Sales tax/GST returns if applicable", "Quotation for machinery/stocks"]',
'["Submit business proposal to channel partner", "Due diligence and credit appraisal", "Sanction and disbursement with Mudra Card"]'),

(5, 'STANDUP-INDIA', 'Stand-Up India for Women & SC/ST', 'स्टैंड-अप इंडिया योजना', 'स्टँड-अप इंडिया योजना', 'Women & Social Welfare', 'Department of Financial Services',
'Bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for greenfield enterprise.',
'हर बैंक शाखा द्वारा कम से कम एक महिला और एक अनुसूचित जाति/जनजाति उद्यमी को ₹10 लाख से ₹1 करोड़ तक का ऋण।',
'प्रत्येक बँक शाखेद्वारे किमान एका महिला आणि एका मागासवर्गीय उद्योजकाला ₹१० लाख ते ₹१ कोटींचे कर्ज.',
10000000, 15.00, 7.75, 18, 60, 2000000,
'["Women", "Entrepreneur", "Small Business", "Graduate"]',
'["Identity proof (SC/ST certificate or proof of Woman ownership)", "Project proposal for greenfield unit", "Collateral or CGSSI guarantee", "Bank balance sheet"]',
'["Apply on Stand-Up Mitra portal", "Connect with Lead District Manager", "Handholding support from SIDBI / NABARD", "Bank sanction and monitoring"]'),

(6, 'MAHA-AGRI-MACH', 'MahaDBT Farm Mechanization Scheme', 'महाडीबीटी कृषी यांत्रिकीकरण योजना', 'महाडीबीटी कृषी यांत्रिकीकरण योजना', 'Agriculture', 'Department of Agriculture, Maharashtra',
'Financial assistance and 40% to 50% capital subsidy (up to ₹2.5 Lakhs) for Maharashtra farmers to purchase tractors, power tillers, rotavators, and harvesters.',
'महाराष्ट्र के किसानों को ट्रैक्टर, रोटावेटर और कृषि यंत्र खरीदने के लिए 40% से 50% (अधिकतम ₹2.5 लाख) की सब्सिडी।',
'महाराष्ट्रातील शेतकऱ्यांना ट्रॅक्टर, रोटाव्हेटर आणि कृषी अवजारे खरेदीसाठी ४०% ते ५०% (जास्तीत जास्त ₹२.५ लाख) अनुदान.',
250000, 50.00, 0.00, 18, 70, 500000,
'["Farmer", "Cultivator"]',
'["7/12 & 8A Land Extract", "Aadhaar Card linked with Bank", "Caste Certificate (for SC/ST 50% subsidy)", "Quotation from authorized dealer"]',
'["Online registration on MahaDBT portal", "Lottery/merit based selection", "Pre-sanction letter", "Purchase from empanelled dealer", "Physical inspection and subsidy transfer"]'),

(7, 'PM-SVANIDHI', 'PM SVANidhi (Street Vendor Loan)', 'पीएम स्वनिधि योजना', 'पीएम स्वनिधी योजना', 'Urban Development', 'Ministry of Housing & Urban Affairs',
'Special micro-credit facility providing ₹10,000 to ₹50,000 working capital loan with 7% interest subsidy and cashback incentives on digital transactions for urban street vendors.',
'शहरी रेहड़ी-पटरी वालों के लिए 7% ब्याज सब्सिडी के साथ ₹10,000 से ₹50,000 तक का कार्यशील पूंजी ऋण।',
'शहरी फेरीवाल्यांसाठी ७% व्याज अनुदानासह ₹१०,००० ते ₹५०,००० पर्यंतचे खेळते भांडवल कर्ज.',
50000, 7.00, 7.00, 18, 65, 300000,
'["Street Vendor", "Daily Wage Earner", "Hawker"]',
'["Vending Certificate / Urban Local Body ID Card", "Aadhaar Card", "Mobile Number linked with Bank", "Recommendation letter from ULB"]',
'["Direct application via Urban Local Body or Portal", "Branch endorsement", "Disbursement within 48 hours", "On-time repayment unlocks next higher tranche"]'),

(8, 'MAHA-BALIRAJA', 'Baliraja Jal Sanjivani Yojana', 'बळीराजा जलसंजीवनी योजना', 'बळीराजा जलसंजीवनी योजना', 'Agriculture', 'Water Resources Dept, Maharashtra',
'Special program for drought-prone regions in Maharashtra providing up to 80% subsidy for drip irrigation, farm ponds, solar agricultural pumps, and sprinkler sets.',
'महाराष्ट्र के सूखा प्रवण क्षेत्रों के किसानों को ड्रिप सिंचाई, खेत तालाब और सौर पंपों के लिए 80% तक सब्सिडी।',
'महाराष्ट्रातील दुष्काळग्रस्त भागातील शेतकऱ्यांसाठी ठिबक सिंचन, शेततळे आणि सौर पंपांसाठी ८०% पर्यंत अनुदान.',
180000, 80.00, 0.00, 18, 72, 400000,
'["Farmer", "Cultivator"]',
'["7/12 Land Record", "Water source certificate (Well / Borewell)", "Electricity bill or Solar application", "Aadhaar & Bank details"]',
'["Submit via Taluka Agriculture Office or MahaDBT", "Technical survey of field", "Approval of equipment installation", "Direct DBT subsidy release"]'),

(9, 'NSAP-IGNOAPS', 'National Social Assistance Pension', 'इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन', 'इंदिरा गांधी राष्ट्रीय वृद्धापकाळ निवृत्तीवेतन', 'Social Welfare', 'Ministry of Rural Development',
'Monthly financial pension for senior citizens (aged 60+) belonging to BPL families or households with minimal income for dignity and healthcare support.',
'गरीबी रेखा से नीचे या निम्न आय वाले वरिष्ठ नागरिकों (60+) के लिए मासिक वित्तीय पेंशन।',
'दारिद्र्यरेषेखालील किंवा अल्प उत्पन्न असलेल्या ज्येष्ठ नागरिकांसाठी (६०+) मासिक निवृत्तीवेतन सहाय्य.',
12000, 100.00, 0.00, 60, 100, 150000,
'["Senior Citizen", "Retired", "Homemaker", "Unemployed Youth"]',
'["Age Proof (Birth cert / Voter ID / Aadhaar)", "BPL Card or Tehsildar Income Certificate", "Bank Account Passbook"]',
'["Apply at Gram Panchayat / Municipal Ward Office", "Tehsildar verification", "Monthly DBT pension directly into citizen account"]'),

(10, 'MAHILA-SAMRIDDHI', 'Mahila Samriddhi Yojana', 'महिला समृद्धि योजना', 'महिला समृद्धी योजना', 'Women Empowerment', 'National Backward Classes Finance & Dev Corp',
'Concessional micro-finance loans up to ₹1,40,000 at 4% annual interest for women entrepreneurs and self-help group members in backward and minority communities.',
'पिछड़े और अल्पसंख्यक समुदायों की महिला उद्यमियों और स्वयं सहायता समूहों के लिए 4% रियायती ब्याज दर पर सूक्ष्म वित्त ऋण।',
'मागासवर्गीय आणि महिला बचत गटांच्या सदस्यांसाठी ४% सवलतीच्या व्याजदराने ₹१,४०,००० पर्यंतचे सूक्ष्म वित्त कर्ज.',
140000, 20.00, 4.00, 18, 55, 300000,
'["Women", "Artisan / Weaver", "Small Business", "Self Employed"]',
'["Self Help Group Membership proof", "Aadhaar Card", "Community/OBC Certificate", "Bank Account Passbook"]',
'["Application through MAVIM or empanelled State Channelizing Agency", "Group scrutiny", "Sanction and training", "Direct disbursement"]'),

(11, 'SKILL-INDIA-YOUTH', 'Skill India Youth Entrepreneurship Loan', 'स्किल इंडिया युवा उद्यमिता ऋण', 'स्किल इंडिया युवा उद्योजकता कर्ज', 'Skill Development', 'Ministry of Skill Development & Entrepreneurship',
'Seed capital and working capital credit up to ₹3,00,000 with 25% capital subsidy for certified vocational trainees and ITI/polytechnic graduates setting up local workshops.',
'प्रमाणित व्यावसायिक प्रशिक्षुओं और आईटीआई स्नातकों के लिए 25% सब्सिडी के साथ ₹3,00,000 तक का बीज पूंजी ऋण।',
'प्रमाणित व्यावसायिक प्रशिक्षणार्थी आणि आयटीआय पदवीधरांसाठी २५% अनुदानासह ₹३,००,००० पर्यंतचे बीज भांडवल कर्ज.',
300000, 25.00, 7.50, 18, 35, 450000,
'["Student / Graduate", "Artisan / Weaver", "Self Employed", "Unemployed Youth"]',
'["Skill Certification / ITI Diploma", "Project Quotation", "Aadhaar & PAN Card", "Residential Certificate"]',
'["Apply through District Industry Centre (DIC)", "Technical feasibility interview", "Bank sanction with Credit Guarantee"]');

-- 3. Deterministic Scheme Rules
INSERT INTO scheme_rules (scheme_id, rule_type, rule_key, operator, rule_value, description, description_hi, description_mr, is_mandatory) VALUES
-- PM-KISAN
(1, 'OCCUPATION', 'occupation', 'IN', 'Farmer,Agricultural Laborer,Cultivator', 'Applicant must be an agricultural cultivator or farmer', 'आवेदक किसान या खेतिहर होना चाहिए', 'अर्जदार शेतकरी किंवा शेतमजूर असणे आवश्यक आहे', TRUE),
(1, 'LAND', 'landholding_acres', '>', '0', 'Applicant must hold verifiable agricultural land', 'आवेदक के पास कृषि भूमि होनी चाहिए', 'अर्जदाराच्या नावावर शेतजमीन असणे आवश्यक आहे', TRUE),
(1, 'INCOME', 'annual_income', '<=', '300000', 'Annual family income must not exceed ₹3,00,000', 'पारिवारिक वार्षिक आय ₹3,00,000 से कम होनी चाहिए', 'वार्षिक उत्पन्न ₹३,००,००० पेक्षा कमी असावे', FALSE),

-- PMEGP
(2, 'AGE', 'age', '>=', '18', 'Applicant must be at least 18 years of age', 'आवेदक की आयु न्यूनतम 18 वर्ष होनी चाहिए', 'अर्जदाराचे वय किमान १८ वर्षे असणे आवश्यक आहे', TRUE),
(2, 'INCOME', 'annual_income', '<=', '1200000', 'Income ceiling up to ₹12,00,000 for manufacturing/service setup', 'वार्षिक आय सीमा ₹12 लाख तक', 'वार्षिक उत्पन्न ₹१२ लाखांपर्यंत चालते', FALSE),
(2, 'OCCUPATION', 'occupation', 'IN', 'Small Business,Entrepreneur,Artisan / Weaver,Unemployed Youth,Self Employed', 'Applicant must be planning a micro business or manufacturing enterprise', 'सूक्ष्म उद्योग शुरू करने की योजना होनी चाहिए', 'सूक्ष्म उद्योग सुरू करण्याची योजना असावी', TRUE),

-- MUDRA-SHISHU
(3, 'AGE', 'age', '>=', '18', 'Applicant must be at least 18 years of age', 'न्यूनतम आयु 18 वर्ष', 'किमान वय १८ वर्षे', TRUE),
(3, 'OCCUPATION', 'occupation', 'IN', 'Street Vendor,Small Business,Artisan / Weaver,Self Employed,Driver,Farmer', 'Must be engaged in non-farm micro enterprise or retail service', 'गैर-कृषि सूक्ष्म उद्यम या खुदरा व्यापार में संलग्न होना चाहिए', 'कृषितर सूक्ष्म व्यवसाय किंवा किरकोळ सेवेत असावे', TRUE),

-- MUDRA-KISHORE
(4, 'AGE', 'age', '>=', '18', 'Applicant must be at least 18 years old', 'न्यूनतम आयु 18 वर्ष', 'किमान वय १८ वर्षे', TRUE),
(4, 'INCOME', 'annual_income', '<=', '800000', 'Annual income ceiling up to ₹8,00,000', 'वार्षिक आय ₹8,00,000 तक', 'वार्षिक उत्पन्न ₹८ लाखांपर्यंत', FALSE),

-- STANDUP-INDIA
(5, 'AGE', 'age', '>=', '18', 'Applicant must be at least 18 years old', 'न्यूनतम आयु 18 वर्ष', 'किमान वय १८ वर्षे', TRUE),
(5, 'CATEGORY', 'category', 'IN', 'Women,SC,ST', 'Applicant must belong to SC, ST or Women category for Stand-Up India', 'आवेदक महिला या अनुसूचित जाति/जनजाति वर्ग से होना चाहिए', 'अर्जदार महिला किंवा अनुसूचित जाती/जमाती प्रवर्गातील असावा', TRUE),

-- MAHA-AGRI-MACH
(6, 'OCCUPATION', 'occupation', 'IN', 'Farmer,Cultivator', 'Must be a registered farmer in Maharashtra', 'महाराष्ट्र में पंजीकृत किसान होना आवश्यक', 'महाराष्ट्रातील नोंदणीकृत शेतकरी असणे आवश्यक', TRUE),
(6, 'LAND', 'landholding_acres', '>=', '1.0', 'Minimum 1 acre of agricultural landholding required', 'न्यूनतम 1 एकड़ कृषि भूमि आवश्यक', 'किमान १ एकर शेतजमीन आवश्यक', TRUE),
(6, 'LOCATION', 'state', '==', 'Maharashtra', 'Must be a resident farmer of Maharashtra state', 'महाराष्ट्र राज्य का निवासी होना आवश्यक', 'महाराष्ट्र राज्याचा रहिवासी असणे आवश्यक', TRUE),

-- PM-SVANIDHI
(7, 'OCCUPATION', 'occupation', 'IN', 'Street Vendor,Daily Wage Earner,Hawker', 'Must be an urban or semi-urban street vendor or hawker', 'शहरी या अर्ध-शहरी रेहड़ी-पटरी विक्रेता होना चाहिए', 'शहरी किंवा निमशहरी फेरीवाला असावा', TRUE),
(7, 'AGE', 'age', '>=', '18', 'Minimum 18 years of age', 'न्यूनतम 18 वर्ष', 'किमान वय १८ वर्षे', TRUE),

-- MAHA-BALIRAJA
(8, 'OCCUPATION', 'occupation', 'IN', 'Farmer,Cultivator', 'Must be an agricultural landholder in Maharashtra', 'महाराष्ट्र में कृषक होना आवश्यक', 'महाराष्ट्रातील शेतकरी असणे आवश्यक', TRUE),
(8, 'LOCATION', 'state', '==', 'Maharashtra', 'Applicable exclusively in Maharashtra state', 'केवल महाराष्ट्र राज्य के लिए लागू', 'फक्त महाराष्ट्र राज्यासाठी लागू', TRUE),

-- NSAP-IGNOAPS
(9, 'AGE', 'age', '>=', '60', 'Applicant must be a senior citizen aged 60 years or above', 'आवेदक की आयु 60 वर्ष या अधिक होनी चाहिए', 'अर्जदाराचे वय ६० वर्षे किंवा त्याहून अधिक असणे आवश्यक आहे', TRUE),
(9, 'INCOME', 'annual_income', '<=', '150000', 'Annual family income must be below ₹1,50,000 or BPL', 'वार्षिक आय ₹1,50,000 से कम या बीपीएल', 'वार्षिक उत्पन्न ₹१.५ लाखांपेक्षा कमी किंवा दारिद्र्यरेषेखालील', TRUE),

-- MAHILA-SAMRIDDHI
(10, 'CATEGORY', 'category', 'IN', 'Women,OBC,SC,ST,Minority', 'Applicant must be a woman entrepreneur or SHG member', 'आवेदक महिला उद्यमी या स्वयं सहायता समूह सदस्य होनी चाहिए', 'अर्जदार महिला उद्योजिका किंवा बचत गट सदस्य असणे आवश्यक आहे', TRUE),

-- SKILL-INDIA-YOUTH
(11, 'AGE', 'age', '<=', '35', 'Applicant age must not exceed 35 years for youth credit', 'युवा ऋण के लिए अधिकतम आयु 35 वर्ष', 'तरुणांसाठी कमाल वय ३५ वर्षे', TRUE),
(11, 'AGE', 'age', '>=', '18', 'Applicant must be at least 18 years of age', 'न्यूनतम आयु 18 वर्ष', 'किमान वय १८ वर्षे', TRUE);

-- 4. Channel Partners in Pune / Maharashtra (10 Partners)
-- Note: Sample data clearly marked for demo compliance
INSERT INTO partners (id, name, type, district, state, address, latitude, longitude, fund_available, npa_percentage, overdue_rate, is_authorized, rating, contact_phone, contact_email, is_demo_data) VALUES
(1, 'District Finance Facilitation Centre', 'Facilitation Centre', 'Pune', 'Maharashtra', 'Camp Area, Dr. Ambedkar Road, Pune District - 411001', 18.5167, 73.8763, 85000000, 2.1, 3.4, TRUE, 4.8, '+91 20 2612 8891', 'pune.dffc@maha.gov.in (Sample Demo)', TRUE),
(2, 'NSFDC Channel Partner', 'State Agency', 'Pune', 'Maharashtra', 'Shivajinagar Bus Station Complex, Pune - 411005', 18.5314, 73.8446, 62000000, 3.2, 4.1, TRUE, 4.7, '+91 20 2553 4410', 'nsfdc.pune@partner.org (Sample Demo)', TRUE),
(3, 'Entrepreneur Support Centre', 'Facilitation Centre', 'Pune', 'Maharashtra', 'Kothrud Industrial Area, Paud Road, Pune - 411038', 18.5074, 73.8077, 45000000, 4.5, 5.2, TRUE, 4.5, '+91 20 2544 1900', 'esc.kothrud@support.org (Sample Demo)', TRUE),
(4, 'Bank of Maharashtra Lead District Office', 'Nationalized Bank', 'Pune', 'Maharashtra', 'Lokmangal, 1501 Shivajinagar / Deccan Gymkhana, Pune - 411005', 18.5180, 73.8415, 125000000, 2.8, 3.1, TRUE, 4.9, '+91 20 2553 2731', 'leaddistrict.pune@bankofmaharashtra.in (Sample Demo)', TRUE),
(5, 'Pune District Central Cooperative Bank (PDCC)', 'Cooperative Bank', 'Pune', 'Maharashtra', '4B Laxmi Road, Swargate, Pune - 411002', 18.5018, 73.8586, 95000000, 5.1, 6.8, TRUE, 4.3, '+91 20 2444 3121', 'swargate@pdccbank.com (Sample Demo)', TRUE),
(6, 'State Bank of India SME Center', 'Nationalized Bank', 'Pune', 'Maharashtra', 'Mega Center, Magarpatta Road, Hadapsar, Pune - 411028', 18.5089, 73.9259, 140000000, 1.9, 2.7, TRUE, 4.9, '+91 20 2689 0451', 'sme.hadapsar@sbi.co.in (Sample Demo)', TRUE),
(7, 'Maharashtra State Financial Corporation (MSFC)', 'State Agency', 'Pune', 'Maharashtra', 'Senapati Bapat Road, Shivajinagar, Pune - 411016', 18.5362, 73.8298, 55000000, 4.2, 4.9, TRUE, 4.4, '+91 20 2565 7701', 'pune@msfcindia.org (Sample Demo)', TRUE),
(8, 'Mahila Arthik Vikas Mahamandal (MAVIM)', 'State Agency', 'Pune', 'Maharashtra', 'Fergusson College Road, Shivajinagar, Pune - 411004', 18.5246, 73.8418, 38000000, 1.5, 2.1, TRUE, 4.9, '+91 20 2567 1190', 'mavim.pune@maharashtra.gov.in (Sample Demo)', TRUE),
(9, 'Canara Bank Rural Financial Center', 'Nationalized Bank', 'Pune', 'Maharashtra', 'Baramati MIDC Road, Baramati Sub-district, Pune - 413133', 18.1519, 74.5772, 70000000, 3.8, 4.5, TRUE, 4.6, '+91 2112 222 411', 'rural.baramati@canarabank.com (Sample Demo)', TRUE),
(10, 'NABARD Financial Services', 'NBFC', 'Pune', 'Maharashtra', 'Survey 65/2, Wakadewadi, Pune - 411003', 18.5410, 73.8505, 88000000, 1.8, 2.4, TRUE, 4.8, '+91 20 2556 9021', 'nabfins.pune@nabard.org (Sample Demo)', TRUE);

-- 5. Partner Scheme Mappings
INSERT INTO partner_schemes (partner_id, scheme_id, allocated_quota, processed_count) VALUES
-- District Finance Facilitation Centre supports PM-KISAN, PMEGP, MUDRA-SHISHU, MAHA-AGRI-MACH
(1, 1, 1500, 890),
(1, 2, 400, 210),
(1, 3, 800, 560),
(1, 6, 350, 190),

-- NSFDC Channel Partner supports STANDUP-INDIA, MAHILA-SAMRIDDHI, PMEGP, MUDRA-KISHORE
(2, 5, 250, 140),
(2, 10, 600, 480),
(2, 2, 300, 190),
(2, 4, 450, 310),

-- Entrepreneur Support Centre supports PMEGP, MUDRA-SHISHU, MUDRA-KISHORE, SKILL-INDIA-YOUTH
(3, 2, 500, 320),
(3, 3, 600, 410),
(3, 4, 350, 220),
(3, 11, 400, 260),

-- Bank of Maharashtra supports PM-KISAN, PMEGP, MUDRA-KISHORE, MUDRA-TARUN, STANDUP-INDIA
(4, 1, 3000, 2400),
(4, 2, 800, 610),
(4, 4, 1200, 950),
(4, 5, 400, 310),
(4, 6, 700, 510),

-- Pune District Central Coop Bank supports PM-KISAN, MAHA-AGRI-MACH, MAHA-BALIRAJA
(5, 1, 4000, 3500),
(5, 6, 900, 720),
(5, 8, 600, 430),

-- SBI SME Center supports PMEGP, MUDRA-KISHORE, STANDUP-INDIA, PM-SVANIDHI
(6, 2, 1200, 980),
(6, 4, 1500, 1180),
(6, 5, 600, 490),
(6, 7, 2000, 1750),

-- MSFC supports PMEGP, MUDRA-KISHORE, SKILL-INDIA-YOUTH
(7, 2, 450, 300),
(7, 4, 500, 360),
(7, 11, 350, 210),

-- MAVIM supports MAHILA-SAMRIDDHI, STANDUP-INDIA, PM-SVANIDHI
(8, 10, 1200, 990),
(8, 5, 300, 230),
(8, 7, 800, 650),

-- Canara Bank Rural Baramati supports PM-KISAN, MAHA-AGRI-MACH, MAHA-BALIRAJA
(9, 1, 2500, 2100),
(9, 6, 600, 480),
(9, 8, 500, 390),

-- NABARD Fin Services supports PMEGP, MAHA-AGRI-MACH, MAHILA-SAMRIDDHI, MUDRA-SHISHU
(10, 2, 700, 520),
(10, 6, 800, 630),
(10, 10, 900, 740),
(10, 3, 1100, 890);

-- 6. Initial Demo Applications
INSERT INTO applications (id, application_no, user_id, scheme_id, partner_id, applicant_name, applicant_phone, applicant_district, applicant_occupation, requested_amount, subsidy_amount, tenure_months, interest_rate, monthly_emi, status, remarks) VALUES
(1, 'SHK-2026-8941', 1, 6, 1, 'Ramesh Tukaram Patil', '+91 98220 12345', 'Pune', 'Farmer', 200000, 100000, 36, 0.0, 2777.78, 'Under Review', 'Tractor rotavator mechanization application. Land records verified by Tehsildar.'),
(2, 'SHK-2026-7812', 2, 2, 4, 'Priya Santosh Sharma', '+91 98220 54321', 'Pune', 'Small Business', 800000, 280000, 60, 8.5, 10680.50, 'Documents Required', 'Food processing unit expansion. Awaiting EDP training completion certificate.'),
(3, 'SHK-2026-4409', 5, 7, 6, 'Suresh Babu Tambe', '+91 98220 33445', 'Pune', 'Street Vendor', 20000, 1400, 12, 7.0, 1730.00, 'Approved', 'Tranche 2 working capital sanctioned. Digital transaction cashback activated.');

INSERT INTO application_status_history (application_id, status, notes) VALUES
(1, 'Submitted', 'Citizen submitted application with 7/12 land extract and quotation.'),
(1, 'Under Review', 'District Finance Facilitation Centre initiated technical inspection.'),
(2, 'Submitted', 'PMEGP application registered online with project report.'),
(2, 'Under Review', 'Task force committee approved primary eligibility.'),
(2, 'Documents Required', 'Additional EDP training certificate requested from applicant.'),
(3, 'Submitted', 'Street vendor vending ID submitted.'),
(3, 'Under Review', 'Branch verification complete.'),
(3, 'Approved', 'Micro credit sanctioned with 7% interest subvention.');
