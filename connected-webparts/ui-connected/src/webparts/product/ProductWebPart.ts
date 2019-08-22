import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProductWebPartStrings';
import Product from './components/Product';
import { IProductProps } from './components/IProductProps';
import { IProduct } from '../../common/model/IProduct';

import { IDynamicDataPropertyDefinition, IDynamicDataCallables } from '@microsoft/sp-dynamic-data';

export interface IProductWebPartProps {
  description: string;
}

export default class ProductWebPart extends BaseClientSideWebPart<IProductWebPartProps> implements IDynamicDataCallables {

  private readonly _products: IProduct[] = [{
    id: 1,
    name: 'Surface Pro',
    price: 1499.00,
    amount: 10
  }, {
    id: 2,
    name: 'Macbook Pro',
    price: 2499.00,
    amount: 5
  }, {
    id: 3,
    name: 'Dell XPS',
    price: 1399.00,
    amount: 10
  }];

  private _selectedProduct: IProduct;

  protected onInit(): Promise<void> {
    // registering this web part as a data source
    this.context.dynamicDataSourceManager.initializeSource(this);

    return Promise.resolve();
  }

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

  /**
   * Returns all the property definitions that the DataSource will provide.
   */
  public getPropertyDefinitions(): IDynamicDataPropertyDefinition[] {
    // in our case the only property to be returned - product
    return [{
        id: 'product',
        title: 'Product'
      }];
  }

  /**
   * Given a property id, returns the value of the property.
   * @param propertyId id of the property to return value for
   */
  public getPropertyValue(propertyId: string): IProduct {
    // checking for "product" property id
    if (propertyId === 'product') {
      return this._selectedProduct;
    }

    throw new Error('bad propertyId');
  }

  private _onProductSelected(product: IProduct) {
    // save selected product
    this._selectedProduct = product;
    // notify Data Source Manager that "product" property has been changed
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
