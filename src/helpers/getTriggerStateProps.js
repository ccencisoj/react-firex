import lodash from 'lodash';
import ReceivesError from '../errors/ReceivesError';
import StatePropError from '../errors/StatePropError';
import createControllersConditions from './createControllersConditions';

/*
  Este ayudante se encarga de llamar a la funcion updateComponentWhen, 
  asi mismo se encarga de definir las reglas de actualizacion del componente
  
  {
    updateComponentWhen: (object)=> {
      object.Controller.changeState({example: 1});
    }
  }

  Este ayudante recibe los siguientes parametros:

  @param wrappedControllers son los controladores que han sido envueltos.

  @param updateComponentWhen es el metodo que permite al desarrollador
  definir las reglas o condiciones de actualizacion del componente.

  @returns un conjunto de funciones, las cuales seran utilizadas
  en la envoltura de componente
*/
function getTriggerStateProps(
  wrappedControllers, updateComponentWhen) {

  let triggerStateProps = {};
  let controllersConditions = 
  
  createControllersConditions(wrappedControllers, {
    changeState: (stateProps, wController, wControllerKey)=> { 

      if(!(lodash.isObject(stateProps))) {
        throw new ReceivesError({method: "changeState", 
        receives: "object"});
      }

      lodash(stateProps).forEach((_, propName)=> {
        if(!lodash.has(wController.initialState, propName)) {
          throw new StatePropError({propName, 
          controllerName: wControllerKey});
        }
      })

      if(!(wControllerKey in triggerStateProps)) {
        triggerStateProps[wControllerKey] = [];
      }

      triggerStateProps[wControllerKey]
      .push(Object.keys(stateProps));
    }
  });

  if(lodash.isFunction(updateComponentWhen)) {
    updateComponentWhen(controllersConditions);
  }

  lodash(wrappedControllers).forEach((wController, wControllerKey)=> {
    let wcTriggerStateProps = triggerStateProps[wControllerKey];

    if(wcTriggerStateProps === undefined) {
      wcTriggerStateProps = Object.keys(wController.initialState);
    }

    triggerStateProps[wControllerKey] = (changedProps)=> {
      if(wcTriggerStateProps.some((p)=> p in changedProps)) {
        return true;
      }
    }
  })

  return triggerStateProps;
}

export default getTriggerStateProps;