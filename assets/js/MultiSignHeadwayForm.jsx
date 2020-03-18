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
import { multiSignHeadwayConfigType } from './types';

const formSchema = object().shape({
  items: array().of(
    object().shape({
      id: string().required(),
      range_low: number().required().positive(),
      range_high: number().required().positive().moreThan(ref('range_low')),
    }),
  ),
});

const MultiSignHeadwayForm = React.memo(({
  branches,
  multiSignHeadwayConfigs,
  setMultiSignHeadwayConfigs,
  unsetMultiSignHeadwayConfigs,
  readOnly,
}) => {
  const initialFormValues = React.useMemo(() => ({
    items: branches.map((branch) => {
      const config = multiSignHeadwayConfigs[branch.id] || {};
      return {
        id: branch.id,
        range_low: config.range_low,
        range_high: config.range_high,
      };
    }),
  }), [branches, multiSignHeadwayConfigs]);

  const isEnabled = React.useMemo(() => branches.some(branch => !!multiSignHeadwayConfigs[branch.id]), [branches, multiSignHeadwayConfigs]); // eslint-disable-line max-len

  const [open, toggleOpen] = React.useState(isEnabled);

  const [inEditMode, setInEditMode] = React.useState(!isEnabled);

  React.useEffect(() => {
    toggleOpen(isEnabled);
    setInEditMode(!isEnabled);
  }, [branches, multiSignHeadwayConfigs, isEnabled]);

  const handleSubmit = React.useCallback((values) => {
    const newConfig = values.items.reduce((acc, curr) => {
      acc[curr.id] = {
        id: curr.id,
        range_low: curr.range_low,
        range_high: curr.range_high,
      };
      return acc;
    }, {});
    setMultiSignHeadwayConfigs(newConfig);
  }, [setMultiSignHeadwayConfigs]);

  const handleDisable = React.useCallback(() => {
    if (window.confirm('Are you sure you want to disable multi-sign headways?')) { // eslint-disable-line no-alert
      unsetMultiSignHeadwayConfigs(branches.map(branch => branch.id));
    }
  }, [branches, unsetMultiSignHeadwayConfigs]);

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
                <FieldArray
                  name="items"
                  render={() => (
                    <div>
                      {branches.map((branch, index) => (
                        <div key={branch.id} className="mb-3">
                          <h5>{branch.name}</h5>
                          <div className="mb-2">
                            expect trains every
                            <Field
                              id={`items.[${index}].range_low`}
                              name={`items.[${index}].range_low`}
                              type="number"
                              disabled={readOnly || !inEditMode}
                              className="mx-2"
                            />
                            to
                            <Field
                              id={`items.[${index}].range_high`}
                              name={`items.[${index}].range_high`}
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
                    {isEnabled && (
                      <button
                        id="disable"
                        type="button"
                        onClick={handleDisable}
                      >
                          Disable
                      </button>
                    )}
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
});

MultiSignHeadwayForm.propTypes = {
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  multiSignHeadwayConfigs: PropTypes.objectOf(multiSignHeadwayConfigType).isRequired,
  setMultiSignHeadwayConfigs: PropTypes.func.isRequired,
  unsetMultiSignHeadwayConfigs: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default MultiSignHeadwayForm;
