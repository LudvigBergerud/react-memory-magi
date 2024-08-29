import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CategoryPopupModal = ({ show, handleClose, handleSave, category }) => {
    const [name, setName] = useState(category ? category.name : '');
    const [image, setImage] = useState(category ? category.image : '');

    const saveCategory = async () => {
        const categoryData = { name, image };

        const accessTokenString = localStorage.getItem('accessToken');
        const accessToken = accessTokenString ? JSON.parse(accessTokenString) : null;

        try {
            const response = await fetch(category ? `/api/category/${category.id}` : 'https://localhost:7259/api/category', {
                method: category ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
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
                <Modal.Title>{category ? 'Edit Category' : 'Create Category'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formCategoryName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Enter category name"
                        />
                    </Form.Group>
                    <Form.Group controlId="formCategoryImage">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={image} 
                            onChange={(e) => setImage(e.target.value)} 
                            placeholder="Enter image URL"
                        />
                    </Form.Group>
                    <div className="category-preview">
                        <div className="category-card">
                            {image ? (
                                <img src={image} alt={name} />
                            ) : (
                                <div className="placeholder">No Image</div>
                            )}
                            <div className="category-name">{name || "Preview Name"}</div>
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
                <Button variant="primary" onClick={saveCategory}>
                    Save Category
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CategoryPopupModal;

