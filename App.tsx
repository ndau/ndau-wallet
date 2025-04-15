import React from 'react';
import '@walletconnect/react-native-compat';
import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import '@ethersproject/shims';
import 'text-encoding-polyfill';

import Main from './src/main';

function App(): JSX.Element {
  return <Main />;
}

export default App;
