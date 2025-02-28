import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {Link} from "react-router-dom";

export default function Sidebar({title}) {
    return (
      <>
        <Navbar key="false" expand="false" className="bg-body-tertiary mb-3">
          <Container fluid>
            <Navbar.Brand href="#">{title}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                  Powered by SiteForge
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link>
                    <Link to="/admin">Home</Link>
                  </Nav.Link>
                  <NavDropdown
                    title="Accounts"
                    id={`offcanvasNavbarDropdown-expand-lg`}
                  >
                    <NavDropdown.Item>
                      <Link to="/admin/account/create">Create Account</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/admin/accounts">View Accounts</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    title="Pages"
                    id={`offcanvasNavbarDropdown-expand-lg`}
                  >
                    <NavDropdown.Item>
                      <Link to="/admin/page/create">Create Page</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/admin/pages">View Pages</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    title="Posts"
                    id={`offcanvasNavbarDropdown-expand-lg`}
                  >
                    <NavDropdown.Item>
                      <Link to="/admin/post/create">Create Post</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/admin/posts">View Posts</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                  <NavDropdown
                    title="Themes"
                    id={`offcanvasNavbarDropdown-expand-lg`}
                  >
                    <NavDropdown.Item>
                      <Link to="/admin/themes">Browse Themes</Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/admin/theme/import">Import Theme</Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link>
                    <Link to="/admin/settings">Settings</Link>
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </>
    );
}