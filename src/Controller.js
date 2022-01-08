class Controller {
  constructor(props) {
    this.props = props;
    this.state = null;
    this.setState = null;
  }

  on(eventName, listener) {}

  off(eventName, listener) {}
  
  emit(eventName, ...args) {}

  initialState() {}
  
  changedState(prevState) {}

  controllerDidMount() {}

  controllerWillUnmount() {}
}

export default Controller;