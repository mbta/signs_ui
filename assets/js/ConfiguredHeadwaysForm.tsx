import * as React from 'react';
import { object, number, ref } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { timePeriodConfig } from './mbta';
import { ConfiguredHeadways } from './types';
import fp from 'lodash/fp';

type FormState = {
  [id: string]: {
    [timePeriod: string]: {
      range_low?: number;
      range_high?: number;
    };
  };
};

interface ConfiguredHeadwaysFormProps {
  branches: {
    id: string;
    name: string;
  }[];
  timePeriods?: {
    id: string;
    name: string;
    description: string;
  }[];
  configuredHeadways: ConfiguredHeadways;
  setConfiguredHeadways: (x: ConfiguredHeadways) => void;
  readOnly: boolean;
}

function ConfiguredHeadwaysForm({
  branches,
  configuredHeadways,
  setConfiguredHeadways,
  readOnly,
  timePeriods = timePeriodConfig,
}: ConfiguredHeadwaysFormProps) {
  const schema = object(
    Object.fromEntries(
      branches.map(({ id }) => [
        id,
        object(
          Object.fromEntries(
            timePeriods.map(({ id }) => [
              id,
              object({
                range_low: number().integer().required().positive(),
                range_high: number()
                  .integer()
                  .required()
                  .positive()
                  .moreThan(ref('range_low')),
              }),
            ]),
          ),
        ),
      ]),
    ),
  );

  const savedState = fp.pick(
    branches.map((b) => b.id),
    configuredHeadways,
  );

  const [inEditMode, setInEditMode] = React.useState(false);
  const [formState, setFormState] = React.useState<FormState>(savedState);
  const isDirty = !fp.equals(formState, savedState);
  const isValid = schema.isValidSync(formState);

  const parseNumber = (v: string) => (v === '' ? undefined : +v);

  return (
    <div className="mb-5">
      {!isValid ? (
        <div className="alert alert-danger">
          Error: All headway ranges must be valid.
        </div>
      ) : null}
      <form
        name="configured-headways-form"
        className={`configured-headways-form ${!inEditMode ? 'disabled' : ''}`}
        onSubmit={(e) => {
          setConfiguredHeadways(fp.assign(configuredHeadways, formState));
          setInEditMode(false);
          e.preventDefault();
        }}
      >
        {!readOnly && (
          <div className="configured-headways-form--edit_button">
            {!inEditMode ? (
              <button
                type="button"
                id="edit"
                className="btn p-0 bg-transparent d-flex align-items-center"
                onClick={() => setInEditMode(true)}
              >
                <FontAwesomeIcon className="mr-1" icon={faEdit} />
                edit
              </button>
            ) : (
              <button
                type="button"
                id="cancel"
                className="text-danger btn p-0 bg-transparent d-flex align-items-center"
                onClick={() => {
                  setInEditMode(false);
                  setFormState(savedState);
                }}
              >
                <FontAwesomeIcon className="mr-1" icon={faTimes} />
                cancel
              </button>
            )}
          </div>
        )}
        {timePeriods.map((period) => (
          <div key={period.id}>
            <div className="d-flex align-items-center">
              <h3>{period.name}</h3>
              {period.description && (
                <span className="ml-2">{`(${period.description})`}</span>
              )}
            </div>
            <div className="row mb-3">
              {branches.map((branch) => (
                <div key={branch.id} className="col-6 col-md-3">
                  <h5>{branch.name}</h5>
                  <div className="mb-3">
                    <input
                      value={formState[branch.id]?.[period.id]?.range_low ?? ''}
                      onChange={(e) =>
                        setFormState(
                          fp.set(
                            [branch.id, period.id, 'range_low'],
                            parseNumber(e.target.value),
                          ),
                        )
                      }
                      type="number"
                      aria-label={`${branch.name} ${period.name} low`}
                      min={1}
                      className="mr-2"
                      disabled={!inEditMode}
                    />
                    to
                    <input
                      value={
                        formState[branch.id]?.[period.id]?.range_high ?? ''
                      }
                      onChange={(e) =>
                        setFormState(
                          fp.set(
                            [branch.id, period.id, 'range_high'],
                            parseNumber(e.target.value),
                          ),
                        )
                      }
                      type="number"
                      aria-label={`${branch.name} ${period.name} high`}
                      min={1}
                      className="mx-2"
                      disabled={!inEditMode}
                    />
                    mins
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!readOnly && (
          <button
            className="mr-2"
            id="apply"
            type="submit"
            disabled={!isDirty || !isValid || !inEditMode}
          >
            Apply
          </button>
        )}
      </form>
    </div>
  );
}

ConfiguredHeadwaysForm.defaultProps = {
  timePeriods: timePeriodConfig,
};

export default React.memo(ConfiguredHeadwaysForm);
export { ConfiguredHeadwaysFormProps };
