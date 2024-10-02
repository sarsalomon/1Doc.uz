import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
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

            setProgress(true);

            const formData = new FormData();
            formData.append("text", text);

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

    const handleCopy = useCallback(() => {
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
    }, [endText]);

  
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
                            <Form.Group rows="10" placeholder={t("User:Translater:Add_Text")}>
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
                            <Form.Group rows="10">
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
