export const termInsurancePlans = [
  {
    id: 'hdfc-click2protect', insurer: 'HDFC Life', name: 'Click 2 Protect Life', logo: 'https://logo.clearbit.com/hdfclife.com',
    claimRatio: 98.69, minAge: 18, maxAge: 65, minCover: 2500000, maxCover: 100000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Yes (age > 45 or cover > 1Cr)',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income', 'Lumpsum + Monthly Income', 'Increasing Monthly Income'],
    riders: ['Accidental Death Benefit', 'Critical Illness', 'Waiver of Premium', 'Income Benefit on Accidental Disability'],
    features: ['Life Option & Life Plus Option', 'Critical Illness Rider', 'Accidental Death Benefit', 'Premium Waiver on CI', 'Whole Life Cover till 99'],
    highlights: ['Claim ratio: 98.69%', 'Top-rated insurer', 'Flexible payout options', 'Online discount available'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.08:age<30?0.10:age<35?0.14:age<40?0.20:age<45?0.30:age<50?0.50:0.80;
      return Math.round((cover/100000)*r*(term>=30?1.15:term>=20?1.0:0.90)*100);
    },
  },
  {
    id: 'icici-iprotect', insurer: 'ICICI Prudential', name: 'iProtect Smart', logo: 'https://logo.clearbit.com/iciciprulife.com',
    claimRatio: 97.83, minAge: 18, maxAge: 65, minCover: 5000000, maxCover: 200000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Yes (based on sum assured)',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income', 'Lumpsum + Monthly Income'],
    riders: ['Accidental Death Benefit', 'Terminal Illness', 'Waiver of Premium'],
    features: ['Lump Sum + Monthly Income', 'Terminal Illness Cover', 'Return of Premium Option', 'Special Exit Value', 'Increasing Cover Option'],
    highlights: ['Claim ratio: 97.83%', 'Increasing cover option', 'Built-in terminal illness', 'ROP available'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.07:age<30?0.09:age<35?0.13:age<40?0.19:age<45?0.28:age<50?0.48:0.76;
      return Math.round((cover/100000)*r*(term>=30?1.18:term>=20?1.0:0.88)*100);
    },
  },
  {
    id: 'lic-tech-term', insurer: 'LIC of India', name: 'Tech Term (Plan 854)', logo: 'https://logo.clearbit.com/licindia.in',
    claimRatio: 98.74, minAge: 18, maxAge: 65, minCover: 5000000, maxCover: 250000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Yes',
    taxBenefit: 'Section 80C + 10(10D) exempt', payoutOptions: ['Lumpsum', 'Monthly Income'],
    riders: ['Accidental Death & Disability', 'LIC Premium Waiver'],
    features: ['LIC Brand Trust', 'Lumpsum or Income Payout', 'Accident Benefit Rider', 'Government Backed', 'Online-only plan'],
    highlights: ['Claim ratio: 98.74%', 'Most trusted brand', 'Government backing', 'Lowest premiums from LIC'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.09:age<30?0.11:age<35?0.15:age<40?0.22:age<45?0.33:age<50?0.55:0.88;
      return Math.round((cover/100000)*r*(term>=30?1.12:term>=20?1.0:0.92)*100);
    },
  },
  {
    id: 'max-smart-secure', insurer: 'Max Life', name: 'Smart Secure Plus', logo: 'https://logo.clearbit.com/maxlifeinsurance.com',
    claimRatio: 99.34, minAge: 18, maxAge: 60, minCover: 2500000, maxCover: 100000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Yes (age > 36)',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income', 'Increasing Monthly Income'],
    riders: ['Critical Illness Plus', 'Accidental Death', 'Waiver of Premium Plus', 'Comprehensive Accident'],
    features: ['Highest Claim Ratio', 'Comprehensive Riders', 'Joint Life Option', 'Whole Life Cover till 100', 'Special exit value'],
    highlights: ['Claim ratio: 99.34%', 'Industry-best settlement', 'Joint life cover', 'Cover till 100 years'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.09:age<30?0.11:age<35?0.15:age<40?0.21:age<45?0.31:age<50?0.52:0.82;
      return Math.round((cover/100000)*r*(term>=30?1.16:term>=20?1.0:0.91)*100);
    },
  },
  {
    id: 'tata-sampoorna', insurer: 'Tata AIA', name: 'Sampoorna Raksha Supreme', logo: 'https://logo.clearbit.com/tataaia.com',
    claimRatio: 98.53, minAge: 18, maxAge: 65, minCover: 2500000, maxCover: 150000000,
    policyTerm: [10,15,20,25,30,35], waitingPeriod: '0 days', medicalRequired: 'Based on age & SA',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income', 'Lumpsum + Income'],
    riders: ['Accidental Death', 'Waiver of Premium', 'Critical Illness', 'Hospi Cash'],
    features: ['Accidental Death Benefit', 'Waiver of Premium', 'Increasing Sum Assured', 'Flexible Payout Modes', 'Premium Back option'],
    highlights: ['Claim ratio: 98.53%', 'Affordable premiums', 'Increasing cover', 'Premium return option'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.07:age<30?0.09:age<35?0.12:age<40?0.18:age<45?0.27:age<50?0.45:0.72;
      return Math.round((cover/100000)*r*(term>=30?1.14:term>=20?1.0:0.89)*100);
    },
  },
  {
    id: 'sbi-eshield', insurer: 'SBI Life', name: 'eShield Next', logo: 'https://logo.clearbit.com/sbilife.co.in',
    claimRatio: 97.18, minAge: 18, maxAge: 65, minCover: 5000000, maxCover: 100000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Yes (based on age)',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income'],
    riders: ['Accidental Death', 'Accelerated Critical Illness'],
    features: ['SBI Group Trust', 'Level & Increasing Cover', 'Online Purchase', 'Rebate for healthy lifestyle'],
    highlights: ['Claim ratio: 97.18%', 'SBI brand trust', 'Healthy lifestyle discount', 'Competitive pricing'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.07:age<30?0.09:age<35?0.13:age<40?0.19:age<45?0.29:age<50?0.47:0.75;
      return Math.round((cover/100000)*r*(term>=30?1.13:term>=20?1.0:0.90)*100);
    },
  },
  {
    id: 'bajaj-life-goal', insurer: 'Bajaj Allianz', name: 'eTouch', logo: 'https://logo.clearbit.com/bajajallianzlife.com',
    claimRatio: 98.02, minAge: 18, maxAge: 65, minCover: 2500000, maxCover: 100000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Based on age & SA',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Income', 'Lumpsum+Income'],
    riders: ['Accidental Death', 'Critical Illness', 'Waiver of Premium'],
    features: ['Affordable online plan', 'Lump sum + income payout', 'Terminal illness cover', 'Bajaj brand reliability'],
    highlights: ['Claim ratio: 98.02%', 'Budget-friendly', 'Terminal illness built-in', 'Quick online issuance'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.06:age<30?0.08:age<35?0.12:age<40?0.17:age<45?0.26:age<50?0.44:0.70;
      return Math.round((cover/100000)*r*(term>=30?1.15:term>=20?1.0:0.88)*100);
    },
  },
  {
    id: 'kotak-eterm', insurer: 'Kotak Life', name: 'e-Term Plan', logo: 'https://logo.clearbit.com/kotaklife.com',
    claimRatio: 98.25, minAge: 18, maxAge: 65, minCover: 2500000, maxCover: 100000000,
    policyTerm: [10,15,20,25,30,35,40], waitingPeriod: '0 days', medicalRequired: 'Based on age & SA',
    taxBenefit: 'Section 80C up to ₹1.5L', payoutOptions: ['Lumpsum', 'Monthly Income', 'Increasing Monthly Income'],
    riders: ['Accidental Death', 'Critical Illness', 'Waiver of Premium', 'Hospital Cash'],
    features: ['Whole life option', 'Increasing cover', 'ROP variant', 'Comprehensive riders', 'Joint life available'],
    highlights: ['Claim ratio: 98.25%', 'Whole life cover', 'Kotak brand', 'Joint life option'],
    getAnnualPremium: (age, cover, term) => {
      const r = age<25?0.08:age<30?0.10:age<35?0.14:age<40?0.20:age<45?0.30:age<50?0.50:0.78;
      return Math.round((cover/100000)*r*(term>=30?1.14:term>=20?1.0:0.90)*100);
    },
  },
];

