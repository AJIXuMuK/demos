import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TeamsMeetingAppWebPartStrings';
import TeamsMeetingApp from './components/TeamsMeetingApp';
import { ITeamsMeetingAppProps } from './components/ITeamsMeetingAppProps';

export interface ITeamsMeetingAppWebPartProps {
  description: string;
}

export default class TeamsMeetingAppWebPart extends BaseClientSideWebPart<ITeamsMeetingAppWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITeamsMeetingAppProps> = React.createElement(
      TeamsMeetingApp,
      {
        pageContext: this.context.pageContext,
        teamsSdk: this.context.sdks.microsoftTeams,
        graphClientFactory: this.context.msGraphClientFactory
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
