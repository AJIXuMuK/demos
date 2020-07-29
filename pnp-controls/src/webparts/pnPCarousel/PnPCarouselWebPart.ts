import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PnPCarouselWebPartStrings';
import PnPCarousel from './components/PnPCarousel';
import { IPnPCarouselProps } from './components/IPnPCarouselProps';

import { PropertyFieldSitePicker, IPropertyFieldSite } from '@pnp/spfx-property-controls/lib/PropertyFieldSitePicker';
import { PropertyFieldListPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface IPnPCarouselWebPartProps {
  sites?: IPropertyFieldSite[];
  listId?: string;
  title?: string;
}

export default class PnPCarouselWebPart extends BaseClientSideWebPart<IPnPCarouselWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPnPCarouselProps> = React.createElement(
      PnPCarousel,
      {
        siteUrl: this.properties.sites ? this.properties.sites[0].url : undefined,
        listId: this.properties.listId,
        title: this.properties.title,
        displayMode: this.displayMode,
        onConfigure: () => {
          this.context.propertyPane.open();
        },
        updateTitle: title => {
          this.properties.title = title;
        },
        spHttpClient: this.context.spHttpClient
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
                PropertyFieldSitePicker('sites', {
                  context: this.context,
                  properties: this.properties,
                  label: 'Select Site',
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  multiSelect: false,
                  initialSites: this.properties.sites,
                  key: 'sites'
                }),
                PropertyFieldListPicker('listId', {
                  context: this.context,
                  selectedList: this.properties.listId,
                  disabled: !this.properties.sites,
                  webAbsoluteUrl: this.properties.sites ? this.properties.sites[0].url : '',
                  properties: this.properties,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  key: 'listid',
                  baseTemplate: 101,
                  label: 'Select document library'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
