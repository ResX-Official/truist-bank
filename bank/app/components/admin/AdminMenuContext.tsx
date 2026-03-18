"use client";
import { createContext, useContext } from "react";

export const AdminMenuContext = createContext<() => void>(() => {});
export function useAdminMenu() { return useContext(AdminMenuContext); }
