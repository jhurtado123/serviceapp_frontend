import React, {Component} from 'react';
import HeaderWithTitle from "../components/HeaderWithTitle";
import ReactCreditCards from "react-credit-cards";
import 'react-credit-cards/es/styles-compiled.css';
import '../assets/css/views/buyTokens.scss';
import Token from '../assets/images/icons/coin2.svg';
import profileApiClient from "../services/apiManager/profile";
import {withAuth} from "../context/AuthContext";
import REDIRECT from "../errorRedirects";
import {Link} from "react-router-dom";
import LoadingBars from "../components/LoadingBars";
import settingsApiClient from "../services/apiManager/settings";

class BuyTokens extends Component {

  state = {
    cvc: '789',
    expiry: '1022',
    focus: '',
    name: 'Carlos Test',
    number: '4444444444444444',
    showStep2: false,
    tokens: 5,
    showSuccess: false,
    serkenPriceEuros: 0,
    isLoading: true,
  };

  step2 = React.createRef();

  handleInputFocus = (e) => {
    this.setState({focus: e.target.name});
  };

  handleInputChange = (e) => {
    const {name, value} = e.target;

    this.setState({[name]: value});
  };
  handleStep2Show = () => {
    this.setState({
      showStep2: true,
    }, () => {
      this.step2.current.scrollIntoView({behavior: 'smooth'})
    });
  };

  async componentDidMount() {
    const {history} = this.props;
    try {
      const {data: {settingValue}} = await settingsApiClient.getValueFromKey('serkens_price_euros');
      this.setState({
        isLoading: false,
        serkenPriceEuros: parseFloat(settingValue.value),
      });

    } catch (e) {
      history.push(REDIRECT[500]);
    }
  }

  handleBuy = async () => {
    const {user, history} = this.props;
    const {tokens} = this.state;
    try {
      await profileApiClient.buyTokens(tokens);
      user.wallet.tokens = parseInt(user.wallet.tokens) + parseInt(tokens);
      this.setState({
        showSuccess: true,
      })
    } catch (e) {
      history.push(REDIRECT[500])
    }
  };

  render() {
    const {showStep2, tokens, cvc, name, number, expiry, showSuccess, serkenPriceEuros, isLoading} = this.state;
    const {history} = this.props;
    return (
      <React.Fragment>
        <HeaderWithTitle title={'Comprar Serkens'} history={history}/>
        {isLoading ? <LoadingBars/> :
        <div className={'buy-tokens-page container ' + (showSuccess ? 'hide' : '')}>
            <form>
              <div className={'step1'}>
                <div>Puedes comprar Serkens para poder contratar servicios.</div>
                <div>Si quieres evitar pagar por los Serkens puedes ofrecer tu servicios a la comunidad de vecinos
                  publicando
                  un anuncio
                </div>
                <div className={'current-tokens'}>
                  <div className={'tokens'}>{tokens} <img src={Token} alt={'serken'}/></div>
                  <div className={'euros'}>{(tokens * serkenPriceEuros).toFixed(2)} €</div>
                </div>
                <div className={'range'}>
                  <input type="range" name={'tokens'} min={5} max={10000}
                        value={tokens}
                        onChange={this.handleInputChange}/>
                </div>
                <div className={'continue-button button-bck-purple ' + (showStep2 ? 'hide' : '')}
                    onClick={this.handleStep2Show}>Continuar
                </div>
              </div>
              <div className={'step2 ' + (showStep2 ? 'show' : '')} ref={this.step2}>
                <ReactCreditCards
                  cvc={this.state.cvc}
                  expiry={this.state.expiry}
                  focused={this.state.focus}
                  name={this.state.name}
                  number={this.state.number}
                />
                <div className={'form-group'}>
                  <label>Número</label>
                  <input
                    type="tel"
                    name="number" value={number}
                    placeholder="Número de la tarjeta"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className={'form-group'}>
                  <label>Titular</label>
                  <input
                    type="tel"
                    name="anme" value={name}
                    placeholder="Titular"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className={'form-group'}>
                  <label>Fecha de expiración</label>
                  <input
                    type="tel" value={expiry}
                    name="expiry"
                    placeholder="Fecha de expiración"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <div className={'form-group'}>
                  <label>CVC</label>
                  <input
                    type="tel" value={cvc}
                    name="cvc"
                    placeholder="Card Number"
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus}
                  />
                </div>
                <table>
                  <thead>
                  <tr>
                    <th>Serkens</th>
                    <th>Precio/Euros</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td className={'gold'}>{tokens}</td>
                    <td className={'gold'}>{serkenPriceEuros}€</td>
                  </tr>
                  <tr>
                    <td className={'bold'}>Total</td>
                    <td rowSpan={2}>{(tokens * serkenPriceEuros).toFixed(2)}€</td>
                  </tr>
                  </tbody>
                </table>
                <div className={'button-bck-purple  buy-button'} onClick={this.handleBuy}>Comprar</div>
              </div>
            </form>
        </div>
        }
        <div className={'success-page container ' + (showSuccess ? 'show' : '')}>
          <div className={'page-message'}>
            <p>¡Compra realizada con éxito! Ya puedes volver a revisar los servicios disponibles</p>
            <Link to={'/'} className={'button-bck-purple'}>Volver a la home</Link>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withAuth(BuyTokens);