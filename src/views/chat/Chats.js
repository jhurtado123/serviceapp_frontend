import React, {Component} from 'react';
import BaseLayout from "../layouts/BaseLayout";
import SearchBar from "../../components/SearchBar";
import chatApiClient from "../../services/apiManager/chat";
import ChatBox from "../../components/ChatBox";
import {Link} from "react-router-dom";
import '../../assets/css/views/chat/chats.scss';
import LoadingBars from "../../components/LoadingBars";

class Chats extends Component {
  state = {
    isLoading: true,
    search: '',
    chats: [],
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  };

  async componentDidMount() {
    try {
      const {data: {response}} = await chatApiClient.getChats();
      this.setState({
        chats: response,
        isLoading: false,
      })
    } catch (e) {
    }
  }

  printChats = () => {
    const {chats, search} = this.state;

    return chats.map((chat, index) => {
      if (chat.chat.ad.name.toLowerCase().includes(search.toLowerCase()) || !search)
        return <ChatBox chatWrap={chat} key={index}/>
    });
  };

  render() {
    const {search, chats, isLoading} = this.state;
    return (
      <BaseLayout>
        <SearchBar handleChange={this.handleChange} searchValue={search} placeholder={'Buscar chats'}/>
        {
          isLoading ? <LoadingBars/> :
            chats.length ?
              <div className={'chats-list-container container'}>
                {this.printChats()}
              </div> :
              <div className={'page-message'}>
                <p>¡No tienes chats activos!</p>
                <Link to={'/'} className={'button-bck-purple'}>Volver a la home</Link>
              </div>
        }
      </BaseLayout>
    );
  }
}

export default Chats;