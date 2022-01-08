import lodash from 'lodash';

/*
  Este ayudante se encarga de extender el controlador para que
  pueda comunicarse con otros controladores
*/
function extendsController({Controller, 
  wrappedControllers, triggerStateProps}) {

  let wControllersStates = {};
    
  return class extends Controller {
    constructor() {
      //Le paso al controlador en props los controladores envueltos
      super(wControllersStates);

      lodash(wrappedControllers).forEach((wController, key)=> {

        //Me suscribo para obtener el estado y escuchar los cambios
        wController.subscribe(({getState, onChangedState})=> {

          //Establesco el estado actual de los controladores envueltos
          Object.assign(wControllersStates, {[key]: getState()});

          //Escucho los cambios del estado
          onChangedState((_, changedProps)=> {

            //Valido si las propiedades que cambiaron son 
            //disparadores de actualizacion
            if(triggerStateProps[key](changedProps)) {
              Object.assign(wControllersStates, {[key]: getState()});
              this.changedState(undefined);
            }
          })
        })
      })
    }
  }
}

export default extendsController;