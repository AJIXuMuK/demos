import { IProduct } from '../../../common/model/IProduct';

export interface IProductProps {
  /**
   * Products to be displayed in the component
   */
  products: IProduct[];
  /**
   * Handler for product selection
   */
  onProductSelected: (product: IProduct) => void;
}
