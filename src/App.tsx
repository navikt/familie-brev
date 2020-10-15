import React, { useEffect, useState } from 'react';
import './App.css';
import { client } from './utils/sanity';
const BlockContent = require('@sanity/block-content-to-react')


function App() {
  const [info, setInfo] = useState<any>();

  const query = '*[_type == "submal"][0]';

    useEffect(() => {
      client
          .fetch(query)
          .then((res: any) => {
              setInfo(res.submal_block);
          });
  }, []);

  return (
    <div className="App">
          {info && <BlockContent blocks={info}/>}
    </div>
  );
}

export default App;
