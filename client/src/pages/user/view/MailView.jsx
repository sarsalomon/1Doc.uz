import { Container, Row, Col, Tabs, Tab, Button, Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { USER_DASHBOARD_CONTRACT_ADD_ROUTE } from "../../../utils/consts";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { useTranslation } from "react-i18next";

const UserMailView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();


    return (
        <>
            <Helmet>
                <title>{t("User:Mail:Title")}</title>
            </Helmet>
            <Container fluid>
                <Row>
                    <Col xxl={11} xl={11} lg={11} md={11} sm={11} className="main-content">
                      
                    </Col>
                </Row>
            </Container>
        </>
    );
});

export default UserMailView;
