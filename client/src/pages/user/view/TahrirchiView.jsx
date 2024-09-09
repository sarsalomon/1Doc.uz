import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Form, Button, Accordion } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { checkTahrirchi } from "../../../function/http/TahrirchiAPI";

const UserTahrirchiView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [text, setText] = useState("");
    const [datas, setDatas] = useState([]);
    const [progress, setProgress] = useState(false);

    const handleCheck = async () => {
        try {
            if (text === "") {
                toast.error(t("Please enter text to translate"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            setProgress(true);

            const formData = new FormData();
            formData.append("text", text);

            const data = await checkTahrirchi(formData);
            if (data["action"] === "SUGGESTIONS") {
                setDatas(data["data"]);
                console.log(data["data"]);
            }
        } catch (e) {
            toast.error(t("An error occurred during translation"), {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error("Error:", e);
        } finally {
            setProgress(false);
        }
    };

    const handleCopy = () => {
        if (text) {
            navigator.clipboard.writeText(text);
            toast.success(t("Text copied to clipboard"), {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const changeWord = async (word, replaces) => {
        const regex = new RegExp(word, 'g');
        const escapedWord = text.replace(regex, replaces);
        setText(escapedWord);
    }
    
    return (
        <>
            <Helmet>
                <title>{t("User:Signature:Title")}</title>
            </Helmet>
            <Container fluid>
                <Row className="mt-5">
                    <Col xxl={9} xl={8} lg={8} md={8} xs={12}>
                        <Form>
                            <Form.Group className="mt-3">
                                <Form.Label>{t("Input text")}</Form.Label>
                                <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xxl={3} xl={4} lg={4} md={4} xs={12}>
                        {datas.length > 0 && (
                            <div>
                                {datas.map((data, index) => (
                                    <Accordion defaultActiveKey="0">
                                        <Accordion.Item eventKey={index} key={index}>
                                            <Accordion.Header>{data.token}</Accordion.Header>
                                            <Accordion.Body>
                                                    {data.corrections.map((data) => (
                                                        <Button
                                                            className="me-3 mt-2"
                                                            onClick={() => changeWord(datas[index]["token"], data)}
                                                        >
                                                            {data}
                                                        </Button>
                                                    ))}
                                            <p className="mt-2">Ushbu so‘zda imloviy xatolik bor.</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>
                <Row className="mt-3 mx-auto">
                    <Col className="d-flex justify-content-center align-items-center">
                        <Button onClick={handleCheck} disabled={progress}>
                            {progress ? t("Translating...") : t("Translate")}
                        </Button>
                    </Col>
                </Row>
                {datas.length > 0 && (
                    <Row className="mt-3 mx-auto">
                        <Col className="d-flex justify-content-center align-items-center">
                            <Button onClick={handleCopy}>{t("Copy text")}</Button>
                        </Col>
                    </Row>
                )}
            </Container>
            <ToastContainer />
        </>
    );
});

export default UserTahrirchiView;
