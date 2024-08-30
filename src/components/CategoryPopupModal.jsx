import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryPopupModal = ({ show, handleClose, handleSave, category }) => {
    const [name, setName] = useState(category ? category.name : '');
    const [image, setImage] = useState(category ? category.image : '');
    const [validated, setValidated] = useState(false);

    const saveCategory = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            setValidated(true);
            return;
        }

        event.preventDefault();

        const categoryData = { name, image };

        const accessTokenString = localStorage.getItem('accessToken');
        const accessTokenData = accessTokenString ? JSON.parse(accessTokenString) : null;
        const accessToken = accessTokenData ? accessTokenData.accessToken : null;

        if (!accessToken) {
            console.error('Ingen giltig access token hittades. Vänligen logga in igen.');
            return;
        }

        try {
            const response = await fetch(category ? `https://localhost:7259/api/category/${category.id}` : 'https://localhost:7259/api/category', {
                method: category ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(categoryData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error saving category: ${errorText}`);
            }

            const data = await response.json();
            console.log('Category saved successfully:', data);
            handleSave(data);
            handleClose();

        } catch (error) {
            console.error('Error saving category:', error.message);
        }
    };

    const handleRemoveImage = () => {
        setImage('');
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{category ? 'Redigera Kategori' : 'Skapa Kategori'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={saveCategory}>
                    <Form.Group controlId="formCategoryName">
                        <Form.Label>Namn</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Ange kategorinamn"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Fyll i det här fältet.
                        </Form.Control.Feedback>
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
                        <Form.Control.Feedback type="invalid">
                            Fyll i det här fältet.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="category-preview">
                        <div className="category-card">
                            {image ? (
                                <img src={image} alt={name} />
                            ) : (
                                <div className="placeholder">Ingen Bild</div>
                            )}
                            <div className="category-name">{name || "Förhandsvisning av namn"}</div>
                            {image && (
                                <button 
                                    className="remove-image-button" 
                                    onClick={handleRemoveImage}
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={saveCategory}>
                    Spara Kategori
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryPopupModal;
