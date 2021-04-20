import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField } from "@microsoft/sp-property-pane";

import * as strings from 'TasksWebPartStrings';
import Tasks from './components/Tasks/Tasks';
import { ITasksProps } from './components/Tasks/ITasksProps';
import { TaskDetails } from './components/TaskDetails/TaskDetails';
import { ITaskDetailsProps, ITask } from '../../common/Model';
import { SPComponentLoader } from '@microsoft/sp-loader';

export interface ITasksWebPartProps {
  componentId: string;
}

export default class TasksWebPart extends BaseClientSideWebPart<ITasksWebPartProps> {

  private readonly tasks: ITask[] = [{
    id: 1,
    title: 'Prepare session slides',
    description: 'Prepare slides for React Templates session',
    priority: 'High',
    status: 'Resolved'
  }, {
    id: 2,
    title: 'Prepare session demo',
    description: 'Prepare demo for React Templates session',
    priority: 'High',
    status: 'Resolved'
  }, {
    id: 3,
    title: 'Deliver the session',
    description: 'Deliver the best session ever!',
    priority: 'High',
    status: 'Active'
  }];

  public async render(): Promise<void> {
    // by default we're using task details component from the web part
    let taskDetailsComponent: React.ComponentClass<ITaskDetailsProps> = TaskDetails;
    if (this.properties.componentId) { // if component id is specified
      // loading the module
      const module: any = await SPComponentLoader.loadComponentById(this.properties.componentId);
      // getting task details component from the modlue
      taskDetailsComponent = module.TaskDetails as React.ComponentClass<ITaskDetailsProps>;
    }

    const element: React.ReactElement<ITasksProps> = React.createElement(
      Tasks,
      {
        tasks: this.tasks,
        taskDetails: taskDetailsComponent // component to use to render task details
      }
    );

    ReactDom.render(element, this.domElement);
    this.renderCompleted();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get isRenderAsync(): boolean {
    return true;
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
                PropertyPaneTextField('componentId', {
                  label: strings.ComponentIdFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
