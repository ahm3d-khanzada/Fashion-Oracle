export const validEmail = new RegExp(
    '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'
  );

  export const validPassword = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
  );
  
  export const validName = new RegExp(/^[A-Za-z]{1,12}$/);

  