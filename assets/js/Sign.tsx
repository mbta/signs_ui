import * as React from 'react';
import dateFormat from 'dateformat';
import lineToColor from './colors';
import { SignConfig, SignConfigs, SingleSignContent } from './types';
import { choosePage } from './helpers';
import SetExpiration from './SetExpiration';

function isNotExpired(expiration: string, currentTime: number) {
  return Date.parse(expiration) - currentTime > 0;
}

function fontSize(signId: string | boolean | undefined) {
  if (
    signId === 'NB'
    || signId === 'SB'
    || signId === 'EB'
    || signId === 'WB'
    || signId === 'MZ'
    || signId === 'CP'
  ) {
    return { fontSize: '1.5em' };
  }
  return {};
}

function makeConfig(mode: 'auto' | 'headway' | 'off' | 'static_text'): SignConfig {
  if (mode === 'auto') {
    return { mode: 'auto' };
  }

  if (mode === 'static_text') {
    return {
      mode: 'static_text',
      expires: null,
      line1: '',
      line2: '',
    };
  }

  if (mode === 'headway') {
    return {
      mode: 'headway',
      expires: null,
    };
  }

  return { mode: 'off', expires: null };
}

function displayName(mode: 'auto' | 'headway' | 'off' | 'static_text') {
  switch (mode) {
    case 'static_text':
      return 'Custom';
    default:
      return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

function isValidText(text: string) {
  return !/[^a-zA-Z0-9,/!@' +]/.test(text);
}

function timeString(currentTime: number) {
  const date = new Date(currentTime);
  return dateFormat(date, 'h:MM').padStart(5);
}

function line1DisplayText(
  lineContent: {
    text: {
      content: string;
      duration: number
    }[];
    expiration: string;
  } | undefined,
  currentTime: number,
  initialTime: number,
) {
  if (
    lineContent !== undefined
    && isNotExpired(lineContent.expiration, currentTime)
  ) {
    const text = choosePage(
      lineContent.text,
      (currentTime - initialTime) / 1000,
    );

    return `${text.padEnd(19)}${timeString(currentTime)}`;
  }
  return `${' '.repeat(19)}${timeString(currentTime)}`;
}

function line2DisplayText(
  lineContent: {
    text: {
      content: string;
      duration: number
    }[];
    expiration: string;
  } | undefined,
  currentTime: number,
  initialTime: number,
) {
  if (
    lineContent !== undefined
    && isNotExpired(lineContent.expiration, currentTime)
  ) {
    return choosePage(lineContent.text, (currentTime - initialTime) / 1000);
  }
  return '';
}

interface SignProps {
  signId: string | boolean | undefined;
  modes: {
    auto: boolean;
    custom: boolean;
    headway: boolean;
    off: boolean;
  };
  signContent: SingleSignContent;
  currentTime: number;
  line: string;
  setConfigs: (x: SignConfigs) => void;
  signConfig: SignConfig;
  realtimeId: string;
  readOnly: boolean;
}

class Sign extends React.Component<
  SignProps,
  {
    staticLine1: string;
    staticLine2: string;
    customChanges: boolean;
    tipText: boolean;
    initialTime: number;
  }
> {
  constructor(props: SignProps) {
    super(props);

    this.saveStaticText = this.saveStaticText.bind(this);
    this.handleInputLine1 = this.handleInputLine1.bind(this);
    this.handleInputLine2 = this.handleInputLine2.bind(this);

    this.state = {
      staticLine1: props.signConfig.line1 || '',
      staticLine2: props.signConfig.line2 || '',
      customChanges: false,
      tipText: false,
      initialTime: props.currentTime,
    };
  }

  handleInputLine1(evt: React.FormEvent<HTMLInputElement>): void {
    const text = evt.currentTarget.value;

    if (isValidText(text)) {
      this.setState({ staticLine1: text, customChanges: true });
    } else {
      this.setState({ tipText: true });
    }
  }

  handleInputLine2(evt: React.FormEvent<HTMLInputElement>): void {
    const text = evt.currentTarget.value;

    if (isValidText(text)) {
      this.setState({ staticLine2: text, customChanges: true });
    } else {
      this.setState({ tipText: true });
    }
  }

  saveStaticText(): void {
    const { signConfig, setConfigs, realtimeId } = this.props;
    const { staticLine1, staticLine2 } = this.state;

    this.setState({ customChanges: false, tipText: false });

    const newConfig: SignConfig = {
      ...signConfig,
      mode: 'static_text',
      line1: staticLine1,
      line2: staticLine2,
    };

    setConfigs({
      [realtimeId]: newConfig,
    });
  }

  render(): JSX.Element {
    const {
      signId,
      signContent,
      currentTime,
      line,
      signConfig,
      setConfigs,
      realtimeId,
      readOnly,
      modes = {
        auto: true,
        custom: true,
        headway: true,
        off: true,
      },
    } = this.props;
    const {
      tipText,
      staticLine1,
      staticLine2,
      customChanges,
      initialTime,
    } = this.state;

    return (
      <div>
        <div className="viewer--sign">
          <div
            className="viewer--sign-id"
            style={{ borderTopColor: lineToColor(line) }}
          >
            <span style={fontSize(signId)}>{signId}</span>
            {readOnly && (
              <div className="viewer--mode-text">
                {displayName(signConfig.mode)}
              </div>
            )}
            {!readOnly && (
              <div>
                <select
                  id={realtimeId}
                  className="viewer--mode-select"
                  value={signConfig.mode}
                  onChange={(event) => {
                    setConfigs({
                      [realtimeId]: makeConfig(event.target.value as 'auto' | 'headway' | 'off' | 'static_text'),
                    });
                  }}
                >
                  {modes.auto && <option value="auto">Auto</option>}
                  {modes.headway && <option value="headway">Headways</option>}
                  {modes.custom && <option value="static_text">Custom</option>}
                  {modes.off && <option value="off">Off</option>}
                </select>
              </div>
            )}
          </div>
          <div className="viewer--sign-lines">
            <div className="viewer--sign-line">
              {line1DisplayText(
                signContent.lines['1'],
                currentTime,
                initialTime,
              )}
            </div>
            <div className="viewer--sign-line">
              {line2DisplayText(
                signContent.lines['2'],
                currentTime,
                initialTime,
              )}
            </div>
          </div>
        </div>

        {signConfig.mode === 'static_text' && !readOnly && (
          <div className="viewer--static-text-form">
            <div>
              <strong>Set custom message</strong>
            </div>
            {tipText && (
              <small className="viewer--error-text">
                You may use letters, numbers, and: /,!@&quot;
              </small>
            )}
            <div>
              <input
                className="viewer--line-input"
                type="text"
                maxLength={18}
                size={18}
                value={staticLine1}
                onChange={this.handleInputLine1}
              />
            </div>
            <div>
              <input
                className="viewer--line-input"
                type="text"
                maxLength={24}
                size={24}
                value={staticLine2}
                onChange={this.handleInputLine2}
              />
            </div>
            <div>
              <input
                className="viewer--apply-button"
                disabled={!customChanges}
                type="submit"
                value="Apply"
                onClick={this.saveStaticText}
              />
              {customChanges ? '*' : ''}
            </div>
          </div>
        )}
        {signConfig.mode !== 'auto' && modes.auto && (
          <div className="viewer--schedule-expires">
            <SetExpiration
              realtimeId={realtimeId}
              signConfig={signConfig}
              setConfigs={setConfigs}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>
    );
  }
}

export default Sign;
