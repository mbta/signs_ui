const stationConfig = {
  Orange: [
    {
      id: 'OOAK',
      name: 'Oak Grove',
      zones: {
        n: true, s: true, e: 'Busway', w: false, c: false, m: true,
      },
    },
    {
      id: 'OMAL',
      name: 'Malden Center',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: 'Entire Station',
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
        n: true, s: true, e: false, w: false, c: false, m: 'Main Lobby',
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
        n: true, s: true, e: false, w: false, c: false, m: false,
      },
    },
  ],
  SL3: [
    {
      id: 'SCHS',
      name: 'Chelsea',
      zones: {
        n: false, s: false, e: false, w: true, c: false, m: false,
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
      id: 'SBOX',
      name: 'Box District',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'SEAV',
      name: 'Seaport Ave',
      zones: {
        n: false, s: false, e: true, w: true, c: false, m: false,
      },
    },
    {
      id: 'SSOU',
      name: 'South Station',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: false,
      },
    },
    {
      id: 'RSOU',
      name: 'South Station',
      zones: {
        n: false, s: false, e: false, w: false, c: false, m: true,
      },
    },
    {
      id: 'SCOU',
      name: 'Courthouse',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: true,
      },
    },
    {
      id: 'SWTC',
      name: 'World Train Center',
      zones: {
        n: false, s: false, e: true, w: false, c: false, m: true,
      },
    },
  ],
};

export default stationConfig;
