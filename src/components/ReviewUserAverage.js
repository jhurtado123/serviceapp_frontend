import React, {Component} from 'react';

class ReviewUserAverage extends Component {

  state = {
    average: 0,
  };

  componentDidMount() {
    this.getAverage();
  }

  getAverage = () => {
    const {user} = this.props;
    this.setState({
      average: user.review.reduce((acc, v) => acc + v.rating , 0) / user.review.length,
    });
  };

  printStars = () => {
    const {average} = this.state;
    let response = '';
    for (let i = 0; i < 5; i++) {
      response += i < average ? '★' : '☆';
    }
    return response;
  };

  render() {
    return (
      <span>{this.printStars()}</span>
    );
  }
}

export default ReviewUserAverage;