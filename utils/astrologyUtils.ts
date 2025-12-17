
// South Indian 10-Porutham Logic & Utilities

export interface StarData {
  id: string;
  name: string;
  rashi: string;
  gana: 'Deva' | 'Manusha' | 'Rakshasa';
  yoni: string; // Animal
  rajju: 'Siro' | 'Kanta' | 'Udar' | 'Kati' | 'Pada';
  vedhai: string[]; // Incompatible Stars
  lord: string;
}

// Full 27 Nakshatra Database with Properties
export const STARS: StarData[] = [
  { id: '1', name: 'Aswini', rashi: 'Mesha', gana: 'Deva', yoni: 'Horse', rajju: 'Pada', vedhai: ['Jyeshta'], lord: 'Ketu' },
  { id: '2', name: 'Bharani', rashi: 'Mesha', gana: 'Manusha', yoni: 'Elephant', rajju: 'Kati', vedhai: ['Anuradha'], lord: 'Venus' },
  { id: '3', name: 'Krittika', rashi: 'Mesha', gana: 'Rakshasa', yoni: 'Goat', rajju: 'Udar', vedhai: ['Vishaka'], lord: 'Sun' },
  { id: '4', name: 'Rohini', rashi: 'Vrishabha', gana: 'Manusha', yoni: 'Serpent', rajju: 'Kanta', vedhai: ['Swati'], lord: 'Moon' },
  { id: '5', name: 'Mrigasira', rashi: 'Vrishabha', gana: 'Deva', yoni: 'Serpent', rajju: 'Siro', vedhai: ['Dhanishta'], lord: 'Mars' },
  { id: '6', name: 'Arudra', rashi: 'Mithuna', gana: 'Manusha', yoni: 'Dog', rajju: 'Siro', vedhai: ['Shravana'], lord: 'Rahu' },
  { id: '7', name: 'Punarvasu', rashi: 'Mithuna', gana: 'Deva', yoni: 'Cat', rajju: 'Kanta', vedhai: ['Uttarashada'], lord: 'Jupiter' },
  { id: '8', name: 'Pushya', rashi: 'Kataka', gana: 'Deva', yoni: 'Goat', rajju: 'Udar', vedhai: ['Purvashada'], lord: 'Saturn' },
  { id: '9', name: 'Ashlesha', rashi: 'Kataka', gana: 'Rakshasa', yoni: 'Cat', rajju: 'Kati', vedhai: ['Moola'], lord: 'Mercury' },
  { id: '10', name: 'Magha', rashi: 'Simha', gana: 'Rakshasa', yoni: 'Rat', rajju: 'Pada', vedhai: ['Revathi'], lord: 'Ketu' },
  { id: '11', name: 'Purva Phalguni', rashi: 'Simha', gana: 'Manusha', yoni: 'Rat', rajju: 'Kati', vedhai: ['Uttarabhadra'], lord: 'Venus' },
  { id: '12', name: 'Uttara Phalguni', rashi: 'Simha', gana: 'Manusha', yoni: 'Cow', rajju: 'Udar', vedhai: ['Purvabhadra'], lord: 'Sun' },
  { id: '13', name: 'Hasta', rashi: 'Kanya', gana: 'Deva', yoni: 'Buffalo', rajju: 'Kanta', vedhai: ['Shatabhisha'], lord: 'Moon' },
  { id: '14', name: 'Chitra', rashi: 'Kanya', gana: 'Rakshasa', yoni: 'Tiger', rajju: 'Siro', vedhai: ['Mrigasira'], lord: 'Mars' },
  { id: '15', name: 'Swati', rashi: 'Tula', gana: 'Deva', yoni: 'Buffalo', rajju: 'Siro', vedhai: ['Rohini'], lord: 'Rahu' },
  { id: '16', name: 'Vishaka', rashi: 'Tula', gana: 'Rakshasa', yoni: 'Tiger', rajju: 'Kanta', vedhai: ['Krittika'], lord: 'Jupiter' },
  { id: '17', name: 'Anuradha', rashi: 'Vrishchika', gana: 'Deva', yoni: 'Deer', rajju: 'Udar', vedhai: ['Bharani'], lord: 'Saturn' },
  { id: '18', name: 'Jyeshta', rashi: 'Vrishchika', gana: 'Rakshasa', yoni: 'Deer', rajju: 'Kati', vedhai: ['Aswini'], lord: 'Mercury' },
  { id: '19', name: 'Moola', rashi: 'Dhanusu', gana: 'Rakshasa', yoni: 'Dog', rajju: 'Pada', vedhai: ['Ashlesha'], lord: 'Ketu' },
  { id: '20', name: 'Purvashada', rashi: 'Dhanusu', gana: 'Manusha', yoni: 'Monkey', rajju: 'Kati', vedhai: ['Pushya'], lord: 'Venus' },
  { id: '21', name: 'Uttarashada', rashi: 'Dhanusu', gana: 'Manusha', yoni: 'Mongoose', rajju: 'Udar', vedhai: ['Punarvasu'], lord: 'Sun' },
  { id: '22', name: 'Shravana', rashi: 'Makara', gana: 'Deva', yoni: 'Monkey', rajju: 'Kanta', vedhai: ['Arudra'], lord: 'Moon' },
  { id: '23', name: 'Dhanishta', rashi: 'Makara', gana: 'Rakshasa', yoni: 'Lion', rajju: 'Siro', vedhai: ['Mrigasira'], lord: 'Mars' },
  { id: '24', name: 'Shatabhisha', rashi: 'Kumbha', gana: 'Rakshasa', yoni: 'Horse', rajju: 'Siro', vedhai: ['Hasta'], lord: 'Rahu' },
  { id: '25', name: 'Purvabhadra', rashi: 'Kumbha', gana: 'Manusha', yoni: 'Lion', rajju: 'Kanta', vedhai: ['Uttara Phalguni'], lord: 'Jupiter' },
  { id: '26', name: 'Uttarabhadra', rashi: 'Meena', gana: 'Manusha', yoni: 'Cow', rajju: 'Udar', vedhai: ['Purva Phalguni'], lord: 'Saturn' },
  { id: '27', name: 'Revathi', rashi: 'Meena', gana: 'Deva', yoni: 'Elephant', rajju: 'Pada', vedhai: ['Magha'], lord: 'Mercury' },
];

