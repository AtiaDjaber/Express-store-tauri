import axiosModule from "@/store/axiosModule";

export default class ChartApi {
  saveChart(chart: any) {
    const promise = axiosModule.instance
      .post("api/chart/add", chart)
      .then((x) => x.data);
    return promise;
  }

  deleteChart(id: number) {
    return axiosModule.instance
      .delete<any>("api/Chart/" + id)
      .then((x) => x.data);
  }

  groupSubjByBarcodeForChart(data: {
    barcode: string;
    idsGroups: number[];
  }): Promise<any> {
    return axiosModule.instance
      .post("api/student/groupSubjByStudentForChart", data)
      .then((x) => x.data);
  }

  groupSubjByIdForChart(data: { student_id: number; idsGroups: number[] }) {
    return axiosModule.instance
      .post("api/student/groupSubjByStudentForChart", data)
      .then((x) => x.data);
  }

  getChart(url: string): Promise<any> {
    return axiosModule.instance.get("api/Charts" + url).then((x) => x.data);
  }

  public getTeachersAnalytics(from?: string, to?: string): Promise<any> {
    return axiosModule.instance
      .get("api/chart/getBenifitsTeachersChart" + "?from=" + from + "&to=" + to)
      .then((x) => x.data);
  }

  public getTopClientsData(): Promise<any> {
    return axiosModule.instance
      .get("api/chart/top_clients")
      .then((x) => x.data);
  }

  public getChartData(): Promise<any> {
    return axiosModule.instance
      .get("api/chart/yearMonthChart")
      .then((x) => x.data);
  }

  public getTeachersBenifits(from?: string, to?: string): Promise<any> {
    return axiosModule.instance
      .get("api/chart/getBenifitsTeachers" + "?from=" + from + "&to=" + to)
      .then((x) => x.data);
  }

  // public getDetailAnalyticsTeacher(
  //     teacher_id: number,
  //     from?: string,
  //     to?: string
  // ): Promise<any> {
  //     return axiosModule.instance
  //         .get(
  //             "api/chart/getBenifitByTeacherId" +
  //             "?from=" +
  //             from +
  //             "&to=" +
  //             to +
  //             "&teacher_id=" +
  //             teacher_id
  //         )
  //         .then((x) => x.data);
  // }

  public getBenifitPeriod(from?: string, to?: string): Promise<any> {
    return axiosModule.instance
      .get("api/chart/benifitPeriod" + "?from=" + from + "&to=" + to)
      .then((x) => x.data);
  }

  public getBenifitPeriodDepots(from?: string, to?: string): Promise<any> {
    return axiosModule.instance
      .get("api/chart/benifitPeriodDepots" + "?from=" + from + "&to=" + to)
      .then((x) => x.data);
  }

  static getTotalDepots(from?: string, to?: string): Promise<any> {
    return axiosModule.instance
      .get("api/chart/totalDepots")
      .then((x) => x.data);
  }

  public getClientDues(): Promise<any> {
    return axiosModule.instance
      .get("api/chart/clients_dues")
      .then((x) => x.data);
  }

  public getProductsInventory(): Promise<any> {
    return axiosModule.instance
      .get("api/chart/products_inventory")
      .then((x) => x.data);
  }

  public getExpensesAnalytics(from: any, to: any): Promise<unknown> {
    return axiosModule.instance
      .get("api/chart/expenses?" + "from=" + from + "&to=" + to)
      .then((x) => x.data);
  }
}
