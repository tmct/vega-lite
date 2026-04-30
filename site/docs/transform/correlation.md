---
layout: docs
menu: docs
title: Correlation
permalink: /docs/correlation.html
---

The correlation transform computes the [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient) between two data fields, producing a single value per group. An optional per-row `weight` field selects a [weighted Pearson correlation](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient#Weighted_correlation_coefficient); when omitted, each row is treated as having weight 1 and the result is the standard unweighted coefficient.

For fitted trend lines rather than a summary coefficient, see the [regression](regression.html) transform, which accepts the same optional `weight` parameter for weighted least squares.

```js
// Any View Specification
{
  ...
  "transform": [
    {"correlation": ...} // Correlation Transform
     ...
  ],
  ...
}
```

## Correlation Transform Definition

{% include table.html props="correlation,on,weight,groupby,as" source="CorrelationTransform" %}

## Usage

```json
{"correlation": "y", "on": "x"}
```

Compute the Pearson correlation between fields `"y"` and `"x"`. The output data stream contains a single object with the coefficient in the `corr` field (or the name given via `as`):

```js
[{corr: 0.71}];
```

If the `groupby` parameter is provided, one coefficient is computed per group, and the output records additionally include all groupby field values:

```json
{"correlation": "y", "on": "x", "groupby": ["category"], "as": ["corr"]}
```

Add an optional `"weight"` field to compute a weighted Pearson correlation. Rows with negative weights are ignored with a warning. Groups with zero total weight or zero variance in either field emit a `null` coefficient.

## Example

Autocorrelation of daily maximum temperature in Seattle at lags of 1, 3, and 6 days, broken out by month — showing how day-to-day temperature persistence decays with lag:

<div class="vl-example" data-name="line_correlation_autocorrelation"></div>
