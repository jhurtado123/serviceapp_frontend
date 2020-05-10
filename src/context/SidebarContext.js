import React, {Component} from 'react';

export const SidebarContext = React.createContext();

export const withSidebar = (Comp) => {
  return class WithSidebar extends Component {
    render() {
      return (
        <SidebarContext.Consumer>
          {({ isOpened, openMenu, closeMenu}) => {
            return (
              <Comp
                isOpened={isOpened}
                openMenu={openMenu}
                closeMenu={closeMenu}
                {...this.props}
              />
            );
          }}
        </SidebarContext.Consumer>
      );
    }
  };
};

class SidebarProvider extends Component {

  state = {
    isOpened: false,
  };

  handleOpen = () => {
    this.setState({
      isOpened: true,
    })
  };

  handleClose = () => {
    this.setState({
      isOpened: false,
    })
  };

  render() {
    const {children} = this.props;
    const {isOpened} = this.state;
    return (
      <SidebarContext.Provider value={{
        isOpened,
        openMenu: this.handleOpen,
        closeMenu: this.handleClose,
      }}>
        {children}
      </SidebarContext.Provider>
    );
  }
}

export default SidebarProvider;