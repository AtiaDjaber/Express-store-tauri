export default class Stock {
    product: Stock;
    id?: number;
    name?: string;
    barcode?: string;
    quantity_alert?: number;
    sell_price?: number=0;
    sell_price2?:number=0;
    price?: number=0;
    quantity?: number=0;
    count?: number;
    photo?: string;
    type?: string;
    created_at?: Date;
    updated_at?: Date;
    Percentage?:number=0;
}
