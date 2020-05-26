import React, {Component} from 'react';
import '../assets/css/components/headerWithTitle.scss';
import {withRouter} from 'react-router-dom';
import backIcon from '../assets/images/icons/back-white.png';

class HeaderWithTitle extends Component {
  render() {
    const {title, history} = this.props;
    return (
      <React.Fragment>
      <header className={'header-with-title'}>
        <img src={backIcon} alt="" onClick={history.goBack}/>
        <h2>{title}</h2>
      </header>
        <div className={'separator'}/>
      </React.Fragment>
    );
  }
}

export default withRouter(HeaderWithTitle);