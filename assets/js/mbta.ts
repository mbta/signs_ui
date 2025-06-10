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
    description: 'weekdays, excluding peak hours',
  },
  {
    id: 'saturday',
    name: 'Saturday',
    description: 'all day Saturday',
  },
  {
    id: 'sunday',
    name: 'Sunday',
    description: 'all day Sunday',
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
    {
      id: 'glx_union',
      name: 'GLX - Union',
    },
    {
      id: 'glx_medford',
      name: 'GLX - Medford',
    },
  ],
  Mattapan: [
    {
      id: 'mattapan_trunk',
      name: 'Mattapan Line',
    },
  ],
  Silver: [
    {
      id: 'silver_chelsea',
      name: 'Chelsea',
    },
    {
      id: "silver_seaport",
      name: "Seaport"
    }
  ]
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
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
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
              temporary_terminal: true,
            },
          },
          e: {
            label: 'Busway',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          c: {
            label: 'MZ',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            label: 'CR Exit',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Main Lobby',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
  Red: {
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          c: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            label: 'Braintree SB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          e: {
            label: 'Ashmont NB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Ashmont SB',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          s: {
            label: 'Drop-off',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
  Blue: {
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Drop-off',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
  Mattapan: {
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
  Silver: {
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
    stations: [
      {
        id: 'SSOU',
        name: 'South Station',
        zones: {
          e: {
            modes: {
              auto: false,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: false,
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
              headway: true,
              off: true,
              temporary_terminal: false,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              headway: true,
              off: true,
              temporary_terminal: false,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: false,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: false,
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
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Inbound',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
  Green: {
    batchModes: {
      auto: true,
      headway: true,
      off: true,
    },
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Track 1',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Track 2',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
        },
      },
      {
        id: 'GLEC',
        name: 'Lechmere',
        zones: {
          e: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Copley & West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
              off: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              temporary_terminal: true,
              off: true,
            },
          },
          m: {
            label: 'CR Exit',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Winter St Concourse',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Wall Track',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            label: 'C/D West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          e: {
            label: 'B East',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'B West',
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          w: {
            modes: {
              auto: true,
              custom: true,
              headway: true,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            label: 'Platform C',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          e: {
            label: 'Platform D',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          w: {
            label: 'Platform A',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          c: {
            label: 'Platform E (East)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Platform E (West)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
        },
      },
      {
        id: 'SLEC',
        name: 'Lechmere',
        zonePositions: {
          left: ['w', 'm'],
          center: ['s', 'n'],
          right: ['e', 'c'],
        },
        zones: {
          m: {
            label: 'Inner Platform',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
            },
          },
          c: {
            label: 'Outer Platform',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          m: {
            label: 'Lower',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            label: 'North',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
          s: {
            label: 'Upper (Island)',
            modes: {
              auto: true,
              custom: true,
              headway: false,
              off: true,
              temporary_terminal: true,
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
              temporary_terminal: true,
            },
          },
        },
      },
    ],
  },
};

export { timePeriodConfig, branchConfig, stationConfig };
