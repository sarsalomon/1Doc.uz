import { observer } from "mobx-react-lite";
import React, { useCallback, useContext, useState } from "react";
import { Accordion, Button, Col, Container, Form, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaRegCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { checkTahrirchi } from "../../../function/http/TahrirchiAPI";
import { Context } from "../../../main";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UserTahrirchiView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [text, setText] = useState("");
    const [datas, setDatas] = useState([]);
    const [progress, setProgress] = useState(false);

    const modules = {
        toolbar: [["bold", "italic", "underline"], [{ header: "1" }, { header: "2" }], [{ list: "ordered" }, { list: "bullet" }], ["clean"]],
    };

    const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

    // Text instruments

    const handleCheck = useCallback(async () => {
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

            setDatas([]);

            setProgress(true);

            const editor = document.querySelector(".ql-editor");
            const plainText = editor.innerText || text;

            const ws = checkAlphabet(plainText);

            if (ws == "3" || ws == "4") {
                toast.error(t("Text xatolik"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            const formData = new FormData();
            formData.append("text", plainText);
            formData.append("ws", ws);

            const data = await checkTahrirchi(formData);

            if (data["action"] === "SUGGESTIONS") {
                setDatas(data["data"]);
                console.log(data["data"]);
            }
        } catch (e) {
            setProgress(false);
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
    }, [text]);

    const handleCopy = useCallback(() => {
        if (text) {
            const editor = document.querySelector(".ql-editor");
            const plainText = editor.innerText || text;
            navigator.clipboard.writeText(plainText);
            toast.success(t("Text copied to clipboard"), {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [text]);

    const changeWord = (word, replaces) => {
        // const regex = new RegExp(word, 'g');
        // const escapedWord = text.replace(regex, replaces);
        // const updatedDatas = datas.filter(item => item.token !== word);
        // setDatas(updatedDatas);

        const regex = new RegExp(`\\b${word}\\b`, "g"); // Ищем точное совпадение слова
        const updatedText = text.replace(regex, replaces);
        setDatas(datas.filter((item) => item.token !== word));
        setText(updatedText);
    };

    function checkAlphabet(text) {
        const cyrillicRegex = /[а-яёА-ЯЁ]/;
        const latinRegex = /[a-zA-Z]/;

        const hasCyrillic = cyrillicRegex.test(text);
        const hasLatin = latinRegex.test(text);

        if (hasCyrillic && hasLatin) {
            return "3";
        } else if (hasCyrillic) {
            return "2";
        } else if (hasLatin) {
            return "1";
        } else {
            return "4";
        }
    }

    return (
        <>
            <Helmet>
                <title>{t("User:Tahrirchi:Title")}</title>
            </Helmet>
            <Container className="textEditor-container">
                <Row className="textEditor-row">
                    <Col className="textEditor-col">
                        <Form>
                            <Form.Group>
                                <div className="edit-buttons">
                                    <Button className="editBtn" onClick={handleCheck} disabled={progress}>
                                        {progress ? t("User:Tahrirchi:Progress") : t("User:Tahrirchi:Translate")}
                                    </Button>
                                    <Button className="copyBtn" onClick={handleCopy} style={{ display: text === "" ? "none" : "block" }}>
										{text && <FaRegCopy />}
                                    </Button>
                                </div>
                                <ReactQuill theme="snow" modules={modules} formats={formats} value={text} onChange={setText} placeholder={t("User:Tahrirchi:Add_Text")} />
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col className="textEditor-col" style={{ overflowY: "auto", maxHeight: "80vh", boxShadow: "none" }}>
                        {datas.length > 0 && (
                            <Accordion className="custom-accordion">
                                {datas.map((data, index) => (
                                    <Accordion.Item className="custom-accordion-item" eventKey={index} key={index}>
                                        <Accordion.Header className="custom-accordion-header">{data.token}</Accordion.Header>
                                        <Accordion.Body className="custom-accordion-body">
                                            {data.corrections.map((correction, i) => (
                                                <Button className="me-3 mt-2 custom-button" onClick={() => changeWord(datas[index].token, correction)} key={i}>
                                                    {correction}
                                                </Button>
                                            ))}
                                            <p className="mt-2 custom-text">{t("There is a spelling error in this word.")}</p>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )}
                    </Col>
                </Row>
            </Container>
            <ToastContainer />
        </>
    );
});

export default UserTahrirchiView;
