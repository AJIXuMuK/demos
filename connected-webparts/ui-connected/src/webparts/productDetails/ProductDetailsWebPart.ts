import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField
} from '@microsoft/sp-property-pane';

import * as strings from 'ProductDetailsWebPartStrings';
import ProductDetails from './components/ProductDetails';
import { IProductDetailsProps } from './components/IProductDetailsProps';
import { IProduct } from '../../common/model/IProduct';
import { DynamicProperty } from '@microsoft/sp-component-base';

export interface IProductDetailsWebPartProps {
  product: DynamicProperty<IProduct>;
}

export default class ProductDetailsWebPart extends BaseClientSideWebPart<IProductDetailsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProductDetailsProps > = React.createElement(
      ProductDetails,
      {
        product: this.properties.product.tryGetValue()
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
      'product': {
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
                PropertyPaneDynamicFieldSet({
                  label: 'Select a source',
                  fields: [
                    PropertyPaneDynamicField('product', {
                      label: 'Select a dynamic property'
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
