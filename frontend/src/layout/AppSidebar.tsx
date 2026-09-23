import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { getUserRole } from "@/lib/auth";

import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";

import {
  Car,
  CarFront,
  CheckCircle,
  ClipboardList,
  Database,
  Fuel,
  LogOut,
  Map,
  Wrench,
} from "lucide-react";

import { logout } from "@/pages/AuthPages/components/endpoint";
import { Users } from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
  }[];
};

const dashboardItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
];

const vehicleManagementItems: NavItem[] = [
  {
    icon: <CarFront size={18} />,
    name: "Vehicles",
    path: "/vehicles",
  },
  {
    icon: <Users size={18} />, 
    name: "Drivers",
    path: "/drivers",
  },
];

const adminItems: NavItem[] = [
  {
    icon: <ClipboardList size={18} />,
    name: "Reservasi Kendaraan",
    path: "/reservations",
  },
  {
    icon: <Car size={18} />,
    name: "Penggunaan Kendaraan",
    path: "/vehicle-usages",
  },
  {
    icon: <Fuel size={18} />,
    name: "BBM",
    path: "/fuel-records",
  },
  {
    icon: <Wrench size={18} />,
    name: "Service",
    path: "/services",
  },
  {
    icon: <Database size={18} />,
    name: "Master Data",
    subItems: [
      {
        name: "Data Kantor",
        path: "/master/offices",
      },
      {
        name: "Data Wilayah",
        path: "/master/regions",
      },
    ],
  },
];

const approvalLv1Items: NavItem[] = [
  {
    icon: <CheckCircle size={18} />,
    name: "Approval Level 1",
    path: "/approvals/level-1",
  },
];

const approvalLv2Items: NavItem[] = [
  {
    icon: <CheckCircle size={18} />,
    name: "Approval Level 2",
    path: "/approvals/level-2",
  },
];

const accountItems: NavItem[] = [
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/profile",
  },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const userRole = getUserRole();

  const isAdmin = userRole === "ADMIN";
  const isOperational = userRole === "KEPALA_OPERASIONAL";
  const isManager = userRole === "MANAGER";

  // Memastikan ketiga role ini bisa melihat menu Vehicles
  const canAccessVehicles = isAdmin || isOperational || isManager;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    setOpenSubmenu(null);
  }, [location]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/signin");
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const SectionHeader = ({ label }: { label: string }) => (
    <h2
      className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
        !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
      }`}
    >
      {isExpanded || isHovered || isMobileOpen ? (
        label
      ) : (
        <HorizontaLDots className="size-6" />
      )}
    </h2>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className="flex items-center gap-3">
              <img
                src="/images/logo/Fleet-Reserve-Light-Mode.png"
                alt="Vehicle Reservation Management System"
                className="h-10 w-auto object-contain flex-shrink-0"
              />
              <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                VRMS
              </span>
            </div>
          ) : (
            <img
              src="/images/logo/Fleet-Reserve-Light-Mode.png"
              alt="VRMS"
              className="h-10 w-10 object-contain"
            />
          )}
        </Link>
      </div>

      {/* Scrollable nav */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              
              <div>
                <SectionHeader label="Dashboard" />
                {renderMenuItems(dashboardItems, "main")}
              </div>

              {/* Render Menu Vehicle jika memiliki akses */}
              {canAccessVehicles && (
                <div>
                  <SectionHeader label="Master Kendaraan" />
                  {renderMenuItems(vehicleManagementItems, "main")}
                </div>
              )}

              {isAdmin && (
                <div>
                  <SectionHeader label="Operasional" />
                  {renderMenuItems(adminItems, "main")}
                </div>
              )}

              {isOperational && (
                <div>
                  <SectionHeader label="Approval" />
                  {renderMenuItems(approvalLv1Items, "main")}
                </div>
              )}

              {isManager && (
                <div>
                  <SectionHeader label="Approval" />
                  {renderMenuItems(approvalLv2Items, "main")}
                </div>
              )}

              <div>
                <SectionHeader label="Account" />
                {renderMenuItems(accountItems, "main")}
              </div>

            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="mb-8 mt-2">
          <button
            onClick={handleLogout}
            className={`menu-item group menu-item-inactive w-full ${
              !isExpanded && !isHovered
                ? "lg:justify-center"
                : "lg:justify-start"
            }`}
          >
            <span className="menu-item-icon-size menu-item-icon-inactive">
              <LogOut className="size-5" />
            </span>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span className="menu-item-text">Logout</span>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;