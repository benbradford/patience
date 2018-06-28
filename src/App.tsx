import * as React from 'react';
import './App.css';
import TableView from './View/TableView'

class App extends React.Component {
  public render() {

    return (
      <div className="App">
       
        <p>
          <TableView />
        </p>
        
      </div>
    );
  }
}

export default App;
