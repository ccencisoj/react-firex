import lodash from 'lodash';
import {loadState, saveState} from '../localstorage';

function initializePersistedController(controller, eventEmitter) {
  let initController = new controller({});
  let onChangedStateListeners = [];
  let currentState = {};
  let initialState = {};
  let persistedState = null;

  initController.on = eventEmitter.on.bind(eventEmitter);
  initController.off = eventEmitter.off.bind(eventEmitter);
  initController.emit = eventEmitter.emit.bind(eventEmitter);

  persistedState = loadState(controller);

  if(persistedState === undefined) {
    initController.initialState();
    initialState = initController.state; 
    saveState(controller, currentState);
    
  }else {
    initController.state = persistedState;
    initialState = initController.state;
  }
  
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
      saveState(controller, newState);
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

export default initializePersistedController;