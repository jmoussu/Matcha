import { useState } from 'react';

export default function useForm(submit) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const fields = [];

  const getData = () => fields.reduce((formData, field) => {
    const { name, value } = field;
    // eslint-disable-next-line no-param-reassign
    formData[name] = value;
    return formData;
  }, {});

  const validateFields = async (fieldNames) => {
    let fieldsToValidate;
    if (fieldNames instanceof Array) {
      fieldsToValidate = fields.filter(field => fieldNames.includes(field.name));
    } else {
      fieldsToValidate = fields;
    }
    const fieldsValid = await Promise.all(
      fieldsToValidate.map(field => field.validate()),
    ).catch(() => false);
    const formValid = fieldsValid.every(isValid => isValid === true);
    return formValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitted(true);
    const formValid = await validateFields();
    await submit(getData(), formValid);
    setSubmitting(false);
  };

  const getWrongFieldnames = () => (
    fields.reduce((fieldNames, f) => {
      if (f.errors.length !== 0) fieldNames.push(f.name);
      return fieldNames;
    }, [])
  );

  return {
    addField: field => fields.push(field),
    isValid: () => fields.every(f => f.errors.length === 0),
    isSubmitting,
    isSubmitted,
    onSubmit,
    getData,
    validateFields,
    getWrongFieldnames,
  };
}
