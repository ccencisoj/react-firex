function getControllerKey(controller) {
  return window.btoa(controller).substring(0, 128);
}

function saveState(controller, state) {
  try {
    let key = getControllerKey(controller);
    let serializedState = JSON.stringify(state);
    window.localStorage.setItem(key, serializedState);

  }catch(e) {
    //ignore error
  }
}

function loadState(controller) {
  try {
    let key = getControllerKey(controller);
    let serializedState = window.localStorage.getItem(key);
    if(serializedState === null) return undefined;
    return JSON.parse(serializedState);

  }catch(e) {
    return undefined;
  }
}

export {loadState, saveState};