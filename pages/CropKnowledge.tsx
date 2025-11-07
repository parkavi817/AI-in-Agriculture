import React, { useState, useEffect } from 'react';
import { Search, Leaf, Bug, Beaker, Calendar, AlertTriangle, CheckCircle, Filter, BookOpen, TrendingUp, Star } from 'lucide-react';
import { userProgressService } from '../services/api'; // Import the userProgressService

interface CropInfo {
  id: string;
  name: string;
  category: string;
  season: string;
  duration: string;
  soilType: string[];
  climate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  popularity: number;
  fertilizers: {
    name: string;
    application: string;
    timing: string;
  }[];
  pesticides: {
    name: string;
    target: string;
    dosage: string;
  }[];
  diseases: {
    name: string;
    symptoms: string;
    treatment: string;
  }[];
  tips: string[];
}

const CropKnowledge: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null);

  // Effect to track crop view when selectedCrop changes
  useEffect(() => {
    if (selectedCrop) {
      userProgressService.trackCropView(selectedCrop.id)
        .then(() => console.log(`Tracked view for crop: ${selectedCrop.name}`))
        .catch(error => console.error('Failed to track crop view:', error));
    }
  }, [selectedCrop]);

  const crops: CropInfo[] = [
    {
      id: '1',
      name: 'Rice',
      category: 'Cereal',
      season: 'Kharif',
      duration: '120-150 days',
      soilType: ['Clay', 'Loamy'],
      climate: 'Tropical and subtropical',
      difficulty: 'Intermediate',
      popularity: 95,
      fertilizers: [
        { name: 'NPK 20:10:10', application: 'Basal dose', timing: 'At planting' },
        { name: 'Urea', application: 'Top dressing', timing: '30 and 60 days after planting' },
        { name: 'DAP', application: 'Basal', timing: 'Before sowing' }
      ],
      pesticides: [
        { name: 'Chlorpyrifos', target: 'Stem borer', dosage: '2ml/liter' },
        { name: 'Imidacloprid', target: 'Brown plant hopper', dosage: '0.5ml/liter' },
        { name: 'Tricyclazole', target: 'Leaf blast', dosage: '1g/liter' }
      ],
      diseases: [
        {
          name: 'Bacterial Leaf Blight',
          symptoms: 'Water-soaked lesions on leaves, yellowing',
          treatment: 'Copper-based fungicides, resistant varieties'
        },
        {
          name: 'Rice Blast',
          symptoms: 'Diamond-shaped lesions with gray centers',
          treatment: 'Tricyclazole application, field sanitation'
        }
      ],
      tips: [
        'Maintain 2-3 cm water level throughout growing season',
        'Use certified seeds for better yield',
        'Apply organic matter to improve soil fertility',
        'Monitor for pest attacks regularly'
      ]
    },
    {
      id: '2',
      name: 'Wheat',
      category: 'Cereal',
      season: 'Rabi',
      duration: '120-130 days',
      soilType: ['Loamy', 'Sandy Loam'],
      climate: 'Cool and dry',
      difficulty: 'Beginner',
      popularity: 90,
      fertilizers: [
        { name: 'NPK 12:32:16', application: 'Basal dose', timing: 'At sowing' },
        { name: 'Urea', application: 'Top dressing', timing: '21 and 45 days after sowing' },
        { name: 'Potash', application: 'Basal', timing: 'Before sowing' }
      ],
      pesticides: [
        { name: 'Malathion', target: 'Aphids', dosage: '2ml/liter' },
        { name: 'Chlorpyrifos', target: 'Termites', dosage: '4ml/liter' },
        { name: 'Propiconazole', target: 'Rust diseases', dosage: '1ml/liter' }
      ],
      diseases: [
        {
          name: 'Yellow Rust',
          symptoms: 'Yellow pustules on leaves in streaks',
          treatment: 'Propiconazole spray, resistant varieties'
        },
        {
          name: 'Loose Smut',
          symptoms: 'Black powdery mass replacing grains',
          treatment: 'Seed treatment with systemic fungicides'
        }
      ],
      tips: [
        'Sow at optimal time (mid-November to December)',
        'Use recommended seed rate of 100 kg/ha',
        'Provide adequate irrigation at critical stages',
        'Harvest at physiological maturity'
      ]
    },
    {
      id: '3',
      name: 'Cotton',
      category: 'Fiber',
      season: 'Kharif',
      duration: '150-180 days',
      soilType: ['Black Cotton', 'Red'],
      climate: 'Semi-arid tropical',
      difficulty: 'Advanced',
      popularity: 75,
      fertilizers: [
        { name: 'NPK 17:17:17', application: 'Basal dose', timing: 'At planting' },
        { name: 'Urea', application: 'Side dressing', timing: '45 and 90 days after planting' },
        { name: 'Boron', application: 'Foliar', timing: 'During flowering' }
      ],
      pesticides: [
        { name: 'Emamectin Benzoate', target: 'Bollworm', dosage: '0.5g/liter' },
        { name: 'Acetamiprid', target: 'Aphids', dosage: '0.2g/liter' },
        { name: 'Spiromesifen', target: 'Red spider mite', dosage: '1ml/liter' }
      ],
      diseases: [
        {
          name: 'Fusarium Wilt',
          symptoms: 'Yellowing and wilting of plants',
          treatment: 'Resistant varieties, soil solarization'
        },
        {
          name: 'Bacterial Blight',
          symptoms: 'Angular water-soaked lesions on leaves',
          treatment: 'Copper-based sprays, crop rotation'
        }
      ],
      tips: [
        'Maintain proper plant spacing for air circulation',
        'Monitor for bollworm infestation regularly',
        'Use integrated pest management practices',
        'Ensure adequate potassium nutrition'
      ]
    },
   {
  id: '5',
  name: 'Soybean',
  category: 'Oilseed',
  season: 'Kharif',
  duration: '90-120 days',
  soilType: ['Sandy loam', 'Black soil'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Intermediate',
  popularity: 80,
  fertilizers: [
    { name: 'Rhizobium culture', application: 'Seed treatment', timing: 'Before sowing' },
    { name: 'NPK 20:20:20', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Quinalphos', target: 'Leaf miner', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Yellow Mosaic Virus',
      symptoms: 'Yellow patches on leaves',
      treatment: 'Resistant varieties, control whiteflies'
    }
  ],
  tips: [
    'Use certified seeds',
    'Avoid late sowing',
    'Irrigate at flowering/pod-filling'
  ]
},
    {
  id: '6',
  name: 'Sugarcane',
  category: 'Commercial',
  season: 'Year-round (ratooning)',
  duration: '12-18 months',
  soilType: ['Deep loamy', 'Clay loam'],
  climate: 'Hot and humid',
  difficulty: 'Advanced',
  popularity: 70,
  fertilizers: [
    { name: 'NPK 25:5:5', application: 'Basal', timing: 'At planting' },
    { name: 'Potassium sulfate', application: 'Top dressing', timing: '120 days after planting' }
  ],
  pesticides: [
    { name: 'Fipronil', target: 'Termites', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Red Rot',
      symptoms: 'Reddish internal stalk discoloration',
      treatment: 'Disease-free setts, crop rotation'
    }
  ],
  tips: [
    'Plant in furrows 1.5m apart',
    'Remove lower leaves for better growth',
    'Harvest when brix >18%'
  ]
},
    {
  id: '7',
  name: 'Potato',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '90-110 days',
  soilType: ['Sandy loam', 'Volcanic soil'],
  climate: 'Cool (15-20°C)',
  difficulty: 'Intermediate',
  popularity: 88,
  fertilizers: [
    { name: 'NPK 15:15:15', application: 'Basal', timing: 'At planting' },
    { name: 'Magnesium sulfate', application: 'Foliar', timing: 'Tuber formation' }
  ],
  pesticides: [
    { name: 'Mancozeb', target: 'Late blight', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Late Blight',
      symptoms: 'Water-soaked leaf spots with white mold',
      treatment: 'Bordeaux mixture (5:5:50)'
    }
  ],
  tips: [
    'Use disease-free seed tubers',
    'Earthing up improves tuber quality',
    'Store at 4°C post-harvest'
  ]
},
   {
  id: '8',
  name: 'Mango',
  category: 'Fruit',
  season: 'Perennial',
  duration: '5-8 years to fruiting',
  soilType: ['Deep well-drained'],
  climate: 'Tropical (24-30°C)',
  difficulty: 'Beginner',
  popularity: 95,
  fertilizers: [
    { name: 'NPK 6:6:6', application: 'Basal', timing: 'Pre-monsoon' },
    { name: 'Boron', application: 'Foliar', timing: 'Flowering' }
  ],
  pesticides: [
    { name: 'Carbaryl', target: 'Fruit fly', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Anthracnose',
      symptoms: 'Black spots on fruits/leaves',
      treatment: 'Copper oxychloride (3g/liter)'
    }
  ],
  tips: [
    'Prune after harvest',
    'Irrigate during fruit development',
    'Use ethylene for uniform ripening'
  ]
},
    {
  id: '9',
  name: 'Chickpea',
  category: 'Pulse',
  season: 'Rabi',
  duration: '100-120 days',
  soilType: ['Sandy loam', 'Black soil'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Beginner',
  popularity: 75,
  fertilizers: [
    { name: 'NPK 12:32:16', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Pod borer', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing and wilting',
      treatment: 'Resistant varieties (e.g., JG 11)'
    }
  ],
  tips: [
    'Sow before winter onset',
    'Avoid excessive nitrogen',
    'Use rhizobium inoculation'
  ]
},
  {
  id: '10',
  name: 'Groundnut',
  category: 'Oilseed',
  season: 'Kharif',
  duration: '100-130 days',
  soilType: ['Sandy loam', 'Red soil'],
  climate: 'Warm (25-30°C)',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'Gypsum', application: 'Basal', timing: 'At flowering' }
  ],
  pesticides: [
    { name: 'Chlorpyriphos', target: 'Termites', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Tikka Disease',
      symptoms: 'Circular leaf spots',
      treatment: 'Mancozeb (2g/liter)'
    }
  ],
  tips: [
    'Harvest when 70% pods mature',
    'Dry to 8% moisture for storage',
    'Avoid water stagnation'
  ]
},
 {
  id: '11',
  name: 'Barley',
  category: 'Cereal',
  season: 'Rabi',
  duration: '110-130 days',
  soilType: ['Loamy', 'Sandy loam'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Beginner',
  popularity: 60,
  fertilizers: [
    { name: 'NPK 12:32:16', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Carbendazim', target: 'Powdery mildew', dosage: '1g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery patches on leaves and stems',
      treatment: 'Spray Carbendazim or Sulphur-based fungicide'
    },
    {
      name: 'Leaf Rust',
      symptoms: 'Orange pustules on leaves and leaf sheaths',
      treatment: 'Apply Propiconazole or Mancozeb'
    },
    {
      name: 'Barley Yellow Dwarf Virus (BYDV)',
      symptoms: 'Yellowing of leaves, stunted growth',
      treatment: 'Control aphids (virus vector), use resistant varieties'
    }
  ],
  tips: [
    'Tolerant to saline soils',
    'Used for malt and animal feed'
  ]
},
{
  id: '12',
  name: 'Pigeon Pea (Arhar)',
  category: 'Pulse',
  season: 'Kharif',
  duration: '150-180 days',
  soilType: ['Sandy loam', 'Red soil'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Intermediate',
  popularity: 70,
  fertilizers: [
    { name: 'Rhizobium culture', application: 'Seed treatment', timing: 'Pre-sowing' }
  ],
  pesticides: [
    { name: 'Quinalphos', target: 'Pod borer', dosage: '2ml/liter' },
    { name: 'Neem oil', target: 'Aphids & whiteflies', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Wilt',
      symptoms: 'Yellowing and sudden wilting',
      treatment: 'Resistant varieties (e.g., ICPL 87119)'
    },
    {
      name: 'Sterility Mosaic Disease',
      symptoms: 'Bushy appearance, no flowering',
      treatment: 'Use resistant varieties, control mite vector'
    }
  ],
  tips: [
    'Intercrop with soybean or sorghum',
    'Drought-tolerant once established'
  ]
},
{
  id: '13',
  name: 'Mustard',
  category: 'Oilseed',
  season: 'Rabi',
  duration: '90-120 days',
  soilType: ['Loamy', 'Clay loam'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Beginner',
  popularity: 75,
  fertilizers: [
    { name: 'NPK 20:20:20', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Acephate', target: 'Aphids', dosage: '1g/liter' },
    { name: 'Chlorpyrifos', target: 'Painted bug', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Alternaria Blight',
      symptoms: 'Dark spots with concentric rings on leaves',
      treatment: 'Spray Mancozeb (2g/liter)'
    },
    {
      name: 'White Rust',
      symptoms: 'White pustules on the underside of leaves',
      treatment: 'Metalaxyl or Mancozeb spray'
    }
  ],
  tips: [
    'Sow in October-November',
    'Harvest when pods turn yellow'
  ]
},
{
  id: '14',
  name: 'Jute',
  category: 'Fiber',
  season: 'Kharif',
  duration: '120-150 days',
  soilType: ['Alluvial', 'Clay loam'],
  climate: 'Humid (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Malathion', target: 'Aphids and flea beetles', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Stem Rot',
      symptoms: 'Black lesions on stems',
      treatment: 'Carbendazim spray (1g/liter)'
    },
    {
      name: 'Hooghly Wilt',
      symptoms: 'Yellowing and wilting of plants in patches',
      treatment: 'Crop rotation and removal of infected plants'
    }
  ],
  tips: [
    'Retting in clean water improves fiber quality',
    'Harvest at flowering stage'
  ]
},
{
  id: '15',
  name: 'Tea',
  category: 'Commercial',
  season: 'Perennial',
  duration: '3 years to first harvest',
  soilType: ['Acidic (pH 4.5-5.5)', 'Well-drained'],
  climate: 'Subtropical (15-25°C)',
  difficulty: 'Advanced',
  popularity: 80,
  fertilizers: [
    { name: 'NPK 20:10:10', application: 'Top dressing', timing: 'Every 3 months' }
  ],
  pesticides: [
    { name: 'Neonicotinoids', target: 'Tea mosquito bug', dosage: '0.5ml/liter' },
    { name: 'Lambda-cyhalothrin', target: 'Looper caterpillar', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Red Rust',
      symptoms: 'Orange to red powdery growth on leaves',
      treatment: 'Spray Copper Oxychloride (2g/liter)'
    },
    {
      name: 'Blister Blight',
      symptoms: 'Water-soaked spots on young leaves',
      treatment: 'Hexaconazole or Propiconazole spray'
    }
  ],
  tips: [
    'Prune regularly to maintain plucking table',
    'Shade trees improve quality'
  ]
},
{
  id: '16',
  name: 'Tomato',
  category: 'Vegetable',
  season: 'Rabi/Summer',
  duration: '90-120 days',
  soilType: ['Sandy loam', 'Organic-rich'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Intermediate',
  popularity: 90,
  fertilizers: [
    { name: 'Vermicompost', application: 'Basal', timing: 'At transplanting' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Fruit borer', dosage: '1ml/liter' },
    { name: 'Neem oil', target: 'Whiteflies', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Early Blight',
      symptoms: 'Concentric rings on leaves',
      treatment: 'Chlorothalonil (2g/liter)'
    },
    {
      name: 'Late Blight',
      symptoms: 'Brown lesions with pale green halo',
      treatment: 'Mancozeb or Metalaxyl spray'
    },
    {
      name: 'Leaf Curl Virus',
      symptoms: 'Upward curling of leaves, yellowing',
      treatment: 'Control whiteflies, remove infected plants'
    }
  ],
  tips: [
    'Stake plants for better yield',
    'Avoid overhead irrigation'
  ]
},
{
  id: '17',
  name: 'Banana',
  category: 'Fruit',
  season: 'Perennial',
  duration: '12-15 months',
  soilType: ['Alluvial', 'Volcanic'],
  climate: 'Tropical (25-35°C)',
  difficulty: 'Beginner',
  popularity: 85,
  fertilizers: [
    { name: 'Potassium chloride', application: 'Top dressing', timing: 'Every 2 months' }
  ],
  pesticides: [
    { name: 'Pseudomonas fluorescens', target: 'Panama wilt', dosage: 'Soil drenching' },
    { name: 'Carbofuran', target: 'Weevils & Nematodes', dosage: 'Apply in soil at planting' }
  ],
  diseases: [
    {
      name: 'Panama Wilt',
      symptoms: 'Yellowing and wilting of older leaves',
      treatment: 'Use resistant cultivars; drench with Pseudomonas fluorescens'
    },
    {
      name: 'Sigatoka Leaf Spot',
      symptoms: 'Brown streaks and yellow spots on leaves',
      treatment: 'Spray Mancozeb or Propiconazole'
    }
  ],
  tips: [
    'Plant suckers at 2m spacing',
    'Remove excess suckers for better yield'
  ]
},

{
  id: '24',
  name: 'Barnyard Millet',
  category: 'Cereal',
  season: 'Kharif',
  duration: '80-90 days',
  soilType: ['Loamy', 'Sandy'],
  climate: 'Subtropical to warm (20-30°C)',
  difficulty: 'Beginner',
  popularity: 40,
  fertilizers: [
    { name: 'Compost', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Malathion', target: 'Shoot fly', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Blast',
      symptoms: 'Brown lesions on leaves and stems',
      treatment: 'Spray Carbendazim or Tricyclazole'
    }
  ],
  tips: [
    'Good for intercropping systems',
    'Gluten-free and nutrient-rich'
  ]
},
{
  id: '25',
  name: 'Foxtail Millet',
  category: 'Cereal',
  season: 'Kharif',
  duration: '80-100 days',
  soilType: ['Sandy loam', 'Red soil'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Beginner',
  popularity: 45,
  fertilizers: [
    { name: 'Farmyard manure', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Quinalphos', target: 'Stem borer', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Smut',
      symptoms: 'Black powdery masses on ear heads',
      treatment: 'Use certified seeds and fungicide seed treatment'
    }
  ],
  tips: ['Good for diabetic diets', 'Requires less water']
},
{
  id: '26',
  name: 'Little Millet',
  category: 'Cereal',
  season: 'Kharif',
  duration: '100-120 days',
  soilType: ['Well-drained', 'Loamy'],
  climate: 'Warm and dry',
  difficulty: 'Beginner',
  popularity: 40,
  fertilizers: [
    { name: 'Compost + NPK', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids and borers', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Blast',
      symptoms: 'Brown oval lesions on leaves',
      treatment: 'Spray Mancozeb or Carbendazim'
    }
  ],
  tips: ['Drought-tolerant', 'Can be grown in marginal soils']
},
{
  id: '27',
  name: 'Kodo Millet',
  category: 'Cereal',
  season: 'Kharif',
  duration: '100-120 days',
  soilType: ['Sandy', 'Gravelly'],
  climate: 'Tropical',
  difficulty: 'Intermediate',
  popularity: 35,
  fertilizers: [
    { name: 'Farmyard manure + DAP', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Chlorpyrifos', target: 'Shoot fly', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Small brown spots on leaves',
      treatment: 'Spray Mancozeb 2g/liter'
    }
  ],
  tips: ['Ideal for dryland farming']
},
  
{
  id: '28',
  name: 'Sorghum (Jowar)',
  category: 'Cereal',
  season: 'Kharif/Rabi',
  duration: '100-120 days',
  soilType: ['Sandy loam', 'Black soil'],
  climate: 'Hot and dry',
  difficulty: 'Beginner',
  popularity: 55,
  fertilizers: [
    { name: 'NPK 20:10:10', application: 'Basal', timing: 'At sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Chlorpyrifos', target: 'Stem borer', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Charcoal Rot',
      symptoms: 'Stalk dries from base upwards',
      treatment: 'Avoid water stress, apply Carbendazim'
    }
  ],
  tips: ['Good fodder crop', 'Drought-tolerant']
},
{
  id: '29',
  name: 'Finger Millet (Ragi)',
  category: 'Cereal',
  season: 'Kharif',
  duration: '100-120 days',
  soilType: ['Red loam', 'Lateritic'],
  climate: 'Moderate',
  difficulty: 'Beginner',
  popularity: 50,
  fertilizers: [
    { name: 'NPK 17:17:17', application: 'Basal', timing: 'At sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after transplanting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Blast',
      symptoms: 'Brown oval lesions on leaf blades',
      treatment: 'Spray Carbendazim or Tricyclazole'
    },
    {
      name: 'Brown Spot',
      symptoms: 'Circular to oval brown lesions',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  tips: ['Rich in calcium and fiber', 'Highly nutritious']
},
{
  id: '31',
  name: 'Pearl Millet (Bajra)',
  category: 'Cereal',
  season: 'Kharif',
  duration: '85-95 days',
  soilType: ['Light soil', 'Sandy'],
  climate: 'Hot (30-40°C)',
  difficulty: 'Beginner',
  popularity: 65,
  fertilizers: [
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' },
    { name: 'DAP', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Quinalphos', target: 'Shoot fly', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Downy Mildew',
      symptoms: 'White fungal growth on lower leaves',
      treatment: 'Spray Metalaxyl 2g/liter'
    },
    {
      name: 'Ergot',
      symptoms: 'Black fungal growth replacing grains',
      treatment: 'Remove infected ears; use Mancozeb'
    }
  ],
  tips: ['Tolerates drought and poor soils', 'Popular in Rajasthan']
},
{
  id: '32',
  name: 'Proso Millet',
  category: 'Cereal',
  season: 'Kharif',
  duration: '70-90 days',
  soilType: ['Sandy loam', 'Loamy'],
  climate: 'Temperate',
  difficulty: 'Intermediate',
  popularity: 25,
  fertilizers: [
    { name: 'Compost + NPK', application: 'Basal', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf folder', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Rust',
      symptoms: 'Small brown pustules on leaves',
      treatment: 'Spray Mancozeb 2g/liter'
    }
  ],
  tips: ['Short growing period', 'Gluten-free grain']
}, 
    {
  id: '33',
  name: 'Lentil (Masoor)',
  category: 'Pulse',
  season: 'Rabi',
  duration: '110-130 days',
  soilType: ['Sandy loam', 'Well-drained loam'],
  climate: 'Cool and dry (15-25°C)',
  difficulty: 'Easy',
  popularity: 80,
  fertilizers: [
    { name: 'Phosphorus (P2O5)', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Potash (K2O)', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Rhizobium biofertilizer', application: 'Seed treatment', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Carbendazim', target: 'Stem rot', dosage: '1g/liter' },
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing leaves, wilting plants',
      treatment: 'Crop rotation, resistant varieties'
    },
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery patches on leaves',
      treatment: 'Sulfur-based fungicides'
    }
  ],
  tips: [
    'Sow in well-drained soil to avoid waterlogging',
    'Avoid nitrogen-heavy fertilizers',
    'Intercropping with mustard can reduce pest risk'
  ]
},
   {
  id: '34',
  name: 'Mung Bean (Moong)',
  category: 'Pulse',
  season: 'Kharif/Rabi/Summer',
  duration: '60-90 days',
  soilType: ['Sandy loam', 'Black soil'],
  climate: 'Warm (25-35°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 85,
  fertilizers: [
    { name: 'Vermicompost', application: 'Basal dose', timing: 'At sowing' },
    { name: 'SSP (Single Super Phosphate)', application: 'Basal dose', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Pod borers', dosage: '0.5ml/liter' },
    { name: 'Deltamethrin', target: 'Whitefly', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Yellow Mosaic Virus',
      symptoms: 'Yellow-green leaf mottling',
      treatment: 'Resistant varieties, control whiteflies'
    },
    {
      name: 'Cercospora Leaf Spot',
      symptoms: 'Brown spots with yellow halos',
      treatment: 'Mancozeb spray (2g/liter)'
    }
  ],
  tips: [
    'Short duration; ideal for crop rotation',
    'Pre-irrigate fields before sowing',
    'Harvest when 80% pods turn black'
  ]
},
    {
  id: '4',
  name: 'Black Gram (Urad)',
  category: 'Pulse',
  season: 'Kharif/Rabi',
  duration: '90-120 days',
  soilType: ['Clay loam', 'Black cotton soil'],
  climate: 'Warm and humid (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 75,
  fertilizers: [
    { name: 'Farmyard manure (FYM)', application: 'Basal dose', timing: 'Before sowing' },
    { name: 'DAP (18:46:0)', application: 'Basal dose', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Quinalphos', target: 'Stem fly', dosage: '2ml/liter' },
    { name: 'Copper oxychloride', target: 'Leaf spot', dosage: '3g/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Curl Virus',
      symptoms: 'Curled, distorted leaves',
      treatment: 'Neem oil spray, resistant varieties'
    },
    {
      name: 'Root Rot',
      symptoms: 'Wilting, brown roots',
      treatment: 'Avoid waterlogging, Trichoderma treatment'
    }
  ],
  tips: [
    'Sow in rows for better aeration',
    'Treat seeds with Rhizobium culture',
    'Tolerant to waterlogging but avoid heavy soils'
  ]
},
    {
  id: '5',
  name: 'Kidney Bean (Rajma)',
  category: 'Pulse',
  season: 'Rabi (in plains), Summer (hills)',
  duration: '120-140 days',
  soilType: ['Well-drained loam', 'Silty clay'],
  climate: 'Cool (15-25°C), frost-sensitive',
  difficulty: 'Intermediate',
  popularity: 70,
  fertilizers: [
    { name: 'NPK 10:26:26', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Zinc sulfate', application: 'Foliar spray', timing: 'Flowering stage' }
  ],
  pesticides: [
    { name: 'Lambda-cyhalothrin', target: 'Aphids', dosage: '1ml/liter' },
    { name: 'Hexaconazole', target: 'Anthracnose', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Anthracnose',
      symptoms: 'Dark sunken spots on pods/leaves',
      treatment: 'Seed treatment with Thiram'
    },
    {
      name: 'Bacterial Blight',
      symptoms: 'Water-soaked leaf spots',
      treatment: 'Copper-based sprays'
    }
  ],
  tips: [
    'Provide support (staking) for climbing varieties',
    'Avoid overhead irrigation to prevent fungal diseases',
    'Harvest when pods turn yellow and dry'
  ]
},
    {
  id: '8',
  name: 'Sunflower',
  category: 'Oilseed',
  season: 'Kharif/Rabi',
  duration: '90-100 days',
  soilType: ['Well-drained loam', 'Black soil'],
  climate: 'Warm (20-30°C), drought-resistant',
  difficulty: 'Easy',
  popularity: 80,
  fertilizers: [
    { name: 'NPK 60:30:30', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Boron', application: 'Foliar spray', timing: 'Bud initiation stage' }
  ],
  pesticides: [
    { name: 'Imidacloprid', target: 'Head borer', dosage: '0.5ml/liter' },
    { name: 'Dicofol', target: 'Red spider mite', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow patches on leaves, white fungal growth',
      treatment: 'Metalaxyl spray'
    },
    {
      name: 'Sclerotinia Rot',
      symptoms: 'Water-soaked stem lesions, wilting',
      treatment: 'Crop rotation, avoid waterlogging'
    }
  ],
  tips: [
    'Plant at 45 cm spacing for better head size',
    'Provide support in windy areas',
    'Harvest when back of the head turns yellow'
  ]
},
    {
  id: '9',
  name: 'Sesame (Til)',
  category: 'Oilseed',
  season: 'Kharif/Summer',
  duration: '80-100 days',
  soilType: ['Sandy loam', 'Well-drained soil'],
  climate: 'Hot (25-35°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'NPK 20:20:10', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Farmyard Manure (FYM)', application: 'Basal dose', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf webber', dosage: '5ml/liter' },
    { name: 'Quinalphos', target: 'Gall fly', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Phyllody',
      symptoms: 'Leafy flowers, stunted growth',
      treatment: 'Control leafhoppers, use resistant varieties'
    },
    {
      name: 'Root Rot',
      symptoms: 'Wilting, brown roots',
      treatment: 'Avoid waterlogging, seed treatment with Thiram'
    }
  ],
  tips: [
    'Shallow sowing (2-3 cm depth) for better germination',
    'Thin plants to 15 cm spacing',
    'Harvest when capsules turn yellow'
  ]
},
   {
  id: '11',
  name: 'Castor',
  category: 'Oilseed',
  season: 'Kharif/Rabi',
  duration: '150-180 days',
  soilType: ['Sandy loam', 'Well-drained soil'],
  climate: 'Hot (20-35°C), drought-resistant',
  difficulty: 'Easy',
  popularity: 65,
  fertilizers: [
    { name: 'NPK 40:20:20', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Potash', application: 'Top dressing', timing: '60 days after sowing' }
  ],
  pesticides: [
    { name: 'Monocrotophos', target: 'Semilooper', dosage: '1.5ml/liter' },
    { name: 'Sulfur dust', target: 'Mites', dosage: '25kg/ha' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing, wilting, vascular browning',
      treatment: 'Resistant varieties, soil solarization'
    },
    {
      name: 'Gray Mold',
      symptoms: 'Fuzzy gray growth on capsules',
      treatment: 'Avoid dense planting, spray Carbendazim'
    }
  ],
  tips: [
    'Widely spaced planting (90x60 cm)',
    'Detopping (removing terminal bud) increases branching',
    'Harvest capsules in 2-3 pickings'
  ]
},
 {
  id: '12',
  name: 'Safflower',
  category: 'Oilseed',
  season: 'Rabi',
  duration: '120-150 days',
  soilType: ['Well-drained loam', 'Black soil'],
  climate: 'Cool to moderate (15-30°C), drought-tolerant',
  difficulty: 'Intermediate',
  popularity: 60,
  fertilizers: [
    { name: 'NPK 40:20:20', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Sulfur', application: 'Top dressing', timing: '45 days after sowing' }
  ],
  pesticides: [
    { name: 'Malathion', target: 'Safflower fly', dosage: '2ml/liter' },
    { name: 'Carbendazim', target: 'Alternaria blight', dosage: '1g/liter' }
  ],
  diseases: [
    {
      name: 'Alternaria Blight',
      symptoms: 'Dark brown leaf spots, defoliation',
      treatment: 'Seed treatment with Thiram'
    },
    {
      name: 'Root Rot',
      symptoms: 'Wilting, blackened roots',
      treatment: 'Avoid waterlogging, crop rotation'
    }
  ],
  tips: [
    'Thin plants to 20 cm spacing for better yield',
    'Harvest when leaves dry and turn brown',
    'Used for edible oil and dye (carthamin) extraction'
  ]
},
{
  id: '13',
  name: 'Linseed (Flaxseed)',
  category: 'Oilseed',
  season: 'Rabi',
  duration: '90-120 days',
  soilType: ['Sandy loam', 'Clay loam'],
  climate: 'Cool (10-25°C), frost-tolerant',
  difficulty: 'Easy',
  popularity: 55,
  fertilizers: [
    { name: 'NPK 20:20:10', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Boron', application: 'Foliar spray', timing: 'Flowering stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' },
    { name: 'Mancozeb', target: 'Rust', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Linseed Rust',
      symptoms: 'Orange-yellow pustules on leaves',
      treatment: 'Resistant varieties, sulfur sprays'
    },
    {
      name: 'Wilt',
      symptoms: 'Sudden wilting, vascular browning',
      treatment: 'Crop rotation with cereals'
    }
  ],
  tips: [
    'Sow early in Rabi to avoid heat stress during flowering',
    'Used for industrial oil (paints, varnishes) and omega-3-rich edible oil',
    'Harvest when capsules turn yellow-brown'
  ]
},
{
  id: '14',
  name: 'Niger (Ramtil)',
  category: 'Oilseed',
  season: 'Kharif (hills), Rabi (plains)',
  duration: '90-110 days',
  soilType: ['Sandy loam', 'Laterite soil'],
  climate: 'Warm (20-30°C), drought-resistant',
  difficulty: 'Easy',
  popularity: 40,
  fertilizers: [
    { name: 'Farmyard Manure (FYM)', application: 'Basal dose', timing: 'Before sowing' },
    { name: 'SSP (Single Super Phosphate)', application: 'Basal dose', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Karanj oil', target: 'Capsule borer', dosage: '5ml/liter' },
    { name: 'Copper oxychloride', target: 'Leaf spot', dosage: '3g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Sulfur dusting (25kg/ha)'
    },
    {
      name: 'Charcoal Rot',
      symptoms: 'Wilting, gray stem discoloration',
      treatment: 'Avoid drought stress'
    }
  ],
  tips: [
    'Often grown as a border crop or in marginal lands',
    'Seeds attract birds; use nets if needed',
    'Harvest when flower heads turn black'
  ]
},
{
  id: '15',
  name: 'Cottonseed',
  category: 'Oilseed',
  season: 'Kharif',
  duration: '150-180 days (cotton crop duration)',
  soilType: ['Black cotton soil', 'Well-drained loam'],
  climate: 'Hot (25-40°C), needs long frost-free period',
  difficulty: 'Intermediate',
  popularity: 75,
  fertilizers: [
    { name: 'NPK 50:25:25', application: 'Split doses', timing: 'Sowing, flowering, boll formation' },
    { name: 'Zinc sulfate', application: 'Foliar spray', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Acephate', target: 'Bollworms', dosage: '1.5g/liter' },
    { name: 'Dicofol', target: 'Red spider mite', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing, wilting, vascular browning',
      treatment: 'Resistant varieties (e.g., Bt cotton)'
    },
    {
      name: 'Boll Rot',
      symptoms: 'Water-soaked bolls, fungal growth',
      treatment: 'Avoid excess irrigation, spray Carbendazim'
    }
  ],
  tips: [
    'Cottonseed oil is a byproduct; prioritize fiber yield',
    'Bt cotton reduces bollworm pesticide use',
    'Dehulled cottonseed meal is used as cattle feed'
  ]
},
{
  id: '16',
  name: 'Taramira (Wild Mustard)',
  category: 'Oilseed',
  season: 'Rabi',
  duration: '100-120 days',
  soilType: ['Sandy loam', 'Saline soils'],
  climate: 'Cool to moderate (15-30°C), drought-hardy',
  difficulty: 'Easy',
  popularity: 30,
  fertilizers: [
    { name: 'NPK 20:20:10', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Gypsum', application: 'Soil amendment', timing: 'Before sowing (for saline soils)' }
  ],
  pesticides: [
    { name: 'Malathion', target: 'Aphids', dosage: '2ml/liter' },
    { name: 'Neem cake', target: 'Nematodes', dosage: '250kg/ha' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery patches on leaves',
      treatment: 'Sulfur spray (3g/liter)'
    },
    {
      name: 'Damping Off',
      symptoms: 'Seedling rot at soil level',
      treatment: 'Seed treatment with Trichoderma'
    }
  ],
  tips: [
    'Grown in arid/saline soils where other crops fail',
    'Oil is used for pickling and medicinal purposes',
    'Harvest when pods turn brown and dry'
  ]
},
{
  id: '17',
  name: 'Sisal',
  category: 'Fiber',
  season: 'Perennial (Year-round)',
  duration: '4-7 years (economic lifespan)',
  soilType: ['Well-drained sandy loam', 'Rocky soils'],
  climate: 'Arid to semi-arid (20-30°C), drought-resistant',
  difficulty: 'Easy',
  popularity: 65,
  fertilizers: [
    { name: 'NPK 10:10:20', application: 'Annual dose', timing: 'Early monsoon' },
    { name: 'Lime', application: 'Soil amendment', timing: 'Before planting (if acidic)' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Mealybugs', dosage: '5ml/liter' },
    { name: 'Chlorpyrifos', target: 'Sisal weevil', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Bole Rot',
      symptoms: 'Soft, decaying leaf base',
      treatment: 'Avoid waterlogging, remove infected plants'
    }
  ],
  uses: [
    'Ropes, twines, carpets',
    'Eco-friendly packaging material',
    'Biodegradable geotextiles'
  ],
  tips: [
    'Plant suckers or bulbils for propagation',
    'Harvest leaves when they reach 1-1.5m length',
    'Low-maintenance crop for marginal lands'
  ]
},
    {
  id: '18',
  name: 'Hemp',
  category: 'Fiber',
  season: 'Kharif (Temperate regions)',
  duration: '90-120 days',
  soilType: ['Loamy', 'Well-drained fertile soil'],
  climate: 'Temperate (15-27°C), needs moderate rainfall',
  difficulty: 'Intermediate',
  popularity: 70,
  fertilizers: [
    { name: 'NPK 20:20:20', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Organic compost', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Pyrethrin', target: 'Aphids', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Gray Mold',
      symptoms: 'Fuzzy gray growth on stems/leaves',
      treatment: 'Improve air circulation, avoid overcrowding'
    }
  ],
  uses: [
    'Textiles (similar to linen)',
    'Paper, biofuel, and CBD oil',
    'Construction materials (hempcrete)'
  ],
  tips: [
    'Requires licensing in many countries (check regulations)',
    'Harvest when plants begin to flower for fiber',
    'Retting (water or dew) is critical for fiber extraction'
  ]
},
{
  id: '19',
  name: 'Flax (Linen)',
  category: 'Fiber',
  season: 'Rabi (in India)',
  duration: '90-110 days',
  soilType: ['Silty loam', 'Well-drained fertile soil'],
  climate: 'Cool (10-22°C), humid during growth',
  difficulty: 'Intermediate',
  popularity: 60,
  fertilizers: [
    { name: 'NPK 12:12:12', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Boron', application: 'Foliar spray', timing: 'Bud formation' }
  ],
  pesticides: [
    { name: 'Copper sulfate', target: 'Fusarium wilt', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Pasmo',
      symptoms: 'Brown leaf spots, defoliation',
      treatment: 'Crop rotation, fungicide sprays'
    }
  ],
  uses: [
    'Linen fabric (high-value textile)',
    'Eco-friendly disposable products',
    'Art canvases'
  ],
  tips: [
    'Uproot plants (do not cut) to preserve fiber length',
    'Ret in slow-moving water for 7-14 days',
    'Higher rainfall = better fiber quality'
  ]
},
{
  id: '20',
  name: 'Kenaf',
  category: 'Fiber',
  season: 'Kharif',
  duration: '120-150 days',
  soilType: ['Sandy loam', 'Alluvial soil'],
  climate: 'Tropical (20-35°C), needs ample water',
  difficulty: 'Easy',
  popularity: 55,
  fertilizers: [
    { name: 'NPK 40:20:20', application: 'Basal dose', timing: 'At sowing' },
    { name: 'Farmyard manure', application: 'Top dressing', timing: '45 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf-eating caterpillars', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Root Knot Nematode',
      symptoms: 'Galls on roots, stunted growth',
      treatment: 'Marigold intercropping, neem cake'
    }
  ],
  uses: [
    'Pulp for paper (alternative to wood)',
    'Biodegradable packaging',
    'Animal bedding'
  ],
  tips: [
    'Harvest before flowering for best fiber quality',
    'Grows up to 5m tall; needs space',
    'Less lignin than wood = easier processing'
  ]
},
{
  id: '21',
  name: 'Ramie',
  category: 'Fiber',
  season: 'Perennial (Multiple harvests/year)',
  duration: '10-20 years (lifespan)',
  soilType: ['Volcanic loam', 'Well-drained fertile soil'],
  climate: 'Subtropical (22-35°C), high humidity',
  difficulty: 'High',
  popularity: 50,
  fertilizers: [
    { name: 'NPK 20:10:10', application: 'After each harvest', timing: 'Post-cutting' },
    { name: 'Silica', application: 'Soil amendment', timing: 'Annually' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Ramie moth', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Bacterial Blight',
      symptoms: 'Water-soaked leaf spots',
      treatment: 'Copper-based sprays'
    }
  ],
  uses: [
    'High-quality textiles (finer than linen)',
    'Banknote paper',
    'Filter cloths'
  ],
  tips: [
    'Labor-intensive decortication (scraping) needed',
    'Harvest shoots when 1-2m tall',
    'Yields improve after 3rd year'
  ]
},
{
  id: '22',
  name: 'Coir',
  category: 'Fiber',
  season: 'Year-round (from coconut husks)',
  duration: 'N/A (byproduct of coconut)',
  soilType: ['Sandy coastal soils'],
  climate: 'Tropical (25-32°C), high rainfall',
  difficulty: 'Low (processing-intensive)',
  popularity: 80,
  fertilizers: [
  {
    name: 'NPK 100:40:140 per palm/year',
    application: 'Split into 2–3 doses',
    timing: 'Start in June with follow-up in October and January'
  },
  {
    name: 'FYM (Farmyard Manure)',
    application: 'Soil enrichment',
    timing: 'Annually, 50kg per palm during monsoon'
  },
  {
    name: 'Neem Cake',
    application: 'Soil amendment & pest deterrent',
    timing: 'Annually, 5kg per palm with FYM'
  },
  {
    name: 'Micronutrients (Zn, Mg, B)',
    application: 'Foliar spray or soil',
    timing: 'Twice yearly for enhanced husk quality'
  }
],
  pesticides: [
    {
      name: 'Copper oxychloride',
      target: 'Stem rot in coconut (source of coir)',
      dosage: '2.5g/liter'
    }
  ],
  diseases: [
    {
      name: 'Stem Bleeding Disease',
      symptoms: 'Reddish brown fluid oozing from the trunk',
      treatment: 'Apply Tridemorph (1ml/liter) and avoid waterlogging'
    },
    {
      name: 'Basal Stem Rot (Ganoderma)',
      symptoms: 'Wilting and decay at base of coconut palm',
      treatment: 'Remove infected trees, improve drainage, apply biofungicides like Trichoderma'
    }
  ],
  processing: [
    { step: 'Retting', method: 'Soak husks in saline water for 6–12 months' },
    { step: 'Defibering', method: 'Mechanical beating' }
  ],
  uses: [
    'Doormats, brushes',
    'Geotextiles for erosion control',
    'Hydroponic growing medium'
  ],
  tips: [
    'White coir (from unripe husks) is finer',
    'Brown coir (from ripe husks) is stronger',
    'India (Kerala) and Sri Lanka are top producers'
  ]
},
    {
  id: 'C01',
  name: 'Stevia',
  category: 'Commercial',
  season: 'Spring/Summer',
  duration: '90-120 days',
  soilType: ['Loamy', 'Well-drained'],
  climate: 'Subtropical to tropical (20-30°C)',
  difficulty: 'Intermediate',
  popularity: 40,
  fertilizers: [
    { name: 'FYM + NPK 20:10:10', application: 'Basal and top dressing', timing: 'At planting and 45 days after' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Brown lesions on leaves',
      treatment: 'Use copper-based fungicide'
    }
  ],
  uses: [
    'Natural sweetener in food and beverages',
    'Diabetic-friendly sugar substitute'
  ],
  tips: [
    'Harvest just before flowering for max sweetness',
    'Dry leaves in shade for quality preservation'
  ]
},
{
  id: 'C02',
  name: 'Aloe Vera',
  category: 'Commercial',
  season: 'Summer',
  duration: '8-10 months (first harvest)',
  soilType: ['Sandy', 'Well-drained'],
  climate: 'Hot and arid (25-40°C)',
  difficulty: 'Beginner',
  popularity: 75,
  fertilizers: [
    { name: 'Vermicompost', application: 'Basal', timing: 'At planting' }
  ],
  pesticides: [
    { name: 'Neem extract', target: 'Mealy bugs', dosage: '10ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Dark spots with yellow halo',
      treatment: 'Remove affected leaves and apply fungicide'
    }
  ],
  uses: [
    'Cosmetics (skin, hair products)',
    'Medicinal (digestive aid, burns, wounds)'
  ],
  tips: [
    'Avoid waterlogging',
    'Needs bright sunlight and minimal care'
  ]
},    
{
  id: 'C03',
  name: 'Lemongrass',
  category: 'Commercial',
  season: 'Monsoon onset',
  duration: '4-5 months (first cut), then perennial',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Tropical (20-35°C)',
  difficulty: 'Beginner',
  popularity: 60,
  fertilizers: [
    { name: 'NPK 40:40:40', application: 'Split dose', timing: 'Basal and 60 days after planting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Mites and caterpillars', dosage: '3-5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Blight',
      symptoms: 'Tip drying and brown patches',
      treatment: 'Use Mancozeb fungicide'
    }
  ],
  uses: [
    'Essential oil extraction',
    'Flavouring tea, food, and aroma therapy'
  ],
  tips: [
    'Harvest every 2.5-3 months',
    'Grow on bunds for erosion control and profit'
  ]
},
{
  id: 'C04',
  name: 'Patchouli',
  category: 'Commercial',
  season: 'Spring',
  duration: '5-6 months',
  soilType: ['Sandy loam', 'High organic matter'],
  climate: 'Warm and humid (22-30°C)',
  difficulty: 'Intermediate',
  popularity: 35,
  fertilizers: [
    { name: 'Organic compost + NPK 20:20:20', application: 'Split dose', timing: 'At transplanting and 60 days after' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Leaf rollers', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Root Rot',
      symptoms: 'Wilting and root decay',
      treatment: 'Improve drainage and apply Trichoderma'
    }
  ],
  uses: [
    'Essential oils for perfumes',
    'Aromatherapy and incense sticks'
  ],
  tips: [
    'Requires partial shade',
    'Can regrow after harvesting if cut properly'
  ]
},
{
  id: 'C05',
  name: 'Isabgol (Psyllium)',
  category: 'Commercial',
  season: 'Rabi',
  duration: '110-130 days',
  soilType: ['Sandy loam', 'Alkaline'],
  climate: 'Cool and dry (15-25°C)',
  difficulty: 'Intermediate',
  popularity: 45,
  fertilizers: [
    { name: 'FYM + NPK 20:10:10', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Chlorpyrifos', target: 'White grub', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Downy Mildew',
      symptoms: 'Yellowing and curling of leaves',
      treatment: 'Use systemic fungicide like Metalaxyl'
    }
  ],
  uses: [
    'Dietary fiber supplement',
    'Constipation treatment, digestive aid'
  ],
  tips: [
    'Harvest when spike turns brown',
    'Avoid irrigation during maturity to prevent seed shattering'
  ]
},
{
  id: 'V01',
  name: 'Okra (Bhindi)',
  category: 'Vegetable',
  season: 'Kharif/Rabi',
  duration: '60–70 days',
  soilType: ['Sandy loam', 'Clay', 'Well-drained'],
  climate: 'Warm (20–35°C), moderate rainfall',
  difficulty: 'Beginner',
  popularity: 85,
  fertilizers: [
    { name: 'NPK 20:20:20', application: 'Basal', timing: 'At sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Cypermethrin', target: 'Aphids, whiteflies', dosage: '1ml/liter' },
    { name: 'Spinosad', target: 'Fruit borer', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Verticillium Wilt',
      symptoms: 'Yellowing followed by wilting of lower leaves',
      treatment: 'Use resistant varieties, soil solarization'
    },
    {
      name: 'Powdery Mildew',
      symptoms: 'White powder on leaves/stems',
      treatment: 'Spray Sulphur or spray Potassium bicarbonate 2g/liter'
    }
  ],
  uses: ['Culinary vegetable: fried, curries, soups'],
  tips: [
    'Harvest pods early (2–3 inches) to avoid fibrous texture',
    'Ensure spacing to reduce humidity and fungal disease'
  ]
},    

{
  id: 'V02',
  name: 'Bottle Gourd',
  category: 'Vegetable',
  season: 'Summer/Kharif',
  duration: '60-70 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Easy',
  popularity: 85,
  fertilizers: [
    { name: 'FYM + NPK 6:10:10', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Malathion', target: 'Red pumpkin beetle', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Anthracnose',
      symptoms: 'Dark sunken spots on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Curries, sweets, juice'],
  tips: [
    'Provide trellis support for straight fruits',
    'Harvest when fruits are tender'
  ]
},    
{
  id: 'V03',
  name: 'Ridge Gourd',
  category: 'Vegetable',
  season: 'Summer/Kharif',
  duration: '70-80 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-30°C)',
  difficulty: 'Easy',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Leaf miner', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow angular spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Curries, chutneys'],
  tips: [
    'Provide strong trellis support',
    'Harvest when ridges are well-formed but tender'
  ]
},
{
  id: 'V04',
  name: 'Snake Gourd',
  category: 'Vegetable',
  season: 'Summer/Kharif',
  duration: '80-90 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-30°C)',
  difficulty: 'Intermediate',
  popularity: 70,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Malathion', target: 'Leaf eating caterpillar', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing and wilting of vines',
      treatment: 'Soil drenching with Carbendazim'
    }
  ],
  uses: ['Curries, stir-fries'],
  tips: [
    'Needs strong overhead trellis for straight fruits',
    'Harvest when fruits are young and tender'
  ]
},
{
  id: 'V05',
  name: 'Pointed Gourd',
  category: 'Vegetable',
  season: 'Summer/Kharif',
  duration: '90-120 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before planting' },
    { name: 'Urea', application: 'Top dressing', timing: '60 days after planting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Epilachna beetle', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Fruit Rot',
      symptoms: 'Water soaked lesions on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Curries, sweets'],
  tips: [
    'Propagated through vine cuttings',
    'Needs support for climbing'
  ]
},
    {
  id: 'V06',
  name: 'Ivy Gourd',
  category: 'Vegetable',
  season: 'Year-round (Perennial)',
  duration: '90-120 days (first harvest)',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before planting' },
    { name: 'Urea', application: 'Top dressing', timing: 'Every 2 months' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Malathion', target: 'Leaf miner', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Leaf Spot',
      symptoms: 'Brown circular spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Curries, stir-fries, pickles'],
  tips: [
    'Propagated through stem cuttings',
    'Requires trellis for climbing',
    'Regular pruning increases yield'
  ]
},
    {
  id: 'V07',
  name: 'Cluster Beans',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '80-90 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' },
    { name: 'Rhizobium culture', application: 'Seed treatment', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Jassids', dosage: '5ml/liter' },
    { name: 'Dimethoate', target: 'Pod borer', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Bacterial Blight',
      symptoms: 'Water-soaked leaf spots',
      treatment: 'Streptocycline 0.5g/liter spray'
    },
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Curries, guar gum production'],
  tips: [
    'Tolerates poor soils',
    'Harvest pods when young and tender',
    'Dual-purpose (vegetable + industrial crop)'
  ]
},
    {
  id: 'V08',
  name: 'French Beans',
  category: 'Vegetable',
  season: 'Rabi (Plains), Summer (Hills)',
  duration: '50-60 days',
  soilType: ['Loamy', 'Well-drained'],
  climate: 'Moderate (15-25°C)',
  difficulty: 'Easy',
  popularity: 85,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' },
    { name: 'Rhizobium culture', application: 'Seed treatment', timing: 'At sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Pod borer', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Anthracnose',
      symptoms: 'Dark sunken spots on pods',
      treatment: 'Mancozeb 2g/liter spray'
    },
    {
      name: 'Rust',
      symptoms: 'Orange pustules on leaves',
      treatment: 'Hexaconazole 1ml/liter spray'
    }
  ],
  uses: ['Salads, stir-fries, canned beans'],
  tips: [
    'Bush varieties need no support',
    'Harvest when pods snap easily',
    'Successive sowing every 2 weeks for continuous harvest'
  ]
},
    {
  id: 'V09',
  name: 'Yam',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '8-10 months',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'FYM (25 tons/ha)', application: 'Basal', timing: 'Before planting' },
    { name: 'NPK 60:60:80', application: 'Split doses', timing: 'Planting + 3 & 6 months' }
  ],
  pesticides: [
    { name: 'Chlorpyriphos', target: 'Tuber fly', dosage: '2ml/liter soil drench' }
  ],
  diseases: [
    {
      name: 'Leaf Blight',
      symptoms: 'Brown lesions with yellow halos',
      treatment: 'Copper oxychloride 3g/liter spray'
    },
    {
      name: 'Tuber Rot',
      symptoms: 'Soft rotting of tubers',
      treatment: 'Avoid waterlogging, treat with Trichoderma'
    }
  ],
  uses: ['Curries, chips, flour'],
  tips: [
    'Plant whole small tubers or cut pieces with at least one eye',
    'Mound soil around base as plant grows',
    'Harvest when leaves turn yellow'
  ]
},
    {
  id: 'V10',
  name: 'Colocasia',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '6-7 months',
  soilType: ['Clay loam', 'Waterlogged soils'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'FYM (20 tons/ha)', application: 'Basal', timing: 'Before planting' },
    { name: 'NPK 80:40:80', application: 'Split doses', timing: 'Planting + 3 months' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Blight',
      symptoms: 'Water-soaked leaf spots',
      treatment: 'Mancozeb 2g/liter spray'
    },
    {
      name: 'Corm Rot',
      symptoms: 'Soft rotting of corms',
      treatment: 'Avoid water stagnation'
    }
  ],
  uses: ['Curries, chips, leaves as greens'],
  tips: [
    'Can grow in waterlogged conditions',
    'Harvest when leaves start yellowing',
    'Peel and soak in water before cooking to remove acridity'
  ]
},
 {
  id: 'V11',
  name: 'Drumstick',
  category: 'Vegetable',
  season: 'Year-round',
  duration: '6-8 months to first harvest',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 80,
  fertilizers: [
    { name: 'FYM (10kg/plant)', application: 'Annual', timing: 'Before monsoon' },
    { name: 'NPK 50:50:50', application: 'Split doses', timing: 'Monsoon + winter' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Budworm', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Sambhar, curries, leaves as nutrition supplement'],
  tips: [
    'Prune annually to maintain height',
    'Drought-resistant once established',
    'Harvest pods when tender (pencil thickness)'
  ]
}, 
   {
  id: 'V12',
  name: 'Beetroot',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '55-65 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Easy',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' },
    { name: 'Boron', application: 'Foliar spray', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf miner', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Cercospora Leaf Spot',
      symptoms: 'Small brown spots with red borders',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Salads, juices, pickles'],
  tips: [
    'Thin seedlings to 10cm spacing',
    'Harvest when roots reach 5-7cm diameter',
    'Rich in iron and antioxidants'
  ]
},
{
  id: 'V13',
  name: 'Radish',
  category: 'Vegetable',
  season: 'Rabi (Winter varieties), Kharif (Summer varieties)',
  duration: '25-45 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Cool (10-25°C)',
  difficulty: 'Very Easy',
  popularity: 90,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Alternaria Blight',
      symptoms: 'Dark concentric rings on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Salads, pickles, cooked vegetable'],
  tips: [
    'Sow seeds directly in field',
    'Harvest before roots become pithy',
    'Summer varieties are more pungent'
  ]
},
   {
  id: 'V14',
  name: 'Cabbage',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '70-90 days',
  soilType: ['Clay loam', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Intermediate',
  popularity: 85,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after transplanting' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Diamondback moth', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Black Rot',
      symptoms: 'Yellow V-shaped leaf margins',
      treatment: 'Streptocycline 0.5g/liter spray'
    },
    {
      name: 'Club Root',
      symptoms: 'Swollen malformed roots',
      treatment: 'Lime application + crop rotation'
    }
  ],
  uses: ['Salads, coleslaw, cooked dishes'],
  tips: [
    'Transplant 4-6 week old seedlings',
    'Harvest when heads are firm',
    'Avoid water stress to prevent head splitting'
  ]
},
  {
  id: 'V15',
  name: 'Cauliflower',
  category: 'Vegetable',
  season: 'Rabi (main), Kharif (early varieties)',
  duration: '90-120 days',
  soilType: ['Clay loam', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Intermediate',
  popularity: 90,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Boron', application: 'Foliar spray', timing: 'Curd formation stage' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Diamondback moth', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Black Rot',
      symptoms: 'Yellow V-shaped leaf margins',
      treatment: 'Streptocycline 0.5g/liter spray'
    },
    {
      name: 'Buttoning',
      symptoms: 'Small premature curds',
      treatment: 'Avoid nitrogen deficiency and transplant shock'
    }
  ],
  uses: ['Curries, soups, pickles'],
  tips: [
    'Cover curds with leaves to maintain whiteness',
    'Harvest when curds are compact',
    'Temperature-sensitive - choose variety according to season'
  ]
},
  {
  id: 'V16',
  name: 'Spinach',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '30-45 days',
  soilType: ['Loamy', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Easy',
  popularity: 95,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '20 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf miner', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow spots on upper leaf surface',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Saag, salads, soups'],
  tips: [
    'Sow seeds directly in field',
    'Harvest outer leaves first for continuous yield',
    'Rich in iron and vitamins'
  ]
},
 {
  id: 'V17',
  name: 'Amaranth',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '25-30 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Very Easy',
  popularity: 80,
  fertilizers: [
    { name: 'FYM', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf-eating caterpillars', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Small brown spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Saag, stir-fries, seeds as grain'],
  tips: [
    'Sow thickly and thin later',
    'Harvest when 20-25cm tall',
    'Drought-tolerant once established'
  ]
},
{
  id: 'V18',
  name: 'Fenugreek Leaves',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '20-25 days',
  soilType: ['Loamy', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Very Easy',
  popularity: 85,
  fertilizers: [
    { name: 'FYM', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Curries, parathas, medicinal'],
  tips: [
    'Sow seeds thickly for leafy growth',
    'Harvest when 15-20cm tall',
    'Rich in iron and digestive properties'
  ]
},
{
  id: 'V19',
  name: 'Coriander',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '30-45 days (for leaves)',
  soilType: ['Loamy', 'Well-drained'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Easy',
  popularity: 95,
  fertilizers: [
    { name: 'FYM', application: 'Basal', timing: 'Before sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Stem Gall',
      symptoms: 'Swollen stems with cavities',
      treatment: 'Seed treatment with hot water'
    }
  ],
  uses: ['Garnish, chutneys, flavoring'],
  tips: [
    'Crush seeds slightly before sowing for better germination',
    'Harvest in morning for best flavor',
    'Successive sowing every 2 weeks for continuous supply'
  ]
},
{
  id: 'V20',
  name: 'Lettuce',
  category: 'Vegetable',
  season: 'Rabi (Plains), Summer (Hills)',
  duration: '50-60 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Cool (10-20°C)',
  difficulty: 'Intermediate',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Tip Burn',
      symptoms: 'Brown leaf margins',
      treatment: 'Ensure calcium availability'
    }
  ],
  uses: ['Salads, sandwiches, wraps'],
  tips: [
    'Transplant 3-4 week old seedlings',
    'Harvest in morning for crisp leaves',
    'Partial shade prevents bolting in warm weather'
  ]
},
{
  id: 'V21',
  name: 'Celery',
  category: 'Vegetable',
  season: 'Rabi (Plains), Summer (Hills)',
  duration: '100-120 days',
  soilType: ['Clay loam', 'Rich organic matter'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Boron', application: 'Foliar spray', timing: '30 days after transplanting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf miner', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Early Blight',
      symptoms: 'Brown spots with yellow halos',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Salads, soups, flavoring'],
  tips: [
    'Start seeds indoors 10-12 weeks before transplanting',
    'Blanching (wrapping stems) produces tender stalks',
    'Requires consistent moisture'
  ]
},
{
  id: 'V22',
  name: 'Pumpkin',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '90-120 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Easy',
  popularity: 80,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Red pumpkin beetle', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow angular spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Curries, sweets, soups'],
  tips: [
    'Allow vines to spread or train on trellis',
    'Harvest when skin hardens and color deepens',
    'Rich in beta-carotene'
  ]
},
{
  id: 'V23',
  name: 'Ash Gourd',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '120-150 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Malathion', target: 'Red pumpkin beetle', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Curries, sweets (petha), juice'],
  tips: [
    'Allow fruits to mature fully for storage',
    'Can be stored for 6-12 months',
    'High water content (96%)'
  ]
},
{
  id: 'V34',
  name: 'Capsicum',
  category: 'Vegetable',
  season: 'Rabi (Plains), Summer (Hills)',
  duration: '90-100 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Moderate (18-25°C)',
  difficulty: 'Intermediate',
  popularity: 80,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Calcium nitrate', application: 'Foliar spray', timing: 'Flowering stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Thrips', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Anthracnose',
      symptoms: 'Sunken spots on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    },
    {
      name: 'Bacterial Spot',
      symptoms: 'Small water-soaked leaf spots',
      treatment: 'Streptocycline 0.5g/liter spray'
    }
  ],
  uses: ['Salads, stir-fries, stuffed vegetables'],
  tips: [
    'Provide support to plants',
    'Harvest when fruits reach full size',
    'Color changes from green to red/yellow if left longer'
  ]
},
 {
  id: 'V35',
  name: 'Chilli',
  category: 'Vegetable',
  season: 'Kharif/Rabi',
  duration: '120-150 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (20-30°C)',
  difficulty: 'Easy',
  popularity: 90,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Potash', application: 'Top dressing', timing: 'Flowering stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Thrips', dosage: '5ml/liter' },
    { name: 'Spinosad', target: 'Fruit borer', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Die-back',
      symptoms: 'Drying of twigs from tip backward',
      treatment: 'Prune affected parts, spray Carbendazim'
    },
    {
      name: 'Anthracnose',
      symptoms: 'Sunken spots on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Seasoning, pickles, chutneys'],
  tips: [
    'Harvest regularly to promote more flowering',
    'Wear gloves while handling hot varieties',
    'Can be grown as perennial in frost-free areas'
  ]
},
 {
  id: 'V36',
  name: 'Cucumber',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '50-70 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Easy',
  popularity: 85,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Red pumpkin beetle', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow angular spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Salads, raita, pickles'],
  tips: [
    'Provide trellis for straight fruits',
    'Harvest when fruits are young and tender',
    'Regular watering prevents bitter taste'
  ]
},
{
  id: 'V37',
  name: 'Watermelon',
  category: 'Fruit',
  season: 'Summer',
  duration: '80-90 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Hot (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 80,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Potash', application: 'Top dressing', timing: 'Fruit setting stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' },
    { name: 'Carbaryl', target: 'Red pumpkin beetle', dosage: '2g/liter' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing and wilting of vines',
      treatment: 'Soil solarization, resistant varieties'
    },
    {
      name: 'Anthracnose',
      symptoms: 'Sunken spots on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Fresh consumption, juices'],
  tips: [
    'Allow 2m spacing between hills',
    'Harvest when tendril near fruit stem dries',
    'Thump test - ripe fruits produce dull sound'
  ]
},
{
  id: 'V38',
  name: 'Muskmelon',
  category: 'Vegetable',
  season: 'Summer',
  duration: '90-100 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Hot (25-35°C)',
  difficulty: 'Intermediate',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Potash', application: 'Top dressing', timing: 'Fruit setting stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    },
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow angular spots on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    }
  ],
  uses: ['Fresh consumption, desserts'],
  tips: [
    'Harvest when fruit slips easily from vine',
    'Sweetness improves in hot, dry weather',
    'Netting on rind indicates ripeness'
  ]
},
{
  id: 'V40',
  name: 'Sponge Gourd',
  category: 'Vegetable',
  season: 'Kharif',
  duration: '90-100 days',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C)',
  difficulty: 'Easy',
  popularity: 65,
  fertilizers: [
    { name: 'FYM + NPK 6:12:12', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Top dressing', timing: '30 days after sowing' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powdery growth on leaves',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Curries, stir-fries, sponges when mature'],
  tips: [
    'Harvest young for vegetable use',
    'Allow to mature and dry for sponge making',
    'Provide strong trellis support'
  ]
},
{
  id: 'V32',
  name: 'Brinjal',
  category: 'Vegetable',
  season: 'Kharif/Rabi',
  duration: '100-120 days',
  soilType: ['Clay loam', 'Well-drained'],
  climate: 'Warm (22-30°C)',
  difficulty: 'Intermediate',
  popularity: 85,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before transplanting' },
    { name: 'Urea', application: 'Top dressing', timing: '30 and 60 days after transplanting' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Shoot and fruit borer', dosage: '5ml/liter' },
    { name: 'Spinosad', target: 'Fruit borer', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Bacterial Wilt',
      symptoms: 'Sudden wilting of plants',
      treatment: 'Soil drenching with Streptocycline'
    },
    {
      name: 'Phomopsis Blight',
      symptoms: 'Sunken spots on fruits',
      treatment: 'Seed treatment with Carbendazim'
    }
  ],
  uses: ['Curries, bhartha, pickles'],
  tips: [
    'Stake plants for better support',
    'Harvest when fruits are glossy and firm',
    'Remove first few flowers to encourage bushier growth'
  ]
},
 {
  id: 'V03',
  name: 'Carrot',
  category: 'Vegetable',
  season: 'Rabi',
  duration: '90–100 days',
  soilType: ['Deep sandy loam', 'Loamy'],
  climate: 'Cool (15–25°C)',
  difficulty: 'Intermediate',
  popularity: 75,
  fertilizers: [
    { name: 'FYM + NPK 12:32:16', application: 'Basal', timing: 'Before sowing' },
    { name: 'Urea', application: 'Split top dressing', timing: '30 and 60 days' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Aphids', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Blight (Alternaria)',
      symptoms: 'Dark concentric rings on leaves',
      treatment: 'Mancozeb 2g/liter spray'
    },
    {
      name: 'Cavity Spot (Pythium spp.)',
      symptoms: 'Sunken lesions on carrot root skin',
      treatment: 'Seed treatment and avoid waterlogging'
    }
  ],
  uses: ['Raw salads, juicing, cooking'],
  tips: [
    'Keep soil well-dug and weed-free for root development',
    'Thin seedlings to prevent forked roots'
  ]
},
{
  id: 'F11',
  name: 'Apple',
  category: 'Fruit',
  season: 'Summer (July-Sept in hills)',
  duration: '4-5 years to bearing',
  soilType: ['Loamy', 'Well-drained (pH 6-7)'],
  climate: 'Cool (15-25°C), needs winter chilling (1000-1600 hrs below 7°C)',
  difficulty: 'High',
  popularity: 80,
  fertilizers: [
    { name: 'FYM (20kg/tree)', application: 'Annual', timing: 'Autumn' },
    { name: 'NPK 10:10:10', application: 'Split doses', timing: 'Spring + Early summer' }
  ],
  pesticides: [
    { name: 'Deltamethrin', target: 'San Jose scale', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Scab',
      symptoms: 'Olive-green leaf spots',
      treatment: 'Mancozeb 2g/liter spray (dormant season)'
    }
  ],
  uses: ['Fresh fruit', 'Juices', 'Desserts'],
  tips: [
    'Prune annually to maintain open center structure',
    'Royal Delicious and Granny Smith are popular varieties',
    'Requires frost-free springs for good fruiting'
  ]
},
{
  id: 'F12',
  name: 'Guava',
  category: 'Fruit',
  season: 'Year-round (2 crops: monsoon + winter)',
  duration: '2-3 years to bearing',
  soilType: ['Sandy loam to clay', 'Well-drained'],
  climate: 'Warm (23-28°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 85,
  fertilizers: [
    { name: 'FYM (10kg/tree)', application: 'Annual', timing: 'Pre-monsoon' },
    { name: 'NPK 6:6:6', application: 'Split doses', timing: 'June + September' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Wilt',
      symptoms: 'Yellowing, defoliation',
      treatment: 'Carbendazim soil drench + resistant varieties'
    }
  ],
  uses: ['Fresh fruit', 'Juices', 'Jams'],
  tips: [
    'Prune after harvest to encourage new shoots',
    'Allahabad Safeda and Lucknow 49 are premium varieties',
    'Bag fruits to prevent fly damage'
  ]
},
{
  id: 'F13',
  name: 'Pomegranate',
  category: 'Fruit',
  season: 'Summer (June-August), Winter (Dec-Feb)',
  duration: '2-3 years to bearing',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Hot-dry (25-35°C), frost-sensitive',
  difficulty: 'Intermediate',
  popularity: 80,
  fertilizers: [
    { name: 'FYM (10kg/tree)', application: 'Annual', timing: 'December' },
    { name: 'NPK 12:12:12', application: 'Split doses', timing: 'Feb + June' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Fruit borer', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Bacterial Blight',
      symptoms: 'Water-soaked fruit spots',
      treatment: 'Streptocycline 0.5g/liter spray'
    }
  ],
  uses: ['Fresh arils', 'Juices', 'Decorative'],
  tips: [
    'Bhagwa (red) variety has high market demand',
    'Thin fruits to 1-2 per branch for better quality',
    'Avoid water stress during fruit development'
  ]
},
{
  id: 'F14',
  name: 'Papaya',
  category: 'Fruit',
  season: 'Year-round',
  duration: '9-11 months to harvest',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-30°C), frost-sensitive',
  difficulty: 'Easy',
  popularity: 75,
  fertilizers: [
    { name: 'FYM (10kg/plant)', application: 'Basal', timing: 'At planting' },
    { name: 'NPK 12:12:12', application: 'Monthly', timing: 'After 3 months' }
  ],
  pesticides: [
    { name: 'Monocrotophos', target: 'Fruit fly', dosage: '1ml/liter' }
  ],
  diseases: [
    {
      name: 'Ring Spot Virus',
      symptoms: 'Yellow rings on leaves',
      treatment: 'Remove infected plants, control aphids'
    }
  ],
  uses: ['Fresh fruit', 'Salads', 'Tenderizing meat'],
  tips: [
    'Red Lady variety is high-yielding',
    'Plant 3 seedlings per pit, remove males later',
    'Harvest when yellow streaks appear on fruit'
  ]
},
{
  id: 'F15',
  name: 'Citrus',
  category: 'Fruit',
  season: 'Winter (Dec-Feb)',
  duration: '3-5 years to bearing',
  soilType: ['Sandy loam', 'Well-drained (pH 5.5-7.5)'],
  climate: 'Moderate (20-30°C), frost-sensitive',
  difficulty: 'Intermediate',
  popularity: 85,
  fertilizers: [
    { name: 'FYM (10kg/tree)', application: 'Annual', timing: 'Pre-monsoon' },
    { name: 'NPK 12:6:6', application: 'Split doses', timing: 'June + September' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Leaf miner', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Citrus Canker',
      symptoms: 'Raised brown lesions on fruits',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Fresh fruit', 'Juices', 'Flavoring'],
  tips: [
    'Nagpur orange and Mosambi are popular varieties',
    'Prune to allow sunlight penetration',
    'Harvest when color develops (varies by variety)'
  ]
},
{
  id: 'F16',
  name: 'Coconut',
  category: 'Fruit',
  season: 'Year-round',
  duration: '6-8 years to bearing',
  soilType: ['Sandy coastal', 'Well-drained'],
  climate: 'Hot-humid (27-32°C), >2000mm rainfall ideal',
  difficulty: 'Easy',
  popularity: 90,
  fertilizers: [
    { name: 'FYM (15kg/tree)', application: 'Annual', timing: 'Pre-monsoon' },
    { name: 'NPK 8:4:12', application: 'Split doses', timing: 'May + September' }
  ],
  pesticides: [
    { name: 'Neem cake', target: 'Rhinoceros beetle', dosage: '2kg/tree soil application' }
  ],
  diseases: [
    {
      name: 'Root Wilt',
      symptoms: 'Flaccid, curled leaves',
      treatment: 'Remove infected palms, control leaf hoppers'
    }
  ],
  uses: ['Water', 'Copra', 'Oil', 'Toddy'],
  tips: [
    'Plant in 1m³ pits with saltwater tolerance',
    'Intercrop with banana/cocoa in early years',
    'Tall varieties yield better than dwarfs long-term'
  ]
},
{
  id: 'F17',
  name: 'Grapes',
  category: 'Fruit',
  season: 'Summer (Apr-June), Winter (Dec-Feb)',
  duration: '2 years to bearing',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm-dry (25-30°C), low humidity during fruiting',
  difficulty: 'High',
  popularity: 75,
  fertilizers: [
    { name: 'FYM (10kg/vine)', application: 'Annual', timing: 'Post-harvest' },
    { name: 'NPK 19:19:19', application: 'Split doses', timing: 'Pruning + Berry setting' }
  ],
  pesticides: [
    { name: 'Wettable sulfur', target: 'Powdery mildew', dosage: '3g/liter' }
  ],
  diseases: [
    {
      name: 'Downy Mildew',
      symptoms: 'Yellow "oil spots" on leaves',
      treatment: 'Bordeaux mixture 1% spray'
    }
  ],
  uses: ['Table fruit', 'Raisins', 'Wine'],
  tips: [
    'Thompson Seedless is leading variety',
    'Train on overhead trellis (bower system)',
    'Prune severely in dormancy (90% removal)'
  ]
},
{
  id: 'F18',
  name: 'Strawberry',
  category: 'Fruit',
  season: 'Winter (Nov-March in plains)',
  duration: '4-5 months (plant to harvest)',
  soilType: ['Sandy loam', 'Well-drained (pH 5.5-6.5)'],
  climate: 'Cool (15-25°C)',
  difficulty: 'Intermediate',
  popularity: 70,
  fertilizers: [
    { name: 'FYM (5kg/m²)', application: 'Basal', timing: 'Before planting' },
    { name: 'NPK 12:32:16', application: 'Weekly foliar', timing: 'Flowering to harvest' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Spider mites', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Gray Mold',
      symptoms: 'Fuzzy gray growth on fruits',
      treatment: 'Improve air circulation, avoid overhead irrigation'
    }
  ],
  uses: ['Fresh fruit', 'Desserts', 'Jams'],
  tips: [
    'Chandler and Winter Dawn are common varieties',
    'Grow on raised beds with black plastic mulch',
    'Pinch off first flowers for better establishment'
  ]
},
{
  id: 'F19',
  name: 'Litchi',
  category: 'Fruit',
  season: 'Summer (May-June)',
  duration: '5-6 years to bearing',
  soilType: ['Deep loamy', 'Well-drained'],
  climate: 'Humid (20-35°C), needs winter chill for flowering',
  difficulty: 'High',
  popularity: 75,
  fertilizers: [
    { name: 'FYM (15kg/tree)', application: 'Annual', timing: 'Post-harvest' },
    { name: 'NPK 8:4:12', application: 'Split doses', timing: 'Pre-flowering + Fruit development' }
  ],
  pesticides: [
    { name: 'Dimethoate', target: 'Litchi mite', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Fruit Cracking',
      symptoms: 'Split fruits before maturity',
      treatment: 'Regular irrigation + calcium sprays'
    }
  ],
  uses: ['Fresh fruit', 'Juices', 'Desserts'],
  tips: [
    'Shahi and China varieties are popular',
    'Requires high humidity during fruit growth',
    'Harvest when pink-red color develops'
  ]
},
{
  id: 'F20',
  name: 'Jackfruit',
  category: 'Fruit',
  season: 'Summer (April-June)',
  duration: '5-7 years to bearing',
  soilType: ['Deep loamy', 'Well-drained'],
  climate: 'Hot-humid (25-35°C), >1500mm rainfall',
  difficulty: 'Easy',
  popularity: 65,
  fertilizers: [
    { name: 'FYM (20kg/tree)', application: 'Annual', timing: 'Pre-monsoon' },
    { name: 'NPK 8:4:12', application: 'Split doses', timing: 'June + September' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit borer', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Fruit Rot',
      symptoms: 'Soft rotting of young fruits',
      treatment: 'Remove infected fruits, spray Bordeaux mixture'
    }
  ],
  uses: ['Fresh bulbs', 'Curries', 'Chips'],
  tips: [
    'Singapore or Vietnam varieties bear early',
    'Bag young fruits to prevent insect damage',
    'Tapping trunk induces early flowering'
  ]
},
{
  id: 'F21',
  name: 'Dragon Fruit',
  category: 'Fruit',
  season: 'Summer (June-Sept)',
  duration: '18-24 months to bearing',
  soilType: ['Sandy loam', 'Well-drained (pH 6-7)'],
  climate: 'Hot-dry (20-30°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'Vermicompost (5kg/plant)', application: 'Quarterly', timing: 'Growing season' },
    { name: 'NPK 6:6:6', application: 'Foliar spray', timing: 'Flowering stage' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Mealybugs', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Stem Rot',
      symptoms: 'Soft, watery stem lesions',
      treatment: 'Reduce watering, apply Trichoderma'
    }
  ],
  uses: ['Fresh fruit', 'Smoothies', 'Salads'],
  tips: [
    'Requires vertical support (concrete posts ideal)',
    'Hand-pollinate at night for better fruit set',
    'Red-fleshed varieties have higher antioxidants'
  ]
},
 {
  id: 'F22',
  name: 'Kiwi',
  category: 'Fruit',
  season: 'Winter (Nov-Jan in hills)',
  duration: '3-4 years to bearing',
  soilType: ['Volcanic loam', 'Well-drained (pH 5-6.5)'],
  climate: 'Cool (15-25°C), needs 700-800 chilling hours',
  difficulty: 'High',
  popularity: 60,
  fertilizers: [
    { name: 'FYM (10kg/vine)', application: 'Annual', timing: 'Dormant season' },
    { name: 'NPK 10:10:20', application: 'Split doses', timing: 'Bud break + Fruit set' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Leaf roller caterpillars', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Bacterial Canker',
      symptoms: 'Reddish ooze from stems',
      treatment: 'Prune infected parts, apply copper sprays'
    }
  ],
  uses: ['Fresh fruit', 'Desserts', 'Garnishing'],
  tips: [
    'Plant male:female in 1:8 ratio for pollination',
    'Train on strong overhead trellis (T-bar system)',
    'Hayward is the leading commercial variety'
  ]
},
{
  id: 'F23',
  name: 'Ber',
  category: 'Fruit',
  season: 'Winter (Dec-Feb)',
  duration: '2-3 years to bearing',
  soilType: ['Sandy', 'Drought-tolerant'],
  climate: 'Hot-dry (25-45°C), frost-resistant',
  difficulty: 'Very Easy',
  popularity: 65,
  fertilizers: [
    { name: 'FYM (5kg/tree)', application: 'Annual', timing: 'Post-harvest' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit fly', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Powdery Mildew',
      symptoms: 'White powder on leaves/fruits',
      treatment: 'Wettable sulfur 3g/liter spray'
    }
  ],
  uses: ['Fresh fruit', 'Candied ber', 'Traditional medicine'],
  tips: [
    'Umran and Gola are high-yielding varieties',
    'Withstand saline soils and water scarcity',
    'Harvest when fruits turn from green to yellow'
  ]
},    
{
  id: 'F24',
  name: 'Jamun',
  category: 'Fruit',
  season: 'Summer (May-July)',
  duration: '6-8 years to bearing',
  soilType: ['Clay loam', 'Waterlogging tolerant'],
  climate: 'Hot-humid (25-40°C)',
  difficulty: 'Easy',
  popularity: 70,
  fertilizers: [
    { name: 'FYM (15kg/tree)', application: 'Annual', timing: 'Monsoon onset' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit borer', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Sooty Mold',
      symptoms: 'Black coating on leaves',
      treatment: 'Control aphids/scale insects'
    }
  ],
  uses: ['Fresh fruit', 'Juices', 'Vinegar'],
  tips: [
    'Seedlings show high variability - grafted plants preferred',
    'Fruits stain clothes (wear gloves during harvest)',
    'Dual-purpose (fruit + timber)'
  ]
},
{
  id: 'F25',
  name: 'Chikoo',
  category: 'Fruit',
  season: 'Year-round (peak Feb-Apr)',
  duration: '3-4 years to bearing',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Warm (25-35°C), sensitive to frost',
  difficulty: 'Easy',
  popularity: 75,
  fertilizers: [
    { name: 'FYM (10kg/tree)', application: 'Annual', timing: 'Pre-monsoon' },
    { name: 'NPK 8:4:8', application: 'Split doses', timing: 'June + September' }
  ],
  pesticides: [
    { name: 'Malathion', target: 'Fruit fly', dosage: '2ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Brown circular lesions',
      treatment: 'Copper oxychloride 3g/liter spray'
    }
  ],
  uses: ['Fresh fruit', 'Milkshakes', 'Desserts'],
  tips: [
    'Cricket Ball and Kalipatti are popular varieties',
    'Harvest when latex turns from white to watery',
    'Tolerant to saline coastal conditions'
  ]
},
{
  id: 'F26',
  name: 'Custard Apple',
  category: 'Fruit',
  season: 'Monsoon (Aug-Oct)',
  duration: '3-4 years to bearing',
  soilType: ['Sandy loam', 'Well-drained'],
  climate: 'Hot-dry (25-35°C), sensitive to humidity during flowering',
  difficulty: 'Easy',
  popularity: 65,
  fertilizers: [
    { name: 'FYM (10kg/tree)', application: 'Annual', timing: 'Winter' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Mealybugs', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Anthracnose',
      symptoms: 'Dark sunken fruit spots',
      treatment: 'Pre-harvest Bordeaux mixture spray'
    }
  ],
  uses: ['Fresh fruit', 'Ice creams', 'Puddings'],
  tips: [
    'Hand-pollinate for better fruit set',
    'Harvest when fruit segments separate slightly',
    'Balangar and Arka Sahan are improved varieties'
  ]
},
{
  id: 'F27',
  name: 'Star Fruit',
  category: 'Fruit',
  season: 'Year-round (peak Oct-Dec)',
  duration: '2-3 years to bearing',
  soilType: ['Clay loam', 'Moisture-retentive'],
  climate: 'Warm-humid (25-32°C)',
  difficulty: 'Easy',
  popularity: 60,
  fertilizers: [
    { name: 'FYM (8kg/tree)', application: 'Quarterly', timing: 'Growing season' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fruit flies', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Algal Leaf Spot',
      symptoms: 'Gray-green raised spots',
      treatment: 'Copper fungicide sprays'
    }
  ],
  uses: ['Salads', 'Garnishes', 'Juices'],
  tips: [
    'Dwarf varieties suitable for containers',
    'Harvest when ridges turn from green to yellow',
    'High oxalate content - avoid for kidney patients'
  ]
},
{
  id: 'F28',
  name: 'Mulberry',
  category: 'Fruit',
  season: 'Spring (Mar-May)',
  duration: '1 year to bearing',
  soilType: ['Alluvial', 'Well-drained'],
  climate: 'Adaptable (15-35°C)',
  difficulty: 'Very Easy',
  popularity: 55,
  fertilizers: [
    { name: 'FYM (5kg/plant)', application: 'Annual', timing: 'Winter pruning' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Mealybugs', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Leaf Spot',
      symptoms: 'Brown circular lesions',
      treatment: 'Remove infected leaves, improve air circulation'
    }
  ],
  uses: ['Fresh fruit', 'Jams', 'Silkworm feed'],
  tips: [
    'Prune heavily in winter to encourage new shoots',
    'White-fruited varieties are sweeter than dark',
    'Harvest in morning for best flavor'
  ]
},
{
  id: 'F29',
  name: 'Passion Fruit',
  category: 'Fruit',
  season: 'Year-round (peak summer)',
  duration: '1-2 years to bearing',
  soilType: ['Volcanic loam', 'Well-drained (pH 6-7)'],
  climate: 'Warm (20-30°C), frost-sensitive',
  difficulty: 'Intermediate',
  popularity: 65,
  fertilizers: [
    { name: 'NPK 10:5:20', application: 'Monthly', timing: 'Growing season' }
  ],
  pesticides: [
    { name: 'Spinosad', target: 'Fruit-sucking bugs', dosage: '0.5ml/liter' }
  ],
  diseases: [
    {
      name: 'Fusarium Wilt',
      symptoms: 'Yellowing and wilting vines',
      treatment: 'Resistant rootstocks, soil solarization'
    }
  ],
  uses: ['Juices', 'Desserts', 'Cocktails'],
  tips: [
    'Requires strong trellis (3m height ideal)',
    'Purple varieties more cold-tolerant than yellow',
    'Hand-pollinate for better fruit set'
  ]
},
{
  id: 'F30',
  name: 'Fig',
  category: 'Fruit',
  season: 'Summer (June-Aug), Winter (Dec-Feb)',
  duration: '2 years to bearing',
  soilType: ['Rocky/sandy', 'Well-drained'],
  climate: 'Hot-dry (25-35°C), drought-tolerant',
  difficulty: 'Easy',
  popularity: 60,
  fertilizers: [
    { name: 'FYM (5kg/tree)', application: 'Annual', timing: 'Dormant season' }
  ],
  pesticides: [
    { name: 'Neem oil', target: 'Fig moths', dosage: '5ml/liter' }
  ],
  diseases: [
    {
      name: 'Fig Rust',
      symptoms: 'Orange pustules on leaves',
      treatment: 'Copper sprays during leaf emergence'
    }
  ],
  uses: ['Fresh/dried fruit', 'Jams', 'Medicinal'],
  tips: [
    'Brown Turkey and Poona varieties perform well',
    'Prune to maintain open vase shape',
    'Birds love ripe fruits - use netting'
  ]
}   
];


  const categories = ['Cereal', 'Pulse', 'Oilseed', 'Fiber', 'Commercial', 'Vegetable', 'Fruit'];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-700 dark:via-green-700 dark:to-teal-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">Crop Knowledge Base 📚</h1>
              <p className="text-emerald-100 text-lg max-w-3xl">
                Comprehensive information about crops, fertilizers, pesticides, and disease management with expert guidance.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {!selectedCrop ? (
        <>
          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-3 mb-6">
              <Filter className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Search & Filter Crops</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="relative group">
                <Leaf className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Crop List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {crop.name}
                  </h3>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-sm font-medium rounded-full">
                    {crop.category}
                  </span>
                </div>

                {/* Popularity and Difficulty */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{crop.popularity}% popular</span>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(crop.difficulty)}`}>
                    {crop.difficulty}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(crop.popularity / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">({crop.popularity}/100)</span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span>Season: <span className="font-medium text-gray-800 dark:text-white">{crop.season}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span>Duration: <span className="font-medium text-gray-800 dark:text-white">{crop.duration}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span>Climate: <span className="font-medium text-gray-800 dark:text-white">{crop.climate}</span></span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                    View Detailed Information →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Detailed Crop View */
        <div className="space-y-8">
          {/* Crop Header */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">{selectedCrop.name}</h2>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-medium rounded-full">
                    {selectedCrop.category} crop
                  </span>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 font-medium rounded-full">
                    {selectedCrop.season} season
                  </span>
                  <span className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(selectedCrop.difficulty)}`}>
                    {selectedCrop.difficulty} level
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors duration-200"
              >
                ← Back to list
              </button>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2 text-lg">Growth Duration</h4>
                <p className="text-blue-700 dark:text-blue-300 text-xl font-semibold">{selectedCrop.duration}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800">
                <h4 className="font-bold text-green-800 dark:text-green-400 mb-2 text-lg">Suitable Soil</h4>
                <p className="text-green-700 dark:text-green-300 text-xl font-semibold">{selectedCrop.soilType.join(', ')}</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl border border-orange-200 dark:border-orange-800">
                <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-2 text-lg">Climate</h4>
                <p className="text-orange-700 dark:text-orange-300 text-xl font-semibold">{selectedCrop.climate}</p>
              </div>
            </div>
          </div>

          {/* Fertilizers */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Beaker className="h-6 w-6 mr-3 text-green-600 dark:text-green-400" />
              Fertilizer Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCrop.fertilizers.map((fertilizer, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-green-300 dark:hover:border-green-600 transition-colors duration-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">{fertilizer.name}</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-800 dark:text-white">Application:</strong> {fertilizer.application}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-800 dark:text-white">Timing:</strong> {fertilizer.timing}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pesticides */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Bug className="h-6 w-6 mr-3 text-red-600 dark:text-red-400" />
              Pest Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCrop.pesticides.map((pesticide, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-red-300 dark:hover:border-red-600 transition-colors duration-200 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-3 text-lg">{pesticide.name}</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-800 dark:text-white">Target:</strong> {pesticide.target}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong className="text-gray-800 dark:text-white">Dosage:</strong> {pesticide.dosage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Diseases */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-yellow-600 dark:text-yellow-400" />
              Disease Management
            </h3>
            <div className="space-y-6">
              {selectedCrop.diseases.map((disease, index) => (
                <div key={index} className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-yellow-300 dark:hover:border-yellow-600 transition-colors duration-200 bg-gradient-to-br from-yellow-50/50 to-amber-50/50 dark:from-yellow-900/10 dark:to-amber-900/10">
                  <h4 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">{disease.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Symptoms:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{disease.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Treatment:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{disease.treatment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" />
              Best Practices & Expert Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCrop.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800 dark:text-blue-300 font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!selectedCrop && filteredCrops.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No crops found matching your criteria.</p>
          <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filter options.</p>
        </div>
      )}
    </div>
  );
};

export default CropKnowledge;