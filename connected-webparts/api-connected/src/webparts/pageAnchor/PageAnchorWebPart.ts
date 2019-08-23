import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import PageAnchor from './components/PageAnchor';
import { IPageAnchorProps } from './components/IPageAnchorProps';
import { IDynamicDataPropertyDefinition, IDynamicDataCallables, IDynamicDataSource } from '@microsoft/sp-dynamic-data';
import { IAnchorItem } from '../../common/IAnchorItem';

export interface IPageAnchorWebPartProps {
  title: string;
}

export default class PageAnchorWebPart extends BaseClientSideWebPart<IPageAnchorWebPartProps> implements IDynamicDataCallables {

  // anchor data object related to the current web part
  private _anchor: IAnchorItem;

  protected onInit(): Promise<void> {
    this._anchor = {};
    this.context.dynamicDataSourceManager.initializeSource(this);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IPageAnchorProps> = React.createElement(
      PageAnchor,
      {
        displayMode: this.displayMode,
        title: this.properties.title,
        updateProperty: newTitle => {
          this._anchor.title = newTitle;
          this.context.dynamicDataSourceManager.notifyPropertyChanged('anchor');
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  /**
   * implementation of getPropertyDefinitions from IDynamicDataCallables
   */
  public getPropertyDefinitions(): ReadonlyArray<IDynamicDataPropertyDefinition> {
    return [{
      id: 'anchor',
      title: 'Anchor'
    }];
  }

  /**
   * implementation of getPropertyValue from IDynamicDataCallables
   * @param propertyId property Id
   */
  public getPropertyValue(propertyId: string): IAnchorItem {
    switch (propertyId) {
      case 'anchor':
        return this._anchor;
    }

    throw new Error('Bad property id');
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
      ]
    };
  }
}
