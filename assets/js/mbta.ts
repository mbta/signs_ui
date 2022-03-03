import { StationConfig } from './types';

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

const branchConfig: { [key: string]: { id: string; name: string }[] } = {
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
      id: 'green_b',
      name: 'Green - B',
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

const stationConfig: {
  [key: string]: {
    batchModes: {
      auto: boolean;
      headway: boolean;
      off: boolean;
    };
    stations: StationConfig[];
  };
} = {
  Orange: {
    batchModes: { auto: true, headway: true, off: true },
    stations: [
      {
        id: 'OOAK',
        name: 'Oak Grove',
        zones: {
          s: {
            label: 'Platform',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          e: {
            label: 'Busway',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OMAL',
        name: 'Malden Center',
        zones: {
          n: {
            label: 'Platform',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OWEL',
        name: 'Wellington',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OASQ',
        name: 'Assembly',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OSUL',
        name: 'Sullivan Sq',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OCOM',
        name: 'Community College',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'ONST',
        name: 'North Station',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'CR Exit',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OHAY',
        name: 'Haymarket',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OSTN',
        name: 'State North',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OSTS',
        name: 'State South',
        zones: {
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'ODTN',
        name: 'Downtown Crossing North',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'ODTS',
        name: 'Downtown Crossing South',
        zones: {
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OCHN',
        name: 'Chinatown North',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OCHS',
        name: 'Chinatown South',
        zones: {
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'ONEM',
        name: 'Tufts Medical Center',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OBAC',
        name: 'Back Bay',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OMAS',
        name: 'Mass. Ave',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'ORUG',
        name: 'Ruggles',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'SRUG',
        name: 'Ruggles Upper Busway',
        zones: {
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OROX',
        name: 'Roxbury Crossing',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OJAC',
        name: 'Jackson Sq',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OSTO',
        name: 'Stony Brook',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OGRE',
        name: 'Green St',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'OFOR',
        name: 'Forest Hills',
        zones: {
          n: {
            label: 'Platform',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'Main Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'SFOR',
        name: 'Forest Hills Entrances from Busways',
        zones: {
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
    ],
  },
  Red: {
    batchModes: { auto: true, headway: true, off: true },
    stations: [
      {
        id: 'RALE',
        name: 'Alewife',
        zones: {
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RDAV',
        name: 'Davis',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RPOR',
        name: 'Porter',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RHAR',
        name: 'Harvard',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RCEN',
        name: 'Central',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RKEN',
        name: 'Kendall/MIT',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RMGH',
        name: 'Charles/MGH',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RPRK',
        name: 'Park St',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RDTC',
        name: 'Downtown Crossing',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RSOU',
        name: 'South Station',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'SSOU',
        name: 'South Station Silver Line',
        zones: {
          w: {
            label: 'Arrival Platform',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RBRO',
        name: 'Broadway',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RAND',
        name: 'Andrew',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RJFK',
        name: 'JFK/UMass',
        zones: {
          n: {
            label: 'Braintree NB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            label: 'Braintree SB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          e: {
            label: 'Ashmont NB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Ashmont SB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RSAV',
        name: 'Savin Hill',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RFIE',
        name: 'Fields Corner',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RSHA',
        name: 'Shawmut',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RASH',
        name: 'Ashmont',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RNQU',
        name: 'North Quincy',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RWOL',
        name: 'Wollaston',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RQUC',
        name: 'Quincy Center',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RQUA',
        name: 'Quincy Adams',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'RBRA',
        name: 'Braintree',
        zones: {
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
    ],
  },
  Blue: {
    batchModes: { auto: true, headway: true, off: true },
    stations: [
      {
        id: 'BWON',
        name: 'Wonderland',
        zones: {
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BREV',
        name: 'Revere Beach',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BBEA',
        name: 'Beachmont',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BSUF',
        name: 'Suffolk Downs',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BORH',
        name: 'Orient Heights',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BWOO',
        name: 'Wood Island',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BAIR',
        name: 'Airport',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BMAV',
        name: 'Maverick',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BAQU',
        name: 'Aquarium',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BSTA',
        name: 'State',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BGOV',
        name: 'Government Center',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'BBOW',
        name: 'Bowdoin',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
    ],
  },
  Mattapan: {
    batchModes: { auto: true, headway: true, off: true },
    stations: [
      {
        id: 'MCED',
        name: 'Cedar Grove',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'MBUT',
        name: 'Butler',
        zones: {
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'MMIL',
        name: 'Milton',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'MCEN',
        name: 'Central Ave',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'MVAL',
        name: 'Valley Rd',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'MCAP',
        name: 'Capen St',
        zones: {
          n: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
    ],
  },
  Silver: {
    batchModes: { auto: true, headway: false, off: true },
    stations: [
      {
        id: 'SSOU',
        name: 'South Station',
        zones: {
          e: {
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SCOU',
        name: 'Courthouse',
        zones: {
          e: {
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SWTC',
        name: 'World Trade Center',
        zones: {
          e: {
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          m: {
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SEAV',
        name: 'Eastern Ave',
        zones: {
          e: {
            label: 'Outbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SBOX',
        name: 'Box District',
        zones: {
          e: {
            label: 'Outbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SBSQ',
        name: 'Bellingham Sq',
        zones: {
          e: {
            label: 'Outbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SCHS',
        name: 'Chelsea',
        zones: {
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
    ],
  },
  Green: {
    batchModes: { auto: true, headway: true, off: true },
    stations: [
      {
        id: 'GUNS',
        name: 'Union Sq',
        zones: {
          e: {
            label: 'Track 1',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Track 2',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GLEC',
        name: 'Lechmere',
        zones: {
          e: {
            label: 'Union Sq',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GSCI',
        name: 'Science Park',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GNST',
        name: 'North Station',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'CR Exit',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GHAY',
        name: 'Haymarket',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GGOV',
        name: 'Government Center',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GPRKE',
        name: 'Park St. Eastbound',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            label: 'Winter St Concourse',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GPRKW',
        name: 'Park St. Westbound',
        zones: {
          n: {
            label: 'Fence Track',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Wall Track',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GBOY',
        name: 'Boylston',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GARL',
        name: 'Arlington',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GCOP',
        name: 'Copley',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GPRU',
        name: 'Prudential',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GSYM',
        name: 'Symphony',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GAUD',
        name: 'Hynes',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GKEN',
        name: 'Kenmore',
        zones: {
          n: {
            label: 'C/D East',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          s: {
            label: 'C/D West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          e: {
            label: 'B East',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'B West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GAMO',
        name: 'Amory St',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GBAB',
        name: 'Babcock St',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GFEN',
        name: 'Fenway',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GLON',
        name: 'Longwood',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GBRV',
        name: 'Brookline Village',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GBRH',
        name: 'Brookline Hills',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GBEA',
        name: 'Beaconsfield',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GRES',
        name: 'Reservoir',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GCHE',
        name: 'Chestnut Hill',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GNEC',
        name: 'Newton Centre',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GNEH',
        name: 'Newton Highlands',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GELI',
        name: 'Eliot',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GWAB',
        name: 'Waban',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GWOO',
        name: 'Woodland',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
      {
        id: 'GRIV',
        name: 'Riverside',
        zones: {
          w: {
            label: 'Entire Station',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
        },
      },
    ],
  },
  Busway: {
    batchModes: { auto: true, headway: false, off: true },
    stations: [
      {
        id: 'SDUD',
        name: 'Nubian',
        zonePositions: {
          left: ['w', 'c'],
          center: ['s', 'm'],
          right: ['e', 'n'],
        },
        zones: {
          n: {
            label: 'Platform F',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          s: {
            label: 'Platform C',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          e: {
            label: 'Platform D',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          w: {
            label: 'Platform A',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          c: {
            label: 'Platform E (East)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          m: {
            label: 'Platform E (West)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SLEC',
        name: 'Lechmere',
        zones: {
          m: {
            label: 'Busway',
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SHAR',
        name: 'Harvard',
        zonePositions: {
          left: ['m'],
          center: [],
          right: ['n'],
        },
        zones: {
          n: {
            label: 'Upper',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          m: {
            label: 'Lower',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'MMAT',
        name: 'Mattapan',
        zones: {
          n: {
            label: 'South',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          s: {
            label: 'North',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SDAV',
        name: 'Davis',
        zones: {
          m: {
            label: 'Busway',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
      {
        id: 'SFOR',
        name: 'Forest Hills',
        zonePositions: {
          left: ['n'],
          center: [],
          right: ['s'],
        },
        zones: {
          n: {
            label: 'Upper (Fence)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
          s: {
            label: 'Upper (Island)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
            },
          },
        },
      },
    ],
  },
};

const arincToRealtimeIdMap: { [key: string]: string } = {
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
  'SSOU-w': 'south_station_silver_line_arrival_platform',
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
  'GAMO-e': 'amory_st_eastbound',
  'GAMO-w': 'amory_st_westbound',
  'GBAB-e': 'babcock_st_eastbound',
  'GBAB-w': 'babcock_st_westbound',
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
  'GLEC-e': 'lechmere_green_line_eastbound',
  'GLEC-w': 'lechmere_green_line_westbound',
  'GLEC-m': 'lechmere_green_line_mezzanine',
  'GUNS-e': 'union_sq_track_one',
  'GUNS-w': 'union_sq_track_two',
  'GUNS-m': 'union_sq_mezzanine',
  'SDUD-n': 'bus.Nubian_Platform_F',
  'SDUD-s': 'bus.Nubian_Platform_C',
  'SDUD-e': 'bus.Nubian_Platform_D',
  'SDUD-w': 'bus.Nubian_Platform_A',
  'SDUD-c': 'bus.Nubian_Platform_E_east',
  'SDUD-m': 'bus.Nubian_Platform_E_west',
  'SLEC-m': 'bus.Lechmere_bus_mezzanine',
  'SHAR-n': 'bus.Harvard_upper',
  'SHAR-m': 'bus.Harvard_lower',
  'MMAT-n': 'bus.Mattapan_south',
  'MMAT-s': 'bus.Mattapan_north',
  'SDAV-m': 'bus.Davis',
  'SFOR-n': 'bus.Forest_Hills_upper_fence',
  'SFOR-s': 'bus.Forest_Hills_upper_island',
};

function arincToRealtimeId(stationZone: string, line: string): string {
  if (stationZone === 'RSOU-m' && line === 'Red') {
    return 'red_south_station_mezzanine';
  }
  if (stationZone === 'RSOU-m' && line === 'Silver') {
    return 'south_station_mezzanine';
  }

  return arincToRealtimeIdMap[stationZone];
}

export { timePeriodConfig, branchConfig, stationConfig, arincToRealtimeId };
