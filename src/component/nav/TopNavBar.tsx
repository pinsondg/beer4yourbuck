import React, {useState} from "react";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink} from "reactstrap";

interface Props {

}

export function TopNavBar(props: Props) {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Beer 4 Your Buck</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <NavLink href={'/near'}>Near You</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={'/compare'}>Compare</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href={'/photo'}>Photo Upload</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}