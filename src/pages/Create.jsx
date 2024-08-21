import React, { useState, useEffect } from 'react';
import config from '../config';
import "../App.css";

const CreateEntities = () => {
    const [selectedUserId] = useState('b7224020-c971-4b1c-b894-568fcc936dd6'); 
    const [activeForm, setActiveForm] = useState('category');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (selectedUserId) {
            fetch(`${config.apiUrl}/category?userId=${selectedUserId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching categories: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => setCategories(data))
                .catch(error => console.error(error));
        }
    
        fetch(`${config.apiUrl}/item`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching items: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => setItems(data))
            .catch(error => console.error(error));
    }, [selectedUserId]);

    const handleSubmitCard = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newItem = {
            name: formData.get('name'),
            image: formData.get('image'),
            categoryId: parseInt(formData.get('categoryId'), 10),
        };

        fetch(`${config.apiUrl}/item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem),
        }).then(response => response.json())
          .then(data => {
              console.log('Item created:', data);
              setItems([...items, data]); 
          })
          .catch(error => console.error('Error creating item:', error));
    };

    const handleSubmitCategory = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newCategory = {
            name: formData.get('name'),
            userId: selectedUserId,
            items: []
        };

        fetch(`${config.apiUrl}/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCategory),
        }).then(response => response.json())
          .then(data => {
              console.log('Category created:', data);
              setCategories(prevCategories => [...prevCategories, data]);
          })
          .catch(error => console.error('Error creating category:', error));
    };

    return (
        <div className="create-entities">
            <div className="button-group">
                <button onClick={() => setActiveForm('category')}>Skapa Kategori</button>
                <button onClick={() => setActiveForm('card')}>Skapa Kort</button>
            </div>

            {activeForm === 'category' && (
                <form onSubmit={handleSubmitCategory}>
                    <label>Namn på kategorin:</label>
                    <input type="text" name="name" required />
                    <button type="submit">Skapa Kategori</button>
                </form>
            )}

            {activeForm === 'card' && (
                <form onSubmit={handleSubmitCard}>
                    <label>Namn på kortet:</label>
                    <input type="text" name="name" required />

                    <label>Bild URL:</label>
                    <input type="url" name="image" required />

                    <label>Välj kategori:</label>
                    <select name="categoryId" required>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>

                    <button type="submit">Skapa Kort</button>
                </form>
            )}
        </div>
    );
};

export default CreateEntities;
