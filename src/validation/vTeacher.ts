import Rules from "./rules/rules";

export default class VTeacher {
  firstname = [Rules.Required, Rules.StringRule];
  lastname = [Rules.Required, Rules.StringRule];
  mobile = [Rules.Required, Rules.checkPhoneNumberNull, Rules.Phone, Rules.length10 ];
  address = [Rules.Required];
  date = [Rules.Required];
}
