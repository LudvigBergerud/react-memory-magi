import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import useFetch from "../hooks/useFetch";

const CategoryPopupModal = ({
  show,
  handleClose,
  handleSave,
  category,
  showMessage,
  categories,
}) => {
  const [name, setName] = useState(category ? category.name : "");
  const [image, setImage] = useState(category ? category.image : "");
  const postCategoryHandler = useFetch();

  const handleSubmitCategory = async (e) => {
    e.preventDefault();

    const categoryData = {
      name: name.trim(),
      image: image.trim(),
    };

    if (!categoryData.name || !categoryData.image) {
      showMessage("Alla fält måste vara ifyllda.");
      return;
    }

    const isDuplicateCategory = categories.some((cat) => {
      return (
        cat?.name && cat.name.toLowerCase() === categoryData.name.toLowerCase()
      );
    });

    if (isDuplicateCategory) {
      showMessage("En kategori med samma namn finns redan.");
      return;
    }
    //Make post
    postCategoryHandler.handleData(
      "https://localhost:7259/api/category",
      "POST",
      categoryData
    );
  };

  //Set data from post when it's available
  useEffect(() => {
    if (postCategoryHandler.data) {
      const savedCategory = postCategoryHandler.data;
      handleSave(savedCategory);
      showMessage("Kategorin sparades");
      setName("");
      setImage("");
      handleClose();
    }
  }, [postCategoryHandler.data]);

  //Handle error that might occur during post
  useEffect(() => {
    if (postCategoryHandler.error) {
      showMessage(`Fel vid sparande av kategori: ${postCategoryHandler.error}`);
    }
  }, [postCategoryHandler.error]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {category ? "Redigera Kategori" : "Skapa Kategori"}
        </Modal.Title>
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
          <Button
            variant="primary"
            type="submit"
            className="create-primary-button"
          >
            Spara Kategori
          </Button>

          <div className="category-preview">
            <div className="category-card">
              {image ? (
                <img src={image} alt={name} />
              ) : (
                <div className="placeholder">Ingen Bild</div>
              )}
              <div className="category-name">
                {name || "Förhandsgranskning"}
              </div>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryPopupModal;
