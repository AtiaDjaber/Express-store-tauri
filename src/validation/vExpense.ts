import Rules from "@/validation/rules/rules";

export default class VExpense {
  name = [Rules.Required, Rules.StringRule];
  price = [Rules.Required, Rules.NumberRule];
  // mobile = [Rules.Required, Rules.checkPhoneNumberNull];
  remarque = [Rules.StringRule];
  date = [Rules.Required];
}
