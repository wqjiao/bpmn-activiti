import Modeler from 'bpmn-js/lib/Modeler';

import {assign, isArray} from 'min-dash';

import inherits from 'inherits';

import CustomTranslate from './customTranslate';

import CustomPalette from './customPalette';

import ColorPickerModule from './customColor';

export default function CustomModeler(options) {
    Modeler.call(this, options);

    this.customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
    CustomTranslate,
    CustomPalette,
    ColorPickerModule,
]);

/**
 * Add a single custom element to the underlying diagram
 *
 * @param {Object} customElement
 */
CustomModeler.prototype.addCustomShape = function(customElement) {
    this.customElements.push(customElement);

    const canvas = this.get('canvas');
    const elementFactory = this.get('elementFactory');

    const customAttrs = assign({businessObject: customElement}, customElement);

    const customShape = elementFactory.create('shape', customAttrs);

    return canvas.addShape(customShape);
};

CustomModeler.prototype.addCustomConnection = function(customElement) {
    this.customElements.push(customElement);

    const canvas = this.get('canvas');
    const elementFactory = this.get('elementFactory');
    const elementRegistry = this.get('elementRegistry');

    const customAttrs = assign({businessObject: customElement}, customElement);

    const connection = elementFactory.create(
        'connection',
        assign(customAttrs, {
            source: elementRegistry.get(customElement.source),
            target: elementRegistry.get(customElement.target),
        }),
        elementRegistry.get(customElement.source).parent
    );

    return canvas.addConnection(connection);
};

/**
 * Add a number of custom elements and connections to the underlying diagram.
 *
 * @param {Array<Object>} customElements
 */
CustomModeler.prototype.addCustomElements = function(customElements) {
    if (!isArray(customElements)) {
        throw new Error('argument must be an array');
    }

    const shapes = [];
    const connections = [];

    customElements.forEach(customElement => {
        if (isCustomConnection(customElement)) {
            connections.push(customElement);
        } else {
            shapes.push(customElement);
        }
    });

    // add shapes before connections so that connections
    // can already rely on the shapes being part of the diagram
    shapes.forEach(this.addCustomShape, this);

    connections.forEach(this.addCustomConnection, this);
};

/**
 * Get custom elements with their current status.
 *
 * @return {Array<Object>} custom elements on the diagram
 */
CustomModeler.prototype.getCustomElements = function() {
    return this.customElements;
};

function isCustomConnection(element) {
    return element.type === 'custom:connection';
}
