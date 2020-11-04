import * as React from 'react';
import {
  Formik, Form, Field, FieldArray,
} from 'formik';
import {
  object, string, array, number, ref,
} from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { timePeriodConfig } from './mbta';
import { ConfiguredHeadways } from './types';

/* eslint-disable camelcase */

const ConfiguredHeadwaysForm = ({
  branches,
  configuredHeadways,
  setConfiguredHeadways,
  readOnly,
  timePeriods = timePeriodConfig,
}: ConfiguredHeadwaysFormProps) => {
  const formSchema = React.useMemo(
    () => object().shape({
      branches: array().of(
        object().shape(
          timePeriods.reduce(
            (acc, curr) => ({
              ...acc,
              [curr.id]: object().shape({
                range_low: number().required().positive(),
                range_high: number()
                  .required()
                  .positive()
                  .moreThan(ref('range_low')),
              }),
            }),
            { id: string().required() },
          ),
        ),
      ),
    }),
    [timePeriods],
  );

  const initialFormValues = React.useMemo(
    () => ({
      branches: branches.map((branch) => {
        const config = configuredHeadways[branch.id] || {};
        return timePeriods.reduce(
          (acc, curr) => ({
            ...acc,
            [curr.id]: config[curr.id] || { range_low: '', range_high: '' },
          }),
          { id: branch.id },
        );
      }),
    }),
    [branches, configuredHeadways],
  );

  const isEnabled = React.useMemo(
    () => branches.some((branch) => !!configuredHeadways[branch.id]),
    [branches, configuredHeadways],
  ); // eslint-disable-line max-len

  const [inEditMode, setInEditMode] = React.useState(!isEnabled);

  React.useEffect(() => {
    setInEditMode(!isEnabled);
  }, [branches, configuredHeadways, isEnabled]);

  const handleSubmit = React.useCallback(
    (values) => {
      const newConfig = values.branches.reduce(
        (branchAcc, branchCurr, index) => ({
          ...branchAcc,
          [branchCurr.id]: timePeriods.reduce(
            (timePeriodAcc, timePeriodCurr) => ({
              ...timePeriodAcc,
              [timePeriodCurr.id]: values.branches[index][timePeriodCurr.id],
            }),
            {},
          ),
        }),
        {},
      );
      setConfiguredHeadways(newConfig);
    },
    [setConfiguredHeadways],
  );

  return (
    <div className="mb-5">
      <div>
        <h5 className="viewer--configured-headways-form-header">Headways</h5>
      </div>
      <Formik<{
        branches: {
          id: string;
          [timePeriodId: string]:
            | {
                range_high: number;
                range_low: number;
              }
            | string;
        }[];
      }>
        validationSchema={formSchema}
        enableReinitialize
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange={false}
      >
        {({ dirty, isValid, resetForm }) => (
          <Form
            className={`viewer--configured-headways-form ${
              !inEditMode ? 'disabled' : ''
            }`}
          >
            {!readOnly && isEnabled && (
              <div className="viewer--configured-headways-form-edit-button">
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
                      resetForm();
                    }}
                  >
                    <FontAwesomeIcon className="mr-1" icon={faTimes} />
                    cancel
                  </button>
                )}
              </div>
            )}
            <div>
              {!isValid ? (
                <div className="alert alert-danger">
                  Error: All headway ranges must be valid.
                </div>
              ) : null}
              {timePeriods.map((period) => (
                <FieldArray
                  key={period.id}
                  name="branches"
                  render={() => (
                    <div>
                      <div className="d-flex align-items-center">
                        <h3>{period.name}</h3>
                        {period.description && (
                          <span className="ml-2">{`(${period.description})`}</span>
                        )}
                      </div>
                      <div className="row mb-3">
                        {branches.map((branch, index) => (
                          <div
                            key={branch.id}
                            className="viewer--configured-headways-form-branch col-6 col-md-4"
                          >
                            <h5>{branch.name}</h5>
                            <div className="mb-3">
                              <Field
                                id={`branches.[${index}].${period.id}.range_low`}
                                name={`branches.[${index}].${period.id}.range_low`}
                                type="number"
                                disabled={readOnly || !inEditMode}
                                className="mr-2"
                              />
                              to
                              <Field
                                id={`branches.[${index}].${period.id}.range_high`}
                                name={`branches.[${index}].${period.id}.range_high`}
                                className="mx-2"
                                disabled={readOnly || !inEditMode}
                                type="number"
                              />
                              mins
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                />
              ))}
              {!readOnly && (
                <div>
                  <button
                    className="mr-2"
                    id="apply"
                    type="submit"
                    disabled={!dirty || !isValid}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ConfiguredHeadwaysForm.defaultProps = {
  timePeriods: timePeriodConfig,
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

export default React.memo(ConfiguredHeadwaysForm);
