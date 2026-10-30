import type { ComponentType } from "react";
import Finder, { TrashApp } from "@/apps/Finder";
import Terminal from "@/apps/Terminal";
import Safari from "@/apps/Safari";
import Notes from "@/apps/Notes";
import Calculator from "@/apps/Calculator";
import Settings from "@/apps/Settings";
import Code from "@/apps/Code";
import Games from "@/apps/Games";
import { Music, Photos } from "@/apps/Media";
import { Calendar, Mail, Messages, Reminders } from "@/apps/Pim";
import { About, AppStore, Maps, Preview, Weather } from "@/apps/Utilities";

export interface AppDef {
  id: string;
  name: string;
  component?: ComponentType<any>;
  category: "System" | "Work" | "Media" | "Internet" | "Fun" | "Utilities";
  hideInLaunchpad?: boolean;
  menus?: string[];
}

export const APPS: AppDef[] = [
  { id: "finder", name: "Finder", component: Finder, category: "System", menus: ["File", "Edit", "View", "Go", "Window", "Help"] },
  { id: "launchpad", name: "Launchpad", category: "System", hideInLaunchpad: true },
  { id: "safari", name: "Safari", component: Safari, category: "Internet", menus: ["File", "Edit", "View", "History", "Bookmarks", "Window", "Help"] },
  { id: "mail", name: "Mail", component: Mail, category: "Internet", menus: ["File", "Edit", "View", "Mailbox", "Message", "Window", "Help"] },
  { id: "messages", name: "Messages", component: Messages, category: "Internet", menus: ["File", "Edit", "View", "Conversation", "Window", "Help"] },
  { id: "maps", name: "Maps", component: Maps, category: "Internet", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "photos", name: "Photos", component: Photos, category: "Media", menus: ["File", "Edit", "Image", "View", "Window", "Help"] },
  { id: "music", name: "Music", component: Music, category: "Media", menus: ["File", "Edit", "Song", "View", "Controls", "Window", "Help"] },
  { id: "notes", name: "Notes", component: Notes, category: "Work", menus: ["File", "Edit", "Format", "View", "Window", "Help"] },
  { id: "reminders", name: "Reminders", component: Reminders, category: "Work", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "calendar", name: "Calendar", component: Calendar, category: "Work", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "appstore", name: "App Store", component: AppStore, category: "System", menus: ["Store", "Edit", "Window", "Help"] },
  { id: "code", name: "Code", component: Code, category: "Work", menus: ["File", "Edit", "Selection", "View", "Go", "Run", "Help"] },
  { id: "terminal", name: "Terminal", component: Terminal, category: "Utilities", menus: ["Shell", "Edit", "View", "Window", "Help"] },
  { id: "calculator", name: "Calculator", component: Calculator, category: "Utilities", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "weather", name: "Weather", component: Weather, category: "Utilities", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "games", name: "Tile Rush", component: Games, category: "Fun", menus: ["Game", "Edit", "View", "Window", "Help"] },
  { id: "settings", name: "System Settings", component: Settings, category: "System", menus: ["File", "Edit", "View", "Window", "Help"] },
  { id: "preview", name: "Preview", component: Preview, category: "Utilities", hideInLaunchpad: true },
  { id: "about", name: "About This Mac", component: About, category: "System", hideInLaunchpad: true },
  { id: "trash", name: "Trash", component: TrashApp, category: "System", hideInLaunchpad: true },
];

export const getApp = (id: string) => APPS.find((a) => a.id === id);
