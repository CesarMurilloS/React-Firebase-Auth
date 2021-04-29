import React from "react"
import { Route, Redirect } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export default function PrivateRoute({ component: Component, layout: Layout, ...rest }) {
  const { currentUser } = useAuth()

  return (
    <Route
      {...rest}
      render={props => {
        return currentUser ? 
        <Layout>
          <Component {...props} />
        </Layout> 
        : 
        <Redirect to="/login" />
      }}
    ></Route>
  )
}
