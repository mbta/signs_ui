const timePeriodConfig = [
  {
    id: 'peak',
    name: 'Peak Hours',
    description: 'weekdays 7-9 AM, 4-6:30 PM',
  },
  {
    id: 'off_peak',
    name: 'Off Peak Hours',
    description: 'weekends and weekdays, excluding peak hours',
  },
];

const branchConfig = {
  Orange: [
    {
      id: 'orange_trunk',
      name: 'Orange Line',
    },
  ],
  Red: [
    {
      id: 'red_trunk',
      name: 'Red Line Trunk',
    },
    {
      id: 'red_ashmont',
      name: 'Ashmont',
    },
    {
      id: 'red_braintree',
      name: 'Braintree',
    },
  ],
  Blue: [
    {
      id: 'blue_trunk',
      name: 'Blue Line',
    },
  ],
  Green: [
    {
      id: 'green_trunk',
      name: 'Green Line Trunk',
    },
    {
      id: 'green_d',
      name: 'Green - D',
    },
    {
      id: 'green_e',
      name: 'Green - E',
    },
  ],
  Mattapan: [
    {
      id: 'mattapan_trunk',
      name: 'Mattapan Line',
    },
  ],
};

const stationConfig = {
  Orange: [
    {
      id: 'OOAK',
      name: 'Oak Grove',
      zones: {
        n: false, s: 'Platform', e: 'Busway', w: false, c: false, m: true,
      },
    },
    {
      id: 'OMAL',
      name: 'Malden Center',
      zones: {
        n: 'Platform', s: false, e: false, w: false, c: false, m: 'Lobby',
      },
    },
    {
      id: 'OWEL',
      name: 'Wellington',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OASQ',
      name: 'Assembly',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OSUL',
      name: 'Sullivan Sq',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OCOM',
      name: 'Community College',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'ONST',
      name: 'North Station',
      zones: {
        n: true, s: true, e: false, w: false, c: true, m: 'CR Exit',
      },
    },
    {
      id: 'OHAY',
      name: 'Haymarket',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OSTN',
      name: 'State North',
      zones: {
        n: true, s: false, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OSTS',
      name: 'State South',
      zones: {
        n: false, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'ODTN',
      name: 'Downtown Crossing North',
      zones: {
        n: true, s: false, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'ODTS',
      name: 'Downtown Crossing South',
      zones: {
        n: false, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'OCHN',
      name: 'Chinatown North',
      zones: {
        n: true, s: false, e: false, w: false, c: false, m: 'Lobby',
      },
    },
    {
      id: 'OCHS',
      name: 'Chinatown South',
      zones: {
        n: false, s: true, e: false, w: false, c: false, m: 'Lobby',
      },
    },
    {
      id: 'ONEM',
      name: 'Tufts Medical Center',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OBAC',
      name: 'Back Bay',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OMAS',
      name: 'Mass. Ave',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'ORUG',
      name: 'Ruggles',
      zones: {
        n: true, s: true, e: false, w: false, c: true, m: true,
      },
    },
    {
      id: 'SRUG',
      name: 'Ruggles Upper Busway',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OROX',
      name: 'Roxbury Crossing',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OJAC',
      name: 'Jackson Sq',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OSTO',
      name: 'Stony Brook',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OGRE',
      name: 'Green St',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'OFOR',
      name: 'Forest Hills',
      zones: {
        n: 'Platform', s: false, e: false, w: false, c: false, m: 'Main Lobby',
      },
    },
    {
      id: 'SFOR',
      name: 'Forest Hills Entrances from Busways',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: true,
      },
    },
  ],
  Red: [
    {
      id: 'RALE',
      name: 'Alewife',
      zones: {
        n: false, s: false, e: false, w: false, c: true, m: true,
      },
    },
    {
      id: 'RDAV',
      name: 'Davis',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RPOR',
      name: 'Porter',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RHAR',
      name: 'Harvard',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RCEN',
      name: 'Central',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'RKEN',
      name: 'Kendall/MIT',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'RMGH',
      name: 'Charles/MGH',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'RPRK',
      name: 'Park St',
      zones: {
        n: true, s: true, e: false, w: false, c: true, m: false,
      },
    },
    {
      id: 'RDTC',
      name: 'Downtown Crossing',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'RSOU',
      name: 'South Station',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'SSOU',
      name: 'South Station Silver Line',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: 'Arrival Platform',
      },
    },
    {
      id: 'RBRO',
      name: 'Broadway',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RAND',
      name: 'Andrew',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RJFK',
      name: 'JFK/UMass',
      zones: {
        n: 'Braintree Platform', s: 'Braintree Platform', e: 'Ashmont Platform', w: 'Ashmont Platform', c: false, m: true,
      },
    },
    {
      id: 'RSAV',
      name: 'Savin Hill',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RFIE',
      name: 'Fields Corner',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RSHA',
      name: 'Shawmut',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RASH',
      name: 'Ashmont',
      zones: {
        n: true, s: false, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RNQU',
      name: 'North Quincy',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RWOL',
      name: 'Wollaston',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RQUC',
      name: 'Quincy Center',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RQUA',
      name: 'Quincy Adams',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'RBRA',
      name: 'Braintree',
      zones: {
        n: false, s: false, e: false, w: false, c: true, m: true,
      },
    },
  ],
  Blue: [
    {
      id: 'BWON',
      name: 'Wonderland',
      zones: {
        n: false, s: false, e: false, w: true, c: false, m: true,
      },
    },
    {
      id: 'BREV',
      name: 'Revere Beach',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BBEA',
      name: 'Beachmont',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'BSUF',
      name: 'Suffolk Downs',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'BORH',
      name: 'Orient Heights',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BWOO',
      name: 'Wood Island',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BAIR',
      name: 'Airport',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'BMAV',
      name: 'Maverick',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'BAQU',
      name: 'Aquarium',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BSTA',
      name: 'State',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BGOV',
      name: 'Government Center',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'BBOW',
      name: 'Bowdoin',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: true,
      },
    },
  ],
  Mattapan: [
    {
      id: 'MCED',
      name: 'Cedar Grove',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'MBUT',
      name: 'Butler',
      zones: {
        n: false, s: false, e: false, w: false, c: true, m: false,
      },
    },
    {
      id: 'MMIL',
      name: 'Milton',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'MCEN',
      name: 'Central Ave',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'MVAL',
      name: 'Valley Rd',
      zones: {
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'MCAP',
      name: 'Capen St',
      zones: {
        n: true, s: false, e: false, w: false, c: false, m: false,
      },
    },
  ],
  SL3: [
    {
      id: 'SSOU',
      name: 'South Station',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: false,
      },
    },
    {
      id: 'SCOU',
      name: 'Courthouse',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'SWTC',
      name: 'World Trade Center',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'SEAV',
      name: 'Eastern Ave',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'SBOX',
      name: 'Box District',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'SBSQ',
      name: 'Bellingham Sq',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'SCHS',
      name: 'Chelsea',
      zones: {
        n: false, s: false, e: false, w: true, c: false, m: false,
      },
    },
  ],
  Green: [
    {
      id: 'GLEC',
      name: 'Lechmere',
      zones: {
        n: false, s: false, e: false, w: 'Green Line', c: false, m: false,
      },
    },
    {
      id: 'GSCI',
      name: 'Science Park',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'GNST',
      name: 'North Station',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: 'CR Exit',
      },
    },
    {
      id: 'GHAY',
      name: 'Haymarket',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GGOV',
      name: 'Government Center',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'GPRKE',
      name: 'Park St. Eastbound',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: 'Winter St Concourse',
      },
    },
    {
      id: 'GPRKW',
      name: 'Park St. Westbound',
      zones: {
        n: 'Fence Track', s: false, e: false, w: 'Wall Track', c: false, m: false,
      },
    },
    {
      id: 'GBOY',
      name: 'Boylston',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GARL',
      name: 'Arlington',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'GCOP',
      name: 'Copley',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GPRU',
      name: 'Prudential',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'GSYM',
      name: 'Symphony',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GAUD',
      name: 'Hynes',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: true,
      },
    },
    {
      id: 'GKEN',
      name: 'Kenmore',
      zones: {
        n: 'C/D East', s: 'C/D West', e: 'B East', w: 'B West', c: false, m: true,
      },
    },
    {
      id: 'GFEN',
      name: 'Fenway',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GLON',
      name: 'Longwood',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GBRV',
      name: 'Brookline Village',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GBRH',
      name: 'Brookline Hills',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GBEA',
      name: 'Beaconsfield',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GRES',
      name: 'Reservoir',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GCHE',
      name: 'Chestnut Hill',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GNEC',
      name: 'Newton Centre',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GNEH',
      name: 'Newton Highlands',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GELI',
      name: 'Eliot',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GWAB',
      name: 'Waban',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GWOO',
      name: 'Woodland',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'GRIV',
      name: 'Riverside',
      zones: {
        n: false, s: false, e: false, w: 'Entire Station', c: false, m: false,
      },
    },
  ],
  Busway: [
    {
      id: 'SDUD',
      name: 'Nubian',
      zones: {
        n: 'Platform F', s: 'Platform C', e: 'Platform D', w: 'Platform A', c: 'Platform E (East)', m: 'Platform E (West)',
      },
    },
    {
      id: 'GLEC',
      name: 'Lechmere',
      zones: {
        n: 'North', s: 'South', e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'SHAR',
      name: 'Harvard',
      zones: {
        n: 'Upper', s: false, e: false, w: false, c: false, m: 'Lower',
      },
    },
    {
      id: 'MMAT',
      name: 'Mattapan',
      zones: {
        n: 'South', s: 'North', e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'SDAV',
      name: 'Davis',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: 'Busway',
      },
    },
    {
      id: 'SFOR',
      name: 'Forest Hills',
      zones: {
        n: 'Upper (Fence)', s: 'Upper (Island)', e: false, w: false, c: false, m: false,
      },
    },
    {
      id: 'RBRA',
      name: 'Braintree',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: 'Busway',
      },
    },
  ],
};

