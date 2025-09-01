import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';  // Correct usage for React 18
import App from './App.jsx';
import './index.css';
import store from './store.js';
import { Provider } from 'react-redux';

// Get the root HTML element by its ID
const rootElement = document.getElementById('root');

// Create a root using React 18's createRoot
const root = createRoot(rootElement);

// Render the application within the Provider and StrictMode
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
