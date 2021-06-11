import React from 'react';
import { AppStateProvider } from './components/AppStateProvider';
import Header from './components/Header';
import { MainContent } from './components/MainContent';

function App() {
  return (
    <AppStateProvider>
      <Header />
      <MainContent />
    </AppStateProvider>
  );
}

export default App;
