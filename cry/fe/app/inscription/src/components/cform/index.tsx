import React, { RefObject } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';

interface YForm<FT extends Record<string, any>> {
  submitRef: RefObject<HTMLInputElement>;
  onSubmit: SubmitHandler<FT>;

  className?: string;
  children?: React.ReactNode | null | Array<React.ReactChildren>;
}

export default React.memo(function YForm<FT extends Record<string, any>>({
  submitRef, className, children, onSubmit,
}: YForm<FT>) {
  const form = useFormContext();

  return (
    <form className={className} onSubmit={form.handleSubmit(onSubmit)}>
      {children}
      <input ref={submitRef} type="submit" style={{ display: 'none' }} />
    </form>
  );
});

export { default as FormItem } from './item';
