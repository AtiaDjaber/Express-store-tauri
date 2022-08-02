import moment from "moment";

export default class TimeFormatService {
  public static format_date(value: any): any {
    if (value) {
      return moment(String(value)).format("YYYY-MM-DD") as unknown as Date;
    }
  }
  
}
