import React from 'react';

const Layout = props => {
  return (
    <div>
        <h1>Layout Navbar</h1>
        {props.children}
        <h3>Layout Footer</h3>
    </div>
  );
};

export default Layout;