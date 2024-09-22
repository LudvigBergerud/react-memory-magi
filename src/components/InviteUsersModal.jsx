import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import useFetch from "../hooks/useFetch";

const InviteUsersModal = ({
  show,
  handleClose,
  handleSaveInvites,
  currentInvitedUsers,
  showMessage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState(currentInvitedUsers || []);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const fetchUserHandler = useFetch();
  const fetchAllUsersHandler = useFetch();

  //Get signed in user
  useEffect(() => {
    if (show) {
      fetchUserHandler.handleData(
        "https://localhost:7259/api/users/user",
        "GET"
      );
      setSearchTerm("");
    }
  }, [show]);

  //Set signed in user, continue fetching all users if successful
  useEffect(() => {
    if (fetchUserHandler.data) {
      setLoggedInUserId(fetchUserHandler.data.userId);
      fetchAllUsersHandler.handleData(
        "https://localhost:7259/api/users/users",
        "GET"
      );
    }
  }, [fetchUserHandler.data]);

  //Handle error that might occur when fetching signed in user
  useEffect(() => {
    if (fetchUserHandler.error) {
      showMessage(
        `Fel vid hämtning av inloggad användare: ${fetchUserHandler.error}`
      );
    }
  }, [fetchUserHandler.error]);

  //Set filtered list of users after succesful fetch of all users
  useEffect(() => {
    if (fetchAllUsersHandler.data) {
      const filteredUsers = fetchAllUsersHandler.data.filter(
        (user) => user.userId !== loggedInUserId
      );
      setUsers(filteredUsers);
    }
  }, [fetchAllUsersHandler.data]);

  //Handle error that might occur when fetching all users
  useEffect(() => {
    if (fetchAllUsersHandler.error) {
      showMessage(
        `Fel vid hämtning av användare: ${fetchAllUsersHandler.error}`
      );
    }
  }, [fetchAllUsersHandler.error]);

  useEffect(() => {
    setInvitedUsers(currentInvitedUsers || []);
  }, [currentInvitedUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInviteUser = (user) => {
    if (
      invitedUsers.some((invitedUser) => invitedUser.userId === user.userId)
    ) {
      setInvitedUsers(
        invitedUsers.filter((invitedUser) => invitedUser.userId !== user.userId)
      );
    } else {
      setInvitedUsers([...invitedUsers, user]);
    }
  };

  const saveInvites = () => {
    handleSaveInvites(invitedUsers);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bjud in användare</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="searchUsers">
          <Form.Control
            type="text"
            placeholder="Sök användare..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>

        <ListGroup
          style={{
            maxHeight: 250,
            overflowY: "auto",
          }}
          className="mt-3"
        >
          {filteredUsers.map((user) => (
            <ListGroup.Item
              key={user.userId}
              onClick={() => toggleInviteUser(user)}
              active={invitedUsers.some(
                (invitedUser) => invitedUser.userId === user.userId
              )}
              style={{
                cursor: "pointer",
                backgroundColor: invitedUsers.some(
                  (invitedUser) => invitedUser.userId === user.userId
                )
                  ? "#007bff"
                  : "",
              }}
            >
              {user.userName} ({user.email})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={saveInvites}>
          Spara Inbjudningar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteUsersModal;
