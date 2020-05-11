import React, {Component} from 'react';
import Lupa from '../assets/images/icons/lupa.png';
import '../assets/css/components/searchBarWithFilters.scss'
import categoriesApiClient from "../services/apiManager/categories";


class SearchBarWithFilters extends Component {

  state = {
    showFilters: false,
    categories: [],
  };

  toggleFiltersBox = () => {
    const {showFilters} = this.state;
    this.setState({
      showFilters: !showFilters,
    })
  };

  printCategories = () => {
    const {categories} = this.state;
    return categories.map((category, index) => <option key={index} value={category._id}>{category.name}</option>);
  };

  async componentDidMount() {
    try {
      const {data: categories} = await categoriesApiClient.getAllCategories();
      this.setState({
        categories: categories.categories,
      })
    } catch (e) {}
  }

  render() {
    const {showFilters} = this.state;
    const {searchValue, handleChange, placeholder, orderBy, maxPrice, category, maxRadius} = this.props;
    return (
      <React.Fragment>
        <div className={'search-bar'}>
          <img src={Lupa} alt=""/>
          <input type="text" name={'search'} value={searchValue} onChange={handleChange} placeholder={placeholder}/>
          <div className={'toggle-filters'} onClick={this.toggleFiltersBox}>Filtros</div>
        </div>
        <div className={'filters-box ' + (showFilters ? 'open' : '')}>
          <div className={'form-title'}>Filtros</div>
          <div className={'dual-form-group'}>
            <div className={'form-group'}>
              <label htmlFor="">Precio máximo</label>
              <input type="number" name={'maxPrice'} value={maxPrice} onChange={handleChange} min={'1'}/>
            </div>
            <div className={'form-group'}>
              <label htmlFor="">Distancia máxima</label>
              <input type="number" name={'maxRadius'} value={maxRadius} onChange={handleChange} min={'1'} max={'100'}/>
            </div>
          </div>
          <div className={'form-group'}>
            <label htmlFor="">Categoría</label>
            <select name="category" onChange={handleChange} value={category}>
              <option value={''}>Todas</option>
              {this.printCategories()}
            </select>
          </div>
          <div className={'form-title'}>Ordenar por</div>
          <div className={'order-by-options form-group'}>
            <div>
              <input type={'radio'} id={'distance'} name={'orderBy'} value={'distance'} defaultChecked onChange={handleChange}/>
              <label htmlFor={'distance'} className={'checkbox-pretty'}/>
              <label htmlFor={'distance'}>Distancia</label>
            </div>
            <div>
              <input type={'radio'} id={'price'} name={'orderBy'} value={'price'} onChange={handleChange}/>
              <label htmlFor={'price'} className={'checkbox-pretty'}/>
              <label htmlFor={'price'}>Precio</label>
            </div>
            <div>
              <input type={'radio'} id={'valorations'} name={'orderBy'} value={'valorations'} onChange={handleChange}/>
              <label htmlFor={'valorations'} className={'checkbox-pretty'}/>
              <label htmlFor={'valorations'}>Mejores valoraciones</label>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default SearchBarWithFilters;