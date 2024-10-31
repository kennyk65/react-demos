import React from 'react';
import {comments} from './commentData';
import Card from './Card';

function App() {
  const cards = comments.map(
    (comment) => <Card commentObject={comment} />
  );
  return <>{cards}</>;
}

export default App;