import { useState, useContext } from 'react';
import { Context } from './Context';

/*
 * Følger denne guiden:
 * https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
 *
 * useServerEffect lagrer responsen til eksterne kall i contexten slik at man
 * kan bruke asynkrone kall selv om man bruker server side rendering.
 */
export const useServerEffect = (initial: any, key: any, effect: any) => {
  const context: any = useContext(Context);
  const [data] = useState(context[key] || initial);
  if (context.requests && !context[key]) {
    context.requests.push(
      effect().then((data: any) => {
        return (context[key] = data);
      }),
    );
  }
  return [data];
};
