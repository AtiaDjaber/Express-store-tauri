import Expense from "@/classes/expense";
import expense from "@/classes/expense";
import HttpClient from "./httpClient";
import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";

export default class expenseApi {
  static getExpenses(search?: Search): Promise<expense[]> {
    return axiosModule.instance
      .get<expense[]>("api/expenses?" + search.toFilter())
      .then((x) => x.data);
  }

  // TODO SAVE EXPENSE
  static async saveExpense(expense: Expense): Promise<Expense> {
    return axiosModule.instance
      .post<Expense>("api/expense/add", expense)
      .then((x) => x.data);
  }

  static deleteExpense(id: number) {
    const deletedExpense = axiosModule.instance
      .delete<any>("api/expense/" + id)
      .then((x) => x.data);
    return deletedExpense;
  }

  static async updateExpense(expense: Expense) {
    return axiosModule.instance
      .put<Expense>("api/expense/put", expense)
      .then((x) => x.data);
  }

  static async getCategories(): Promise<any> {
    return await axiosModule.instance.get("api/expense_categories");
  }
}
