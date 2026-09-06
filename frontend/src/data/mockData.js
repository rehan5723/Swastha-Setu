/**
 * mockData.js — centralised mock data for Swasthya Setu.
 *
 * Structure mirrors what the real ML/backend API will eventually return.
 * All UI components should consume data from here (or the API service),
 * never from hardcoded objects inline.
 */

/* ── User ────────────────────────────────────────────── */
export const MOCK_USER = {
  id: 'usr_001',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  mobile: '+91 98765 43210',
  avatar: null, // Will be a URL when profile photos are supported
  state: 'Maharashtra',
  district: 'Pune',
  dob: '1995-07-14',
  gender: 'Male',
  bloodGroup: 'O+',
  joinedAt: '2024-01-10T09:00:00Z',
}

/* ── Medical Report Analysis ────────────────────────── */
export const MOCK_REPORT_ANALYSIS = {
  id: 'rpt_001',
  type: 'medical_report',
  fileName: 'Blood_Report_Jan2024.pdf',
  analyzedAt: '2024-01-15T10:30:00Z',
  urgencyLevel: 'moderate',
  summary: {
    total: 18,
    normal: 14,
    attention: 3,
    highPriority: 1,
  },
  parameters: [
    { name: 'Hemoglobin',   value: 13.5, unit: 'g/dL',     refMin: 13.0, refMax: 17.5, status: 'normal'    },
    { name: 'RBC Count',    value: 4.8,  unit: 'mil/μL',    refMin: 4.5,  refMax: 5.5,  status: 'normal'    },
    { name: 'WBC Count',    value: 9800, unit: '/μL',        refMin: 4000, refMax: 11000,status: 'attention' },
    { name: 'Platelets',    value: 215,  unit: 'thou/μL',   refMin: 150,  refMax: 400,  status: 'normal'    },
    { name: 'Vitamin D',    value: 14.2, unit: 'ng/mL',     refMin: 30,   refMax: 100,  status: 'high'      },
    { name: 'Vitamin B12',  value: 280,  unit: 'pg/mL',     refMin: 200,  refMax: 900,  status: 'attention' },
    { name: 'Iron',         value: 72,   unit: 'μg/dL',     refMin: 60,   refMax: 170,  status: 'normal'    },
    { name: 'Serum Glucose',value: 98,   unit: 'mg/dL',     refMin: 70,   refMax: 100,  status: 'normal'    },
    { name: 'HbA1c',        value: 5.4,  unit: '%',          refMin: 0,    refMax: 5.6,  status: 'normal'    },
    { name: 'Total Cholesterol', value: 198, unit: 'mg/dL', refMin: 0,    refMax: 200,  status: 'attention' },
    { name: 'HDL',          value: 52,   unit: 'mg/dL',     refMin: 40,   refMax: 60,   status: 'normal'    },
    { name: 'LDL',          value: 128,  unit: 'mg/dL',     refMin: 0,    refMax: 130,  status: 'normal'    },
    { name: 'Triglycerides',value: 130,  unit: 'mg/dL',     refMin: 0,    refMax: 150,  status: 'normal'    },
    { name: 'Creatinine',   value: 1.0,  unit: 'mg/dL',     refMin: 0.7,  refMax: 1.2,  status: 'normal'    },
    { name: 'Urea',         value: 24,   unit: 'mg/dL',     refMin: 7,    refMax: 25,   status: 'normal'    },
    { name: 'SGPT (ALT)',   value: 32,   unit: 'U/L',        refMin: 7,    refMax: 56,   status: 'normal'    },
    { name: 'SGOT (AST)',   value: 28,   unit: 'U/L',        refMin: 10,   refMax: 40,   status: 'normal'    },
    { name: 'TSH',          value: 2.3,  unit: 'mIU/L',     refMin: 0.4,  refMax: 4.0,  status: 'normal'    },
  ],
  explanation: {
    simple:
      'Your blood report shows 14 values within the provided reference ranges. Three values (WBC Count, Vitamin B12, and Total Cholesterol) are near the upper boundaries of their reference ranges and may benefit from monitoring. One value — Vitamin D — is reported below the reference range provided in this report.',
    detailed:
      'Vitamin D at 14.2 ng/mL is below the lower reference limit of 30 ng/mL listed in your report. Vitamin D plays a role in calcium absorption and immune function. WBC at 9,800/μL is within range but elevated compared to mid-range values — this can be transient due to minor infections or stress. Vitamin B12 at 280 pg/mL is within range but toward the lower end; levels between 200–400 pg/mL may be worth monitoring over time. Total Cholesterol is near the upper threshold at 198 mg/dL.',
  },
  nextStep:
    'Consider discussing Vitamin D with a healthcare professional, particularly regarding supplementation. Follow up on WBC trends if symptoms such as fever or fatigue are present. This analysis is AI-assisted and is for informational purposes only.',
  disclaimer:
    'AI-assisted information is for informational purposes only and does not constitute a medical diagnosis or medical advice. Consult a qualified healthcare professional for medical concerns.',
}

