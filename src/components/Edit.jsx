//Component in EventPage om edit en delete

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Edit = ({ isOpen, onClose, eventData, onEventUpdated }) => {
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  // AlertDialog state for delete confirmation
  const {
    isOpen: isDeleteDialogOpen,
    onOpen: openDeleteDialog,
    onClose: closeDeleteDialog,
  } = useDisclosure();
  const cancelRef = useRef();

  useEffect(() => {
    setEditData(eventData || {});
  }, [eventData]);

  const handleSave = async () => {
    if (
      !editData.title ||
      !editData.description ||
      !editData.startTime ||
      !editData.endTime
    ) {
      toast({
        title: "Verplichte velden ontbreken",
        description: "Title, description, date en time zijn verplicht.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventData.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editData),
        }
      );
      if (!response.ok) throw new Error("Update failed");
      const updated = await response.json();
      onEventUpdated(updated);
      onClose();
      toast({
        title: "Saved successfully",
        description: "The event has been updated.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error bij save",
        description: err.message || "Onbekende error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/events/${eventData.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Delete mislukt");
      toast({
        title: "Event verwijderd",
        description: "Het event is succesvol verwijderd.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      closeDeleteDialog();
      onClose();
      navigate("/events");
    } catch (err) {
      toast({
        title: "Error bij delete",
        description: err.message || "Onbekende error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event edit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Title</FormLabel>
              <Input
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Description</FormLabel>
              <Input
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Location</FormLabel>
              <Input
                value={editData.location || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
              />
            </FormControl>

            {/* Start Date en Time */}
            <FormControl mb={3}>
              <FormLabel>Start date and time</FormLabel>
              <Input
                type="datetime-local"
                value={editData.startTime || ""}
                onChange={(e) =>
                  setEditData({ ...editData, startTime: e.target.value })
                }
              />
            </FormControl>

            {/* End date and time */}
            <FormControl mb={3}>
              <FormLabel>End date and time</FormLabel>
              <Input
                type="datetime-local"
                value={editData.endTime || ""}
                onChange={(e) =>
                  setEditData({ ...editData, endTime: e.target.value })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Annuleer
            </Button>
            <Button
              colorScheme="red"
              onClick={openDeleteDialog}
              mr={3}
              isLoading={isDeleting}
            >
              Delete
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmatie dialoog voor delete */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Event delete
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je dit event wilt delete? Deze actie
              kan niet ongedaan worden gemaakt.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog}>
                Annuleer
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
