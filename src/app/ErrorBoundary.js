"use client"
import Error from "./error"


import React, { useEffect, useState } from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  onClose = () => {
    this.setState({ hasError: false, error: null });

  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ overflow: "auto" }}>
          <Error error={this.state.error} reset={this.resetError} onClose={this.onClose} />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
