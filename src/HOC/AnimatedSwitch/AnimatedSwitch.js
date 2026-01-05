import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Used for wrapping layout to allow for animation when route changes
const animatedSwitch = WrappingComponent => {
  const AnimatedSwitchWrapper = (props) => {
    const location = useLocation();
    return (
      <WrappingComponent {...props} uniqueKey={props.page[0]} location={location}>
        {props.children}
      </WrappingComponent>
    );
  };
  return AnimatedSwitchWrapper;
};

animatedSwitch.propTypes = {
  page: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default animatedSwitch;