import { useState, useEffect, useRef } from 'react';

export default function useField(name, form,
  { validations = [], fieldDependencies = [name] } = {}, defaultValue = '') {
  const [state, setState] = useState({
    value: defaultValue,
    pristine: defaultValue && false,
    errors: [],
    isValidating: false,
    event: '',
  });
  const validateCounter = useRef(0);

  const {
    value, pristine, errors, isValidating, event,
  } = state;

  useEffect(() => {
    if (pristine || event === '' || validations.length === 0) return;
    form.validateFields(fieldDependencies);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, event]);

  const validate = async () => {
    const currentIteration = ++validateCounter.current;
    setState({ ...state, isValidating: true });
    const formData = form.getData();
    let errorMessages = await Promise.all(
      validations.map(validateRule => validateRule(formData, event)),
    ).catch(err => [err.message]);
    errorMessages = errorMessages.filter(errorMsg => !!errorMsg);
    if (currentIteration === validateCounter.current) {
      setState({
        ...state,
        errors: errorMessages,
        event: '',
        isValidating: false,
      });
    }
    return errorMessages.length === 0;
  };

  const field = {
    name,
    value,
    errors,
    isValidating,
    validate,
    pristine,
    onChange: (e) => {
      setState({
        ...state,
        value: e.target.value,
        event: 'onchange',
        pristine: false,
      });
    },
    onBlur: () => {
      if (pristine === true) return;
      setState({ ...state, event: 'onblur' });
    },
    setErrors: err => setState({ ...state, errors: err }),
    setValue: val => setState({
      ...state,
      value: val,
      pristine: false,
      event: 'onchange',
    }),
  };

  form.addField(field);
  return field;
}