/* ── X-Ray / Imaging Analysis ───────────────────────── */
export const MOCK_IMAGING_ANALYSIS = {
  id: 'img_001',
  type: 'xray',
  fileName: 'Chest_XRay_Jan2024.jpg',
  analyzedAt: '2024-01-16T14:20:00Z',
  urgencyLevel: 'low',
  region: 'Chest',
  findings: [
    { label: 'Lung fields', finding: 'Appear clear bilaterally',             confidence: 0.91 },
    { label: 'Heart size',  finding: 'Within normal limits for view',         confidence: 0.88 },
    { label: 'Costophrenic angles', finding: 'Appear sharp bilaterally',      confidence: 0.86 },
    { label: 'Bony structures', finding: 'No obvious fracture detected',      confidence: 0.84 },
    { label: 'Mediastinum', finding: 'Appears within normal limits',          confidence: 0.79 },
  ],
  summary:
    'Preliminary AI-assisted review of the uploaded chest X-ray image did not detect findings of high concern. Lung fields appear clear. These are preliminary observations only.',
  nextStep:
    'A qualified radiologist should formally review this image. If you have symptoms such as chest pain, breathlessness, or persistent cough, seek prompt medical evaluation.',
  disclaimer:
    'AI-assisted information is for informational purposes only and does not constitute a medical diagnosis or medical advice. Consult a qualified healthcare professional for medical concerns.',
}

/* ── Dermatology Analysis ───────────────────────────── */
export const MOCK_DERMATOLOGY_ANALYSIS = {
  id: 'derm_001',
  type: 'dermatology',
  method: 'image',
  analyzedAt: '2024-01-17T09:10:00Z',
  possibleConditions: [
    {
      name: 'Contact Dermatitis',
      confidence: 0.72,
      matchingSymptoms: ['Redness', 'Itching', 'Localized rash', 'Dry skin'],
      description:
        'An inflammation of the skin that occurs when contact with a substance causes a reaction. Usually localised to the area of contact.',
    },
    {
      name: 'Atopic Eczema',
      confidence: 0.58,
      matchingSymptoms: ['Itching', 'Dry skin', 'Redness'],
      description:
        'A chronic condition that makes skin red, dry and itchy. Common in childhood but can affect any age.',
    },
    {
      name: 'Psoriasis (mild)',
      confidence: 0.34,
      matchingSymptoms: ['Redness', 'Dry skin'],
      description:
        'An immune-mediated condition causing skin cells to build up, forming scales and dry, itchy patches.',
    },
  ],
  generalPrecautions: [
    'Avoid scratching the affected area',
    'Keep skin moisturised with fragrance-free products',
    'Avoid known irritants such as harsh soaps or detergents',
    'Wear loose, breathable clothing over the affected area',
  ],
  thingsToAvoid: [
    'Scented soaps, perfumes, and synthetic fabrics',
    'Hot showers that may dry out skin further',
    'Scratching, which can introduce infection',
  ],
  whenToSeek:
    'Seek professional evaluation if the rash spreads rapidly, is accompanied by fever, swelling, or difficulty breathing, or does not improve within a week.',
  disclaimer:
    'AI-assisted information is for informational purposes only and does not constitute a medical diagnosis or medical advice. Consult a qualified dermatologist or healthcare professional for skin concerns.',
}

