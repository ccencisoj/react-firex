import Controller from '../Controller';
import PersistedController from '../PersistedController';

function isComponent(component) {
  return typeof component === "function";
}

function isPersistedController(element) {
  return element.prototype instanceof PersistedController;
}

function isController(element) {
  return element.prototype instanceof Controller;
}

export {isComponent, isController, isPersistedController};