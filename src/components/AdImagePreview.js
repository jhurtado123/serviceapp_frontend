import React, {Component} from 'react';
import '../assets/css/components/adImagePreview.scss';

class AdImagePreview extends Component {

  getImageUrl() {
    const {ad} = this.props;
    const baseURL = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages`;
    if (ad.images.length) {
      return `${baseURL}/${ad._id}/${ad.images[0]}`;
    }

    return `${baseURL}/categories/${ad.category.default_image}`;
  }

  render() {
    const {small} = this.props;
    return (
      <div className={'ad-preview-image ' + (small && ' small')} style={{
        backgroundImage: "url(" + this.getImageUrl() + ")",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }}/>
    );
  }
}

export default AdImagePreview;