export interface Order {
  _id: string;
  userId: string;
  items: {
    productId: string;
    image: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  active: number;
  code: String;
}
