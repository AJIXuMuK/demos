import { DisplayMode } from "@microsoft/sp-core-library";
import { SPHttpClient } from '@microsoft/sp-http';


export interface IPnPCarouselProps {
  /**
   * Site where the document library with carousel images is located
   */
  siteUrl: string | undefined;
  /**
   * Carousel images Document library id
   */
  listId: string | undefined;
  /**
   * Web part's title
   */
  title: string | undefined;
  /**
   * Page display mode
   */
  displayMode: DisplayMode;
  /**
   * Event handler for PnP Placeholder
   */
  onConfigure: () => void;
  /**
   * Event handler for PnP WebPartTitle
   */
  updateTitle: (title: string) => void;
  /**
   * Http client to communicate with SharePoint
   */
  spHttpClient: SPHttpClient;
}
