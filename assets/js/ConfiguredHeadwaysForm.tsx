import * as React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, array, number, ref } from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import { timePeriodConfig } from './mbta';
import { ConfiguredHeadways } from './types';

type Inputs = {
  branches: {
    id: string;
    [timePeriodId: string]:
      | {
          range_high: number;
          range_low: number;
        }
      | string;
  }[];
};

interface ConfiguredHeadwaysFormProps {
  branches: {
    id: string;
    name: string;
    [timePeriodId: string]:
      | {
          range_high: number;
          range_low: number;
        }
      | string;
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
  const formSchema = React.useMemo(
    () =>
      object().shape({
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
  );

  const [inEditMode, setInEditMode] = React.useState(!isEnabled);

  React.useEffect(() => {
    setInEditMode(!isEnabled);
  }, [branches, configuredHeadways, isEnabled]);

  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid },
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(formSchema),
    defaultValues: initialFormValues,
    mode: 'onBlur',
  });

  const onSumbit: SubmitHandler<Inputs> = React.useCallback(
    (values: {
      branches: {
        id: string;
        [timePeriodId: string]:
          | {
              range_high: number;
              range_low: number;
            }
          | string;
      }[];
    }) => {
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
      reset({}, { keepValues: true });
    },
    [setConfiguredHeadways],
  );
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
        onSubmit={handleSubmit(onSumbit)}
      >
        {!readOnly && isEnabled && (
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
                  reset(initialFormValues);
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
              {branches.map((branch, index) => (
                <div key={branch.id} className="col-6 col-md-3">
                  <h5>{branch.name}</h5>
                  <div className="mb-3">
                    <input
                      {...register(`branches.${index}.${period.id}.range_low`)}
                      id={`branches.[${index}].${period.id}.range_low`}
                      name={`branches.[${index}].${period.id}.range_low`}
                      type="number"
                      disabled={readOnly || !inEditMode}
                      className="mr-2"
                    />
                    to
                    <input
                      {...register(`branches.${index}.${period.id}.range_high`)}
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
        ))}
        {!readOnly && (
          <button
            className="mr-2"
            id="apply"
            type="submit"
            disabled={!isDirty || !isValid}
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