const arincToRealtimeIdMap = {
  'MCED-s': 'cedar_grove_outbound',
  'MCED-n': 'cedar_grove_inbound',
  'MBUT-c': 'butler_center',
  'MMIL-s': 'milton_outbound',
  'MMIL-n': 'milton_inbound',
  'MCEN-s': 'central_avenue_outbound',
  'MCEN-n': 'central_avenue_inbound',
  'MVAL-s': 'valley_road_outbound',
  'MVAL-n': 'valley_road_inbound',
  'MCAP-s': 'capen_street_outbound',
  'MCAP-n': 'capen_street_inbound',
  'SCHS-w': 'Silver_Line.Chelsea_IB',
  'SBSQ-w': 'Silver_Line.Bellingham_Square_IB',
  'SBSQ-e': 'Silver_Line.Bellingham_Square_OB',
  'SBOX-w': 'Silver_Line.Box_District_IB',
  'SBOX-e': 'Silver_Line.Box_District_OB',
  'SEAV-w': 'Silver_Line.Eastern_Ave_IB',
  'SEAV-e': 'Silver_Line.Eastern_Ave_OB',
  'SSOU-e': 'Silver_Line.South_Station_EB',
  'SCOU-e': 'Silver_Line.Courthouse_EB',
  'SCOU-w': 'Silver_Line.Courthouse_WB',
  'SCOU-m': 'Silver_Line.Courthouse_mezz',
  'SWTC-e': 'Silver_Line.World_Trade_Ctr_EB',
  'SWTC-w': 'Silver_Line.World_Trade_Ctr_WB',
  'SWTC-m': 'Silver_Line.World_Trade_Ctr_mezz',
  'BWON-w': 'wonderland_westbound',
  'BWON-m': 'wonderland_mezzanine',
  'BREV-e': 'revere_beach_eastbound',
  'BREV-m': 'revere_beach_mezzanine',
  'BREV-w': 'revere_beach_westbound',
  'BBEA-e': 'beachmont_eastbound',
  'BBEA-w': 'beachmont_westbound',
  'BSUF-e': 'suffolk_downs_eastbound',
  'BSUF-w': 'suffolk_downs_westbound',
  'BORH-e': 'orient_heights_eastbound',
  'BORH-m': 'orient_heights_mezzanine',
  'BORH-w': 'orient_heights_westbound',
  'BWOO-e': 'wood_island_eastbound',
  'BWOO-m': 'wood_island_mezzanine',
  'BWOO-w': 'wood_island_westbound',
  'BAIR-e': 'airport_eastbound',
  'BAIR-w': 'airport_westbound',
  'BMAV-e': 'maverick_eastbound',
  'BMAV-w': 'maverick_westbound',
  'BAQU-e': 'aquarium_eastbound',
  'BAQU-m': 'aquarium_mezzanine',
  'BAQU-w': 'aquarium_westbound',
  'BSTA-e': 'state_blue_eastbound',
  'BSTA-m': 'state_blue_mezzanine',
  'BSTA-w': 'state_blue_westbound',
  'BGOV-e': 'government_center_eastbound',
  'BGOV-m': 'government_center_mezzanine',
  'BGOV-w': 'government_center_westbound',
  'BBOW-e': 'bowdoin_eastbound',
  'BBOW-m': 'bowdoin_mezzanine',
  'OOAK-m': 'oak_grove_mezzanine_southbound',
  'OOAK-e': 'oak_grove_east_busway',
  'OOAK-s': 'oak_grove_platform',
  'OMAL-m': 'malden_lobby',
  'OMAL-n': 'malden_center_platform',
  'OWEL-m': 'wellington_mezzanine',
  'OWEL-n': 'wellington_northbound',
  'OWEL-s': 'wellington_southbound',
  'OASQ-m': 'assembly_mezzanine',
  'OASQ-n': 'assembly_northbound',
  'OASQ-s': 'assembly_southbound',
  'OSUL-m': 'sullivan_mezzanine',
  'OSUL-n': 'sullivan_northbound',
  'OSUL-s': 'sullivan_southbound',
  'OCOM-m': 'community_college_mezzanine',
  'OCOM-n': 'community_college_northbound',
  'OCOM-s': 'community_college_southbound',
  'ONST-n': 'orange_north_station_northbound',
  'ONST-s': 'orange_north_station_southbound',
  'ONST-c': 'orange_north_station_mezzanine',
  'ONST-m': 'orange_north_station_commuter_rail_exit',
  'OHAY-m': 'orange_haymarket_mezzanine',
  'OHAY-n': 'orange_haymarket_northbound',
  'OHAY-s': 'orange_haymarket_southbound',
  'OSTN-m': 'orange_state_mezzanine',
  'OSTN-n': 'orange_state_northbound',
  'OSTS-s': 'orange_state_southbound',
  'ODTN-n': 'orange_downtown_crossing_northbound',
  'ODTS-s': 'orange_downtown_crossing_southbound',
  'OCHN-m': 'chinatown_northbound_lobby',
  'OCHS-m': 'chinatown_southbound_lobby',
  'OCHN-n': 'chinatown_northbound',
  'OCHS-s': 'chinatown_southbound',
  'ONEM-m': 'tufts_mezzanine',
  'ONEM-n': 'tufts_northbound',
  'ONEM-s': 'tufts_southbound',
  'OBAC-m': 'back_bay_mezzanine',
  'OBAC-n': 'back_bay_northbound',
  'OBAC-s': 'back_bay_southbound',
  'OMAS-m': 'mass_ave_mezzanine',
  'OMAS-n': 'mass_ave_northbound',
  'OMAS-s': 'mass_ave_southbound',
  'ORUG-n': 'ruggles_northbound',
  'ORUG-s': 'ruggles_southbound',
  'ORUG-c': 'ruggles_center',
  'ORUG-m': 'ruggles_mezzanine',
  'OROX-m': 'roxbury_crossing_mezzanine',
  'OROX-n': 'roxbury_crossing_northbound',
  'OROX-s': 'roxbury_crossing_southbound',
  'OJAC-m': 'jackson_square_mezzanine',
  'OJAC-n': 'jackson_square_northbound',
  'OJAC-s': 'jackson_square_southbound',
  'OSTO-m': 'stony_brook_mezzanine',
  'OSTO-n': 'stony_brook_northbound',
  'OSTO-s': 'stony_brook_southbound',
  'OGRE-m': 'green_street_mezzanine',
  'OGRE-n': 'green_street_northbound',
  'OGRE-s': 'green_street_southbound',
  'OFOR-m': 'forest_hills_main_lobby',
  'OFOR-n': 'forest_hills_platform',
  'SFOR-m': 'forest_hills_entrances_from_busways',
  'SRUG-m': 'ruggles_upper_busway',
  'RALE-c': 'alewife_center_southbound',
  'RALE-m': 'alewife_mezzanine_southbound',
  'RDAV-m': 'davis_mezzanine',
  'RDAV-n': 'davis_northbound',
  'RDAV-s': 'davis_southbound',
  'RPOR-m': 'porter_mezzanine',
  'RPOR-n': 'porter_northbound',
  'RPOR-s': 'porter_southbound',
  'RHAR-m': 'harvard_mezzanine',
  'RHAR-n': 'harvard_northbound',
  'RHAR-s': 'harvard_southbound',
  'RCEN-n': 'central_northbound',
  'RCEN-s': 'central_southbound',
  'RKEN-n': 'kendall_mit_northbound',
  'RKEN-s': 'kendall_mit_southbound',
  'RMGH-n': 'charles_mgh_northbound',
  'RMGH-s': 'charles_mgh_southbound',
  'RPRK-n': 'red_park_st_northbound',
  'RPRK-s': 'red_park_st_southbound',
  'RPRK-c': 'red_park_st_center',
  'RDTC-n': 'red_downtown_crossing_northbound',
  'RDTC-s': 'red_downtown_crossing_southbound',
  'RSOU-n': 'red_south_station_northbound',
  'RSOU-s': 'red_south_station_southbound',
  'SSOU-m': 'south_station_silver_line_arrival_platform',
  'RBRO-m': 'broadway_mezzanine',
  'RBRO-n': 'broadway_northbound',
  'RBRO-s': 'broadway_southbound',
  'RAND-m': 'andrew_mezzanine',
  'RAND-n': 'andrew_northbound',
  'RAND-s': 'andrew_southbound',
  'RSAV-m': 'savin_hill_mezzanine',
  'RSAV-n': 'savin_hill_northbound',
  'RSAV-s': 'savin_hill_southbound',
  'RFIE-m': 'fields_corner_mezzanine',
  'RFIE-n': 'fields_corner_northbound',
  'RFIE-s': 'fields_corner_southbound',
  'RSHA-m': 'shawmut_mezzanine',
  'RSHA-n': 'shawmut_northbound',
  'RSHA-s': 'shawmut_southbound',
  'RASH-m': 'ashmont_mezzanine',
  'RASH-n': 'red_ashmont_northbound',
  'RNQU-m': 'north_quincy_mezzanine',
  'RNQU-n': 'north_quincy_northbound',
  'RNQU-s': 'north_quincy_southbound',
  'RWOL-m': 'wollaston_mezzanine',
  'RWOL-n': 'wollaston_northbound',
  'RWOL-s': 'wollaston_southbound',
  'RQUC-m': 'quincy_center_mezzanine',
  'RQUC-n': 'quincy_center_northbound',
  'RQUC-s': 'quincy_center_southbound',
  'RQUA-m': 'quincy_adams_mezzanine',
  'RQUA-n': 'quincy_adams_northbound',
  'RQUA-s': 'quincy_adams_southbound',
  'RBRA-c': 'braintree_center_northbound',
  'RBRA-m': 'braintree_mezzanine_northbound',
  'RJFK-w': 'jfk_umass_ashmont_platform_southbound',
  'RJFK-s': 'jfk_umass_braintree_platform_southbound',
  'RJFK-e': 'jfk_umass_ashmont_platform_northbound',
  'RJFK-n': 'jfk_umass_braintree_platform_northbound',
  'RJFK-m': 'jfk_umass_mezzanine',
  'GRIV-w': 'riverside_entire_station',
  'GWOO-e': 'woodland_eastbound',
  'GWOO-w': 'woodland_westbound',
  'GWAB-e': 'waban_eastbound',
  'GWAB-w': 'waban_westbound',
  'GELI-e': 'eliot_eastbound',
  'GELI-w': 'eliot_westbound',
  'GNEH-e': 'newton_highlands_eastbound',
  'GNEH-w': 'newton_highlands_westbound',
  'GNEC-e': 'newton_centre_eastbound',
  'GNEC-w': 'newton_centre_westbound',
  'GCHE-e': 'chestnut_hill_eastbound',
  'GCHE-w': 'chestnut_hill_westbound',
  'GRES-e': 'reservoir_eastbound',
  'GRES-w': 'reservoir_westbound',
  'GBEA-e': 'beaconsfield_eastbound',
  'GBEA-w': 'beaconsfield_westbound',
  'GBRH-e': 'brookline_hills_eastbound',
  'GBRH-w': 'brookline_hills_westbound',
  'GBRV-e': 'brookline_village_eastbound',
  'GBRV-w': 'brookline_village_westbound',
  'GLON-e': 'longwood_eastbound',
  'GLON-w': 'longwood_westbound',
  'GFEN-e': 'fenway_eastbound',
  'GFEN-w': 'fenway_westbound',
  'GKEN-e': 'kenmore_b_eastbound',
  'GKEN-w': 'kenmore_b_westbound',
  'GKEN-n': 'kenmore_c_d_eastbound',
  'GKEN-s': 'kenmore_c_d_westbound',
  'GKEN-m': 'kenmore_mezzanine',
  'GAUD-e': 'hynes_eastbound',
  'GAUD-w': 'hynes_westbound',
  'GAUD-m': 'hynes_mezzanine',
  'GSYM-e': 'symphony_eastbound',
  'GSYM-w': 'symphony_westbound',
  'GPRU-e': 'prudential_eastbound',
  'GPRU-w': 'prudential_westbound',
  'GPRU-m': 'prudential_mezzanine',
  'GCOP-e': 'copley_eastbound',
  'GCOP-w': 'copley_westbound',
  'GCOP-m': 'copley_mezzanine',
  'GARL-e': 'arlington_eastbound',
  'GARL-w': 'arlington_westbound',
  'GARL-m': 'arlington_mezzanine',
  'GBOY-e': 'boylston_eastbound',
  'GBOY-w': 'boylston_westbound',
  'GPRKE-e': 'park_st_eastbound',
  'GPRKE-m': 'park_st_winter_st_concourse',
  'GPRKW-w': 'park_st_westbound_wall_track',
  'GPRKW-n': 'park_st_westbound_fence_track',
  'GGOV-e': 'green_government_center_eastbound',
  'GGOV-w': 'green_government_center_westbound',
  'GGOV-m': 'green_government_center_mezzanine',
  'GHAY-e': 'green_haymarket_eastbound',
  'GHAY-w': 'green_haymarket_westbound',
  'GNST-e': 'green_north_station_eastbound',
  'GNST-w': 'green_north_station_westbound',
  'GNST-m': 'green_north_station_commuter_rail_exit',
  'GSCI-e': 'science_park_eastbound',
  'GSCI-w': 'science_park_westbound',
  'GSCI-m': 'science_park_mezzanine',
  'GLEC-w': 'lechmere_green_line',
  'SDUD-n': 'bus.Dudley_Platform_F',
  'SDUD-s': 'bus.Dudley_Platform_C',
  'SDUD-e': 'bus.Dudley_Platform_D',
  'SDUD-w': 'bus.Dudley_Platform_A',
  'SDUD-c': 'bus.Dudley_Platform_E_east',
  'SDUD-m': 'bus.Dudley_Platform_E_west',
  'GLEC-n': 'bus.Lechmere_bus_north',
  'GLEC-s': 'bus.Lechmere_bus_south',
  'SHAR-n': 'bus.Harvard_upper',
  'SHAR-m': 'bus.Harvard_lower',
  'MMAT-n': 'bus.Mattapan_south',
  'MMAT-s': 'bus.Mattapan_north',
  'SDAV-m': 'bus.Davis',
  'SFOR-n': 'bus.Forest_Hills_upper_fence',
  'SFOR-s': 'bus.Forest_Hills_upper_island',
};

function arincToRealtimeId(stationZone, line) {
  if (stationZone === 'RSOU-m' && line === 'Red') {
    return 'red_south_station_mezzanine';
  }
  if (stationZone === 'RSOU-m' && line === 'SL3') {
    return 'south_station_mezzanine';
  }

  return arincToRealtimeIdMap[stationZone];
}

export {
  timePeriodConfig, branchConfig, stationConfig, arincToRealtimeId,
};
