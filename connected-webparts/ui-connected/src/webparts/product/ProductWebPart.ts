import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart
} from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';

import * as strings from 'ProductWebPartStrings';
import Product from './components/Product';
import { IProductProps } from './components/IProductProps';
import { IProduct } from '../../common/model/IProduct';

import { IDynamicDataCallables, IDynamicDataPropertyDefinition } from '@microsoft/sp-dynamic-data';

export interface IProductWebPartProps {
  description: string;
}

export default class ProductWebPart extends BaseClientSideWebPart<IProductWebPartProps> implements IDynamicDataCallables {
  public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {
    return [{
      id: 'product',
      title: 'Product'
    }];
  }
  public getPropertyValue(propertyId: string): IProduct {
    if (propertyId === 'product') {
      return this._selectedProduct;
    }

    throw new Error(`We did not recognize the property id`);
  }

  public onInit(): Promise<void> {
    this.context.dynamicDataSourceManager.initializeSource(this);

    return Promise.resolve();
  }

  private readonly _products: IProduct[] = [{
    id: 1,
    name: 'Surface Pro',
    price: 1499.00,
    amount: 10,
    imageUrl: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE2wleV'
  }, {
    id: 2,
    name: 'Macbook Pro',
    price: 2499.00,
    amount: 5,
    imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp15touch-space-select-201807?wid=904&hei=840&fmt=jpeg&qlt=80&op_usm=0.5,0.5&.v=1529520056969'
  }, {
    id: 3,
    name: 'Dell XPS',
    price: 1399.00,
    amount: 10,
    imageUrl: 'https://i.dell.com/is/image/DellContent//content/dam/global-site-design/product_images/dell_client_products/notebooks/xps_notebooks/xps_15_7590/pdp/laptops-xps-15-7590-pdp-mod2.jpg?fmt=jpg'
  }];

  private _selectedProduct: IProduct;

  public render(): void {
    const element: React.ReactElement<IProductProps> = React.createElement(
      Product,
      {
        products: this._products,
        onProductSelected: product => { this._onProductSelected(product); }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _onProductSelected(product: IProduct) {
    this._selectedProduct = product;

    this.context.dynamicDataSourceManager.notifyPropertyChanged('product');
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
