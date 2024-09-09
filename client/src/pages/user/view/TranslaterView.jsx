import React, { useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { translateTahrirchi } from "../../../function/http/TahrirchiAPI";
import { FaRegCopy } from "react-icons/fa";

const UserTranslaterView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [text, setText] = useState("");
    const [endText, setEndText] = useState("");

    const [fromLang, setFromLang] = useState("uzn_Latn");
    const [toLang, setToLang] = useState("");
    const [progress, setProgress] = useState(false);

    const handleTranslate = async () => {
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

            if (fromLang === "") {
                toast.error(t("Please select the source language"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            if (toLang === "") {
                toast.error(t("Please select the target language"), {
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
            formData.append("fromLang", fromLang);
            formData.append("toLang", toLang);

            const data = await translateTahrirchi(formData);
            const sentences = data?.chunks[0]?.sentences || [];
            const translatedText = sentences.map((sentence) => sentence.translated).join(" ");

            setEndText(translatedText);
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
        if (endText) {
            navigator.clipboard.writeText(endText);
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

    return (
        <>
            <Helmet>
                <title>{t("User:Signature:Title")}</title>
            </Helmet>
            <Container className="mt-3">
                <Row>
                    <Col>Tilmoch</Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <Form.Select value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                                <option value="uzn_Latn">O'zbek</option>
                                <option value="uzn_Cyrl">Ўзбек</option>
                                <option value="rus_Cyrl">Русский</option>
                                <option value="eng_Latn">English</option>
                                <option value="kaa_Latn">Qaraqolpoq</option>
                                <option value="kaa_Cyrl">Қарақолпоқ</option>
                            </Form.Select>
                            <Form.Group className="mt-3" rows="10" placeholder="Enter text here...">
                                <Form.Label>{t("Input text")}</Form.Label>
                                <Form.Control as="textarea" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Select value={toLang} onChange={(e) => setToLang(e.target.value)}>
                                <option value="">{t("Select target language")}</option>
                                <option value="uzn_Latn">O'zbek</option>
                                <option value="uzn_Cyrl">Ўзбек</option>
                                <option value="rus_Cyrl">Русский</option>
                                <option value="eng_Latn">English</option>
                                <option value="kaa_Latn">Qaraqolpoq</option>
                                <option value="kaa_Cyrl">Қарақолпоқ</option>
                            </Form.Select>
                            <Form.Group className="mt-3" rows="10" placeholder="Enter text here...">
                                <Form.Label>{t("Translated text")}</Form.Label>
                                <InputGroup>
                                    <Form.Control as="textarea" rows={3} value={endText} readOnly />
                                    {endText != "" ? (
                                        <Button onClick={handleCopy}>
                                            <FaRegCopy />
                                        </Button>
                                    ) : null}
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-3 mx-auto">
                    <Col className="d-flex justify-content-center align-items-center">
                        <Button onClick={handleTranslate} disabled={progress}>
                            {progress ? t("Translating...") : t("Translate")}
                        </Button>
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
});

export default UserTranslaterView;
