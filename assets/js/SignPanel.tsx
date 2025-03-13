import * as React from 'react';
import lineToColor from './colors';
import { RouteAlerts, SignConfig, SignGroup, SingleSignContent } from './types';
import SignGroupExpirationDetails from './SignGroupExpirationDetails';
import SignTextInput from './SignTextInput';
import SetExpiration from './SetExpiration';
import SignDisplay from './SignDisplay';

type SignModeOptions =
  | 'auto'
  | 'headway'
  | 'off'
  | 'static_text'
  | 'temporary_terminal';

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

  if (mode === 'temporary_terminal') {
    return {
      mode: 'temporary_terminal',
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

function stringify(expires: Date | null) {
  if (expires) {
    return expires.toISOString();
  }

  return null;
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
    temporary_terminal: boolean;
    off: boolean;
  };
  signContent: SingleSignContent;
  currentTime: number;
  line: string;
  setConfig: (x: SignConfig) => void;
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
    temporary_terminal: true,
    off: true,
  },
  signContent,
  currentTime,
  line,
  setConfig,
  signConfig: initialSignConfig,
  realtimeId,
  signGroup,
  ungroupSign,
  readOnly,
}: SignPanelProps): JSX.Element {
  const [signConfig, setSignConfig] = React.useState(initialSignConfig);
  const [hasCustomChanges, setHasCustomChanges] = React.useState(false);
  const [confirmingUngroup, setConfirmingUngroup] = React.useState(false);

  React.useEffect(() => {
    if (!hasCustomChanges) {
      setSignConfig(initialSignConfig);
    }
  }, [initialSignConfig, hasCustomChanges]);

  function save(config: SignConfig): void {
    setHasCustomChanges(false);
    setConfig(config);
  }

  function handleInputLine1(newText: string): void {
    setSignConfig({ ...signConfig, line1: newText });
    setHasCustomChanges(true);
  }

  function handleInputLine2(newText: string): void {
    setSignConfig({ ...signConfig, line2: newText });
    setHasCustomChanges(true);
  }

  function handleModeSelect(event: React.ChangeEvent<HTMLSelectElement>): void {
    const value = event.target.value as SignModeOptions;
    const newConfig = makeConfig(value);
    setSignConfig(newConfig);
    setHasCustomChanges(true);

    if (value !== 'static_text') {
      save(newConfig);
    }
  }

  function performUngroup(): void {
    if (ungroupSign !== undefined) {
      setConfirmingUngroup(false);
      ungroupSign();
    }
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
                onChange={handleModeSelect}
              >
                {modes.auto && <option value="auto">Auto</option>}
                {modes.headway && <option value="headway">Headways</option>}
                {modes.custom && <option value="static_text">Custom</option>}
                {modes.temporary_terminal && (
                  <option value="temporary_terminal">Temporary Terminal</option>
                )}
                {modes.off && <option value="off">Off</option>}
              </select>
            </div>
          )}
        </div>
        <div className="viewer--sign_text">
          <SignDisplay content={signContent} currentTime={currentTime} />
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
              line1={signConfig.line1 || ''}
              line2={signConfig.line2 || ''}
              onValidLine1Change={handleInputLine1}
              onValidLine2Change={handleInputLine2}
            />
          </div>
        )}

        {signConfig.mode !== 'auto' && !signGroup && (
          <div>
            {modes.auto && (
              <div className="viewer--schedule-expires">
                <SetExpiration
                  alerts={alerts}
                  expires={parseDate(signConfig.expires)}
                  alertId={signConfig.alert_id}
                  onDateChange={(dt) => {
                    setSignConfig({ ...signConfig, expires: stringify(dt) });
                    setHasCustomChanges(true);
                  }}
                  onAlertChange={(alertId) => {
                    setSignConfig({ ...signConfig, alert_id: alertId });
                    setHasCustomChanges(true);
                  }}
                  readOnly={readOnly}
                  showAlertSelector={shouldShowAlertSelector(line)}
                />
              </div>
            )}
            <div>
              <input
                className="viewer--apply-button"
                disabled={!hasCustomChanges}
                type="submit"
                value="Apply"
                onClick={() => save(signConfig)}
              />
              {hasCustomChanges ? '*' : ''}
            </div>
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

              {!readOnly && (
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
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SignPanel;
export { SignModeOptions, SignPanelProps };
