import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AppRoute, AuthorizationStatus} from '../../const';
import Spinner from '../spinner/spinner';
import {getAuthorizationStatus} from '../../store/user-slice/selectors.ts';

type PrivateRouteProps = {
  isReverse?: boolean;
  children: JSX.Element;
};

function PrivateRoute({isReverse = false, children}: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useSelector(getAuthorizationStatus);

  if (authorizationStatus === AuthorizationStatus.Unknown) {
    return <Spinner />;
  }

  return (
    authorizationStatus === (isReverse ? AuthorizationStatus.NoAuth : AuthorizationStatus.Auth) ?
      children :
      <Navigate to={isReverse ? AppRoute.Root : AppRoute.Login}/>
  );
}

export default PrivateRoute;
