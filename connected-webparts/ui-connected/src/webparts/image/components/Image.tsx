import * as React from 'react';
import styles from './Image.module.scss';
import { IImageProps } from './IImageProps';
import { Image as ReactImage } from 'office-ui-fabric-react/lib/components/Image';

export default class Image extends React.Component<IImageProps, {}> {
  public render(): React.ReactElement<IImageProps> {
    return (
      <div className={ styles.image }>
        <ReactImage src={this.props.imageUrl} />
      </div>
    );
  }
}
