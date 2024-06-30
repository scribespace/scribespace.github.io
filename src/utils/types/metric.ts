import { variableExists } from "../common";
import { assert } from "../dev";

export interface MetricSerialized {
  value: number;
  unit: string;
}

export class Metric {
  private __value: number;
  private __unit: string;

  constructor(value?: number, unit?: string) {
    this.__value = variableExists( value ) ? value : NaN;
    this.__unit = unit || "";
  }

  export(): MetricSerialized {
    return {value: this.value, unit: this.unit};
  }

  static import(smetric: MetricSerialized): Metric {
    return new Metric(smetric.value, smetric.unit);
  }

  clone() {
    return new Metric(this.__value, this.__unit);
  }

  isValid() {
    return !isNaN(this.__value);
  }

  get value() { return this.__value; }
  get unit() { return this.__unit; }

  getValue() {
    return this.__value;
  }

  getUnit() {
    return this.__unit;
  }

  setValue(value: number) {
    this.__value = value;
  }

  setUnit(unit: string) {
    this.__unit = unit;
  }

  addValue(value: number) {
    assert(this.isValid(), "Metric isn't valid");
    this.__value += value;
    return this;
  }

  subValue(value: number) {
    assert(this.isValid(), "Metric isn't valid");
    this.__value -= value;
    return this;
  }

  mulValue(value: number) {
    assert(this.isValid(), "Metric isn't valid");
    this.__value *= value;
    return this;
  }

  add(metric: Metric) {
    assert(this.isValid(), "Metric isn't valid");
    assert(metric.isValid(), "Metric param isn't valid");
    assert(this.__unit == metric.getUnit(), "Metrics aren't the same");
    this.__value += metric.getValue();
    return this;
  }

  sub(metric: Metric) {
    assert(this.isValid(), "Metric isn't valid");
    assert(metric.isValid(), "Metric param isn't valid");
    assert(this.__unit == metric.getUnit(), "Metrics aren't the same");
    this.__value -= metric.getValue();
    return this;
  }

  mul(metric: Metric) {
    assert(this.isValid(), "Metric isn't valid");
    assert(metric.isValid(), "Metric param isn't valid");
    assert(this.__unit == metric.getUnit(), "Metrics aren't the same");
    this.__value *= metric.getValue();
    return this;
  }

  toString() {
    return `${this.__value}${this.__unit}`;
  }

  cmp( other: Metric ) {
    return this.__value == other.value && this.__unit == other.unit;
  }

  static fromString(str: string) {
    const regex = /^(-?\d+\.?\d*)([a-zA-Z%]*)$/;
    const match = str.match(regex);
    if (match) {
      return new Metric(parseFloat(match[1]), match[2] || "");
    }

    return new Metric();
  }
}
