import React, {Component} from 'react';
import ReactSimpleImageSlider from "react-simple-image-slider";

class AdImages extends Component {

  getImages() {
    const {ad} = this.props;
    if (ad.images.length) {
      console.log(ad.images);
      return ad.images.map(image => {
        return {
          url: `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/${ad._id}/${image}`
        }
      });
    }
    return [{
      url: `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/categories/${ad.category.default_image}`,
    }]
  }

  render() {
    return (
      <React.Fragment>
        <ReactSimpleImageSlider width={'100%'} height={231} navStyle={1} bgColor={'white'} images={this.getImages()}/>
      </React.Fragment>
    );
  }
}

export default AdImages;