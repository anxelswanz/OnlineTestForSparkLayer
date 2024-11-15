import React, { useEffect, useState } from 'react';
import './App.css';
import Todo, { TodoType } from './Todo';

function App() {
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // Initially fetch todo
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await fetch('http://localhost:8081/');
        if (todos.status !== 200) {
          console.log('Error fetching data');
          return;
        }
        // console.log("todos -> " , await todos.json());

        setTodos(await todos.json());
      } catch (e) {
        console.log('Could not connect to server. Ensure it is running. ' + e);
      }
    }

    fetchTodos()
  }, []);

  async function submit() {

    // create a item using the title/description received in useState
    var item = {
      title: title,
      description: description
    };
    //console.log("item => ", item);
    try {
      // Router -> add an item
      // do a asyncrhonous request
      const response = await fetch('http://localhost:8081/', {
        // method: Post
        method: 'POST',
        // This is to convert an object (item) to JSON format String
        body: JSON.stringify(item)
      });
      //console.log("response", response);

      if (response.status !== 200) {
        console.log('Error Adding an item');
        return;
      } else {
        console.log('A new item is added successfully');
      }
    }
    catch (e) {
      console.log('Error Adding an item to server due to ' + e);
    }

  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
      </header>

      <div className="todo-list">
        {todos?.map((todo) =>
          <Todo
            key={todo.title + todo.description}
            title={todo.title}
            description={todo.description}
          />
        )}
      </div>

      <h2>Add a Todo</h2>
      <form>
        <input
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          name="title"
          autoFocus={true} />
        <input
          placeholder="Description"
          name="description"
          onChange={(e) => setDescription(e.target.value)} />
        <button onClick={(e) => { e.preventDefault(); submit() }}>Add Todo</button>
      </form>
    </div>
  );
}

export default App;
