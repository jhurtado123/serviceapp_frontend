import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import '../assets/css/views/home.scss';
import SearchBarWithFilters from "../components/SearchBarWithFilters";
import {withRouter} from 'react-router-dom';

class Home extends Component {

  state = {
    search: '',
    maxRadius: 10,
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
      console.log(this.state);
      history.push(
        {
          pathname: "/search",
          state: {...this.state}
        });
    });
  };

  render() {
    return (
      <BaseLayout>
        <SearchBarWithFilters placeholder={'Buscar'} handleChange={this.handleChange} {...this.state}/>
        <div className={'container home'}>
          <h1>Home</h1>
        </div>
      </BaseLayout>
    );
  }
}

export default withRouter(Home);