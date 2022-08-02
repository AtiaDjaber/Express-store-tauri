// import { parsePhoneNumber } from "libphonenumber-js";

import { parsePhoneNumber } from "libphonenumber-js";

export default class Rules {


  static NumberRule = (v: string) =>
    Rules.checkIsNumberOrNull(v) || "الرجاء إدخال رقم";

  static length10 = (v: string) =>
    v.length == 10 || "الرجاء إدخال 10 أرقام";

  static NumberGreaterThanZeroRule = (v?: string) =>
    Number(v) > 0 || "الرجاء إدخال رقم أكبر من الصفر";

  static NumberGreaterThanEqualZeroRule = (v: string) =>
    Rules.checkNumberGTEZero(v) || "الرجاء إدخال رقم أكبر من أو يساوي الصفر";

  static Required = (v?: string) => !!v || "حقل إجباري";

  static StringRule = (v?: string) =>
    isNaN(Number(v)) || "الرجاء إدخال حروف فقط ";
  
    static Phone = (v: string) =>
    Rules.checkPhoneNumberNull(v) || "رقم الهاتف خاطئ";
  
    static From0To100 = (v: string) => 0 <= Number(v) && Number(v) <= 100 || "الرجاء إدخال رقم بين 0 و 100"

  static checkPhoneNumberNull(v: string): boolean {
    if (v !== undefined) {
      const number = parsePhoneNumber("+213" + v);
      return number !== undefined ? number.isValid() : false;
    } else return false;
  }

  static checkIsNumberOrNull(v0: string) {
    if (v0 !== undefined) {
      if (isNaN(Number(v0))) return false;
      return !isNaN(Number(v0)) || v0 == "";
    }
    return true;
  }
  
  static checkNumberGTEZero(v0: string) {
    if (v0 !== undefined) {
      if (isNaN(Number(v0))) return false;
      return Number(v0) >= 0 || v0 == "";
    }
    return true;
  }



}
