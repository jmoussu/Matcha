export const emailValidation = () => ([
  fData => !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(fData.email)
    && 'Wrong format of email',
]);

export const passwordValidation = () => ([
  fData => !/(?=^.{8,16}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(fData.password)
    && 'Password must contain 8 to 16 characters, one number, one special char (?#$^+=!*()@%&)',
]);

export const firstnameValidation = () => ([
  fData => !/^[a-z,.'-]{2,32}$/i.test(fData.firstname)
      && 'Your firstname must contain 2 to 24 characters',
]);

export const lastnameValidation = () => ([
  fData => !/^[a-z,.'-]{2,32}$/i.test(fData.lastname)
      && 'Your lastname must contain 2 to 24 characters',
]);

export const genderValidation = () => ([
  (fData) => {
    const { gender: gend } = fData;
    return gend !== 'male' && gend !== 'female' && gend !== 'other'
    && 'required';
  },
]);

export const ageValidation = () => ([
  fData => (fData.age < 16 || fData.age > 80)
  && '16 to 80 years old',
]);
