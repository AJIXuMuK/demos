import * as React from 'react';
import styles from './TeamsMeetingApp.module.scss';
import { ITeamsMeetingAppProps } from './ITeamsMeetingAppProps';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';

export type TabType = 'team' | 'personal' | 'meeting' | 'none';

interface IProperty {
  key: string;
  value: string;
}

export interface ITeamsMeetingAppState {
  requestingData?: boolean;
  dataRequested?: boolean;
  tabType: TabType;
  additionalInfo?: IProperty[];
}

export default class TeamsMeetingApp extends React.Component<ITeamsMeetingAppProps, ITeamsMeetingAppState> {
  constructor(props: ITeamsMeetingAppProps) {
    super(props);

    let tabType: TabType = 'none';

    if (props.teamsSdk) {
      const teamsContext = props.teamsSdk.context;

      if (teamsContext.groupId) {
        tabType = 'team';
      }
      else if (teamsContext.meetingId) {
        tabType = 'meeting';
      }
      else {
        tabType = 'personal';
      }
    }

    this.state = {
      tabType: tabType
    };
  }

  public render(): React.ReactElement<ITeamsMeetingAppProps> {
    return (
      <div className={styles.teamsMeetingApp}>
        {this.getSharePointContextElement()}
        {this.getTeamsContextElement()}
      </div>
    );
  }

  private getSharePointContextElement = (): React.ReactNode => {
    const {
      pageContext
    } = this.props;

    const properties: IProperty[] = [{
      key: 'Site Url',
      value: pageContext.web.absoluteUrl
    }, {
      key: 'Current User',
      value: pageContext.user.displayName
    }];

    return <div>
      <h2>SharePoint Context Data:</h2>
      <Stack>
        {this.renderProperties(properties)}
      </Stack>
    </div>;
  }

  private getTeamsContextElement = (): React.ReactNode => {
    const {
      teamsSdk
    } = this.props;

    const {
      requestingData,
      dataRequested
    } = this.state;


    if (!teamsSdk) {
      return <></>;
    }

    const teamsContext = teamsSdk.context;
    const properties: IProperty[] = [];

    //
    // we could use tabType from state here, but for clarity purposes will use context properties
    //
    if (teamsContext.groupId) { // Channel Tab
      properties.push(...[{
        key: 'Tab Type',
        value: 'Team Tab'
      }, {
        key: 'Grouop Id',
        value: teamsContext.groupId
      }, {
        key: 'Channel Name',
        value: teamsContext.channelName
      }, {
        key: 'Channel Type',
        value: teamsContext.channelType
      }]);
    }
    else if (teamsContext.meetingId) { // meeting app
      properties.push(...[{
        key: 'Tab Type',
        value: 'Meeting App'
      }, {
        key: 'Meeting Id',
        value: teamsContext.meetingId
      }, {
        key: 'Chat Id',
        value: teamsContext.chatId
      }]);
    }
    else { // personal app
      properties.push(...[{
        key: 'Tab Type',
        value: 'Personal App'
      }, {
        key: 'User Id',
        value: teamsContext.userObjectId
      }]);
    }

    return <div>
      <h2>Teams Context Data:</h2>
      <Stack>
        {this.renderProperties(properties)}
      </Stack>
      <div>
        <PrimaryButton text={'Request additional info'} disabled={requestingData || dataRequested} onClick={this.onRequestInfoClick} />
      </div>
      {!!this.state.additionalInfo &&
        <div>
          <h3>Additional Info</h3>
          <Stack>
            {this.renderProperties(this.state.additionalInfo)}
          </Stack>
        </div>}
    </div>;
  }

  private renderProperties = (properties: IProperty[]): React.ReactNode[] => {
    return properties.map(p => {
      return <Stack.Item>
        <Stack horizontal>
          <Stack.Item className={styles.key}>
            {p.key}
          </Stack.Item>
          <Stack.Item>
            {p.value}
          </Stack.Item>
        </Stack>
      </Stack.Item>;
    });
  }

  private onRequestInfoClick = async (): Promise<void> => {
    this.setState({
      requestingData: true
    });

    const {
      graphClientFactory,
      teamsSdk
    } = this.props;

    const graphClient = await graphClientFactory.getClient();
    const teamsContext = teamsSdk.context;
    console.log(this.state);

    const additionalInfo: IProperty[] = [];

    switch (this.state.tabType) {
      case 'team':
        break;
      case 'personal':
        break;
      case 'meeting':

        const meetingChatInfo = await graphClient.api(`/chats/${teamsContext.chatId}`).version('beta').get();

        if (meetingChatInfo && meetingChatInfo.onlineMeetingInfo) {
          const meetingInfo = await graphClient.api(`/me/onlineMeetings?$filter=JoinWebUrl%20eq%20'${encodeURIComponent(meetingChatInfo.onlineMeetingInfo.joinWebUrl)}'`).version('v1.0').get();

          if (meetingInfo && meetingInfo.value && meetingInfo.value.length > 0) {
            const mInfo = meetingInfo.value[0];

            additionalInfo.push({
              key: 'Meeting Title',
              value: mInfo.subject
            });
            additionalInfo.push({
              key: 'Start Date & Time',
              value: mInfo.startDateTime
            });
          }
        }
        break;
    }

    this.setState({
      additionalInfo: additionalInfo,
      requestingData: false,
      dataRequested: true
    });
  }
}
