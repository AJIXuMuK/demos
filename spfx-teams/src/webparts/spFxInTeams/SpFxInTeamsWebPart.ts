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

  protected async onInit(): Promise<any> {
    // check if we're in Teams context
    if (this.context.sdks.microsoftTeams) {
      // getting teams context
      this._teamsContext = this.context.sdks.microsoftTeams.context;
      // creating MS Graph client
      const client = await this.context.msGraphClientFactory.getClient();

      let response: any;

      if (this._teamsContext.groupId) {
      // requesting channel documents using Team's context properties: groupId, channelName
      const channelFolder = this._teamsContext.channelRelativeUrl.replace(`${this.context.pageContext.web.serverRelativeUrl}/Shared Documents`, '');
      response = await client
        .api(`/groups/${this._teamsContext.groupId}/drive/root:/${channelFolder}:/children`)
        .version('v1.0')
        .get();
      }
      else {
        // requesting documents from user's OneDrive
        response = await client
          .api(`/me/drive/root/children`)
          .version('v1.0')
          .get();
      }
      const docs = response.value as any[];
      this._channelDocuments = docs;
    }
  }

  public render(): void {
    const element: React.ReactElement<ISpFxInTeamsProps> = React.createElement(
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
