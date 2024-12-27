import { useEffect } from "react";

export interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}

export const GLOBAL_SHORTCUTS: Shortcut[] = [
  {
    key: "g",
    ctrlKey: true,
    description: "Enregistrer un gain",
    action: () => {}, // Sera défini dans le composant
  },
  {
    key: "p",
    ctrlKey: true,
    description: "Enregistrer une perte",
    action: () => {},
  },
  {
    key: "n",
    altKey: true,
    description: "Nouvelle session",
    action: () => {},
  },
  {
    key: "s",
    altKey: true,
    description: "Page statistiques",
    action: () => {},
  },
  {
    key: "h",
    altKey: true,
    description: "Retour à l'accueil",
    action: () => {},
  },
  {
    key: "t",
    altKey: true,
    description: "Changer le thème",
    action: () => {},
  },
];

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, ctrlKey, altKey, action }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          event.ctrlKey === !!ctrlKey &&
          event.altKey === !!altKey
        ) {
          event.preventDefault();
          action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
