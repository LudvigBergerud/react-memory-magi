import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryPopupModal = ({ show, handleClose, handleSave, category, showMessage, categories }) => {
    const [name, setName] = useState(category ? category.name : '');
    const [image, setImage] = useState(category ? category.image : '');

    const handleSubmitCategory = async (e) => {
        e.preventDefault();

        const categoryData = { 
            name: name.trim(), 
            image: image.trim() 
        };

        if (!categoryData.name || !categoryData.image) {
            showMessage('Alla fält måste vara ifyllda.');
            return;
        }

        const isDuplicateCategory = categories.some(
            (cat) => {
                return cat?.name && cat.name.toLowerCase() === categoryData.name.toLowerCase();
            }
        );

        if (isDuplicateCategory) {
            showMessage('En kategori med samma namn finns redan.');
            return;
        }

        const accessTokenString = localStorage.getItem('accessToken');
        const accessTokenData = accessTokenString ? JSON.parse(accessTokenString) : null;
        const accessToken = accessTokenData ? accessTokenData.accessToken : null;

        if (!accessToken) {
            showMessage('Ingen giltig access token hittades. Vänligen logga in igen.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7259/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                showMessage(`Fel vid sparande av kategori: ${errorText}`);
                return;
            }

            const savedCategory = await response.json();

            handleSave(savedCategory); 
            showMessage('Kategorin sparades');
            setName(''); 
            setImage(''); 
            handleClose(); 
        } catch (error) {
            showMessage(`Fel vid sparande av kategori: ${error.message}`);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{category ? 'Redigera Kategori' : 'Skapa Kategori'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitCategory} className="form-section">
                    <Form.Group controlId="formCategoryName">
                        <Form.Label>Namn</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Ange kategorinamn"
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategoryImage">
                        <Form.Label>Bild URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={image} 
                            onChange={(e) => setImage(e.target.value)} 
                            placeholder="Ange bildens URL"
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="create-primary-button">
                        Spara Kategori
                    </Button>

                    <div className="category-preview">
                        <div className="category-card">
                            {image ? (
                                <img src={image} alt={name} />
                            ) : (
                                <div className="placeholder">Ingen Bild</div>
                            )}
                            <div className="category-name">{name || "Förhandsgranskning av namn"}</div>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CategoryPopupModal;
