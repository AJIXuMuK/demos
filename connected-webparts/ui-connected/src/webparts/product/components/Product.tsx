import * as React from 'react';
import styles from './Product.module.scss';
import { IProductProps } from './IProductProps';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';

export default class Product extends React.Component<IProductProps, {}> {
  public render(): React.ReactElement<IProductProps> {
    const {
      products,
      onProductSelected
    } = this.props;
    return (
      <div className={styles.product}>
        {!products && <div>no items</div>}
        {products &&
          <Dropdown
            label="Select a product"
            options={products.map(product => { return { key: product.id, text: product.name }; })}
            onChanged={option => {
              const product = products.filter(p => p.id === (option.key as number))[0];
              if (onProductSelected) {
                onProductSelected(product);
              }
            }}
          />
        }
      </div>
    );
  }
}