export const healthInsurancePlans = [
  {
    id: 'star-comprehensive', insurer: 'Star Health', name: 'Comprehensive Health', logo: 'https://logo.clearbit.com/starhealth.in',
    claimRatio: 63.8, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,750000,1000000,1500000,2000000,2500000],
    waitingPeriod: '30 days (initial), 2 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No room rent capping', renewability: 'Lifelong', prePostHosp: '60 days pre / 180 days post',
    daycare: '586+ day care procedures', ambulance: '₹2,500 per hospitalization',
    features: ['No room rent capping', 'Day care procedures covered', 'Pre & Post hospitalization', 'Annual health check-up', 'No co-payment', 'AYUSH treatment'],
    highlights: ['Largest health insurer', 'Cashless at 14,000+ hospitals', 'No co-payment', 'Lifelong renewability'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?680:age<35?820:age<40?1050:age<45?1450:age<50?2000:age<55?2800:3850;
      const f = fs<=1?1.0:fs===2?1.65:fs===3?2.1:fs===4?2.4:2.7;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'hdfc-optima-secure', insurer: 'HDFC Ergo', name: 'Optima Secure', logo: 'https://logo.clearbit.com/hdfcergo.com',
    claimRatio: 58.2, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,1000000,1500000,2000000,2500000,5000000],
    waitingPeriod: '30 days (initial), 3 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No sub-limits', renewability: 'Lifelong', prePostHosp: '60 days pre / 180 days post',
    daycare: '541+ day care procedures', ambulance: '₹5,000 per hospitalization',
    features: ['Restore benefit (100%)', 'Unlimited restore for unrelated claims', 'Vaccination cover', 'OPD Cover available', 'No sub-limits', 'Multiplier benefit'],
    highlights: ['100% sum restore', 'Unlimited restore', 'Up to ₹50L cover', 'Multiplier benefit'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?740:age<35?900:age<40?1180:age<45?1600:age<50?2200:age<55?3050:4250;
      const f = fs<=1?1.0:fs===2?1.60:fs===3?2.0:fs===4?2.3:2.6;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'niva-health-recharge', insurer: 'Niva Bupa', name: 'Health Recharge', logo: 'https://logo.clearbit.com/nivabupa.com',
    claimRatio: 55.6, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,1000000,1500000,2000000,3000000,5000000],
    waitingPeriod: '30 days (initial), 3 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No room rent limit', renewability: 'Lifelong', prePostHosp: '60 days pre / 180 days post',
    daycare: '500+ day care procedures', ambulance: '₹3,000 per hospitalization',
    features: ['Recharge benefit', 'Consumables covered', 'Maternity cover', 'Wellness rewards', 'No room rent limit', 'Organ donor cover'],
    highlights: ['Recharge benefit', 'All consumables covered', 'Wellness discounts', 'Modern digital experience'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?710:age<35?860:age<40?1120:age<45?1520:age<50?2100:age<55?2900:4000;
      const f = fs<=1?1.0:fs===2?1.62:fs===3?2.05:fs===4?2.35:2.65;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'care-supreme', insurer: 'Care Health', name: 'Care Supreme', logo: 'https://logo.clearbit.com/careinsurance.com',
    claimRatio: 62.1, minAge: 18, maxAge: 65,
    coverOptions: [500000,1000000,1500000,2000000,2500000,3000000,5000000],
    waitingPeriod: '30 days (initial), 3 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No room rent limit', renewability: 'Lifelong', prePostHosp: '60 days pre / 180 days post',
    daycare: '588+ day care procedures', ambulance: 'Unlimited ambulance cover',
    features: ['Unlimited restore', 'No room rent limit', 'Air ambulance cover', 'Second e-opinion', 'Unlimited ambulance', 'No claim bonus 50%'],
    highlights: ['Unlimited restore', 'No sub-limits', 'Air ambulance cover', 'NCB up to 50%'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?620:age<35?780:age<40?1020:age<45?1400:age<50?1920:age<55?2680:3650;
      const f = fs<=1?1.0:fs===2?1.58:fs===3?2.0:fs===4?2.3:2.55;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'manipal-proflex', insurer: 'ManipalCigna', name: 'ProHealth Flex', logo: 'https://logo.clearbit.com/manipalcigna.com',
    claimRatio: 51.3, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,750000,1000000,1500000,2000000,3000000],
    waitingPeriod: '30 days (initial), 4 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No room rent limit', renewability: 'Lifelong', prePostHosp: '30 days pre / 90 days post',
    daycare: '480+ day care procedures', ambulance: '₹3,000 per hospitalization',
    features: ['Flexi cover options', 'Cumulative bonus 50%/yr', 'AYUSH treatment', 'Global coverage add-on', 'Booster benefit', 'Day 1 cover for accidents'],
    highlights: ['50% cumulative bonus', 'AYUSH covered', 'Flexible plans', 'Global coverage available'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?690:age<35?840:age<40?1100:age<45?1500:age<50?2080:age<55?2820:3880;
      const f = fs<=1?1.0:fs===2?1.63:fs===3?2.08:fs===4?2.38:2.68;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'aditya-activ-health', insurer: 'Aditya Birla', name: 'Activ Health Platinum', logo: 'https://logo.clearbit.com/adityabirlacapital.com',
    claimRatio: 54.5, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,750000,1000000,1500000,2000000,5000000],
    waitingPeriod: '30 days (initial), 3 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No capping', renewability: 'Lifelong', prePostHosp: '60 days pre / 180 days post',
    daycare: '541+ day care procedures', ambulance: '₹3,000 per hospitalization',
    features: ['Chronic management program', 'Health returns (up to 30%)', 'Reload benefit', 'In-patient & OPD cover', 'Modern claim process', 'Wellness coaching'],
    highlights: ['Health returns up to 30%', 'Chronic care program', 'OPD cover available', 'Wellness rewards'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?800:age<35?970:age<40?1250:age<45?1680:age<50?2300:age<55?3150:4380;
      const f = fs<=1?1.0:fs===2?1.60:fs===3?2.05:fs===4?2.35:2.65;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'sbi-arogya-premier', insurer: 'SBI General', name: 'Arogya Premier', logo: 'https://logo.clearbit.com/sbigeneral.in',
    claimRatio: 60.2, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,1000000,1500000,2000000,2500000],
    waitingPeriod: '30 days (initial), 2 yrs (pre-existing)', coPay: 'No co-payment (up to ₹20L)',
    roomRent: 'No room rent limit', renewability: 'Lifelong', prePostHosp: '60 days pre / 90 days post',
    daycare: '400+ day care procedures', ambulance: '₹2,000 per hospitalization',
    features: ['SBI brand trust', 'Automatic recharge', 'Cumulative bonus', 'Domiciliary treatment', 'No room rent limit', 'Second opinion'],
    highlights: ['SBI brand trust', 'Automatic recharge', 'Short pre-existing waiting', 'Affordable premiums'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?590:age<35?730:age<40?960:age<45?1340:age<50?1850:age<55?2520:3500;
      const f = fs<=1?1.0:fs===2?1.55:fs===3?1.95:fs===4?2.25:2.50;
      return Math.round((cover/100000)*r*f);
    },
  },
  {
    id: 'bajaj-health-guard', insurer: 'Bajaj Allianz', name: 'Health Guard', logo: 'https://logo.clearbit.com/bajajallianz.com',
    claimRatio: 57.9, minAge: 18, maxAge: 65,
    coverOptions: [300000,500000,750000,1000000,1500000,2000000],
    waitingPeriod: '30 days (initial), 3 yrs (pre-existing)', coPay: 'No co-payment',
    roomRent: 'No sub-limits', renewability: 'Lifelong', prePostHosp: '60 days pre / 120 days post',
    daycare: '500+ day care procedures', ambulance: '₹3,000 per hospitalization',
    features: ['Cumulative bonus 100%', 'No sub-limits', 'Road ambulance cover', 'Organ donor expense', 'Bariatric surgery', 'Bajaj reliability'],
    highlights: ['100% cumulative bonus', 'No sub-limits', 'Bariatric surgery covered', 'Wide network'],
    getAnnualPremium: (age, cover, fs) => {
      const r = age<30?650:age<35?800:age<40?1040:age<45?1440:age<50?1980:age<55?2740:3800;
      const f = fs<=1?1.0:fs===2?1.60:fs===3?2.02:fs===4?2.32:2.60;
      return Math.round((cover/100000)*r*f);
    },
  },
];

export const formatINR = (val) => {
  const abs = Math.abs(val);
  if (abs >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};
