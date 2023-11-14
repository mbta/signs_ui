/* eslint-disable camelcase */

type Zone = 'n' | 'e' | 's' | 'w' | 'c' | 'm';

type ZoneConfig = {
  label?: string;
  modes: {
    auto: boolean;
    off: boolean;
    headway: boolean;
    custom: boolean;
    temporary_terminal: boolean;
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
  mode: 'auto' | 'headway' | 'off' | 'static_text' | 'temporary_terminal';
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

type Alert = {
  id: string;
  created_at: string | null;
  service_effect: string;
};

type RouteAlerts = {
  [id: string]: Alert;
};

type Alerts = {
  [routeId: string]: RouteAlerts;
};

type SignGroup = {
  sign_ids: string[];
  line1: string;
  line2: string;
  expires: string | null;
  alert_id: string | null;
};

type RouteSignGroups = {
  [key: string]: SignGroup;
};

// {groupKey: {}} means "delete groupKey sign group"
// {} is represented in TS as Record<string, never>
type RouteSignGroupsWithDeletions = {
  [key: string]: SignGroup | Record<string, never>;
};

type SignGroupMap = {
  [routeId: string]: RouteSignGroups;
};

export {
  Alert,
  RouteAlerts,
  Alerts,
  StationConfig,
  SignConfig,
  SignConfigs,
  SingleSignContent,
  SignContent,
  ConfiguredHeadways,
  Zone,
  ZoneConfig,
  SignGroupMap,
  RouteSignGroups,
  RouteSignGroupsWithDeletions,
  SignGroup,
};
