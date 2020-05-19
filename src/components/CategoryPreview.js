import React, { Component } from 'react';
import '../assets/css/views/home.scss';

class CategoryPreview extends Component{
  
  getImageUrl() {
    const { img } = this.props;
    const baseURL = `${process.env.REACT_APP_BACKEND_URI}/uploads/adImages/categories`;
      return `${baseURL}/${img}`;
  }

  render(){
    const {name, handleCategoryClick, id} = this.props;
    return(
      <div className="category-preview"  onClick={() => handleCategoryClick(id)}>
        <div className={'category-preview-img small'} style={{
          backgroundImage: "url(" + this.getImageUrl() + ")",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          borderRadius: "15px",
          width: '130px'
        }} />
        <div className="category-preview-name-container">
          <p className="category-preview-name" >{name}</p>
        </div>
      </div>
    )
  }
}

export default CategoryPreview;