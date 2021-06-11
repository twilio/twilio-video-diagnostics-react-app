import React from 'react';
import { AppStateProvider } from './components/AppStateProvider';
import Header from './components/Header';

function App() {
  return (
    <AppStateProvider>
      <Header />
    </AppStateProvider>
  );
}

export default App;
