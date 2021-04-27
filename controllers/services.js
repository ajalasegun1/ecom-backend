exports.signupErrors = {};
exports.signupValidator = (input) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  this.signupErrors.name =
    input.name.length > 0 && input.name.length <= 32
      ? ""
      : "Name must not be empty and not more than 32 characters";

  this.signupErrors.email =
    input.email.length >= 0 && re.test(input.email) ? "" : "Email is invalid";

  this.signupErrors.password =
    input.password.length >= 6
      ? ""
      : "Password must be at least 6 characters long";

  const check = Object.values(this.signupErrors).every((item) => item === "");
  return check
};
