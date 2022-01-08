import React from "react";
import lodash from "lodash";

function wrapComponent({Component, 
  wrappedControllers, triggerStateProps}) {

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.id = Date.now();
      this.didMountListeners = [];
      this.willUnmountListeners = [];
      this.componentDidMounted = false;
      this.componentWillUnmounted = false;

      lodash(wrappedControllers).forEach((wController, key)=> {
        wController.subscribe(({getState, onChangedState, unsubscribe})=> {
          
          this.state[key] = getState();

          onChangedState((_, changedProps)=> {
            this.onComponentDidMount(()=> {

              if(triggerStateProps[key](changedProps)) {
                this.setState({[key]: getState()});
              }
            })
          })

          this.onComponentWillUnmount(unsubscribe);
        })
      })
    }

    onComponentDidMount = (cb)=> {
      this.didMountListeners.push(cb);
      
      if(this.componentDidMounted) {
        this.didMountListeners.pop()();
      }
    }

    onComponentWillUnmount = (cb)=> {
      this.willUnmountListeners.push(cb);

      if(this.componentWillUnmounted) {
        this.willUnmountListeners.pop()();
      }
    }

    componentDidMount = ()=> {
      this.componentDidMounted = true;
      this.didMountListeners.forEach((cb)=> cb());
    }

    componentWillUnmount = ()=> {
      this.componentWillUnmounted = true;
      this.willUnmountListeners.forEach((cb)=> cb());
    }

    render = ()=> { 
      return <Component {...this.state}/>;
    }
  }
}

export default wrapComponent;