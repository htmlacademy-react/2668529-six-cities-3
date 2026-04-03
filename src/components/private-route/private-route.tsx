import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AppRoute, AuthorizationStatus} from '../../const';
import {State} from '../../store';
import Spinner from '../spinner/spinner';

type PrivateRouteProps = {
  isReverse?: boolean;
  children: JSX.Element;
};

function PrivateRoute({isReverse, children}: PrivateRouteProps): JSX.Element {
  const authorizationStatus = useSelector(
    (state: State) => state.authorizationStatus
  );

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
