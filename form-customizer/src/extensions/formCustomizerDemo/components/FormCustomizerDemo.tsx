import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';
import { DynamicForm } from '@pnp/spfx-controls-react/lib/DynamicForm';

import styles from './FormCustomizerDemo.module.scss';

export interface IFormCustomizerDemoProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'FormCustomizerDemo';

export default class FormCustomizerDemo extends React.Component<IFormCustomizerDemoProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: FormCustomizerDemo mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: FormCustomizerDemo unmounted');
  }

  public render(): React.ReactElement<{}> {
    if (this.props.displayMode === FormDisplayMode.Display) {
      return <div>Not supported</div>;
    }
    return <div className={styles.formCustomizerDemo}>
      <DynamicForm
        context={this.props.context as any} // eslint-disable-line @typescript-eslint/no-explicit-any
        listId={this.props.context.list.guid.toString()}
        listItemId={this.props.context.itemId}
        onSubmitted={this.props.onSave}
        onCancelled={this.props.onClose}
      />
    </div>;
  }
}
