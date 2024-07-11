import Footer from "../components/Footer";
import Header from "../components/Header";

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header at the top */}
      <Header />
      
      {/* Main content area */}
      <div className="container mx-auto py-10 flex-1">
        {children}
      </div>
      
      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default Layout;
