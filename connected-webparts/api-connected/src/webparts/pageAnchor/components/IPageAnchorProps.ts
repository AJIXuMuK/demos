import { DisplayMode } from '@microsoft/sp-core-library';

export interface IPageAnchorProps {
  displayMode: DisplayMode;
  title: string;
  updateProperty: (value: string) => void;
}
