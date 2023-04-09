import { useEffect, useState } from 'react';

import firebase, { auth, provider } from './firebase'

import './App.css';

function App() {
  const [fields, setFieldValue] = useState({
    subject: '',
    content: '',
  });

  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchItems = async () => {
      const db = firebase.firestore();

      const result = await db
        .collection('items')
        .where('userId', '==', user.uid)
        .get();

      const parseResult = result.docs.map((item) => ({ ...item.data(), id: item.id }))

      console.log(parseResult)

      setItems(parseResult);
    }

    fetchItems();
  }, [user]);

  const handleInputChange = (e) => {
    setFieldValue({ ...fields, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const db = firebase.firestore();

    const request = {
      ...fields,
      userId: user.uid
    }

    const result = await db.collection('items').add(request);

    setItems([...items, { ...request, id: result.id }])
  }

  const handleDeleteItem = async (id) => {
    const db = firebase.firestore();

    await db.collection('items').doc(id).delete();

    const filterItems = items.filter(item => item.id !== id);

    setItems(filterItems)
  }

  const login = () => {
    // const result = await auth.signInWithPopup(provider);

    // setUser(result.user);

    auth.signInWithRedirect(provider)
    setItems([]);
  }

  const logout = async () => {
    await auth.signOut();

    setUser(null)
  }

  return (
    <div className="App">
      <header>
        <h1>React Firebase</h1>
        {user && <span>{user.displayName}</span>}
        {user && <img src={user.photoURL} />}
        {user ? <button onClick={logout}>Log out</button> : <button onClick={login}>Log in</button>}

      </header>

      <main>
        <section>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="subject"
              value={fields.subject}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="content"
              value={fields.content}
              onChange={handleInputChange}
            />

            <button type="submit">Submit</button>
          </form>
        </section>

        <section>
          {items.map((item) => (
            <div key={item.id}>
              <strong>{item.subject}</strong>
              <span>{item.content}</span>
              <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
