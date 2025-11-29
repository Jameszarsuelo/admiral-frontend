import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../public/images/auth/admiral-logo.png";

import {
    BoxCubeIcon,
    ChevronDownIcon,
    EnvelopeIcon,
    GridIcon,
    HorizontaLDots,
    ListIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { usePermissions } from "@/hooks/usePermissions";
import SidebarSkeleton from "@/components/ui/SideBarSkeleton";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const iconMap: Record<string, React.ReactNode> = {
    dashboard: <GridIcon />,
    contact_directory: <GridIcon />,
    invoice_detail: <GridIcon />,
    task_detail: <GridIcon />,
    supplier_directory: <GridIcon />,
    exceptions: <ListIcon />,
    upload_exceptions: <ListIcon />,
    email_templates: <EnvelopeIcon />,
    template_a: <EnvelopeIcon />,
    configuration: <BoxCubeIcon />,
    ipc: <BoxCubeIcon />,
    outcomes: <BoxCubeIcon />,
    planning: <BoxCubeIcon />,
    profiles: <BoxCubeIcon />,
    task_queues: <BoxCubeIcon />,
    users: <BoxCubeIcon />,
    reports: <GridIcon />,
    document_management: <GridIcon />,
    bordereau_query_management: <GridIcon />,
    invoice_query_management: <GridIcon />,
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const { modules, loading } = usePermissions();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "configurations" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {},
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback(
        (path: string) => location.pathname === path,
        [location.pathname],
    );

    const mainModules = modules.filter((m) => m.parent === null);
    const subModules = modules.filter((m) => m.parent !== null);

    // Convert backend modules → NavItem format your sidebar uses
    const dynamicNavItems: NavItem[] = mainModules.map((m) => {
        const children = subModules.filter((child) => child.parent === m.code);

        return {
            name: m.name,
            icon: iconMap[m.code] ?? <GridIcon />, // default icon
            path: m.path || undefined,
            subItems: children.length
                ? children.map((ch) => ({
                      name: ch.name,
                      path: ch.path || "",
                  }))
                : undefined,
        };
    });

    const mainItems = dynamicNavItems.filter(
        (i) =>
            i.name === "Workplace" ||
            i.name === "Dashboard" ||
            i.name === "Contact Directory" ||
            i.name === "Bordereau Detail" ||
            i.name === "Task Detail" ||
            i.name === "Supplier Directory" ||
            i.name === "Exceptions" ||
            i.name === "Upload Exceptions",
    );

    const configItems = dynamicNavItems.filter(
        (i) =>
            i.name === "System Configurations" || i.name === "Email Templates",
    );
    const othersItems = dynamicNavItems.filter(
        (i) =>
            i.name === "Reports" ||
            i.name === "Document Management" ||
            i.name === "Bordereau Query Management" ||
            i.name === "Invoice Query Management",
    );

    useEffect(() => {
        // Close submenu when sidebar collapses
        if (!isExpanded && !isHovered) {
            setOpenSubmenu(null);
        }
    }, [isExpanded, isHovered]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (
        index: number,
        menuType: "main" | "configurations" | "others",
    ) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (
        items: NavItem[],
        menuType: "main" | "configurations" | "others",
    ) => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <li key={nav.name}>
                    {nav.subItems ? (
                        <button
                            onClick={() => handleSubmenuToggle(index, menuType)}
                            className={`menu-item group ${
                                openSubmenu?.type === menuType &&
                                openSubmenu?.index === index
                                    ? "menu-item-active"
                                    : "menu-item-inactive"
                            } cursor-pointer ${
                                !isExpanded && !isHovered
                                    ? "lg:justify-center"
                                    : "lg:justify-start"
                            }`}
                        >
                            <span
                                className={`menu-item-icon-size  ${
                                    openSubmenu?.type === menuType &&
                                    openSubmenu?.index === index
                                        ? "menu-item-icon-active"
                                        : "menu-item-icon-inactive"
                                }`}
                            >
                                {nav.icon}
                            </span>
                            {(isExpanded || isHovered || isMobileOpen) && (
                                <span className="menu-item-text">
                                    {nav.name}
                                </span>
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
                                    isActive(nav.path)
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
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
                                    <span className="menu-item-text">
                                        {nav.name}
                                    </span>
                                )}
                            </Link>
                        )
                    )}
                    {nav.subItems &&
                        (isExpanded || isHovered || isMobileOpen) && (
                            <div
                                ref={(el) => {
                                    subMenuRefs.current[
                                        `${menuType}-${index}`
                                    ] = el;
                                }}
                                className="overflow-hidden transition-all duration-300"
                                style={{
                                    height:
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? `${
                                                  subMenuHeight[
                                                      `${menuType}-${index}`
                                                  ]
                                              }px`
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
                                                                isActive(
                                                                    subItem.path,
                                                                )
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
                                                                isActive(
                                                                    subItem.path,
                                                                )
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

    if (loading) return <SidebarSkeleton />;

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
            <div
                className={`py-8 flex ${
                    !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                }`}
            >
                <Link to="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <div className="dark:hidden flex items-center gap-3">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                />
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Admiral
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Invoice Processing Tool
                                    </p>
                                </div>
                            </div>
                            <div className="hidden dark:flex items-center gap-3">
                                <img
                                    src={logo}
                                    alt="Logo"
                                    width={60}
                                    height={60}
                                />
                                <div className="flex flex-col">
                                    <h1 className="text-xl font-bold text-white">
                                        Admiral
                                    </h1>
                                    <p className="text-xs text-white font-medium">
                                        Invoice Processing Tool
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <img
                            src="/images/logo/logo-icon.svg"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        {mainItems.length > 0 && (
                            <div>
                                <h2
                                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                        !isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "justify-start"
                                    }`}
                                >
                                    {isExpanded || isHovered || isMobileOpen ? (
                                        "Menu"
                                    ) : (
                                        <HorizontaLDots className="size-6" />
                                    )}
                                </h2>
                                {renderMenuItems(mainItems, "main")}
                            </div>
                        )}

                        {configItems.length > 0 && (
                            <div className="">
                                <h2
                                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                        !isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "justify-start"
                                    }`}
                                >
                                    {isExpanded || isHovered || isMobileOpen ? (
                                        "Configurations"
                                    ) : (
                                        <HorizontaLDots />
                                    )}
                                </h2>
                                {renderMenuItems(configItems, "configurations")}
                            </div>
                        )}

                        {othersItems.length > 0 && (
                            <div className="">
                                <h2
                                    className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                        !isExpanded && !isHovered
                                            ? "lg:justify-center"
                                            : "justify-start"
                                    }`}
                                >
                                    {isExpanded || isHovered || isMobileOpen ? (
                                        "Others"
                                    ) : (
                                        <HorizontaLDots />
                                    )}
                                </h2>
                                {renderMenuItems(othersItems, "others")}
                            </div>
                        )}
                    </div>
                </nav>
                {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
            </div>
        </aside>
    );
};

export default AppSidebar;
