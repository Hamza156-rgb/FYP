import React from "react";
import { Route, Redirect } from "react-router-dom";

// handle the private routes
function PrivateRoute({ component: Component, authenticated, ...rest }) {
    
    return (
        <Route
            {...rest}
            render={(props) =>
                authenticated === true
                    ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{ pathname: "/", state: { from: props.location } }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute;
