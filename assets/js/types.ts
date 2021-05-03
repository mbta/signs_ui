/* eslint-disable camelcase */

type Zone = 'n' | 'e' | 's' | 'w' | 'c' | 'm';

type ZoneConfig = {
  label?: string;
  modes: {
    auto: boolean;
    off: boolean;
    headway: boolean;
    custom: boolean;
  };
};

type ConfigByZone = {
  [key: string]: ZoneConfig;
  n: ZoneConfig;
  e: ZoneConfig;
  s: ZoneConfig;
  w: ZoneConfig;
  c: ZoneConfig;
  m: ZoneConfig;
};

type StationConfig = {
  id: string;
  name: string;
  zonePositions?: {
    left: Zone[];
    right: Zone[];
    center: Zone[];
  };
  zones: Partial<ConfigByZone>;
};

type SignConfig = {
  id?: string;
  mode: 'auto' | 'headway' | 'off' | 'static_text';
  expires?: string | null;
  alert_id?: string | null;
  line1?: string;
  line2?: string;
};

type SignConfigs = { [id: string]: SignConfig };

type SingleSignContent = {
  sign_id: string;
  lines: {
    [key: string]: {
      text: {
        content: string;
        duration: number;
      }[];
      expiration: string;
    };
  };
};

type SignContent = {
  [id: string]: SingleSignContent;
};

type ConfiguredHeadways = {
  [id: string]: {
    [timePeriod: string]: {
      range_low: number;
      range_high: number;
    };
  };
};

type Alerts = {
  [routeId: string]: {
    [id: string]: {
      id: string;
      created_at: string;
      service_effect: string;
    };
  };
};

export {
  Alerts,
  StationConfig,
  SignConfig,
  SignConfigs,
  SingleSignContent,
  SignContent,
  ConfiguredHeadways,
  Zone,
  ZoneConfig,
};
