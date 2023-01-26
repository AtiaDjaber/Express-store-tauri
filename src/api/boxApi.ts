import Box from "@/classes/box";
import BoxTransaction from "@/classes/boxTransaction";
import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";

export default class BoxApi {
  static async getBoxes(search?: Search) {
    const res = await axiosModule.instance.get<Box[]>(
      "api/boxes?" + search.toFilter()
    );

    return (res.data as any).data;
  }

  // TODO SAVE Box
  static async saveBox(Box: Box): Promise<Box> {
    return axiosModule.instance
      .post<Box>("api/box/add", Box)
      .then((x) => x.data);
  }

  static deleteBox(id: number) {
    const deletedBox = axiosModule.instance
      .delete<any>("api/box/" + id)
      .then((x) => x.data);
    return deletedBox;
  }

  static async updateBox(Box: Box) {
    return axiosModule.instance
      .put<Box>("api/box/put", Box)
      .then((x) => x.data);
  }

  static async getBoxTransactions(search?: Search) {
    const res = await axiosModule.instance.get(
      "api/box_transactions?" + search.toFilter()
    );

    return (res.data as any).data;
  }

  static async saveBoxTransaction(Box: BoxTransaction) {
    return axiosModule.instance
      .post("api/box_transaction/add", Box)
      .then((x) => x.data);
  }
}
