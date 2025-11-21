import { Route } from "react-router";
import { lazy } from "react";
import SignIn from "../pages/AuthPages/SignIn";

const NotFound = lazy(() => import("../pages/OtherPage/NotFound"));

export const UnauthenticatedRoutes = () => {
    return (
        <>
            <Route path="/signin" element={<SignIn />} />;
            <Route path="*" element={<NotFound />} />;
        </>
    );
};
