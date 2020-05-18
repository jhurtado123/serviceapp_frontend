import React, {Component} from 'react';
import '../assets/css/components/loadingBars.scss';

class LoadingBars extends Component {
  render() {
    return (
      <div className={'loading'}>
        <div id="loadFacebookG">
          <div id="blockG_1" className="facebook_blockG"></div>
          <div id="blockG_2" className="facebook_blockG"></div>
          <div id="blockG_3" className="facebook_blockG"></div>
        </div>
      </div>
    );
  }
}

export default LoadingBars;