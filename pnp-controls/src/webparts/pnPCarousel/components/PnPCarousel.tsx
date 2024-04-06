import * as React from 'react';
import styles from './PnPCarousel.module.scss';
import { IPnPCarouselProps } from './IPnPCarouselProps';
import { SPHttpClient } from '@microsoft/sp-http';
import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { WebPartTitle } from '@pnp/spfx-controls-react/lib/WebPartTitle';
import {
  Carousel
} from '@pnp/spfx-controls-react/lib/Carousel';
import { Spinner, SpinnerSize, ImageFit } from '@fluentui/react';
import { ICarouselImageProps } from '@pnp/spfx-controls-react/lib/controls/carousel/CarouselImage';
export interface ICarouselImage {
  imageSrc: string;
  title?: string;
  description?: string;
  url?: string;
}

export interface IPnPCarouselState {
  images?: ICarouselImage[];
}

export default class PnPCarousel extends React.Component<
  IPnPCarouselProps,
  IPnPCarouselState
> {
  constructor(props: IPnPCarouselProps) {
    super(props);

    this.state = {};
  }

  public componentDidMount(): void {
    this.getImages(this.props)
      .then(() => {
        /* no-op; */
      })
      .catch(() => {
        /* no-op; */
      });
  }

  public componentWillReceiveProps(nextProps: IPnPCarouselProps): void {
    //
    // we need to get images if listId or siteUrl have been changed
    //
    if (
      nextProps.listId !== this.props.listId ||
      nextProps.siteUrl !== this.props.siteUrl
    ) {
      this.getImages(nextProps)
        .then(() => {
          /* no-op; */
        })
        .catch(() => {
          /* no-op; */
        });
    }
  }

  public render(): React.ReactElement<IPnPCarouselProps> {
    const { siteUrl, listId, title, displayMode, onConfigure, updateTitle } =
      this.props;

    return (
      <div className={styles.pnPCarousel}>
        <WebPartTitle
          displayMode={displayMode}
          title={title}
          updateProperty={updateTitle}
        />
        {(!siteUrl || !listId) && (
          <Placeholder
            iconName='Edit'
            iconText='Configure your web part'
            description='Please, enter site url and list id'
            buttonLabel='Configure'
            onConfigure={onConfigure}
          />
        )}
        {!!siteUrl && !!listId && this.getMainContent()}
      </div>
    );
  }

  private getMainContent = (): JSX.Element => {
    const { images } = this.state;

    if (images) {
      return (
        <Carousel
          element={images.map((image) => {
            return {
              ...image,
              key: image.imageSrc,
              imageFit: ImageFit.contain,
              showDetailsOnHover: true,
            } as ICarouselImageProps;
          })}
          isInfinite={true}
          indicatorStyle={{
            backgroundColor: '#000',
          }}
          contentHeight={400}
          pauseOnHover={true}
        />
      );
    } else {
      return <Spinner size={SpinnerSize.large} />;
    }
  };

  private getImages = async (props: IPnPCarouselProps): Promise<void> => {
    if (!props.siteUrl || !props.listId) {
      return;
    }

    const response = await this.props.spHttpClient.get(
      `${props.siteUrl}/_api/lists/getById('${props.listId}')/items?$expand=File`,
      SPHttpClient.configurations.v1
    );
    const jsonResponse = await response.json();

    const images: ICarouselImage[] = [];

    if (jsonResponse.value && jsonResponse.value.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      jsonResponse.value.forEach((v: any) => {
        images.push({
          imageSrc: v.File.ServerRelativeUrl,
          title: v.Title,
          description: v.Description,
          url: v.Url.Url,
        });
      });
    }

    this.setState({
      images: images,
    });
  };
}
