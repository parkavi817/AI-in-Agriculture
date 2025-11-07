import React, { useState } from 'react';
import { Search, MapPin, Thermometer, Droplets, Zap, Filter, Star, TrendingUp, X, Calendar, DollarSign, AlertTriangle, CheckCircle, Sprout, Target, Clock, BarChart3 } from 'lucide-react';

interface CropData {
  name: string;
  suitability: 'High' | 'Medium' | 'Low';
  season: string;
  soilType: string[];
  waterRequirement: string;
  fertilizer: string;
  expectedYield: string;
  profitability: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface DetailedGuide {
  overview: string;
  climate: {
    temperature: string;
    rainfall: string;
    humidity: string;
    sunshine: string;
  };
  soilPreparation: string[];
  seeding: {
    seedRate: string;
    timing: string;
    spacing: string;
    depth: string;
  };
  irrigation: string[];
  fertilization: {
    basal: string;
    topDressing: string[];
    micronutrients: string;
  };
  pestManagement: {
    commonPests: string[];
    diseases: string[];
    control: string[];
  };
  harvesting: {
    timing: string;
    indicators: string[];
    method: string;
  };
  economics: {
    costPerHectare: string;
    revenuePerHectare: string;
    profitMargin: string;
    breakEven: string;
  };
  marketing: string[];
  challenges: string[];
}

const CropSuitability: React.FC = () => {
  const [selectedSoil, setSelectedSoil] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('suitability');
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const cropData: CropData[] = [
    // Cereals
    {
      name: 'Rice',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Clay', 'Loamy'],
      waterRequirement: 'High',
      fertilizer: 'NPK 20:10:10',
      expectedYield: '3-4 tons/hectare',
      profitability: 85,
      difficulty: 'Medium'
    },
    {
      name: 'Wheat',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '4-5 tons/hectare',
      profitability: 90,
      difficulty: 'Easy'
    },
    {
      name: 'Maize',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Sandy', 'Loamy'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 18:46:0',
      expectedYield: '5-6 tons/hectare',
      profitability: 82,
      difficulty: 'Easy'
    },
    {
      name: 'Barley',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Sandy Loam', 'Clay'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '2.5-3 tons/hectare',
      profitability: 65,
      difficulty: 'Easy'
    },
    {
      name: 'Millets (Bajra)',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Sandy', 'Red'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 10:26:26',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 70,
      difficulty: 'Easy'
    },
    {
      name: 'Sorghum (Jowar)',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Red', 'Black Cotton'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '2-3 tons/hectare',
      profitability: 68,
      difficulty: 'Easy'
    },
    
    // Cash Crops
    {
      name: 'Cotton',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Black Cotton', 'Red'],
      waterRequirement: 'High',
      fertilizer: 'NPK 17:17:17',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 75,
      difficulty: 'Hard'
    },
    {
      name: 'Sugarcane',
      suitability: 'High',
      season: 'Annual',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'Very High',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '70-80 tons/hectare',
      profitability: 95,
      difficulty: 'Hard'
    },
    {
      name: 'Jute',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Clay', 'Loamy'],
      waterRequirement: 'High',
      fertilizer: 'NPK 20:10:10',
      expectedYield: '2.5-3 tons/hectare',
      profitability: 60,
      difficulty: 'Medium'
    },
    {
      name: 'Tobacco',
      suitability: 'Low',
      season: 'Rabi',
      soilType: ['Sandy Loam', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '1.8-2.2 tons/hectare',
      profitability: 85,
      difficulty: 'Hard'
    },
    
    // Pulses
    {
      name: 'Chickpea (Chana)',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Loamy', 'Black Cotton'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 18:46:0',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 78,
      difficulty: 'Medium'
    },
    {
      name: 'Pigeon Pea (Arhar)',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Red', 'Black Cotton'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '1.2-1.8 tons/hectare',
      profitability: 72,
      difficulty: 'Medium'
    },
    {
      name: 'Black Gram (Urad)',
      suitability: 'Medium',
      season: 'Kharif/Rabi',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '0.8-1.2 tons/hectare',
      profitability: 75,
      difficulty: 'Medium'
    },
    {
      name: 'Green Gram (Moong)',
      suitability: 'High',
      season: 'Kharif/Summer',
      soilType: ['Sandy Loam', 'Loamy'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 10:26:26',
      expectedYield: '0.8-1 tons/hectare',
      profitability: 70,
      difficulty: 'Easy'
    },
    {
      name: 'Lentil (Masoor)',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 18:46:0',
      expectedYield: '1-1.5 tons/hectare',
      profitability: 68,
      difficulty: 'Easy'
    },
    {
      name: 'Field Pea',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 65,
      difficulty: 'Easy'
    },
    
    // Oilseeds
    {
      name: 'Mustard',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Sandy', 'Loamy'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 18:18:0',
      expectedYield: '1-1.5 tons/hectare',
      profitability: 72,
      difficulty: 'Easy'
    },
    {
      name: 'Groundnut',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Sandy', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '2-2.5 tons/hectare',
      profitability: 80,
      difficulty: 'Medium'
    },
    {
      name: 'Sunflower',
      suitability: 'Medium',
      season: 'Kharif/Rabi',
      soilType: ['Black Cotton', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 17:17:17',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 75,
      difficulty: 'Medium'
    },
    {
      name: 'Sesame (Til)',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Sandy', 'Red'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '0.6-0.8 tons/hectare',
      profitability: 70,
      difficulty: 'Easy'
    },
    {
      name: 'Safflower',
      suitability: 'Low',
      season: 'Rabi',
      soilType: ['Black Cotton', 'Red'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 18:46:0',
      expectedYield: '0.8-1.2 tons/hectare',
      profitability: 65,
      difficulty: 'Medium'
    },
    {
      name: 'Soybean',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Black Cotton', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '1.5-2.5 tons/hectare',
      profitability: 78,
      difficulty: 'Medium'
    },
    
    // Vegetables
    {
      name: 'Tomato',
      suitability: 'High',
      season: 'Rabi/Summer',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'High',
      fertilizer: 'NPK 19:19:19',
      expectedYield: '25-30 tons/hectare',
      profitability: 88,
      difficulty: 'Medium'
    },
    {
      name: 'Onion',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '20-25 tons/hectare',
      profitability: 85,
      difficulty: 'Medium'
    },
    {
      name: 'Potato',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Sandy Loam', 'Loamy'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '25-35 tons/hectare',
      profitability: 90,
      difficulty: 'Medium'
    },
    {
      name: 'Cabbage',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'High',
      fertilizer: 'NPK 20:10:10',
      expectedYield: '30-40 tons/hectare',
      profitability: 82,
      difficulty: 'Easy'
    },
    {
      name: 'Cauliflower',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'High',
      fertilizer: 'NPK 18:18:18',
      expectedYield: '20-25 tons/hectare',
      profitability: 80,
      difficulty: 'Medium'
    },
    {
      name: 'Brinjal',
      suitability: 'High',
      season: 'Kharif/Rabi',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 17:17:17',
      expectedYield: '15-20 tons/hectare',
      profitability: 78,
      difficulty: 'Medium'
    },
    {
      name: 'Okra (Bhindi)',
      suitability: 'High',
      season: 'Kharif/Summer',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '8-12 tons/hectare',
      profitability: 75,
      difficulty: 'Easy'
    },
    {
      name: 'Chilli',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Red', 'Black Cotton'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 19:19:19',
      expectedYield: '8-10 tons/hectare',
      profitability: 85,
      difficulty: 'Medium'
    },
    
    // Fruits
    {
      name: 'Mango',
      suitability: 'High',
      season: 'Perennial',
      soilType: ['Loamy', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 10:26:26',
      expectedYield: '8-12 tons/hectare',
      profitability: 92,
      difficulty: 'Hard'
    },
    {
      name: 'Banana',
      suitability: 'High',
      season: 'Annual',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'High',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '40-50 tons/hectare',
      profitability: 88,
      difficulty: 'Medium'
    },
    {
      name: 'Grapes',
      suitability: 'Medium',
      season: 'Perennial',
      soilType: ['Sandy Loam', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '15-20 tons/hectare',
      profitability: 95,
      difficulty: 'Hard'
    },
    {
      name: 'Orange',
      suitability: 'Medium',
      season: 'Perennial',
      soilType: ['Loamy', 'Red'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 18:18:18',
      expectedYield: '12-15 tons/hectare',
      profitability: 85,
      difficulty: 'Hard'
    },
    {
      name: 'Apple',
      suitability: 'Low',
      season: 'Perennial',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Medium',
      fertilizer: 'NPK 10:26:26',
      expectedYield: '15-25 tons/hectare',
      profitability: 90,
      difficulty: 'Hard'
    },
    {
      name: 'Pomegranate',
      suitability: 'Medium',
      season: 'Perennial',
      soilType: ['Red', 'Black Cotton'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 17:17:17',
      expectedYield: '8-12 tons/hectare',
      profitability: 88,
      difficulty: 'Medium'
    },
    
    // Spices
    {
      name: 'Turmeric',
      suitability: 'High',
      season: 'Kharif',
      soilType: ['Loamy', 'Red'],
      waterRequirement: 'High',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '3-5 tons/hectare',
      profitability: 85,
      difficulty: 'Medium'
    },
    {
      name: 'Ginger',
      suitability: 'Medium',
      season: 'Kharif',
      soilType: ['Loamy', 'Red'],
      waterRequirement: 'High',
      fertilizer: 'NPK 12:32:16',
      expectedYield: '8-12 tons/hectare',
      profitability: 90,
      difficulty: 'Medium'
    },
    {
      name: 'Coriander',
      suitability: 'High',
      season: 'Rabi',
      soilType: ['Loamy', 'Sandy Loam'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 18:18:18',
      expectedYield: '1-1.5 tons/hectare',
      profitability: 75,
      difficulty: 'Easy'
    },
    {
      name: 'Cumin',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Sandy Loam', 'Loamy'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 15:15:15',
      expectedYield: '0.8-1.2 tons/hectare',
      profitability: 80,
      difficulty: 'Medium'
    },
    {
      name: 'Fenugreek',
      suitability: 'Medium',
      season: 'Rabi',
      soilType: ['Loamy', 'Clay'],
      waterRequirement: 'Low',
      fertilizer: 'NPK 10:26:26',
      expectedYield: '1.5-2 tons/hectare',
      profitability: 70,
      difficulty: 'Easy'
    },
    {
      name: 'Black Pepper',
      suitability: 'Low',
      season: 'Perennial',
      soilType: ['Red', 'Loamy'],
      waterRequirement: 'High',
      fertilizer: 'NPK 17:17:17',
      expectedYield: '2-3 tons/hectare',
      profitability: 95,
      difficulty: 'Hard'
    }
  ];

  const detailedGuides: { [key: string]: DetailedGuide } = {
    'Rice': {
      overview: 'Rice is the staple food crop for more than half of the world\'s population. It is primarily grown in flooded fields and requires specific water management techniques. Rice cultivation provides food security and livelihood to millions of farmers.',
      climate: {
        temperature: '20-35°C during growing season',
        rainfall: '1000-2000mm annually or assured irrigation',
        humidity: '80-90% during vegetative growth',
        sunshine: '6-8 hours daily for proper grain filling'
      },
      soilPreparation: [
        'Deep ploughing 2-3 times to break hardpan',
        'Level the field properly for uniform water distribution',
        'Apply farmyard manure 10-15 tons per hectare',
        'Prepare raised nursery beds for seedling production',
        'Flood the field 2-3 days before transplanting'
      ],
      seeding: {
        seedRate: '20-25 kg/hectare for transplanting, 60-80 kg for direct seeding',
        timing: 'June-July for Kharif, November-December for Rabi',
        spacing: '20cm x 15cm for transplanting',
        depth: '2-3cm for direct seeding, shallow for transplanting'
      },
      irrigation: [
        'Maintain 2-5cm water level during vegetative stage',
        'Increase to 5-10cm during tillering and flowering',
        'Drain field 10 days before harvest',
        'Critical stages: tillering, panicle initiation, flowering, grain filling'
      ],
      fertilization: {
        basal: 'Apply 50% N, full P and K at transplanting',
        topDressing: [
          '25% N at tillering stage (20-25 days after transplanting)',
          '25% N at panicle initiation (40-45 days after transplanting)'
        ],
        micronutrients: 'Zinc sulphate 25 kg/ha, Iron sulphate if deficiency observed'
      },
      pestManagement: {
        commonPests: ['Stem borer', 'Brown plant hopper', 'Leaf folder', 'Gall midge'],
        diseases: ['Blast', 'Bacterial blight', 'Sheath blight', 'Tungro virus'],
        control: [
          'Use resistant varieties like Swarna, IR64, Pusa Basmati',
          'Maintain proper plant spacing for air circulation',
          'Apply neem oil 3ml/liter for organic pest control',
          'Use pheromone traps for stem borer monitoring'
        ]
      },
      harvesting: {
        timing: '110-140 days after transplanting depending on variety',
        indicators: ['80% of grains turn golden yellow', 'Moisture content 20-25%'],
        method: 'Cut 15-20cm above ground level, dry to 14% moisture before storage'
      },
      economics: {
        costPerHectare: '₹45,000-55,000 (including labor, inputs, machinery)',
        revenuePerHectare: '₹75,000-90,000 (at ₹20-25 per kg)',
        profitMargin: '35-40% with good management practices',
        breakEven: '2.5-3 tons per hectare yield required'
      },
      marketing: [
        'Sell to government procurement centers for MSP',
        'Direct marketing to rice mills for better prices',
        'Organic certification can fetch 20-30% premium',
        'Export quality basmati can get ₹40-60 per kg'
      ],
      challenges: [
        'Water scarcity and irregular rainfall patterns',
        'Increasing pest resistance to conventional pesticides',
        'Labor shortage during peak seasons',
        'Price volatility and market fluctuations'
      ]
    },
    'Wheat': {
      overview: 'Wheat is the second most important cereal crop in India and a major source of carbohydrates. It is primarily grown in northern states during the Rabi season and requires cool weather for proper growth and grain development.',
      climate: {
        temperature: '15-25°C during growing season, cool nights preferred',
        rainfall: '300-400mm during crop season',
        humidity: '50-70% relative humidity',
        sunshine: 'Bright sunshine during grain filling stage'
      },
      soilPreparation: [
        'Deep ploughing followed by 2-3 harrowings',
        'Apply farmyard manure 8-10 tons per hectare',
        'Level the field for uniform irrigation',
        'Prepare fine tilth for proper seed germination',
        'Ensure good drainage to prevent waterlogging'
      ],
      seeding: {
        seedRate: '100-125 kg/hectare for normal varieties, 80-100 kg for dwarf varieties',
        timing: 'November 15 to December 15 for timely sowing',
        spacing: '20-23cm row spacing using seed drill',
        depth: '3-5cm depth for optimal germination'
      },
      irrigation: [
        'First irrigation 20-25 days after sowing (crown root stage)',
        'Second irrigation at tillering stage (40-45 days)',
        'Third irrigation at jointing stage (60-65 days)',
        'Fourth irrigation at flowering stage (80-85 days)',
        'Fifth irrigation at milk stage (100-105 days)'
      ],
      fertilization: {
        basal: 'Apply full P, K and 1/3 N at sowing time',
        topDressing: [
          '1/3 N at first irrigation (crown root stage)',
          '1/3 N at second irrigation (tillering stage)'
        ],
        micronutrients: 'Zinc sulphate 20 kg/ha if soil is deficient'
      },
      pestManagement: {
        commonPests: ['Aphids', 'Termites', 'Army worm', 'Shoot fly'],
        diseases: ['Rust (yellow, brown, black)', 'Powdery mildew', 'Loose smut', 'Karnal bunt'],
        control: [
          'Use certified disease-resistant varieties',
          'Seed treatment with fungicides before sowing',
          'Crop rotation with non-cereal crops',
          'Timely application of recommended fungicides'
        ]
      },
      harvesting: {
        timing: '130-150 days after sowing when grains are hard',
        indicators: ['Golden yellow color of crop', 'Moisture content 20-25%'],
        method: 'Harvest early morning, dry to 12% moisture for storage'
      },
      economics: {
        costPerHectare: '₹35,000-45,000 (including all inputs and operations)',
        revenuePerHectare: '₹70,000-85,000 (at MSP ₹2125 per quintal)',
        profitMargin: '40-50% with good management',
        breakEven: '2.8-3.2 tons per hectare yield required'
      },
      marketing: [
        'Government procurement at Minimum Support Price (MSP)',
        'Private traders and flour mills',
        'Cooperative societies and FPOs',
        'Export opportunities for quality wheat'
      ],
      challenges: [
        'Terminal heat stress affecting grain filling',
        'Yellow rust disease in northern plains',
        'Stagnating yields despite increased inputs',
        'Competition from rice in cropping system'
      ]
    },
    'Maize': {
      overview: 'Maize is the third most important cereal crop globally and serves as food, feed, and industrial raw material. It is a versatile crop that can be grown in diverse agro-climatic conditions and has high yield potential.',
      climate: {
        temperature: '21-27°C during growing season',
        rainfall: '500-750mm well distributed',
        humidity: '60-70% relative humidity',
        sunshine: 'Bright sunshine for 6-8 hours daily'
      },
      soilPreparation: [
        'Deep ploughing to break hardpan and improve drainage',
        'Apply organic manure 10-12 tons per hectare',
        'Prepare fine seedbed with 2-3 harrowings',
        'Ensure proper field leveling for irrigation',
        'Make ridges and furrows for better drainage'
      ],
      seeding: {
        seedRate: '20-25 kg/hectare for hybrids, 25-30 kg for composites',
        timing: 'June-July for Kharif, October-November for Rabi',
        spacing: '60cm x 20cm or 75cm x 20cm',
        depth: '3-5cm depth for proper germination'
      },
      irrigation: [
        'First irrigation at 3-4 leaf stage if needed',
        'Critical irrigation at tasseling and silking stage',
        'Grain filling stage requires adequate moisture',
        'Avoid waterlogging during any growth stage'
      ],
      fertilization: {
        basal: 'Apply full P, K and 25% N at sowing',
        topDressing: [
          '50% N at 4-6 leaf stage (knee high)',
          '25% N at tasseling stage'
        ],
        micronutrients: 'Zinc sulphate 25 kg/ha, Boron if deficient'
      },
      pestManagement: {
        commonPests: ['Fall army worm', 'Stem borer', 'Shoot fly', 'Aphids'],
        diseases: ['Downy mildew', 'Common rust', 'Turcicum leaf blight', 'Charcoal rot'],
        control: [
          'Use resistant hybrids and varieties',
          'Seed treatment with recommended insecticides',
          'Integrated pest management practices',
          'Biological control using Trichogramma'
        ]
      },
      harvesting: {
        timing: '90-110 days after sowing depending on variety',
        indicators: ['Black layer formation at grain base', 'Moisture 20-25%'],
        method: 'Harvest cobs when husks turn brown, dry to 14% moisture'
      },
      economics: {
        costPerHectare: '₹40,000-50,000 (including hybrid seeds and inputs)',
        revenuePerHectare: '₹80,000-1,00,000 (at ₹18-20 per kg)',
        profitMargin: '45-55% with hybrid varieties',
        breakEven: '3.5-4 tons per hectare yield required'
      },
      marketing: [
        'Poultry and cattle feed industry (60% demand)',
        'Food processing companies for corn flakes, starch',
        'Wet milling industry for glucose, fructose',
        'Export market for quality maize'
      ],
      challenges: [
        'Fall army worm infestation in recent years',
        'Post-harvest losses due to improper drying',
        'Price fluctuations based on international market',
        'Competition with other Kharif crops for area'
      ]
    },
    'Cotton': {
      overview: 'Cotton is the most important cash crop and natural fiber crop in India. It provides livelihood to millions of farmers and supports the textile industry. India is the largest producer of cotton globally.',
      climate: {
        temperature: '21-30°C during growing season',
        rainfall: '500-1000mm well distributed',
        humidity: '60-70% during vegetative growth',
        sunshine: 'Bright sunshine during boll development'
      },
      soilPreparation: [
        'Deep ploughing to 20-25cm depth',
        'Apply farmyard manure 10-15 tons per hectare',
        'Prepare raised beds for better drainage',
        'Ensure field is free from cotton stalks of previous crop',
        'Level the field for uniform irrigation'
      ],
      seeding: {
        seedRate: '1.5-2 kg/hectare for Bt cotton hybrids',
        timing: 'May-June for irrigated, June-July for rainfed',
        spacing: '90cm x 45cm or 120cm x 30cm',
        depth: '2-3cm depth for proper germination'
      },
      irrigation: [
        'Pre-sowing irrigation for good germination',
        'Critical stages: square formation, flowering, boll development',
        'Avoid irrigation during picking period',
        'Drip irrigation recommended for water efficiency'
      ],
      fertilization: {
        basal: 'Apply full P, K and 25% N at sowing',
        topDressing: [
          '50% N at square formation stage',
          '25% N at flowering stage'
        ],
        micronutrients: 'Zinc, Boron, and Magnesium as per soil test'
      },
      pestManagement: {
        commonPests: ['Bollworm complex', 'Aphids', 'Jassids', 'Thrips', 'Whitefly'],
        diseases: ['Fusarium wilt', 'Bacterial blight', 'Grey mildew', 'Alternaria leaf spot'],
        control: [
          'Use Bt cotton varieties for bollworm control',
          'Refuge crop (non-Bt) mandatory for resistance management',
          'Integrated pest management with bioagents',
          'Avoid excessive use of pesticides'
        ]
      },
      harvesting: {
        timing: '150-180 days after sowing, multiple pickings',
        indicators: ['Bolls fully opened', 'Fiber moisture 7-8%'],
        method: 'Hand picking in early morning, avoid contamination'
      },
      economics: {
        costPerHectare: '₹60,000-80,000 (including high input costs)',
        revenuePerHectare: '₹1,00,000-1,40,000 (at ₹5500-6000 per quintal)',
        profitMargin: '30-40% with good management',
        breakEven: '12-15 quintals per hectare yield required'
      },
      marketing: [
        'Cotton Corporation of India (CCI) procurement',
        'Private traders and ginning mills',
        'Contract farming with textile companies',
        'Cooperative marketing societies'
      ],
      challenges: [
        'Pink bollworm resistance to Bt cotton',
        'High input costs and labor shortage',
        'Price volatility in international market',
        'Climate change affecting crop productivity'
      ]
    },
    'Sugarcane': {
      overview: 'Sugarcane is a major cash crop and the primary source of sugar production in India. It is a long-duration crop that provides raw material for sugar, jaggery, and ethanol production.',
      climate: {
        temperature: '26-32°C during growing season',
        rainfall: '1000-1500mm well distributed',
        humidity: '80-85% relative humidity',
        sunshine: 'Bright sunshine for sugar accumulation'
      },
      soilPreparation: [
        'Deep ploughing to 30-40cm depth',
        'Apply farmyard manure 25-30 tons per hectare',
        'Prepare furrows 90-120cm apart',
        'Ensure proper drainage system',
        'Level the field for uniform irrigation'
      ],
      seeding: {
        seedRate: '40,000-50,000 three-budded setts per hectare',
        timing: 'February-March (spring), October-November (autumn)',
        spacing: '90-120cm row spacing',
        depth: '5-8cm depth in furrows'
      },
      irrigation: [
        'Frequent light irrigations initially',
        'Heavy irrigation during grand growth period',
        'Reduce irrigation 6-8 weeks before harvest',
        'Drip irrigation saves 40-50% water'
      ],
      fertilization: {
        basal: 'Apply full P, K and 1/3 N at planting',
        topDressing: [
          '1/3 N at 45 days after planting',
          '1/3 N at 90 days after planting'
        ],
        micronutrients: 'Zinc, Iron, and Manganese as per requirement'
      },
      pestManagement: {
        commonPests: ['Early shoot borer', 'Top borer', 'Root borer', 'Scale insects'],
        diseases: ['Red rot', 'Smut', 'Wilt', 'Mosaic virus'],
        control: [
          'Use disease-resistant varieties',
          'Seed treatment with fungicides',
          'Biological control using Trichogramma',
          'Proper field sanitation'
        ]
      },
      harvesting: {
        timing: '10-12 months after planting',
        indicators: ['Sucrose content 18-20%', 'Brix reading 18-22'],
        method: 'Cut close to ground level, transport immediately to mill'
      },
      economics: {
        costPerHectare: '₹80,000-1,20,000 (high input intensive crop)',
        revenuePerHectare: '₹2,00,000-2,80,000 (at ₹280-350 per quintal)',
        profitMargin: '60-70% with good management',
        breakEven: '600-700 quintals per hectare yield required'
      },
      marketing: [
        'Sugar mills with assured procurement',
        'Jaggery making for local markets',
        'Ethanol production for fuel blending',
        'Bagasse for paper and power generation'
      ],
      challenges: [
        'Water-intensive crop in water-scarce regions',
        'Delayed payments from sugar mills',
        'Pest and disease management complexity',
        'Labor-intensive harvesting operations'
      ]
    },
    'Tomato': {
      overview: 'Tomato is one of the most important vegetable crops grown worldwide. It is rich in vitamins and minerals and has high market demand throughout the year. Both fresh market and processing varieties are cultivated.',
      climate: {
        temperature: '20-25°C optimal, sensitive to frost',
        rainfall: '600-800mm well distributed',
        humidity: '60-70% relative humidity',
        sunshine: '6-8 hours daily for good fruit development'
      },
      soilPreparation: [
        'Deep ploughing and incorporation of organic matter',
        'Apply farmyard manure 20-25 tons per hectare',
        'Prepare raised beds for better drainage',
        'Ensure pH between 6.0-7.0',
        'Install drip irrigation system'
      ],
      seeding: {
        seedRate: '300-400g per hectare for hybrids',
        timing: 'July-August, November-December, January-February',
        spacing: '60cm x 45cm or 75cm x 30cm',
        depth: 'Transplant 25-30 day old seedlings'
      },
      irrigation: [
        'Light frequent irrigations initially',
        'Critical stages: flowering and fruit development',
        'Avoid water stress during fruit setting',
        'Drip irrigation recommended for efficiency'
      ],
      fertilization: {
        basal: 'Apply full P, K and 50% N before transplanting',
        topDressing: [
          '25% N at 15 days after transplanting',
          '25% N at first fruit set'
        ],
        micronutrients: 'Calcium, Boron for preventing fruit disorders'
      },
      pestManagement: {
        commonPests: ['Fruit borer', 'Leaf miner', 'Aphids', 'Whitefly', 'Thrips'],
        diseases: ['Early blight', 'Late blight', 'Bacterial wilt', 'Mosaic virus'],
        control: [
          'Use resistant varieties and hybrids',
          'Crop rotation with non-solanaceous crops',
          'Integrated pest management practices',
          'Proper field sanitation'
        ]
      },
      harvesting: {
        timing: '70-80 days after transplanting',
        indicators: ['Fruits turn pink to red color', 'Firm texture'],
        method: 'Multiple harvests every 3-4 days, handle carefully'
      },
      economics: {
        costPerHectare: '₹1,50,000-2,00,000 (including protected cultivation)',
        revenuePerHectare: '₹4,00,000-6,00,000 (at ₹15-25 per kg)',
        profitMargin: '60-70% with good market prices',
        breakEven: '20-25 tons per hectare yield required'
      },
      marketing: [
        'Fresh market through wholesale mandis',
        'Direct marketing to retailers and consumers',
        'Processing industry for puree, sauce, ketchup',
        'Export market for quality produce'
      ],
      challenges: [
        'High susceptibility to diseases and pests',
        'Price fluctuations due to perishable nature',
        'Post-harvest losses during transportation',
        'Need for cold storage and processing facilities'
      ]
    },
    'Potato': {
      overview: 'Potato is the fourth most important food crop globally and a major vegetable crop in India. It is a versatile crop used for fresh consumption, processing, and industrial purposes.',
      climate: {
        temperature: '15-20°C during tuber formation',
        rainfall: '500-700mm during growing season',
        humidity: '80-90% relative humidity',
        sunshine: 'Short day length favors tuber formation'
      },
      soilPreparation: [
        'Deep ploughing to 25-30cm depth',
        'Apply farmyard manure 20-25 tons per hectare',
        'Prepare ridges and furrows for planting',
        'Ensure good drainage to prevent waterlogging',
        'Maintain soil pH between 5.5-6.5'
      ],
      seeding: {
        seedRate: '2.5-3 tons per hectare of seed tubers',
        timing: 'October-November in plains, March-April in hills',
        spacing: '60cm x 20cm or 50cm x 20cm',
        depth: '5-7cm depth in furrows'
      },
      irrigation: [
        'Light irrigation immediately after planting',
        'Critical stages: tuber initiation and bulking',
        'Avoid irrigation 10-15 days before harvest',
        'Maintain soil moisture at 80% field capacity'
      ],
      fertilization: {
        basal: 'Apply full P, K and 1/3 N at planting',
        topDressing: [
          '1/3 N at 30 days after planting',
          '1/3 N at 45 days after planting'
        ],
        micronutrients: 'Zinc, Boron for better tuber quality'
      },
      pestManagement: {
        commonPests: ['Potato tuber moth', 'Aphids', 'Cutworm', 'White grub'],
        diseases: ['Late blight', 'Early blight', 'Black scurf', 'Bacterial wilt'],
        control: [
          'Use certified disease-free seed tubers',
          'Crop rotation with non-solanaceous crops',
          'Fungicide spray for late blight control',
          'Proper storage to prevent pest infestation'
        ]
      },
      harvesting: {
        timing: '90-120 days after planting depending on variety',
        indicators: ['Yellowing of foliage', 'Skin set on tubers'],
        method: 'Harvest in cool weather, cure for 10-15 days'
      },
      economics: {
        costPerHectare: '₹1,20,000-1,50,000 (including seed cost)',
        revenuePerHectare: '₹3,00,000-4,50,000 (at ₹12-18 per kg)',
        profitMargin: '50-60% with good management',
        breakEven: '20-25 tons per hectare yield required'
      },
      marketing: [
        'Fresh market through wholesale mandis',
        'Processing industry for chips, french fries',
        'Cold storage for year-round supply',
        'Export market for quality potatoes'
      ],
      challenges: [
        'High seed cost (30-40% of total cost)',
        'Late blight disease in humid conditions',
        'Price volatility due to seasonal production',
        'Need for cold storage infrastructure'
      ]
    },
    'Onion': {
      overview: 'Onion is an important commercial vegetable crop and essential ingredient in Indian cuisine. It has good export potential and provides year-round income to farmers through different seasons.',
      climate: {
        temperature: '15-25°C during bulb development',
        rainfall: '650-750mm during growing season',
        humidity: '70% relative humidity',
        sunshine: 'Long day length for bulb formation'
      },
      soilPreparation: [
        'Deep ploughing and fine tilth preparation',
        'Apply farmyard manure 15-20 tons per hectare',
        'Prepare raised beds for better drainage',
        'Ensure soil pH between 6.0-7.5',
        'Level the field for uniform irrigation'
      ],
      seeding: {
        seedRate: '8-10 kg per hectare for direct seeding',
        timing: 'Kharif: June-July, Rabi: November-December, Summer: January-February',
        spacing: '15cm x 10cm for transplanting',
        depth: 'Transplant 45-50 day old seedlings'
      },
      irrigation: [
        'Light frequent irrigations initially',
        'Critical stages: bulb initiation and development',
        'Stop irrigation 2-3 weeks before harvest',
        'Drip irrigation saves water and improves quality'
      ],
      fertilization: {
        basal: 'Apply full P, K and 50% N before transplanting',
        topDressing: [
          '25% N at 30 days after transplanting',
          '25% N at 45 days after transplanting'
        ],
        micronutrients: 'Sulphur 40 kg/ha for better bulb quality'
      },
      pestManagement: {
        commonPests: ['Thrips', 'Onion maggot', 'Cutworm', 'Aphids'],
        diseases: ['Purple blotch', 'Downy mildew', 'Basal rot', 'Black mold'],
        control: [
          'Use resistant varieties like Agrifound Dark Red',
          'Crop rotation with cereals or legumes',
          'Proper field drainage to prevent diseases',
          'Integrated pest management practices'
        ]
      },
      harvesting: {
        timing: '120-150 days after transplanting',
        indicators: ['Neck fall and yellowing of leaves', 'Bulb maturity'],
        method: 'Harvest in dry weather, cure for 7-10 days'
      },
      economics: {
        costPerHectare: '₹80,000-1,20,000 (including labor and inputs)',
        revenuePerHectare: '₹2,50,000-4,00,000 (at ₹12-20 per kg)',
        profitMargin: '60-70% with good market prices',
        breakEven: '15-20 tons per hectare yield required'
      },
      marketing: [
        'Fresh market through wholesale mandis',
        'Export market for quality onions',
        'Processing industry for dehydrated onions',
        'Direct marketing to retailers'
      ],
      challenges: [
        'Price volatility affecting farmer income',
        'Post-harvest losses due to poor storage',
        'Thrips infestation reducing quality',
        'Export restrictions during domestic shortage'
      ]
    }
  };

  const getDetailedGuide = (cropName: string): DetailedGuide => {
    return detailedGuides[cropName] || {
      overview: `${cropName} is an important agricultural crop with significant economic value. It requires specific cultivation practices for optimal yield and quality production.`,
      climate: {
        temperature: 'Optimal temperature range varies by variety',
        rainfall: 'Adequate moisture required during growing season',
        humidity: 'Moderate humidity levels preferred',
        sunshine: 'Sufficient sunlight needed for photosynthesis'
      },
      soilPreparation: [
        'Prepare well-drained, fertile soil',
        'Apply organic manure as per recommendation',
        'Ensure proper field leveling',
        'Maintain optimal soil pH',
        'Implement good drainage system'
      ],
      seeding: {
        seedRate: 'Use recommended seed rate for variety',
        timing: 'Plant during optimal season',
        spacing: 'Maintain proper plant spacing',
        depth: 'Sow at appropriate depth'
      },
      irrigation: [
        'Provide adequate water during critical stages',
        'Avoid water stress during flowering',
        'Maintain proper soil moisture',
        'Use efficient irrigation methods'
      ],
      fertilization: {
        basal: 'Apply basal fertilizers before planting',
        topDressing: ['Apply nitrogen in split doses', 'Time application with growth stages'],
        micronutrients: 'Apply micronutrients as per soil test'
      },
      pestManagement: {
        commonPests: ['Monitor for common pests', 'Implement IPM practices'],
        diseases: ['Watch for disease symptoms', 'Use resistant varieties'],
        control: ['Use integrated approach', 'Apply treatments as needed']
      },
      harvesting: {
        timing: 'Harvest at optimal maturity',
        indicators: ['Check for maturity signs', 'Monitor quality parameters'],
        method: 'Use proper harvesting techniques'
      },
      economics: {
        costPerHectare: 'Variable based on inputs and region',
        revenuePerHectare: 'Depends on yield and market price',
        profitMargin: 'Varies with management practices',
        breakEven: 'Calculate based on local conditions'
      },
      marketing: [
        'Explore local market opportunities',
        'Consider value addition options',
        'Build market linkages',
        'Focus on quality production'
      ],
      challenges: [
        'Address climate-related risks',
        'Manage pest and disease pressure',
        'Handle market price fluctuations',
        'Ensure sustainable practices'
      ]
    };
  };

  const soilTypes = ['Clay', 'Loamy', 'Sandy', 'Sandy Loam', 'Black Cotton', 'Red'];
  const regions = ['Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'];

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability) {
      case 'High': return 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium': return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-700 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'Hard': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredCrops = cropData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSoil = !selectedSoil || crop.soilType.includes(selectedSoil);
    return matchesSearch && matchesSoil;
  }).sort((a, b) => {
    if (sortBy === 'profitability') return b.profitability - a.profitability;
    if (sortBy === 'suitability') {
      const order = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return order[b.suitability] - order[a.suitability];
    }
    return 0;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-700 dark:via-green-700 dark:to-teal-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">Crop Suitability Analysis 🌾</h1>
          <p className="text-green-100 text-lg max-w-3xl">
            Discover which crops are most suitable for your soil type and region to maximize yield and profit with AI-powered recommendations covering 40+ crops.
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <Filter className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filter & Search</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all duration-200"
            >
              <option value="">Select Region</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <select
              value={selectedSoil}
              onChange={(e) => setSelectedSoil(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all duration-200"
            >
              <option value="">Select Soil Type</option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
          </div>

          <div className="relative group">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none transition-all duration-200"
            >
              <option value="suitability">Sort by Suitability</option>
              <option value="profitability">Sort by Profitability</option>
            </select>
          </div>
        </div>
      </div>

      {/* Crop Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Crops', value: cropData.length, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
          { label: 'High Suitability', value: cropData.filter(c => c.suitability === 'High').length, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
          { label: 'Easy to Grow', value: cropData.filter(c => c.difficulty === 'Easy').length, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
          { label: 'High Profit', value: cropData.filter(c => c.profitability >= 80).length, color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-3`}>
              <TrendingUp className="h-6 w-6" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Crop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCrops.map((crop, index) => (
          <div key={index} className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                {crop.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuitabilityColor(crop.suitability)}`}>
                  {crop.suitability}
                </span>
              </div>
            </div>

            {/* Profitability Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Profitability</span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">{crop.profitability}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${crop.profitability}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <Thermometer className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Season: <span className="font-medium text-gray-800 dark:text-white">{crop.season}</span></span>
              </div>

              <div className="flex items-center space-x-3">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Soil: <span className="font-medium text-gray-800 dark:text-white">{crop.soilType.join(', ')}</span></span>
              </div>

              <div className="flex items-center space-x-3">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Water: <span className="font-medium text-gray-800 dark:text-white">{crop.waterRequirement}</span></span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(crop.difficulty)}`}>
                  {crop.difficulty} to grow
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(crop.profitability / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-white">Fertilizer:</strong> {crop.fertilizer}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-gray-800 dark:text-white">Expected Yield:</strong> {crop.expectedYield}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={() => setSelectedCrop(crop.name)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                View Detailed Guide
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No crops found matching your criteria.</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Detailed Guide Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{selectedCrop} Cultivation Guide</h2>
                <p className="text-green-100 mt-1">Comprehensive farming information and best practices</p>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {(() => {
                const guide = getDetailedGuide(selectedCrop);
                return (
                  <div className="space-y-8">
                    {/* Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sprout className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Overview</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guide.overview}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Profitability', value: `${cropData.find(c => c.name === selectedCrop)?.profitability}%`, icon: BarChart3, color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
                        { label: 'Season', value: cropData.find(c => c.name === selectedCrop)?.season, icon: Calendar, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
                        { label: 'Water Need', value: cropData.find(c => c.name === selectedCrop)?.waterRequirement, icon: Droplets, color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30' },
                        { label: 'Difficulty', value: cropData.find(c => c.name === selectedCrop)?.difficulty, icon: Target, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' }
                      ].map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                          <div className={`inline-flex p-2 rounded-lg ${stat.color} mb-2`}>
                            <stat.icon className="h-4 w-4" />
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                          <p className="text-lg font-bold text-gray-800 dark:text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Economics */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Economic Analysis</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Cost Structure</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Investment per hectare:</span>
                              <span className="font-medium text-gray-800 dark:text-white">{guide.economics.costPerHectare}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Break-even yield:</span>
                              <span className="font-medium text-gray-800 dark:text-white">{guide.economics.breakEven}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Revenue Potential</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Revenue per hectare:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">{guide.economics.revenuePerHectare}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Profit margin:</span>
                              <span className="font-medium text-green-600 dark:text-green-400">{guide.economics.profitMargin}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Climate Requirements */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Thermometer className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Climate Requirements</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(guide.climate).map(([key, value]) => (
                          <div key={key} className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{key}:</p>
                            <p className="text-gray-800 dark:text-white font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Soil Preparation */}
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Soil Preparation</h3>
                      </div>
                      <div className="space-y-3">
                        {guide.soilPreparation.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seeding Information */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Sprout className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Seeding Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(guide.seeding).map(([key, value]) => (
                          <div key={key} className="bg-white dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                            <p className="text-gray-800 dark:text-white font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Irrigation Schedule */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Droplets className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Irrigation Schedule</h3>
                      </div>
                      <div className="space-y-3">
                        {guide.irrigation.map((schedule, index) => (
                          <div key={index} className="flex items-start space-x-3 bg-white dark:bg-gray-700 rounded-lg p-3">
                            <Droplets className="h-4 w-4 text-cyan-500 mt-1" />
                            <p className="text-gray-700 dark:text-gray-300">{schedule}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fertilization Plan */}
                    <div className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-teal-200 dark:border-teal-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Zap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Fertilization Plan</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Basal Application</h4>
                          <p className="text-gray-700 dark:text-gray-300">{guide.fertilization.basal}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Top Dressing</h4>
                          <ul className="space-y-1">
                            {guide.fertilization.topDressing.map((application, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start space-x-2">
                                <span className="text-teal-500">•</span>
                                <span>{application}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Micronutrients</h4>
                          <p className="text-gray-700 dark:text-gray-300">{guide.fertilization.micronutrients}</p>
                        </div>
                      </div>
                    </div>

                    {/* Pest Management */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Pest & Disease Management</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Common Pests</h4>
                          <ul className="space-y-1">
                            {guide.pestManagement.commonPests.map((pest, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-center space-x-2">
                                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                <span>{pest}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Diseases</h4>
                          <ul className="space-y-1">
                            {guide.pestManagement.diseases.map((disease, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-center space-x-2">
                                <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                <span>{disease}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Control Measures</h4>
                          <ul className="space-y-1">
                            {guide.pestManagement.control.map((control, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>{control}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Harvesting */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Harvesting Guidelines</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Timing</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{guide.harvesting.timing}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Indicators</h4>
                          <ul className="space-y-1">
                            {guide.harvesting.indicators.map((indicator, index) => (
                              <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-start space-x-2">
                                <span className="text-amber-500 mt-1">•</span>
                                <span>{indicator}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Method</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{guide.harvesting.method}</p>
                        </div>
                      </div>
                    </div>

                    {/* Marketing */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                      <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Marketing Strategies</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {guide.marketing.map((strategy, index) => (
                          <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-start space-x-3">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Challenges */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Common Challenges</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {guide.challenges.map((challenge, index) => (
                          <div key={index} className="bg-white dark:bg-gray-700 rounded-lg p-3 flex items-start space-x-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropSuitability;