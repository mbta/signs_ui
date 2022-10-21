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
          w: {
            label: 'Drop-off',
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
        id: 'GCOS',
        name: 'College Ave',
        zones: {
          e: {
            label: 'Track 2',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Track 1',
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
        id: 'GBSS',
        name: 'Ball Sq',
        zones: {
          e: {
            label: 'Medford/ Tufts',
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
        id: 'GMSS',
        name: 'Magoun Sq',
        zones: {
          e: {
            label: 'Medford/ Tufts',
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
        id: 'GGSS',
        name: 'Gilman Sq',
        zones: {
          e: {
            label: 'Medford/ Tufts',
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
        id: 'GESS',
        name: 'East Somerville',
        zones: {
          e: {
            label: 'Medford/ Tufts',
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
        id: 'GUNS',
        name: 'Union Sq',
        zones: {
          e: {
            label: 'Track 1',
            modes: {
              auto: false,
              custom: true,
              headway: true,
              off: true,
            },
          },
          w: {
            label: 'Track 2',
            modes: {
              auto: false,
              custom: true,
              headway: true,
              off: true,
            },
          },
          m: {
            modes: {
              auto: false,
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
              auto: true,
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
      {
        id: 'RBRA',
        name: 'Braintree',
        zonePositions: {
          left: [],
          center: ['n'],
          right: [],
        },
        zones: {
          n: {
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
    ],
  },
};

export { timePeriodConfig, branchConfig, stationConfig };
