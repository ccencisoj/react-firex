/*
  Este error se lanza cuando en las propiedades del estado 
  inicial del controlador no ha sido declarada cierta
  propiedad disparadora.

  Las propiedades disparadores son las que se declaran asi:
  "controller.YourController.changeState({triggerProp: 1})"
*/
class StatePropError extends Error {
  constructor({propName, controllerName}) {
    super(`${propName} is not defined  
    in ${controllerName} state`);
    this.name = "StatePropError";
  }
}

export default StatePropError;
