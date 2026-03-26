import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "../../public/images/auth/admiral-logo.png";

import {
    BoxCubeIcon,
    ChevronDownIcon,
    GridIcon,
    HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { usePermissions } from "@/hooks/usePermissions";
import SidebarSkeleton from "@/components/ui/SideBarSkeleton";
import {
    ArchiveBoxIcon,
    BuildingOffice2Icon,
    ChartBarIcon,
    ClipboardDocumentIcon,
    Cog8ToothIcon,
    ComputerDesktopIcon,
    ClockIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    ListBulletIcon,
    QuestionMarkCircleIcon,
    Squares2X2Icon,
    UsersIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const iconMap: Record<string, React.ReactNode> = {
    dashboard: <Squares2X2Icon />,
    contact_directory: <UsersIcon />,
    bordereau_detail: <ListBulletIcon />,
    task_detail: <ClipboardDocumentIcon />,
    supplier_directory: <BuildingOffice2Icon />,
    exceptions: <ExclamationTriangleIcon />,
    upload_exceptions: <ExclamationTriangleIcon />,
    email_templates: <EnvelopeIcon />,
    template_a: <EnvelopeIcon />,
    configuration: <Cog8ToothIcon />,
    ipc: <BoxCubeIcon />,
    outcomes: <BoxCubeIcon />,
    planning: <BoxCubeIcon />,
    profiles: <BoxCubeIcon />,
    task_queues: <BoxCubeIcon />,
    users: <BoxCubeIcon />,
    reports: <ChartBarIcon />,
    document_management: <ArchiveBoxIcon />,
    bordereau_query_management: <QuestionMarkCircleIcon />,
    bordereau_processing_queue: <QuestionMarkCircleIcon />,
    bpc_supplier_skills: <QuestionMarkCircleIcon />,
    workplace: <ComputerDesktopIcon />,
    overview: <ListBulletIcon />,
    navigation_audit_logs: <ClockIcon />,
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const location = useLocation();
    const navigate = useNavigate();
    const { modules, loading } = usePermissions();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "configurations" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {},
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Treat a route as active if the current pathname matches it exactly
    // or is a nested path under it (e.g. "/bordereau-detail/view/123" should
    // keep the "/bordereau-detail" menu item highlighted).
    // Special cases:
    // - The dashboard root path "/" should only be active on the exact
    //   homepage, not for every route.
    // - "Activity Query Management" currently has a path alias mismatch
    //   between frontend routes and backend module config, so we treat
    //   "/activity-query-management" and "/bordereau-query-management"
    //   as equivalent for active-state purposes.
    const isActive = useCallback(
        (path: string) => {
            if (!path) return false;

            const current = location.pathname.replace(/\/+$/, "") || "/";
            const target = path.replace(/\/+$/, "") || "/";

            // Root/dashboard: only active on exact match
            if (target === "/") {
                return current === "/";
            }

            const isDirectMatch =
                current === target || current.startsWith(`${target}/`);
            if (isDirectMatch) return true;

            // Handle known path aliases
            const aliasMap: Record<string, string[]> = {
                "/activity-query-management": ["/bordereau-query-management"],
                "/bordereau-query-management": ["/activity-query-management"],
                "/navigation-audit-logs": [
                    "/system-configurations/navigation-audit-logs",
                ],
                "/system-configurations/navigation-audit-logs": [
                    "/navigation-audit-logs",
                ],
            };

            const aliases = aliasMap[target];
            if (!aliases) return false;

            return aliases.some(
                (alias) => current === alias || current.startsWith(`${alias}/`),
            );
        },
        [location.pathname],
    );

    const handleNavigationClick = useCallback(
        (
            event: React.MouseEvent<HTMLAnchorElement>,
            _page: string,
            uri: string,
        ) => {
            event.preventDefault();

            navigate(uri);
        },
        [navigate],
    );

    const currentPath = location.pathname.replace(/\/+$/, "") || "/";

    const isNavItemActive = (nav: NavItem): boolean => {
        const path = nav.path ?? "";
        if (isActive(path)) return true;

        switch (nav.name) {
            case "Overview":
                return currentPath.startsWith("/overview");
            case "Activity Query Management":
                return (
                    currentPath.startsWith("/activity-query-management") ||
                    currentPath.startsWith("/bordereau-query-management")
                );
            default:
                return false;
        }
    };

    const isSubItemActive = (subItem: {
        name: string;
        path: string;
    }): boolean => {
        if (isActive(subItem.path)) return true;

        switch (subItem.name) {
            case "Work Types":
                return (
                    currentPath.startsWith("/work-types") ||
                    currentPath.startsWith("/system-configurations/work-types")
                );
            case "Navigation Audit Logs":
                return (
                    currentPath.startsWith("/navigation-audit-logs") ||
                    currentPath.startsWith(
                        "/system-configurations/navigation-audit-logs",
                    )
                );
            default:
                return false;
        }
    };

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
            i.name === "Overview" ||
            i.name === "Dashboard" ||
            i.name === "Contact Directory" ||
            i.name === "Activity Detail" ||
            i.name === "Task Detail" ||
            i.name === "Supplier Directory" ||
            i.name === "Exceptions" ||
            i.name === "Upload Exceptions" ||
            i.name === "BPC Supplier Skills" ||
            i.name === "Reports" ||
            i.name === "Document Management" ||
            i.name === "Activity Query Management" ||
            i.name === "Navigation Audit Logs",
    );

    const configItems = dynamicNavItems.filter(
        (i) =>
            i.name === "System Configurations" || i.name === "Email Templates",
    );
    // const othersItems = dynamicNavItems.filter(
    //     (i) =>

    // );

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
                                onClick={(event) =>
                                    handleNavigationClick(
                                        event,
                                        nav.name,
                                        nav.path!,
                                    )
                                }
                                className={`menu-item group ${
                                    isNavItemActive(nav)
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                }`}
                            >
                                <span
                                    className={`menu-item-icon-size ${
                                        isNavItemActive(nav)
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
                                                onClick={(event) =>
                                                    handleNavigationClick(
                                                        event,
                                                        subItem.name,
                                                        subItem.path,
                                                    )
                                                }
                                                className={`menu-dropdown-item ${
                                                    isSubItemActive(subItem)
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
                <Link
                    to="/"
                    onClick={(event) =>
                        handleNavigationClick(event, "Dashboard", "/")
                    }
                >
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
                                        Alloc8
                                    </h1>
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
                                        Alloc8
                                    </h1>
                                    <p className="text-xs text-white font-medium">
                                        Bordereau Processing Tool
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
                                    className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
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
                                    className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
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

                        {/* {othersItems.length > 0 && (
                            <div className="">
                                <h2
                                    className={`mb-4 text-xs uppercase flex leading-5 text-gray-400 ${
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
                        )} */}
                    </div>
                </nav>
                {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
            </div>
        </aside>
    );
};

export default AppSidebar;
