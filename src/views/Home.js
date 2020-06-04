import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import '../assets/css/views/home.scss';
import SearchBarWithFilters from "../components/SearchBarWithFilters";
import CategoriesHome from "../components/CategoriesHome";
import BestAds from "../components/BestAds";
import {withRouter} from 'react-router-dom';
import {withAuth} from "../context/AuthContext";
import AdRecentlyView from "../components/AdRecentlyView";

class Home extends Component {

  state = {
    search: '',
    maxRadius: 10000,
    maxPrice: '',
    ads: [],
    orderBy: 'distance',
    category: '',
    isMapShown: false,
  };

  handleChange = (e) => {
    const {history} = this.props;
    this.setState({
      [e.target.name]: e.target.value,
    }, () => {
      history.push(
        {
          pathname: "/search",
          state: {...this.state}
        });
    });
  };
  handleCategoryClick = (id) => {
    const {history} = this.props;
    this.setState({
      category: id,
    }, () => {
      history.push(
        {
          pathname: "/search",
          state: {...this.state}
        });
    });
  };

  render() {
    const {user} = this.props;
    return (
      <BaseLayout>
        <SearchBarWithFilters placeholder={'Buscar'} handleChange={this.handleChange} {...this.state}/>
        <div className={'container home'}>
          <p className="section-title-home">Categorías más populares</p>
          <CategoriesHome title="Categorías más populares" handleCategoryClick={this.handleCategoryClick}/>
          <p className="section-title-home">Los mejor valorados</p>
          <BestAds stateFromHome={this.props.location.state}/>
          {
            user &&
            <React.Fragment>
              <p className="section-title-home">Últimamente has visto</p>
              <AdRecentlyView/>
            </React.Fragment>
          }

        </div>
      </BaseLayout>
    );
  }
}

export default withRouter(withAuth(Home));