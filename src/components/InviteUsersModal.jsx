import React, { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup } from "react-bootstrap";
import useLocalStorage from "../hooks/useLocalStorage";

const InviteUsersModal = ({ show, handleClose, handleSaveInvites, currentInvitedUsers, showMessage }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState(currentInvitedUsers || []);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const { getLocalStorage } = useLocalStorage();

  useEffect(() => {
    if (show) {
      fetchLoggedInUser();
      setSearchTerm(""); 
    }
  }, [show]);

  useEffect(() => {
    setInvitedUsers(currentInvitedUsers || []);
  }, [currentInvitedUsers]);

  const fetchLoggedInUser = async () => {
    const accessToken = await getLocalStorage("accessToken");

    if (!accessToken || !accessToken.accessToken) {
      showMessage("Access-token saknas eller är felaktigt.");
      return;
    }

    try {
      const response = await fetch("https://localhost:7259/api/users/user", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Misslyckades med att hämta inloggad användare");
      }

      const userData = await response.json();
      setLoggedInUserId(userData.userId);
      fetchUsers(userData.userId);
    } catch (error) {
      showMessage(`Fel vid hämtning av inloggad användare: ${error.message}`);
    }
  };

  const fetchUsers = async (loggedInUserId) => {
    const accessToken = await getLocalStorage("accessToken");

    try {
      const response = await fetch("https://localhost:7259/api/users/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
      });

      const usersData = await response.json();
      const filteredUsers = usersData.filter(
        (user) => user.userId !== loggedInUserId
      );
      setUsers(filteredUsers);
    } catch (error) {
      showMessage(`Fel vid hämtning av användare: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleInviteUser = (user) => {
    if (invitedUsers.some((invitedUser) => invitedUser.userId === user.userId)) {
      setInvitedUsers(invitedUsers.filter((invitedUser) => invitedUser.userId !== user.userId));
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
