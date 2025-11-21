import { Route } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { usePermissions } from "@/hooks/usePermissions";
import SidebarSkeleton from "@/components/ui/SideBarSkeleton";
import { JSX } from "react";
import { modulePageMap } from "./modulePages";

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

    return [
        <Route key="protected" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
                {/* <Route index element={<Dashboard />} /> */}

                {dynamicRoutes}

                <Route path="*" element={<NotFound />} />
            </Route>
        </Route>,
    ];
};
