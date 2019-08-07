import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
} from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'SpFxInTeamsWebPartStrings';
import SpFxInTeams from './components/SpFxInTeams';
import { ISpFxInTeamsProps } from './components/ISpFxInTeamsProps';
import * as microsoftTeams from '@microsoft/teams-js';

export interface ISpFxInTeamsWebPartProps {
  description: string;
}

export default class SpFxInTeamsWebPart extends BaseClientSideWebPart<ISpFxInTeamsWebPartProps> {

  // teams context
  private _teamsContext: microsoftTeams.Context;
  // channel docs
  private _channelDocuments: any[];

  protected onInit(): Promise<any> {
    let retVal: Promise<any> = Promise.resolve();
    // check if we're in Teams context
    if (this.context.microsoftTeams) {
      // creating a promise to be returned
      retVal = new Promise((resolve, reject) => {
        // getting Teams context
        this.context.microsoftTeams.getContext(context => {
          this._teamsContext = context;
          // creating MS Graph client
          this.context.msGraphClientFactory.getClient().then(client => {
            // requesting channel documents using Team's context properties: groupId, channelName
            client
              .api(`/groups/${this._teamsContext.groupId}/drive/root:/${this._teamsContext.channelName}:/children`)
              .version('v1.0')
              .get().then(response => {
                const docs = response.value as any[];
                this._channelDocuments = docs;
                resolve();
              });
          });
        });
      });
    }
    return retVal;
  }

  public render(): void {
    const element: React.ReactElement<ISpFxInTeamsProps > = React.createElement(
      SpFxInTeams,
      {
        description: this.properties.description,
        documents: this._channelDocuments
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
