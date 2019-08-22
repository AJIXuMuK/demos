import { IProduct } from '../../../common/model/IProduct';

export interface IProductDetailsProps {
  /**
   * Product to display details for
   */
  product: IProduct | undefined;
}