/* ── Government Schemes ──────────────────────────────── */
export const MOCK_GOVERNMENT_SCHEMES = [
  {
    id: 'scheme_001',
    name: 'Ayushman Bharat PM-JAY',
    department: 'Ministry of Health & Family Welfare',
    description:
      'Provides health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalisation.',
    benefits: ['₹5 lakh annual health cover', 'Cashless & paperless treatment', '1,574+ medical packages covered'],
    eligibility: ['BPL families', 'SECC database listed families', 'No restriction on family size or age'],
    documents: ['Aadhaar Card', 'Ration Card', 'SECC/BPL Certificate'],
    applicationInfo: 'Apply via Ayushman Bharat portal or nearest Common Service Centre (CSC).',
    officialUrl: 'https://pmjay.gov.in',
    states: 'All India',
    category: 'hospitalisation',
  },
  {
    id: 'scheme_002',
    name: 'Pradhan Mantri Suraksha Bima Yojana',
    department: 'Ministry of Finance',
    description:
      'Accident insurance scheme offering ₹2 lakh cover for accidental death or disability at ₹20/year premium.',
    benefits: ['₹2 lakh cover for accidental death', '₹1 lakh for partial disability', 'Affordable ₹20/year premium'],
    eligibility: ['Age 18–70 years', 'Savings bank account holder', 'Aadhaar-linked account preferred'],
    documents: ['Aadhaar Card', 'Bank account details'],
    applicationInfo: 'Enroll through your bank branch or net banking portal.',
    officialUrl: 'https://jansuraksha.gov.in',
    states: 'All India',
    category: 'insurance',
  },
  {
    id: 'scheme_003',
    name: 'Rashtriya Arogya Nidhi',
    department: 'Ministry of Health & Family Welfare',
    description:
      'Provides financial assistance to BPL patients suffering from major life-threatening diseases requiring hospitalisation.',
    benefits: ['Financial assistance for major illnesses', 'Covers cancer, heart surgery, kidney transplant & more'],
    eligibility: ['BPL families', 'Treatment at government hospitals', 'Specific life-threatening conditions'],
    documents: ['BPL Certificate', 'Medical certificate from govt hospital', 'Aadhaar Card'],
    applicationInfo: 'Apply through the treating government hospital.',
    officialUrl: 'https://mohfw.gov.in',
    states: 'All India',
    category: 'financial_aid',
  },
  {
    id: 'scheme_004',
    name: 'Mahatma Jyotiba Phule Jan Arogya Yojana',
    department: 'Maharashtra Government',
    description:
      'Maharashtra-specific scheme providing cashless medical treatment up to ₹1.5 lakh per year.',
    benefits: ['₹1.5 lakh annual cover', 'Cashless treatment at network hospitals', '996+ medical & surgical procedures'],
    eligibility: ['Maharashtra residents', 'Yellow/Orange/White ration card holders', 'Farmers and their families'],
    documents: ['Ration Card', 'Aadhaar Card', 'Maharashtra domicile proof'],
    applicationInfo: 'Apply at network hospitals or district health offices in Maharashtra.',
    officialUrl: 'https://www.jeevandayee.gov.in',
    states: 'Maharashtra',
    category: 'state_scheme',
  },
]

/* ── Analysis History ────────────────────────────────── */
export const MOCK_HISTORY = [
  {
    id: 'rpt_001',
    type: 'medical_report',
    label: 'Blood Report Analysis',
    fileName: 'Blood_Report_Jan2024.pdf',
    date: '2024-01-15T10:30:00Z',
    urgency: 'moderate',
    summary: '18 parameters · 1 high priority',
  },
  {
    id: 'img_001',
    type: 'imaging',
    label: 'Chest X-Ray Analysis',
    fileName: 'Chest_XRay_Jan2024.jpg',
    date: '2024-01-16T14:20:00Z',
    urgency: 'low',
    summary: '5 findings · No high concern',
  },
  {
    id: 'derm_001',
    type: 'dermatology',
    label: 'Skin Concern Analysis',
    fileName: 'Skin_Image.jpg',
    date: '2024-01-17T09:10:00Z',
    urgency: 'moderate',
    summary: '3 possible conditions identified',
  },
]
