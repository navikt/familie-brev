import { useState, useContext } from 'react';
import Context from './Context';

// https://medium.com/swlh/how-to-use-useeffect-on-server-side-654932c51b13
const useServerEffect = (initial: any, key: any, effect: any) => {
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
export default useServerEffect;
