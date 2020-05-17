import React, { Component } from 'react';
import adApiClient from "../services/apiManager/ad";
import CategoryPreview from "../components/CategoryPreview";
import SmallLoading from "../components/SmallLoading"; 
import '../assets/css/views/home.scss';
import { Link } from 'react-router-dom';


const STATUS = {
  LOADING: "LOADING",
  LOADED: "LOADED",
};

class CategoriesHome extends Component {
  state = {
    categories: [],
    status: STATUS.LOADING,
  }

  componentDidMount = ()=> {
    this.getAllAds()
  }

  async getAllAds() {
    const {data: categories}  = await adApiClient.getAllAds()
    let bestCategories = []
    for (let i = 0; i < 6; i++) {
      const category = categories[i];
      bestCategories.push(category) 
    }
    this.setState({
      categories: bestCategories, 
      status: STATUS.LOADED,
    })    
  }


  displayBestCategories = () => {
    const { categories } = this.state; 
    if (typeof categories !== 'undefined' && categories.length > 0) {
    return categories.map((category, i)=> {
      return (
        <Link to={`/category/${category._id[0]._id}`} key={i} >
          <CategoryPreview  name={category._id[0].name} img={category._id[0].default_image} />
        </Link>
      )
    })
    }
  }

  render(){
    const { status } = this.state;
    // eslint-disable-next-line default-case
    switch (status) {
      case STATUS.LOADING:
        return (
          <div>
            <SmallLoading />
          </div>
        )
      case STATUS.LOADED:
        return (
          <div>
            <div className="category-preview-container">
              {this.displayBestCategories()}
            </div>
          </div>
        )
    }
  }
}

export default CategoriesHome; 