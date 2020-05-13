import React, {Component} from 'react';
import '../../assets/css/views/ad/create.scss';
import adApiClient from '../../services/apiManager/ad';
import AdForm from "../../components/AdForm";
import {withAuth} from "../../context/AuthContext";
import REDIRECT from "../../errorRedirects";
import HeaderWithTitle from "../../components/HeaderWithTitle";


class AdCreate extends Component {

  handleSubmit = async (state) => {
    try {
      await adApiClient.createAd(state);
      this.props.history.push('/ads');
    } catch (error) {
      if (error.response) {
        if (error.response.data.data) {
          this.setState({
            error: error.response.data.data,
          });
        } else {
          this.props.history.push(REDIRECT[error.response.status]);
        }
        return;
      }
      this.props.history.push(REDIRECT[500]);
    }
  };


  render() {
    return (
      <React.Fragment>
        <HeaderWithTitle title={'Publicar anuncio'}/>
        <div className={'container'}>
          <AdForm onSubmit={this.handleSubmit} usePersonalAddress={true}/>
        </div>
      </React.Fragment>
    );
  }
}

export default withAuth(AdCreate);