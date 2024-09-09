import { Container, Row, Col, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { Context } from "../main";
import { NavLink } from "react-router-dom";
import { HOME_ROUTE, USER_DASHBOARD_ROUTE } from "../utils/consts";

const NotFound = observer(() => {
    const { user } = useContext(Context);
    const isAuth = user.isAuth;

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xxl={4} xl={4} lg={4} md={4} xs={12}></Col>
                    <Col xxl={4} xl={4} lg={4} md={4} xs={12}>
                        404
                        <p>Siz qidirga sahifa topilmadi</p>
                        {isAuth === false ? (
                            <NavLink to={HOME_ROUTE}>
                                <Button> Bosh sahifaga qaytish</Button>
                            </NavLink>
                        ) : (
                            <NavLink to={USER_DASHBOARD_ROUTE}>
                                <Button> Bosh sahifaga qaytish</Button>
                            </NavLink>
                        )}
                    </Col>
                    <Col xxl={4} xl={4} lg={4} md={4} xs={12}></Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
});

export default NotFound;