export interface PoruthamResult {
  name: string;
  score: number; // 0, 0.5, 1
  maxScore: number;
  status: 'Uthamam' | 'Mathiyamam' | 'Athamam';
  description: string;
}

export interface MatchReport {
  totalScore: number;
  totalPossible: number;
  results: PoruthamResult[];
  verdict: string;
  groomStar: StarData;
  brideStar: StarData;
}

// --- CALCULATION LOGIC ---

export const calculatePorutham = (boyStarName: string, girlStarName: string): MatchReport => {
  const boyStar = STARS.find(s => s.name === boyStarName) || STARS[0];
  const girlStar = STARS.find(s => s.name === girlStarName) || STARS[0];
  const results: PoruthamResult[] = [];

  const girlIndex = STARS.findIndex(s => s.id === girlStar.id);
  const boyIndex = STARS.findIndex(s => s.id === boyStar.id);
  
  // Count from Girl to Boy (inclusive of Girl's star usually, here simple index diff)
  let count = (boyIndex - girlIndex) + 1;
  if (count <= 0) count += 27;

  // 1. Dina Porutham (Health)
  const dinaGood = [2, 4, 6, 8, 9, 11, 13, 15, 18, 20, 24, 26];
  const dinaScore = dinaGood.includes(count) ? 1 : 0;
  results.push({ name: 'Dina', score: dinaScore, maxScore: 1, status: dinaScore ? 'Uthamam' : 'Athamam', description: 'Health & Prosperity' });

  // 2. Gana Porutham (Temperament)
  let ganaScore = 0;
  let ganaStatus: 'Uthamam' | 'Mathiyamam' | 'Athamam' = 'Athamam';
  if (boyStar.gana === girlStar.gana) { ganaScore = 1; ganaStatus = 'Uthamam'; }
  else if (boyStar.gana === 'Deva' && girlStar.gana === 'Manusha') { ganaScore = 0.5; ganaStatus = 'Mathiyamam'; }
  else if (girlStar.gana === 'Deva' && boyStar.gana === 'Manusha') { ganaScore = 0.5; ganaStatus = 'Mathiyamam'; }
  else if (boyStar.gana === 'Rakshasa' && girlStar.gana !== 'Rakshasa') { ganaScore = 0; ganaStatus = 'Athamam'; } 
  else { ganaScore = 0.5; ganaStatus = 'Mathiyamam'; }
  results.push({ name: 'Gana', score: ganaScore, maxScore: 1, status: ganaStatus, description: 'Temperament Match' });

  // 3. Mahendra Porutham (Progeny)
  const mahendraGood = [4, 7, 10, 13, 16, 19, 22, 25];
  const mahendraScore = mahendraGood.includes(count) ? 1 : 0;
  results.push({ name: 'Mahendra', score: mahendraScore, maxScore: 1, status: mahendraScore ? 'Uthamam' : 'Athamam', description: 'Progeny & Wealth' });

  // 4. Sthree Deergam (Longevity)
  const sthreeStatus = count >= 13 ? 'Uthamam' : count >= 7 ? 'Mathiyamam' : 'Athamam';
  const sthreeScore = count >= 13 ? 1 : count >= 7 ? 0.5 : 0;
  results.push({ name: 'Sthree Deergam', score: sthreeScore, maxScore: 1, status: sthreeStatus, description: 'Wellbeing of Bride' });

  // 5. Yoni Porutham (Compatibility)
  const yoniScore = boyStar.yoni === girlStar.yoni ? 1 : 0.5; // Simplified enemy logic
  results.push({ name: 'Yoni', score: yoniScore, maxScore: 1, status: yoniScore === 1 ? 'Uthamam' : 'Mathiyamam', description: 'Intimacy Compatibility' });

  // 6. Rasi Porutham (Unity) - Simplified Rasi check based on star
  const rasiScore = boyStar.rashi === girlStar.rashi ? 1 : 0.5; 
  results.push({ name: 'Rasi', score: rasiScore, maxScore: 1, status: rasiScore === 1 ? 'Uthamam' : 'Mathiyamam', description: 'Family Unity' });

  // 7. Rasi Adhipathi (Lord Friendship)
  const lordScore = boyStar.lord === girlStar.lord ? 1 : 0.5;
  results.push({ name: 'Rasi Adhipathi', score: lordScore, maxScore: 1, status: lordScore === 1 ? 'Uthamam' : 'Mathiyamam', description: 'Lordship Friendship' });

  // 8. Vasiya Porutham (Attraction)
  const vasiyaScore = 0.5; // Placeholder
  results.push({ name: 'Vasiya', score: vasiyaScore, maxScore: 1, status: 'Mathiyamam', description: 'Mutual Attraction' });

  // 9. Rajju (Vital - Head to Foot)
  // Logic: Must NOT be same Rajju
  const rajjuScore = boyStar.rajju !== girlStar.rajju ? 1 : 0;
  results.push({ name: 'Rajju', score: rajjuScore, maxScore: 1, status: rajjuScore ? 'Uthamam' : 'Athamam', description: 'Mangalya Bala (Vital)' });

  // 10. Vedhai (Affliction)
  const isVedhai = boyStar.vedhai.includes(girlStar.name) || girlStar.vedhai.includes(boyStar.name);
  const vedhaiScore = isVedhai ? 0 : 1;
  results.push({ name: 'Vedhai', score: vedhaiScore, maxScore: 1, status: vedhaiScore ? 'Uthamam' : 'Athamam', description: 'Affliction Check' });

  const totalScore = results.reduce((a, b) => a + b.score, 0);
  let verdict = "Not Recommended";
  if (totalScore >= 7 && rajjuScore === 1) verdict = "Excellent Match (Uthamam)";
  else if (totalScore >= 5 && rajjuScore === 1) verdict = "Good Match (Mathiyamam)";
  else if (rajjuScore === 0) verdict = "Rajju Mismatch (Athamam)";

  return {
    totalScore,
    totalPossible: 10,
    results,
    verdict,
    groomStar: boyStar,
    brideStar: girlStar
  };
};

export const getRasiFromStar = (starName: string) => {
    return STARS.find(s => s.name === starName)?.rashi || 'Mesha';
}
