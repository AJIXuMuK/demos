import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';

import * as strings from 'ProductDetailsWebPartStrings';
import ProductDetails from './components/ProductDetails';
import { IProductDetailsProps } from './components/IProductDetailsProps';
import { IProduct } from '../../common/model/IProduct';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { PropertyPaneDynamicFieldSet, PropertyPaneDynamicField } from '@microsoft/sp-property-pane';

export interface IProductDetailsWebPartProps {
  /**
   * Registering product as a Dynamic Property
   */
  product: DynamicProperty<IProduct>;
}

export default class ProductDetailsWebPart extends BaseClientSideWebPart<IProductDetailsWebPartProps> {

  public render(): void {
    // here we're checking if the source for the property is defined and the value has been provided
    const element: React.ReactElement<IProductDetailsProps > = React.createElement(
      ProductDetails,
      {
        product: this.properties.product.tryGetSource() ? this.properties.product.tryGetValue() : undefined
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get propertiesMetadata(): IWebPartPropertiesMetadata {
    return {
      'product': { // product is a dynamic complex object property
        dynamicPropertyType: 'object'
      }
    };
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
                // defining field set to be able to select a source
                PropertyPaneDynamicFieldSet({
                  label: 'Select product source',
                  fields: [
                    // we have the only field to store product value
                    PropertyPaneDynamicField('product', {
                      label: 'Product source'
                    })
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
