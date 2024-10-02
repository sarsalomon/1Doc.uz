import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal, Tab, Tabs } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { Context } from "../../main";

import { registration, signIn } from "../../function/http/UserApi";
import { ADMIN_DASHBOARD_ROUTE, HOME_ROUTE, USER_DASHBOARD_ROUTE } from "../../utils/consts";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [key, setKey] = useState("first");

    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [whois, setWhoIs] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showToast = (message, type) => {
        toast[type](t(`${message}`), {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
        const redirectToDashboard = () => {
            if (user) {
                if (user._user.role === "Admin") {
                    navigate(ADMIN_DASHBOARD_ROUTE);
                } else if (["User", "Lawyer"].includes(user._user.role)) {
                    navigate(USER_DASHBOARD_ROUTE);
                }
            } else {
                navigate(HOME_ROUTE);
            }
        };

        redirectToDashboard();
    }, [user, navigate]);

    const handleCheckboxChange = (e) => setWhoIs(e.target.checked);

    const register = async () => {
        try {
            if (password.length < 7 || repeatPassword.length < 7) {
                showToast("General:Auth:Registration:PasswordLengthError", "error");
                return;
            }

            if (password !== repeatPassword) {
                showToast("General:Auth:Registration:RePasswordError", "error");
                return;
            }

            const formData = new FormData();
            formData.append("name", name == "" ? "" : name);
            formData.append("surname", surname == "" ? "" : surname);
            formData.append("phone", phone);
            formData.append("password", password);
            formData.append("whois", whois ? "Lawyer" : "User");

            let data = await registration(formData);

            if (data) {
                user.setUser(data);
                user.setIsAuth(true);
                navigate(USER_DASHBOARD_ROUTE);
            }
        } catch (e) {
            showToast(e.response?.data?.message, "error");
            return;
        }
    };

    const login = async () => {
        if (!phone || !password) {
            showToast("lease enter valid phone number and password", "error");
            return;
        }

        try {
            const data = await signIn(phone, password);

            if (data) {
                user.setUser(data);
                user.setIsAuth(true);

                if (data.role === "Admin") {
                    navigate(ADMIN_DASHBOARD_ROUTE);
                } else if (["User", "Lawyer"].includes(data.role)) {
                    navigate(USER_DASHBOARD_ROUTE);
                }
            }
        } catch (e) {
            showToast(e.response?.data?.message, "error");
            return;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        show ? login() : register();
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === "Enter") {
                handleSubmit();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [name, surname, phone, password, repeatPassword, whois, show]);

    return (
        <>
            <Helmet>
                <title>{t("General:Auth:Registration:PageTitle")}</title>
            </Helmet>
            <div>
                <main>
                    <div className="row">
                        <div className="col-md-8 main-img"></div>

                        <div className="col-md-4 main-content">
                            <h2 className="my-3">Ro'yxatdan o'tish</h2>
                            <form onSubmit={handleSubmit}>
                                <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                                    {/* First Tab */}
                                    <Tab eventKey="first" title="Kirish">
                                        <div className="form-group">
                                            <label htmlFor="phoneInput">Pochta / Telefon raqamingizni kiriting</label>
                                            <input type="text" className="form-control" id="phoneInput" placeholder="+998 xx xxx xx xx" maxLength={9} minLength={9} onChange={(e) => setPhone(e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="passwordInput">Parolni kiriting</label>
                                            <input type="password" className="form-control" id="passwordInput" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <label htmlFor="repasswordInput">Parolni takrorlang</label>
                                            <input type="password" className="form-control" id="repasswordInput" placeholder="********" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
                                            <div className="d-flex justify-content-center align-items-center form-group">
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" id="whoisCheck" checked={whois} onChange={handleCheckboxChange} />
                                                    <label className="form-check-label" htmlFor="whoisCheck">
                                                        Yuridik shaxsman
                                                    </label>
                                                </div>

                                                <button type="button" className="forgot-pass btn btn-link" onClick={handleShow}>
                                                    Akkauntim bor
                                                </button>
                                            </div>
                                        </div>
                                    </Tab>

                                    {/* Second Tab */}
                                    <Tab eventKey="second" title="Kalit orqali kirish">
                                        <div className="form-group">
                                            <label htmlFor="repeatPasswordInput">Kalitni kiriting</label>
                                            <input type="password" className="form-control" id="repeatPasswordInput" placeholder="ЭЦП" onChange={(e) => setRepeatPassword(e.target.value)} />
                                        </div>
                                    </Tab>
                                </Tabs>
                                <div className="form-group">
                                    <button type="submit" className="btn btn-primary">
                                        RO’YXATDAN O’TISH
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

                <Modal className="py-4 sigNmodal" show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
                    <Modal.Header closeButton>
                        <div className=" closeHeader">
                            <Modal.Title>{t("General:Auth:pageTitle")}</Modal.Title>
                            <span onClick={handleClose}>
                                {t("General:Auth:notRegister")} <Link to="/registration">{t("General:Auth:register")}</Link>
                            </span>
                            <button className="closeBtn btn " onClick={handleClose}>
                                X
                            </button>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="d-flex flex-column" onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("General:Auth:phone")}</Form.Label>
                                <Form.Control placeholder={t("General:Auth:phonePlaceholder")} value={phone} onChange={(e) => setPhone(e.target.value)} autoFocus />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>{t("General:Auth:password")}</Form.Label>
                                <Form.Control type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button type="submit">{t("General:Auth:submitBtn")}</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            </div>
        </>
    );
});

export default Auth;
