import React, { Component, Fragment } from 'react';
import * as API from './services';
import OrderHistoryTable from './tmplOrderHistory';
import Form from './Form';

export default class App extends Component {
  state = {
    orderHistory: [],
    isModalOpen: false,
    moreItemInfoById: '',
    isLoading: false,
  };

  componentDidMount() {
    API.getAllItems().then(data => this.setState({ orderHistory: data }));
  }

  handleRemoveItem = id => {
    API.deleteItem(id).then(res => {
      if (!res) return;
      this.setState(state => ({
        orderHistory: state.orderHistory.filter(item => item.id !== id),
      }));
    });
  };

  handleOpenModal = id => {
    this.setState({ isLoading: true });
    API.getItemById(id)
      .then(data => {
        this.setState({ moreItemInfoById: data.description });
      })
      .then(this.setState({ isLoading: false }))
      .then(this.setState({ isModalOpen: true }));
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false, moreItemInfoById: '' });
  };

  handlePostData = item => {
    API.addItem(item).then(res => {
      if (!res.status === 201) return;
      this.setState(prevState => ({
        orderHistory: prevState.orderHistory + res.data,
      }));
    });
  };

  render() {
    const {
      orderHistory,
      isModalOpen,
      moreItemInfoById,
      isLoading,
    } = this.state;
    return (
      <Fragment>
        {orderHistory.length > 0 && (
          <OrderHistoryTable
            dataOrderHistory={orderHistory}
            handleRemove={this.handleRemoveItem}
            handleOpenModal={this.handleOpenModal}
            isModalOpen={isModalOpen}
            handleCloseModal={this.handleCloseModal}
            moreItemInfoById={moreItemInfoById}
            isLoading={isLoading}
          />
        )}
        <Fragment>
          <Form postData={this.handlePostData} />
        </Fragment>
      </Fragment>
    );
  }
}
