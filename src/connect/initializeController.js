import lodash from 'lodash';

function initializeController(controller, eventEmitter) {
  let initController = new controller({});
  let onChangedStateListeners = [];
  let currentState = {};
  let initialState = {};

  initController.on = eventEmitter.on.bind(eventEmitter);
  initController.off = eventEmitter.off.bind(eventEmitter);
  initController.emit = eventEmitter.emit.bind(eventEmitter);

  initController.initialState();
  initialState = initController.state;
  currentState = initialState;

  initController.setState = setState;
  initController.controllerDidMount(); 

  if(window) window.addEventListener("beforeunload", ()=> {
    initController.controllerWillUnmount();
  })

  function setState(state, callback) {    
    let newState, changedProps, returnedState;
    
    if(lodash.isFunction(state)) {
      returnedState = state(currentState);
      state = returnedState || {};
    }

    newState = {...currentState, ...state};
    changedProps = state;

    if(!(lodash.isEqual(currentState, newState))) {
      Object.assign(initController, {state: newState});
      
      currentState = newState;
      initController.changedState(newState);

      onChangedStateListeners.forEach(({listener})=> {
        listener(newState, changedProps);
      })

      if(lodash.isFunction(callback)) {
        callback();
      }
    }
  }

  function onChangedState(listener) {
    onChangedStateListeners.push({listener});

    return function offChangeState() {
      lodash.remove(onChangedStateListeners, {listener});
    }
  }

  return {initController, initialState, onChangedState};
}

export default initializeController;