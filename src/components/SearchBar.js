import React, {Component} from 'react';
import Lupa from '../assets/images/icons/lupa.png';
import '../assets/css/components/searchBar.scss'

class SearchBar extends Component {
  render() {
    const {searchValue, handleChange, placeholder} = this.props;
    return (
      <div className={'search-bar'}>
        <img src={Lupa} alt=""/>
        <input type="text" name={'search'} value={searchValue} onChange={handleChange} placeholder={placeholder}/>
      </div>
    );
  }
}

export default SearchBar;