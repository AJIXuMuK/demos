import { IProduct } from '../../../common/model/IProduct';

export interface IProductProps {
  products: IProduct[];
  onProductSelected: (product: IProduct) => void;
}
