import React, {Component} from 'react';
import BaseLayout from "./layouts/BaseLayout";

class Home extends Component {
  render() {
    return (
      <BaseLayout>
        <div className={'container'}>
          <h1>Home</h1>
        </div>
      </BaseLayout>
    );
  }
}

export default Home;