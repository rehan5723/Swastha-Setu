const user = {
  id: 'usr_001',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  mobile: '+91 98765 43210',
  avatar: null,
  state: 'Maharashtra',
  district: 'Pune',
  dob: '1995-07-14',
  gender: 'Male',
  bloodGroup: 'O+',
  joinedAt: '2024-01-10T09:00:00Z',
}

const reportAnalysis = {
  id: 'rpt_001',
  type: 'medical_report',
  fileName: 'Blood_Report_Jan2024.pdf',
  analyzedAt: '2024-01-15T10:30:00Z',
  urgencyLevel: 'moderate',
  summary: { total: 3, normal: 1, attention: 1, highPriority: 1 },
  parameters: [
    { name: 'Hemoglobin', value: 13.5, unit: 'g/dL', refMin: 13, refMax: 17.5, status: 'normal' },
    { name: 'WBC Count', value: 9800, unit: '/uL', refMin: 4000, refMax: 11000, status: 'attention' },
    { name: 'Vitamin D', value: 14.2, unit: 'ng/mL', refMin: 30, refMax: 100, status: 'high' },
  ],
  explanation: { simple: 'Most reported values are within range. Vitamin D is below the reference range and WBC count may warrant monitoring.' },
  nextStep: 'Discuss the Vitamin D result with a qualified healthcare professional.',
  disclaimer: 'AI-assisted information is for informational purposes only and does not constitute medical advice.',
}

const imagingAnalysis = {
  id: 'img_001', type: 'xray', fileName: 'Chest_XRay_Jan2024.jpg', analyzedAt: '2024-01-16T14:20:00Z', urgencyLevel: 'low', region: 'Chest',
  findings: [
    { label: 'Lung fields', finding: 'Appear clear bilaterally', confidence: 0.91 },
    { label: 'Heart size', finding: 'Within normal limits for view', confidence: 0.88 },
  ],
  summary: 'Preliminary AI-assisted review did not detect findings of high concern.',
  nextStep: 'A qualified radiologist should formally review this image.',
  disclaimer: 'AI-assisted information is for informational purposes only and does not constitute medical advice.',
}

const dermatologyAnalysis = {
  id: 'derm_001', type: 'dermatology', method: 'image', fileName: 'Skin_Image.jpg', analyzedAt: '2024-01-17T09:10:00Z', urgencyLevel: 'moderate',
  possibleConditions: [
    { name: 'Contact Dermatitis', confidence: 0.72, matchingSymptoms: ['Redness', 'Itching'], description: 'Skin inflammation that can occur after contact with an irritant.' },
    { name: 'Atopic Eczema', confidence: 0.58, matchingSymptoms: ['Itching', 'Dry skin'], description: 'A condition that can make skin red, dry and itchy.' },
  ],
  generalPrecautions: ['Avoid scratching the affected area', 'Keep skin moisturised', 'Avoid known irritants'],
  nextStep: 'Seek professional evaluation if symptoms spread or do not improve.',
  disclaimer: 'AI-assisted information is for informational purposes only and does not constitute medical advice.',
}

const history = [
  { id: 'rpt_001', type: 'medical_report', label: 'Blood Report Analysis', fileName: reportAnalysis.fileName, date: reportAnalysis.analyzedAt, urgency: 'moderate', summary: '3 parameters · 1 high priority' },
  { id: 'img_001', type: 'imaging', label: 'Chest X-Ray Analysis', fileName: imagingAnalysis.fileName, date: imagingAnalysis.analyzedAt, urgency: 'low', summary: '2 findings · No high concern' },
  { id: 'derm_001', type: 'dermatology', label: 'Skin Concern Analysis', fileName: dermatologyAnalysis.fileName, date: dermatologyAnalysis.analyzedAt, urgency: 'moderate', summary: '2 possible conditions identified' },
]

const schemes = [
  { id: 'scheme_001', name: 'Ayushman Bharat PM-JAY', department: 'Ministry of Health & Family Welfare', description: 'Provides health cover of Rs 5 lakh per family per year for secondary and tertiary care hospitalisation.', benefits: ['Rs 5 lakh annual health cover', 'Cashless and paperless treatment'], eligibility: ['BPL families', 'SECC database listed families'], documents: ['Aadhaar Card', 'Ration Card'], applicationInfo: 'Apply via the Ayushman Bharat portal or nearest CSC.', officialUrl: 'https://pmjay.gov.in', states: 'All India', category: 'hospitalisation' },
  { id: 'scheme_002', name: 'Pradhan Mantri Suraksha Bima Yojana', department: 'Ministry of Finance', description: 'Accident insurance offering cover for accidental death or disability.', benefits: ['Rs 2 lakh accidental death cover', 'Affordable annual premium'], eligibility: ['Age 18-70 years', 'Savings bank account holder'], documents: ['Aadhaar Card', 'Bank account details'], applicationInfo: 'Enroll through your bank branch or net banking portal.', officialUrl: 'https://jansuraksha.gov.in', states: 'All India', category: 'insurance' },
  { id: 'scheme_003', name: 'Rashtriya Arogya Nidhi', department: 'Ministry of Health & Family Welfare', description: 'Financial assistance for BPL patients with major life-threatening diseases.', benefits: ['Financial assistance for major illnesses'], eligibility: ['BPL families', 'Treatment at government hospitals'], documents: ['BPL Certificate', 'Medical certificate'], applicationInfo: 'Apply through the treating government hospital.', officialUrl: 'https://mohfw.gov.in', states: 'All India', category: 'financial_aid' },
  { id: 'scheme_004', name: 'Mahatma Jyotiba Phule Jan Arogya Yojana', department: 'Maharashtra Government', description: 'Maharashtra scheme providing cashless medical treatment support.', benefits: ['Annual cover', 'Cashless treatment at network hospitals'], eligibility: ['Maharashtra residents', 'Eligible ration card holders'], documents: ['Ration Card', 'Aadhaar Card'], applicationInfo: 'Apply at network hospitals or district health offices.', officialUrl: 'https://www.jeevandayee.gov.in', states: 'Maharashtra', category: 'state_scheme' },
]

const analyses = { rpt_001: reportAnalysis, img_001: imagingAnalysis, derm_001: dermatologyAnalysis }

module.exports = { user, history, schemes, analyses }
