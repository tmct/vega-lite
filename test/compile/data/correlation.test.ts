import {CorrelationTransformNode} from '../../../src/compile/data/correlation.js';
import {Transform} from '../../../src/transform.js';
import {PlaceholderDataFlowNode} from './util.js';

describe('compile/data/correlation', () => {
  describe('assemble', () => {
    it('should produce a proper vg transform with weight and groupby', () => {
      const transform: Transform = {
        correlation: 'y',
        on: 'x',
        weight: 'w',
        groupby: ['g'],
        as: ['r'],
      };
      const node = new CorrelationTransformNode(null, transform);
      expect(node.assemble()).toEqual({
        type: 'correlation',
        x: 'x',
        y: 'y',
        weight: 'w',
        groupby: ['g'],
        as: ['r'],
      });
    });

    it('should omit weight and groupby when not provided and default as to ["corr"]', () => {
      const transform: Transform = {correlation: 'y', on: 'x'};
      const node = new CorrelationTransformNode(null, transform);
      expect(node.assemble()).toEqual({type: 'correlation', x: 'x', y: 'y', as: ['corr']});
    });
  });

  describe('dependentFields', () => {
    it('should include weight and groupby fields when provided', () => {
      const transform: Transform = {
        correlation: 'y',
        on: 'x',
        weight: 'w',
        groupby: ['g1', 'g2'],
      };
      const node = new CorrelationTransformNode(null, transform);
      expect(node.dependentFields()).toEqual(new Set(['x', 'y', 'w', 'g1', 'g2']));
    });

    it('should exclude weight when not provided', () => {
      const transform: Transform = {correlation: 'y', on: 'x'};
      const node = new CorrelationTransformNode(null, transform);
      expect(node.dependentFields()).toEqual(new Set(['x', 'y']));
    });
  });

  describe('producedFields', () => {
    it('should produce default corr field', () => {
      const transform: Transform = {correlation: 'y', on: 'x'};
      const node = new CorrelationTransformNode(null, transform);
      expect(node.producedFields()).toEqual(new Set(['corr']));
    });

    it('should produce custom output field', () => {
      const transform: Transform = {correlation: 'y', on: 'x', as: ['r']};
      const node = new CorrelationTransformNode(null, transform);
      expect(node.producedFields()).toEqual(new Set(['r']));
    });
  });

  describe('hash', () => {
    it('should generate a stable hash', () => {
      const transform: Transform = {correlation: 'y', on: 'x', as: ['r']};
      const node = new CorrelationTransformNode(null, transform);
      expect(node.hash()).toBe('CorrelationTransform {"as":["r"],"correlation":"y","on":"x"}');
    });
  });

  describe('clone', () => {
    it('should not clone the parent', () => {
      const parent = new PlaceholderDataFlowNode(null);
      const node = new CorrelationTransformNode(parent, {correlation: 'y', on: 'x'});
      expect(node.clone().parent).toBeNull();
    });
  });
});
