import * as React from 'react';
import styles from './Image.module.scss';
import { IImageProps } from './IImageProps';
import { Image as ReactImage } from 'office-ui-fabric-react/lib/components/Image';
import { Label } from 'office-ui-fabric-react/lib/Label';

export default class Image extends React.Component<IImageProps, {}> {
  public render(): React.ReactElement<IImageProps> {
    return (
      <div className={ styles.image }>
        <Label>{this.props.imageTitle}</Label>
        <ReactImage src={this.props.imageUrl} />
      </div>
    );
  }
}
