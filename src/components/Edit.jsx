//Component in EventPage om wijzigen en verwijderen

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
        description: "Titel, omschrijving, datum en tijd zijn verplicht.",
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
      if (!response.ok) throw new Error("Update mislukt");
      const updated = await response.json();
      onEventUpdated(updated);
      onClose();
      toast({
        title: "Succesvol opgeslagen",
        description: "Het evenement is bijgewerkt.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Fout bij opslaan",
        description: err.message || "Onbekende fout",
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
        title: "Evenement verwijderd",
        description: "Het evenement is succesvol verwijderd.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      closeDeleteDialog();
      onClose();
      navigate("/events");
    } catch (err) {
      toast({
        title: "Fout bij verwijderen",
        description: err.message || "Onbekende fout",
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
          <ModalHeader>Evenement bewerken</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Titel</FormLabel>
              <Input
                value={editData.title || ""}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Beschrijving</FormLabel>
              <Input
                value={editData.description || ""}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Locatie</FormLabel>
              <Input
                value={editData.location || ""}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
              />
            </FormControl>

            {/* Start Datum en Tijd */}
            <FormControl mb={3}>
              <FormLabel>Startdatum en tijd</FormLabel>
              <Input
                type="datetime-local"
                value={editData.startTime || ""}
                onChange={(e) =>
                  setEditData({ ...editData, startTime: e.target.value })
                }
              />
            </FormControl>

            {/* Eind Datum en Tijd */}
            <FormControl mb={3}>
              <FormLabel>Einddatum en tijd</FormLabel>
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
              Verwijder
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSaving}
            >
              Opslaan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmatie dialoog voor verwijderen */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Evenement verwijderen
            </AlertDialogHeader>

            <AlertDialogBody>
              Weet je zeker dat je dit evenement wilt verwijderen? Deze actie
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
                Verwijder
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
