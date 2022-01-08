import lodash from 'lodash';

/*
  Esta funcion se encarga de crear el objeto que permite definir 
  las reglas o condiciones de actualizacion, para ello toma los 
  nombres de los controladores y los ingresa en un objeto. 
  Por cada nombre de controlador hay ciertos establecedores.

  @param wrapperController son los controladores envueltos

  @param conditionsSetters son las funciones que estableceran

  @returns un objeto con los nombres de los controladores 
  ingresados y sus correspondientes establecedores.
*/
function createControllersConditions(
  wrappedControllers, conditionsSetters) {
  let controllerConditions = {};

  lodash(wrappedControllers).forEach((
    wController, wControllerKey)=> {

    let controllerConditionsSetters = {};

    lodash(conditionsSetters).forEach((setter, key)=> {
      controllerConditionsSetters[key] = (value)=> {
        setter(value, wController, wControllerKey);
      } 
    })

    controllerConditions[wControllerKey] = 
    controllerConditionsSetters;
  })

  return controllerConditions;
}

export default createControllersConditions;