import { Route } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import SidebarSkeleton from "@/components/ui/SideBarSkeleton";
import { JSX, lazy } from "react";
import { modulePageMap } from "./modulePages";

const OverviewHeadcount = lazy(() => import("@/pages/Overview/HeadcountIndex"));
const OverviewProductionLine = lazy(() => import("@/pages/Overview/ProductionLineIndex"));
const OverviewOutstandingQueries = lazy(() => import("@/pages/Overview/OutstandingQueriesIndex"));
const OverviewForecast = lazy(() => import("@/pages/Overview/ForecastIndex"));
const OverviewTimToday = lazy(() => import("@/pages/Overview/TimTodayIndex"));
const OverviewTimBot = lazy(() => import("@/pages/Overview/TimBotIndex"));

export const AuthenticatedRoutes = () => {
    const { modules, loading } = usePermissions();

    if (loading) {
        return [<Route key="loading" element={<SidebarSkeleton />} />];
    }

    // const Dashboard = modulePageMap["dashboard"].main;
    const NotFound = modulePageMap["not_found"].main;

    const dynamicRoutes = modules.flatMap((m) => {
        const components = modulePageMap[m.code];
        if (!components) return [];

        const permissionBase = m.code;
        const routes: JSX.Element[] = [];

        // MAIN PAGE
        const Main = components.main;
        routes.push(
            <Route
                key={`${m.code}-main`}
                path={m.path!}
                element={
                    <ProtectedRoute permission={`${permissionBase}.view`}>
                        <Main />
                    </ProtectedRoute>
                }
            />
        );

        // CREATE ROUTE
        if (components.create && m.actions.includes(`${permissionBase}.create`)) {
            const Create = components.create;
            routes.push(
                <Route
                    key={`${m.code}-create`}
                    path={`${m.path}/create`}
                    element={
                        <ProtectedRoute permission={`${permissionBase}.create`}>
                            <Create />
                        </ProtectedRoute>
                    }
                />
            );
        }

        // EDIT ROUTE
        if (components.edit && m.actions.includes(`${permissionBase}.edit`)) {
            const Edit = components.edit;
            routes.push(
                <Route
                    key={`${m.code}-edit`}
                    path={`${m.path}/edit/:id`}
                    element={
                        <ProtectedRoute permission={`${permissionBase}.edit`}>
                            <Edit />
                        </ProtectedRoute>
                    }
                />
            );
        }

        // VIEW ROUTE
        if (components.view && m.actions.includes(`${permissionBase}.view`)) {
            const View = components.view;
            routes.push(
                <Route
                    key={`${m.code}-view`}
                    path={`${m.path}/view/:id`}
                    element={
                        <ProtectedRoute permission={`${permissionBase}.view`}>
                            <View />
                        </ProtectedRoute>
                    }
                />
            );
        }

        return routes;
    });

    const hasOverviewModule = modules.some((m) => m.code === "overview");

    return [
        <Route key="protected" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
                {/* <Route index element={<Dashboard />} /> */}

                {dynamicRoutes}

                {hasOverviewModule && (
                    <Route
                        path="/overview/headcount"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewHeadcount />
                            </ProtectedRoute>
                        }
                    />
                )}

                {hasOverviewModule && (
                    <Route
                        path="/overview/production-line"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewProductionLine />
                            </ProtectedRoute>
                        }
                    />
                )}

                {hasOverviewModule && (
                    <Route
                        path="/overview/outstanding-queries"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewOutstandingQueries />
                            </ProtectedRoute>
                        }
                    />
                )}

                {hasOverviewModule && (
                    <Route
                        path="/overview/forecast"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewForecast />
                            </ProtectedRoute>
                        }
                    />
                )}

                {hasOverviewModule && (
                    <Route
                        path="/overview/tim-today"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewTimToday />
                            </ProtectedRoute>
                        }
                    />
                )}

                {hasOverviewModule && (
                    <Route
                        path="/overview/tim-bot"
                        element={
                            <ProtectedRoute permission="overview.view">
                                <OverviewTimBot />
                            </ProtectedRoute>
                        }
                    />
                )}

                <Route path="*" element={<NotFound />} />
            </Route>
        </Route>,
    ];
};
