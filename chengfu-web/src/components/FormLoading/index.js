import React, { Component } from 'react';
import { Spin } from 'antd';

const defaultOptions = {
  isLoading: () => false,
  delayMs: 300,
};

const FormLoading = ({ isLoading, delayMs = 300 } = defaultOptions) => (C) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: isLoading(props),
        delayed: false,
      };
      this.timeoutID = setTimeout(() => {
        this.setState({ delayed: true });
      }, delayMs);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        const loading = isLoading(nextProps);
        this.setState({ loading });
        if (this.timeoutID && !loading) {
          clearTimeout(this.timeoutID);
          this.timeoutID = undefined;
        }
      }
    }

    render() {
      const { delayed, loading } = this.state;
      return (
        <Spin spinning={delayed && loading}>
          <C {...this.props} />
        </Spin>
      );
    }
  };
};

export default FormLoading;
