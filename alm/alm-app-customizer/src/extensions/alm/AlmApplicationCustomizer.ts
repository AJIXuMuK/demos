import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer, PlaceholderContent, PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'AlmApplicationCustomizerStrings';

import styles from './AlmApplicationCustomizer.module.scss';

const LOG_SOURCE: string = 'AlmApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IAlmApplicationCustomizerProperties {
  // This is an example; replace with your own property: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class AlmApplicationCustomizer
  extends BaseApplicationCustomizer<IAlmApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    // Added to handle possible changes on the existence of placeholders.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholder);

    // Call render method for generating the HTML elements.
    this._renderPlaceholder();
    return Promise.resolve();
  }

  private _renderPlaceholder() {
    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Top) was not found.');
        return;
      }
    }

    if (this._topPlaceholder.domElement) {
      this._topPlaceholder.domElement.innerHTML = `
      <div class="${styles.app}">
        <div class="ms-bgColor-themeDark ms-fontColor-white ${styles.top}">
          <i class="ms-Icon ms-Icon--Info" aria-hidden="true"></i>Hello everyone! I was added using ALM API!
        </div>
      </div>`;
    }

  }

  private _onDispose() {
  }
}
