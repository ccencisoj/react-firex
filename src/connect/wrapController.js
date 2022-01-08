import lodash from "lodash";
import EventEmitter from 'events';
import {isPersistedController} from "../util";
import initializeController from './initializeController';
import initializePersistedController from "./initializePersistedController";

const wrappedControllersArray = [];

function wrapController(controller) {
  let wrappedController = null;
  
  lodash(wrappedControllersArray).forEach((wController)=> {
    if(wController.creator === controller) {
      wrappedController = wController;
    }
  })

  if(wrappedController === null) { 
    let creator = controller;
    let eventEmitter = new EventEmitter();  
    let initialize = initializeController;

    if(isPersistedController(controller)) {
      initialize = initializePersistedController;
    }

    let {initController, initialState, onChangedState} = 
    initialize(controller, eventEmitter);
    
    function subscribe(callback) {
      let currentSub = {recordedEvents: []};
      let offChangedState = null;

      function on(eventName, listener) {
        eventEmitter.on(eventName, listener);
        currentSub.recordedEvents.push({eventName, listener});
      }

      function off(eventName, listener) {
        eventEmitter.off(eventName, listener);
        lodash.remove(currentSub.recordedEvents, {listener});
      }

      function emit(eventName, ...args) {
        eventEmitter.emit(eventName, ...args);
      }

      function getState() {
        return {...initController, on, off, emit};
      }
  
      function _onChangedState(listener) {
        offChangedState = onChangedState(listener);
      }

      function unsubscribe() {
        offChangedState();

        lodash(currentSub.recordedEvents)
        .forEach(({eventName, listener})=> {
          eventEmitter.off(eventName, listener);
        })

        lodash.remove(currentSub.recordedEvents, {});        
      }
      
      callback({getState, unsubscribe, 
        onChangedState: _onChangedState});
    }

    wrappedController = {creator, subscribe, initialState};
    wrappedControllersArray.push(wrappedController);
  }

  return wrappedController;
}

export default wrapController;