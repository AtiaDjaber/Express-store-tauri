import Rules from "@/validation/rules/rules";

export default class VUser {
  name = [Rules.Required, Rules.StringRule];
  price = [Rules.Required, Rules.NumberRule];
  quantity = [Rules.Required, Rules.NumberRule];
  mobile = [Rules.Required, Rules.checkPhoneNumberNull, Rules.Phone, Rules.length10 ];

  // mobile = [Rules.Required, Rules.checkPhoneNumberNull, Rules.Phone, Rules.length10];
  remarque = [Rules.Required, Rules.StringRule];
  date = [Rules.Required];
}
