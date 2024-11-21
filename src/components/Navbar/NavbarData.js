import { FaUsers } from "react-icons/fa";
import { GiWhiteBook } from "react-icons/gi";
import { FaBalanceScale } from "react-icons/fa";
import { LiaClipboardListSolid } from "react-icons/lia";

export const NavBarData = [
  {
    title: "Verificaciones diarias",
    path: "/registros/diarios",
    icon: <LiaClipboardListSolid />,
    cName: "nav-text",
    access: ['admin', 'planta', 'logistica', 'calidad']
  },
  {
    title: "Listado verificaciones",
    path: "/verificaciones",
    icon: <GiWhiteBook />,
    cName: "nav-text",
    access: ['admin','calidad']
  },
  {
    title: "Grameras",
    path: "/grameras",
    icon: <FaBalanceScale />,
    cName: "nav-text",
    access: ['admin','calidad']
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: <FaUsers />,
    cName: "nav-text",
    access: ['admin']
  },
];