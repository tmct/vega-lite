import {CorrelationTransform as VgCorrelationTransform} from 'vega';
import {CorrelationTransform} from '../../transform.js';
import {duplicate, hash} from '../../util.js';
import {DataFlowNode} from './dataflow.js';

/**
 * A class for (weighted) Pearson correlation transform nodes.
 */
export class CorrelationTransformNode extends DataFlowNode {
  public clone() {
    return new CorrelationTransformNode(null, duplicate(this.transform));
  }

  constructor(
    parent: DataFlowNode,
    private transform: CorrelationTransform,
  ) {
    super(parent);
    this.transform = duplicate(transform);
    const specifiedAs = this.transform.as ?? [undefined];
    this.transform.as = [specifiedAs[0] ?? 'corr'];
  }

  public dependentFields() {
    const deps = new Set<string>([this.transform.correlation, this.transform.on, ...(this.transform.groupby ?? [])]);
    if (this.transform.weight) {
      deps.add(this.transform.weight);
    }
    return deps;
  }

  public producedFields() {
    return new Set<string>(this.transform.as);
  }

  public hash() {
    return `CorrelationTransform ${hash(this.transform)}`;
  }

  public assemble(): VgCorrelationTransform {
    const {correlation, on, weight, groupby, as} = this.transform;
    const result: VgCorrelationTransform = {
      type: 'correlation',
      x: on,
      y: correlation,
      ...(weight ? {weight} : {}),
      ...(groupby ? {groupby} : {}),
      as,
    };
    return result;
  }
}
