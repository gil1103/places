import React from 'react';
import {CSSTransition} from 'react-transition-group';
// import  ReactDOM  from 'react-dom';
import './SideDrawer.css';


export const SideDrawer = (props) => {
	return (
    <CSSTransition 
      in={props.show} 
      timeout={200} 
      classNames="slide-in-left" // classes found on index.css
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );
};

//optional
// export const SideDrawer = (props) => {
//   const content = <aside className="side-drawer">{props.children}</aside>;
//   return ReactDOM.createPortal(content, document.getElementById('drawer-hook'))
// }
