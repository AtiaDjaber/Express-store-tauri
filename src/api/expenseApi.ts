import Expense from "@/classes/expense";
import expense from "@/classes/expense";
import HttpClient from "./httpClient";
import Search from "@/classes/search";

export default class expenseApi extends HttpClient {
    public constructor() {
        super(process.env.VUE_APP_API_URL as string);
    }

    public getExpenses(search?: Search): Promise<expense[]> {
        return this.instance.get<expense[]>("api/expenses?" + search.toFilter())
            .then((x) => x.data);
    }

// TODO SAVE EXPENSE
    async saveExpense(expense: Expense): Promise<Expense> {
        return this.instance
            .post<Expense>("api/expense/add", expense)
            .then((x) => x.data);
    }

    deleteExpense(id: number) {
        const deletedExpense = this.instance
            .delete<any>("api/expense/" + id)
            .then((x) => x.data);
        return deletedExpense;
    }

    async updateExpense(expense: Expense) {
        return this.instance
            .put<Expense>("api/expense/put", expense)
            .then((x) => x.data);
    }


}
