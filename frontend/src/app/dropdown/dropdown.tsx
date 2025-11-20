"use client";

import { JSX } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVertical } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Login } from "./login/login";
import { About } from "./about/about";
import { Settings } from "./settings/settings";

export function Dropdown(): JSX.Element {
  const { setIsLoginOpen, setIsAboutOpen, setIsSettingsOpen } = useAppContext();

  const menuItems = [
    { label: "Settings", onClick: () => setIsSettingsOpen(true) },
    { label: "About", onClick: () => setIsAboutOpen(true) },
    { label: "Account", onClick: () => setIsLoginOpen(true) },
  ];

  return (
    <div className="fixed top-3 z-[10000]">
      <Menu as="div" className="relative inline-block">
        <MenuButton className="mt-12 ml-12 flex items-center justify-center rounded-full size-12 bg-white text-sm font-semibold text-black data-focus:text-blue hover:bg-blue-100">
          <EllipsisVertical className="w-6 h-6" />
        </MenuButton>

        <MenuItems
          transition
          className="mt-2 w-56 rounded-md outline-1 bg-white transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          <div className="py-1">
            {menuItems.map((item) => (
              <MenuItem key={item.label}>
                <button
                  type="button"
                  onClick={item.onClick}
                  className="block w-full text-left px-4 py-2 text-sm text-black data-[focus]:bg-blue-100 data-[focus]:text-black"
                >
                  {item.label}
                </button>
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      <Settings />
      <About />
      <Login />
    </div>
  );
}
