import HttpClient from "./httpClient";
import Facture from "@/classes/facture";
import FactureTransfer from "@/classes/facture_transfer";
import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";

export default class ExportApi  {
  

    public getExports(search: Search): Promise<any> {
        return axiosModule.instance.get("api/exports?" + search.toFilter())
            .then((x) => x.data);
    }

    async saveExport(facture: FactureTransfer): Promise<any> {
        return axiosModule.instance
            .post("api/export/add", facture)
            .then((x) => x.data);
    }

    async saveImport(facture: FactureTransfer): Promise<any> {
        return axiosModule.instance
            .post("api/import/add", facture)
            .then((x) => x.data);
    }

    deleteExport(id: number) {
        return axiosModule.instance.delete("api/facture/" + id)
            .then((x) => x.data);
    }

     deleteExportImport(id: number): Promise<any> {
        return axiosModule.instance.delete("api/facture_transfer/" + id)
            .then((x) => x.data);
    }

    async updateExport(facture: FactureTransfer) {
        return axiosModule.instance.put("api/export/put", facture)
            .then((x) => x.data);
    }
}
