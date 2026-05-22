import { Transform, TransformOptions } from 'class-transformer';

export const Trim = (opts?: TransformOptions): PropertyDecorator =>
  Transform(({ value }: { value?: string }) => value?.trim(), opts);
