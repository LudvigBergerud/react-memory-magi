import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ItemPopupModal = ({ show, handleClose, handleSave }) => {
    const [cardName, setCardName] = useState('');
    const [imageLink, setImageLink] = useState('');

    const handleSubmitCard = async (e) => {
        e.preventDefault();

        const cardData = { 
            name: cardName, 
            image: imageLink,
            gameId: -1 
        };

        handleSave(cardData); 
        handleClose(); 
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ textAlign: 'center', width: '100%' }}>Skapa Kort</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitCard} className="form-section">
                    <div className="form-inputs">
                        <Form.Group controlId="formCardName">
                            <Form.Label>Namn på kortet:</Form.Label>
                            <Form.Control
                                type="text"
                                value={cardName}
                                required
                                onChange={(e) => setCardName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCardImage">
                            <Form.Label>Bild URL:</Form.Label>
                            <Form.Control
                                type="url"
                                value={imageLink}
                                required
                                onChange={(e) => setImageLink(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Skapa Kort
                        </Button>
                    </div>
                    <div className="card-preview">
                        <div className="card-create">
                            {imageLink ? (
                                <img src={imageLink} alt={cardName} />
                            ) : (
                                <div style={{ height: '150px', width: '100%', backgroundColor: '#cccccc', borderRadius: '10px' }}></div>
                            )}
                            <div className="card-name">{cardName || "Förhandsgranskning"}</div>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ItemPopupModal;

