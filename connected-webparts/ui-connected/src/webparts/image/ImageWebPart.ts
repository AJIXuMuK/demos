import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDynamicFieldSet,
  PropertyPaneDynamicField,
  IWebPartPropertiesMetadata
} from '@microsoft/sp-webpart-base';

import * as strings from 'ImageWebPartStrings';
import Image from './components/Image';
import { IImageProps } from './components/IImageProps';
import { DynamicProperty } from '@microsoft/sp-component-base';
import { DynamicDataSharedDepth } from '@microsoft/sp-property-pane';

export interface IImageWebPartProps {
  imageUrl: DynamicProperty<string>;
}

export default class ImageWebPart extends BaseClientSideWebPart<IImageWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IImageProps> = React.createElement(
      Image,
      {
        imageUrl: this.properties.imageUrl.tryGetValue()
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
      'imageUrl': {
        dynamicPropertyType: 'string'
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
              // let user decide if he wants to connect to the data source
              primaryGroup: {
                groupName: strings.BasicGroupName,
                groupFields: [
                  PropertyPaneTextField('imageUrl', {
                    label: strings.DescriptionFieldLabel
                  })
                ]
              },
              secondaryGroup: {
              groupName: strings.BasicGroupName,
              groupFields: [
                // defining field set to be able to select a source
                PropertyPaneDynamicFieldSet({
                  label: 'Select product source',
                  fields: [
                    // we have the only field to store product value
                    PropertyPaneDynamicField('imageUrl', {
                      label: strings.DescriptionFieldLabel
                    })
                  ],
                  sharedConfiguration: {
                    depth: DynamicDataSharedDepth.Property // we're interested in single property from the source
                  }
                })
              ]
            },
            showSecondaryGroup: !!this.properties.imageUrl.tryGetSource()
          }
      ]
    }
      ]
  };
}
}
