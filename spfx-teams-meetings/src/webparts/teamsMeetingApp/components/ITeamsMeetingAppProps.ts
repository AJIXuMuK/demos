import { PageContext } from '@microsoft/sp-page-context';
import { IMicrosoftTeams } from '@microsoft/sp-webpart-base';
import { MSGraphClientFactory } from '@microsoft/sp-http';

export interface ITeamsMeetingAppProps {
  pageContext: PageContext;
  teamsSdk?: IMicrosoftTeams;
  graphClientFactory: MSGraphClientFactory;
}
