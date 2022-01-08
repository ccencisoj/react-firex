/*
  Este error se lanza cuando la funcion a recibido 
  un parametro no esperado
*/
class ReceivesError extends Error {
  constructor({method, receives}) {
    super(`the ${method} receives an ${receives}`);
    this.name = "ReceivesError";
  }
}

export default ReceivesError;