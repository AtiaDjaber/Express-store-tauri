import Stock from "@/classes/stock";
import Search from "@/classes/search";
import axiosModule from "@/store/axiosModule";
import Favorite from "@/classes/favorite";
import axios, { AxiosResponse } from "axios";
import Damage from "@/classes/damage";

export default class stockApi {
  static async getStock(search?: Search): Promise<any> {
    return await axiosModule.instance.get("api/products?" + search.toFilter());
  }

  static async getDiver(): Promise<any> {
    return await axiosModule.instance.get("api/divers");
  }
  static async getAllStock(search?: Search): Promise<AxiosResponse> {
    return await axiosModule.instance.get(
      "api/products/all?" + search.toFilter()
    );
  }

  static async getAllStockExport(): Promise<AxiosResponse> {
    return await axiosModule.instance.get("api/products/export");
  }

  static async getProductsDepot(search?: Search): Promise<any> {
    return await axiosModule.instance.get(
      "api/product_depot?" + search.toFilter()
    );
  }

  static async getBarcode(resource = "products"): Promise<any> {
    return await axiosModule.instance.get(
      "api/product/generate?table=" + resource
    );
  }

  static async saveStock(stock: Stock): Promise<any> {
    return await axiosModule.instance.post("api/product/add", stock);
  }

  static async saveManyStock(stock: Stock[]): Promise<any> {
    return await axiosModule.instance.post("api/product/add_many", stock);
  }

  static deleteStock(id: number) {
    const deleteStock = axiosModule.instance
      .delete<any>("api/product/" + id)
      .then((x) => x.data);
    return deleteStock;
  }

  static async updateStock(stock: Stock) {
    return axiosModule.instance.put<Stock>("api/product/put", stock);
  }

  static async getFav(): Promise<any> {
    return await axiosModule.instance.get("api/favorites");
  }

  static async saveFav(favorite: Favorite): Promise<any> {
    return await axiosModule.instance.post("api/favorite/add", favorite);
  }
  static async updateFav(favorite: Favorite) {
    return axiosModule.instance.put("api/favorite/put", favorite);
  }

  static async attachProductToFavorite(favorite: Favorite, stock: Stock) {
    return axiosModule.instance.post(
      "api/favorite/add-product/" + favorite.id + "/" + stock.id,
      stock
    );
  }

  static async detachProductFromFavorite(favorite: Favorite, stock: Stock) {
    return axiosModule.instance.post(
      "api/favorite/remove-product/" + favorite.id + "/" + stock.id,
      {}
    );
  }

  static async uploadImage(formData: FormData) {
    const res = await axiosModule.instance
      .post("api/product/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((e) => {
        console.log(e);
      });
    return res;
  }

  static deleteFavorite(id: number) {
    const deleteStock = axiosModule.instance
      .delete("api/favorite/" + id)
      .then((x) => x.data);
    return deleteStock;
  }

  static async getDamages(search?: Search): Promise<any> {
    return await axiosModule.instance.get("api/damages?" + search.toFilter());
  }

  static deleteDamage(id: number) {
    const deleted = axiosModule.instance
      .delete("api/damages/" + id)
      .then((x) => x.data);
    return deleted;
  }

  static async saveDamage(damage: Damage): Promise<any> {
    return await axiosModule.instance.post("api/damage/add", damage);
  }

  static deleteBarcode(id: number) {
    const deleted = axiosModule.instance
      .delete("api/barcode/" + id)
      .then((x) => x.data);
    return deleted;
  }
}
