import Header from '../components/ui/header/Header';
import Footer from '../components/ui/footer/Footer';

const Layout = ({children}) => (
  <div className="layout">
    <Header />
    <main className="main-content">{children}</main>
    <Footer />
  </div>
);

export default Layout;
