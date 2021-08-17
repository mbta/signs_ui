import * as React from 'react';
import lineToColor from './colors';
import {
  RouteAlerts,
  SignConfig,
  SignConfigs,
  SignGroup,
  SingleSignContent,
} from './types';
import { choosePage } from './helpers';
import SignGroupExpirationDetails from './SignGroupExpirationDetails';
import SignTextInput from './SignTextInput';
import SetExpiration from './SetExpiration';
import SignText from './SignText';

type SignModeOptions = 'auto' | 'headway' | 'off' | 'static_text';

function isNotExpired(expiration: string, currentTime: number) {
  return Date.parse(expiration) - currentTime > 0;
}

function fontSize(signId: string) {
  if (
    signId === 'NB' ||
    signId === 'SB' ||
    signId === 'EB' ||
    signId === 'WB' ||
    signId === 'MZ' ||
    signId === 'CP'
  ) {
    return { fontSize: '1.5em' };
  }
  return {};
}

function makeConfig(mode: SignModeOptions): SignConfig {
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

function displayName(mode: SignModeOptions) {
  switch (mode) {
    case 'static_text':
      return 'Custom';
    default:
      return mode.charAt(0).toUpperCase() + mode.slice(1);
  }
}

function shouldShowAlertSelector(line: string): boolean {
  return (
    line === 'Red' ||
    line === 'Blue' ||
    line === 'Orange' ||
    line === 'Green' ||
    line === 'Mattapan'
  );
}

function lineDisplayText(
  lineContent:
    | {
        text: {
          content: string;
          duration: number;
        }[];
        expiration: string;
      }
    | undefined,
  currentTime: number,
  initialTime: number,
): string {
  if (
    lineContent !== undefined &&
    isNotExpired(lineContent.expiration, currentTime)
  ) {
    return choosePage(lineContent.text, (currentTime - initialTime) / 1000);
  }
  return '';
}

function stringify(expires: Date | null) {
  if (expires) {
    return expires.toISOString();
  }

  return null;
}

function updateConfig(
  setConfigsFn: (x: SignConfigs) => void,
  realtimeId: string,
  signConfig: SignConfig,
  expires: Date | [Date, Date] | null,
  alertId: string | null,
) {
  if (Array.isArray(expires)) {
    return;
  }
  const expirationConfig = stringify(expires);

  const newConfig = {
    ...signConfig,
    expires: expirationConfig,
    alert_id: alertId,
  };

  setConfigsFn({
    [realtimeId]: newConfig,
  });
}

function parseDate(str: string | null | undefined): Date | null {
  if (str) {
    const date = new Date(str);

    if (date.toString() !== 'Invalid Date') {
      return date;
    }
  }

  return null;
}

interface SignPanelProps {
  alerts: RouteAlerts;
  signId: string;
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
  signGroup?: SignGroup;
  ungroupSign?: () => void;
  readOnly: boolean;
}

function SignPanel({
  alerts,
  signId,
  modes = {
    auto: true,
    custom: true,
    headway: true,
    off: true,
  },
  signContent,
  currentTime,
  line,
  setConfigs,
  signConfig,
  realtimeId,
  signGroup,
  ungroupSign,
  readOnly,
}: SignPanelProps): JSX.Element {
  const [staticLine1, setStaticLine1] = React.useState(signConfig.line1 || '');
  const [staticLine2, setStaticLine2] = React.useState(signConfig.line2 || '');
  const [customChanges, setCustomChanges] = React.useState(false);
  const [initialTime] = React.useState(currentTime);
  const [confirmingUngroup, setConfirmingUngroup] = React.useState(false);

  function handleInputLine1(newText: string): void {
    setStaticLine1(newText);
    setCustomChanges(true);
  }

  function handleInputLine2(newText: string): void {
    setStaticLine2(newText);
    setCustomChanges(true);
  }

  function performUngroup(): void {
    if (ungroupSign !== undefined) {
      setConfirmingUngroup(false);
      ungroupSign();
    }
  }

  function saveStaticText(): void {
    setCustomChanges(false);

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

  return (
    <section aria-label={signId}>
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
          {!readOnly && !signGroup && (
            <div>
              <select
                id={realtimeId}
                className="viewer--mode-select"
                value={signConfig.mode}
                onChange={(event) => {
                  const newConfig = makeConfig(
                    event.target.value as
                      | 'auto'
                      | 'headway'
                      | 'off'
                      | 'static_text',
                  );
                  setStaticLine1(newConfig.line1 || '');
                  setStaticLine2(newConfig.line2 || '');
                  setCustomChanges(false);
                  setConfigs({
                    [realtimeId]: newConfig,
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
        <div className="viewer--sign_text">
          <SignText
            line1={lineDisplayText(
              signContent.lines['1'],
              currentTime,
              initialTime,
            )}
            line2={lineDisplayText(
              signContent.lines['2'],
              currentTime,
              initialTime,
            )}
            time={currentTime}
          />
        </div>
      </div>

      <div className="viewer--sign-options">
        {signConfig.mode === 'static_text' && !readOnly && !signGroup && (
          <div className="viewer--static-text-form">
            <div>
              <strong>Set custom message</strong>
            </div>
            <SignTextInput
              signID={realtimeId}
              line1={staticLine1}
              line2={staticLine2}
              onValidLine1Change={handleInputLine1}
              onValidLine2Change={handleInputLine2}
            />
            <div>
              <input
                className="viewer--apply-button"
                disabled={!customChanges}
                type="submit"
                value="Apply"
                onClick={saveStaticText}
              />
              {customChanges ? '*' : ''}
            </div>
          </div>
        )}

        {signConfig.mode !== 'auto' && modes.auto && !signGroup && (
          <div className="viewer--schedule-expires">
            <SetExpiration
              alerts={alerts}
              expires={parseDate(signConfig.expires)}
              alertId={signConfig.alert_id}
              onDateChange={(dt) => {
                updateConfig(setConfigs, realtimeId, signConfig, dt, null);
              }}
              onAlertChange={(alertId) =>
                updateConfig(setConfigs, realtimeId, signConfig, null, alertId)
              }
              readOnly={readOnly}
              showAlertSelector={shouldShowAlertSelector(line)}
            />
          </div>
        )}

        {signGroup && (
          <div className="viewer--sign-group">
            {confirmingUngroup && (
              <div className="viewer--sign-ungroup-confirmation">
                <h4>This sign is part of a group</h4>
                <p>
                  Ungrouping will return this sign to &quot;Auto&quot;.
                  <br />
                  Would you like to ungroup the sign?
                </p>

                <div className="viewer--sign-ungroup-confirmation--buttons">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => performUngroup()}
                  >
                    Yes, ungroup this sign
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setConfirmingUngroup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="viewer--sign-group-panel">
              <div className="viewer--sign-group-details">
                <h4>Grouped</h4>
                <SignGroupExpirationDetails group={signGroup} />
              </div>

              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setConfirmingUngroup(true)}
                  disabled={confirmingUngroup}
                >
                  Ungroup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SignPanel;
export { SignModeOptions, SignPanelProps };
