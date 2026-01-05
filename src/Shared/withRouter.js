import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
      <Component
        {...props}
        location={location}
        navigate={navigate}
        params={params}
        history={{
          push: navigate,
          replace: (path) => navigate(path, { replace: true }),
          action: 'PUSH',
          goBack: () => navigate(-1)
        }}
      />
    );
  }

  return ComponentWithRouterProp;
}
