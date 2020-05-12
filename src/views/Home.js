import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";
import '../assets/css/views/home.scss';

class Home extends Component {
  render() {
    return (
      <BaseLayout>
        <div className={'container home'}>
          <h1>Home</h1>
        </div>
      </BaseLayout>
    );
  }
}

export default Home;