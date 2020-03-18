import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, FieldArray,
} from 'formik';
import {
  object, string, array, number, ref,
} from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { timePeriodConfig } from './mbta';
import { configuredHeadwayType } from './types';

const ConfiguredHeadwaysForm = React.memo(({
  branches,
  configuredHeadways,
  setConfiguredHeadways,
  readOnly,
  timePeriods,
}) => {
  const formSchema = React.useMemo(() => object().shape({
    branches: array().of(
      object().shape(timePeriods.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: object().shape({
          range_low: number().required().positive(),
          range_high: number().required().positive().moreThan(ref('range_low')),
        }),
      }), { id: string().required() })),
    ),
  }), [timePeriods]);

  const initialFormValues = React.useMemo(() => ({
    branches: branches.map((branch) => {
      const config = configuredHeadways[branch.id] || {};
      return timePeriods.reduce((acc, curr) => ({
        ...acc,
        [curr.id]: config[curr.id] || { range_low: '', range_high: '' },
      }), { id: branch.id });
    }),
  }), [branches, configuredHeadways]);

  const isEnabled = React.useMemo(() => branches.some(branch => !!configuredHeadways[branch.id]), [branches, configuredHeadways]); // eslint-disable-line max-len

  const [open, toggleOpen] = React.useState(isEnabled);

  const [inEditMode, setInEditMode] = React.useState(!isEnabled);

  React.useEffect(() => {
    toggleOpen(isEnabled);
    setInEditMode(!isEnabled);
  }, [branches, configuredHeadways, isEnabled]);

  const handleSubmit = React.useCallback((values) => {
    const newConfig = values.branches.reduce((branchAcc, branchCurr, index) => ({
      ...branchAcc,
      [branchCurr.id]: timePeriods.reduce((timePeriodAcc, timePeriodCurr) => ({
        ...timePeriodAcc,
        [timePeriodCurr.id]: values.branches[index][timePeriodCurr.id],
      }), {}),
    }), {});
    setConfiguredHeadways(newConfig);
  }, [setConfiguredHeadways]);

  return (
    <div className="mb-5">
      <div>
        <button
          type="button"
          className={`btn btn-outline-secondary viewer--multi-sign-headway-form-toggle ${open ? 'open' : ''}`}
          onClick={() => toggleOpen(!open)}
          disabled={isEnabled}
        >
          <h5 className="mb-0">{isEnabled ? 'Multi-sign Headways Enabled' : 'Enable Multi-sign Headways'}</h5>
          <i />
        </button>
      </div>
      { open && (
        <Formik
          validationSchema={formSchema}
          enableReinitialize
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
        >
          {({
            dirty, isValid, resetForm,
          }) => (
            <Form
              className={`viewer--multi-sign-headway-form ${!inEditMode ? 'disabled' : ''}`}
            >
              {!readOnly && isEnabled && (
                <div className="viewer--multi-sign-headway-form-edit-button">
                  { !inEditMode ? (
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
                {branches.map((branch, index) => (
                  <FieldArray
                    key={branch.id}
                    name="branches"
                    render={() => (
                      <div>
                        <h3>{branch.name}</h3>
                        {timePeriods.map(period => (
                          <div key={period.id} className="mb-3">
                            <h5>{period.name}</h5>
                            <div className="mb-2">
                                expect trains every
                              <Field
                                id={`branches.[${index}].${period.id}.range_low`}
                                name={`branches.[${index}].${period.id}.range_low`}
                                type="number"
                                disabled={readOnly || !inEditMode}
                                className="mx-2"
                              />
                                to
                              <Field
                                id={`branches.[${index}].${period.id}.range_high`}
                                name={`branches.[${index}].${period.id}.range_high`}
                                className="mx-2"
                                disabled={readOnly || !inEditMode}
                                type="number"
                              />
                                minutes
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                ))}
                { !readOnly && (
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
          )
          }
        </Formik>
      )}
    </div>
  );
});

ConfiguredHeadwaysForm.defaultProps = {
  timePeriods: timePeriodConfig,
};

ConfiguredHeadwaysForm.propTypes = {
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  timePeriods: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })),
  configuredHeadways: PropTypes.objectOf(configuredHeadwayType).isRequired,
  setConfiguredHeadways: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default ConfiguredHeadwaysForm;
