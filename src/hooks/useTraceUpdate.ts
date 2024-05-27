import { useEffect, useRef } from "react";

type Props = Record<string, unknown>;
export default function useTraceUpdate<T extends Props>(props: T): void {
    const prev = useRef<T>(props);
  
    useEffect(() => {
      const changedProps: Partial<{ [K in keyof T]: [T[K], T[K]] }> = {};
      for (const [key, value] of Object.entries(props) as [keyof T, T[keyof T]][]) {
        if (prev.current[key] !== value) {
          changedProps[key] = [prev.current[key], value];
        }
      }
  
      if (Object.keys(changedProps).length > 0) {
        console.log('Changed props:', changedProps);
      }
  
      prev.current = props;
    }, [props]);
  }