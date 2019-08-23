import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'PageNavigationWebPartStrings';
import PageNavigation from './components/PageNavigation';
import { IPageNavigationProps } from './components/IPageNavigationProps';
import { IDynamicDataSource } from '@microsoft/sp-dynamic-data';
import { IAnchorItem } from '../../common/IAnchorItem';

export interface IPageNavigationWebPartProps {
  description: string;
}

export default class PageNavigationWebPart extends BaseClientSideWebPart<IPageNavigationWebPartProps> {

  // "Anchor" data sources
  private _dataSources: IDynamicDataSource[] = [];

  protected onInit(): Promise<void> {
    this._onAnchorChanged = this._onAnchorChanged.bind(this);
    this._availableSourcesChanged = this._availableSourcesChanged.bind(this);
    // getting data sources that have already been added on the page
    this._initDataSources();
    // registering for changes in available datasources
    this.context.dynamicDataProvider.registerAvailableSourcesChanged(this._availableSourcesChanged);

    return Promise.resolve();
  }

  public render(): void {

    const anchors = this._dataSources && this._dataSources.map(ds => ds.getPropertyValue('anchor') as IAnchorItem);

    const element: React.ReactElement<IPageNavigationProps> = React.createElement(
      PageNavigation,
      {
        anchors: anchors
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _availableSourcesChanged() {
    this._initDataSources(true);
  }

  /**
   * Initializes collection of "Anchor" data soures based on collection of existing page's data sources
   * @param reRender specifies if the web part should be rerendered
   */
  private _initDataSources(reRender?: boolean) {
    // all data sources on the page
    const availableDataSources = this.context.dynamicDataProvider.getAvailableSources();

    if (availableDataSources && availableDataSources.length) {
      // "Ahchor" data sources cached in the web part from prev call
      const dataSources = this._dataSources;
      //
      // removing deleted data sources if any
      //
      const availableDataSourcesIds = availableDataSources.map(ds => ds.id);
      for (let i = 0, len = dataSources.length; i < len; i++) {
        let dataSource = dataSources[i];
        if (availableDataSourcesIds.indexOf(dataSource.id) == -1) {
          dataSources.splice(i, 1);
          try {
            this.context.dynamicDataProvider.unregisterPropertyChanged(dataSource.id, 'anchor', this._onAnchorChanged);
          }
          catch (err) { }
          i--;
          len--;
        }
      }

      //
      // adding new data sources
      //
      for (let i = 0, len = availableDataSources.length; i < len; i++) {
        let dataSource = availableDataSources[i];
        if (!dataSource.getPropertyDefinitions().filter(pd => pd.id === 'anchor').length) {
          continue; // we don't need data sources other than anchors
        }
        if (!dataSources || !dataSources.filter(ds => ds.id === dataSource.id).length) {
          dataSources.push(dataSource);
          this.context.dynamicDataProvider.registerPropertyChanged(dataSource.id, 'anchor', this._onAnchorChanged);
        }
      }
    }

    if (reRender) {
      this.render();
    }
  }

  /**
   * Fired when any of anchors has been changed
   */
  private _onAnchorChanged() {
    this.render();
  }

  protected onDispose(): void {

    this.context.dynamicDataProvider.unregisterAvailableSourcesChanged(this._availableSourcesChanged);
    if (this._dataSources) {
      this._dataSources.forEach(ds => {
        this.context.dynamicDataProvider.unregisterPropertyChanged(ds.id, 'anchor', this._onAnchorChanged);
      });
      delete this._dataSources;
    }

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
