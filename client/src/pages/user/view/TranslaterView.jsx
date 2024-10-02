import React, { useContext, useState, useEffect, useRef } from "react";
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

    const textareaRef = useRef(null);
    const outputTextareaRef = useRef(null);

    const [text, setText] = useState("");
    const [endText, setEndText] = useState("");

    const [fromLang, setFromLang] = useState("uzn_Latn");
    const [toLang, setToLang] = useState("");
    const [progress, setProgress] = useState(false);


    useEffect(() => {
        if (textareaRef.current) {
            if(text === ""){
                textareaRef.current.style.height = '22rem';
            }else{
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
             }
        }

        if (outputTextareaRef.current) {
            outputTextareaRef.current.style.height = 'auto';
            outputTextareaRef.current.style.height = outputTextareaRef.current.scrollHeight + "px";
        }
    }, [text,endText]);


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
                <title>{t("User:Translater:Title")}</title>
            </Helmet>
            <Container className="translate-container">
                {/* <Row>
                    <Col>Tilmoch</Col>
                </Row> */}
                <Row className='translate-row'>
                    <Col className='translate-col'>
                        <Form class='form'>
                            <Form.Select className="custom-select"  value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                                <option value="uzn_Latn">O'zbek</option>
                                <option value="uzn_Cyrl">Ўзбек</option>
                                <option value="rus_Cyrl">Русский</option>
                                <option value="eng_Latn">English</option>
                                <option value="kaa_Latn">Qaraqolpoq</option>
                                <option value="kaa_Cyrl">Қарақолпоқ</option>
                            </Form.Select>
                            <Form.Group className="mt-3" rows="10" placeholder={t("User:Translater:Add_Text")}>
                              
                               <Form.Control 
                                    className="custom-textarea active:outline-none focus:outline-none"
                                    as="textarea" 
                                    rows={3} 
                                    value={text} 
                                    placeholder={t("User:Translater:Translate_Text")}
                                    onChange={(e) => setText(e.target.value)} 
                                    ref={textareaRef}
                                />

                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className='translate-col'>
                        <Form class='form'>
                            <Form.Select className="custom-select" value={toLang} onChange={(e) => setToLang(e.target.value)}>
                                <option value="">{t("User:Translater:To_Lang")}</option>
                                <option value="uzn_Latn">O'zbek</option>
                                <option value="uzn_Cyrl">Ўзбек</option>
                                <option value="rus_Cyrl">Русский</option>
                                <option value="eng_Latn">English</option>
                                <option value="kaa_Latn">Qaraqolpoq</option>
                                <option value="kaa_Cyrl">Қарақолпоқ</option>
                            </Form.Select>
                            <Form.Group className="mt-3" rows="10">
                                {/* <Form.Label>{t("User:Translater:Translate_Text")}</Form.Label> */}
                                <InputGroup>
                                    <Form.Control 
                                    className="custom-textarea active:outline-none focus:outline-none"
                                    as="textarea"
                                    rows={3} 
                                    value={endText} 
                                    ref={outputTextareaRef}
                                    readOnly />

                                    {endText != "" ? (
                                        <Button onClick={handleCopy}>
                                            <FaRegCopy />
                                        </Button>
                                    ) : null}
                                    <Button className='custom-btn' onClick={handleTranslate} disabled={progress}>
                                    {progress ? t("User:Translater:Progress") : t("User:Translater:Translate")}
                                </Button>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                
            </Container>
            <ToastContainer />
        </>
    );
});

export default UserTranslaterView;
