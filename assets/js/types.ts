/* eslint-disable camelcase */

type Zones = 'n' | 'e' | 's' | 'w' | 'c' | 'm';

type ZoneConfig = {
  value: string | boolean;
  modes: {
    auto: boolean;
    off: boolean;
    headway: boolean;
    custom: boolean;
  };
}

type StationConfig = {
    id: string;
    name: string;
    zonePositions: {
      left: Zones[];
      right: Zones[];
      center: Zones[];
    };
    zones: {
      n: ZoneConfig;
      e: ZoneConfig;
      s: ZoneConfig;
      w: ZoneConfig;
      c: ZoneConfig;
      m: ZoneConfig;
    };
  }

type SignConfig = { id?: string, mode: 'auto' | 'headway' | 'off' | 'static_text', expires?: string | null, line1?: string; line2?: string}

type SignConfigs = {[id: string]: SignConfig}

type SingleSignContent = {
  sign_id: string
  lines: {
    [key: string]: {
      text: {
        content: string
        duration: number
      }[]
      expiration: string
    }
  }
}

type SignContent = {
  [id: string]: SingleSignContent
}

type ConfiguredHeadways = {
  [id: string]: {
    range_lwo: number,
    range_high: number
  }
}

export {
  StationConfig, SignConfig, SignConfigs, SingleSignContent, SignContent, ConfiguredHeadways,
};
