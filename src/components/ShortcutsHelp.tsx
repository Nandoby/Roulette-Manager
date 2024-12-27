import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Shortcut } from "@/hooks/useKeyboardShortcuts";

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
}

export default function ShortcutsHelp({
  open,
  onClose,
  shortcuts,
}: ShortcutsHelpProps) {
  const formatShortcut = (shortcut: Shortcut) => {
    const parts = [];
    if (shortcut.ctrlKey) parts.push("Ctrl");
    if (shortcut.altKey) parts.push("Alt");
    parts.push(shortcut.key.toUpperCase());
    return parts.join(" + ");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Raccourcis Clavier
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" paragraph>
          Utilisez ces raccourcis pour accéder rapidement aux fonctionnalités de
          l'application.
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Raccourci</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shortcuts.map((shortcut, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Typography
                    component="kbd"
                    sx={{
                      backgroundColor: "action.hover",
                      padding: "2px 6px",
                      borderRadius: 1,
                      fontFamily: "monospace",
                    }}
                  >
                    {formatShortcut(shortcut)}
                  </Typography>
                </TableCell>
                <TableCell>{shortcut.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
