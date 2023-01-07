import React from "react";
import { Route, Redirect } from "react-router-dom";

// handle the public routes
function PublicRoute({ component: Component, authenticated, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) =>
                authenticated === false ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/ads/add" }} />
                )
            }
        />
    );
}

export default PublicRoute;

