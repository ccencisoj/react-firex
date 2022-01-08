import lodash from 'lodash';
import wrapController from './wrapController';
import wrapComponent from './wrapComponent';
import extendsController from './extendsController';
import {
  isComponent, 
  isController, 
  isPersistedController
} from '../util';
import {
  validateComponent, 
  getTriggerStateProps, 
} from '../helpers';

/*
  La funcion connect se encarga de envolver los componentes 
  y cochangedState = (newState)=> {
    console.log(newState);
  }ntroladores.

  @param controllers los controladores que el desarrollador
  ha creado
*/

function connect(controllers) {
  let wrappedControllers = {};

  //Envuelvo todos los controladores
  lodash(controllers).forEach((controller, key)=> {
    wrappedControllers[key] = wrapController(controller);
  })

  return function to(Component, 
    {updateComponentWhen, callChangedStateWhen}={}) {
    /*
      updateComponentWhen y callChangedStateWhen son funciones, ambas
      realizan lo mismo, lo unico que cambia es el nombre para que 
      sea mas coherente la lectura del codigo del desarrollador.
    */
    let Controller = null;
    let triggerStateProps = null;

    //validateComponent se encarga de verificar que Component sea
    //un elemento valido. Si no es un elemento valido lanzara algun error
    validateComponent(Component);

    //Si Component es un componente de React, lo envuelvo. Pero si es
    //un controlador, entonces los extiendo para que se pueda comunicar
    //con otros controladores
    if(isController(Component) || 
      isPersistedController(Component)) {
        
      triggerStateProps = getTriggerStateProps(
      wrappedControllers, callChangedStateWhen);
      Controller = Component;

    }else if(isComponent(Component)) {
      triggerStateProps = getTriggerStateProps(
      wrappedControllers, updateComponentWhen);

      return wrapComponent({Component, 
      wrappedControllers, triggerStateProps});
    }

    return extendsController({Controller,
    wrappedControllers, triggerStateProps});    
  }
}

export default connect;