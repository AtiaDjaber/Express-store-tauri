import HttpClient from "./httpClient";
import Facture from "@/classes/facture";
import FactureTransfer from "@/classes/facture_transfer";
import Search from "@/classes/search";

export default class ExportApi extends HttpClient {
    public constructor() {
        super(process.env.VUE_APP_API_URL as string);
    }

    public getExports(search: Search): Promise<any> {
        return this.instance.get("api/exports?" + search.toFilter())
            .then((x) => x.data);
    }

    async saveExport(facture: FactureTransfer): Promise<any> {
        return this.instance
            .post("api/export/add", facture)
            .then((x) => x.data);
    }

    async saveImport(facture: FactureTransfer): Promise<any> {
        return this.instance
            .post("api/import/add", facture)
            .then((x) => x.data);
    }

    deleteExport(id: number) {
        return this.instance.delete("api/facture/" + id)
            .then((x) => x.data);
    }

     deleteExportImport(id: number): Promise<any> {
        return this.instance.delete("api/facture_transfer/" + id)
            .then((x) => x.data);
    }

    async updateExport(facture: FactureTransfer) {
        return this.instance.put("api/export/put", facture)
            .then((x) => x.data);
    }
}
