import { Outlet, useLocation } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer';
import { AuthorizationStatus } from '../../const';

type LayoutProps = {
  authorizationStatus: AuthorizationStatus;
};

function Layout({ authorizationStatus }: LayoutProps): JSX.Element {
  const { pathname } = useLocation();

  const isLoginPage = pathname === '/login';
  const isFavoritesPage = pathname === '/favorites';

  return (
    <>
      <Header
        authorizationStatus={authorizationStatus}
        isLoginPage={isLoginPage}
      />
      <Outlet />
      {isFavoritesPage && <Footer />}
    </>
  );
}

export default Layout;
