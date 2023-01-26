import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";

export default class CategoryApi {
  static getCategories(resource: string) {
    return axiosModule.instance.get("api/" + resource).then((x) => x.data);
  }

  static async saveCategory(category: any, resource: string) {
    return axiosModule.instance
      .post("api/" + resource + "/add", category)
      .then((x) => x.data);
  }

  static deleteCategory(id: number, resource: string) {
    const deletedExpense = axiosModule.instance
      .delete("api/" + resource + "/" + id)
      .then((x) => x.data);
    return deletedExpense;
  }
}
