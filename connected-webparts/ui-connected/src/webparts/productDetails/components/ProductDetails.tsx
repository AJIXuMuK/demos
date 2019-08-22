import * as React from 'react';
import styles from './ProductDetails.module.scss';
import { IProductDetailsProps } from './IProductDetailsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ProductDetails extends React.Component<IProductDetailsProps, {}> {
  public render(): React.ReactElement<IProductDetailsProps> {
    const {
      product
    } = this.props;
    return (
      <div className={styles.productDetails}>
        {!product && <div className={styles.noItem}>No product selected</div>}
        {product &&
          <div className={styles.product}>
            <div className={styles.prop}>
              <div className={styles.title}>ID:</div>
              <div className={styles.value}>{product.id}</div>
            </div>
            <div className={styles.prop}>
              <div className={styles.title}>Name:</div>
              <div className={styles.value}>{product.name}</div>
            </div>
            <div className={styles.prop}>
              <div className={styles.title}>price:</div>
              <div className={styles.value}>${product.price}</div>
            </div>
            <div className={styles.prop}>
              <div className={styles.title}>Amount in stock:</div>
              <div className={styles.value}>{product.amount}</div>
            </div>
          </div>}
      </div>
    );
  }
}
