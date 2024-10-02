import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";

import { Container, Col, Row, Form, Button, Modal, InputGroup } from "react-bootstrap";
import { addDataAppeal, getDataCode, verifyDataCode } from "../../function/http/Appeal";
import { Context } from "../../main";

const Appeal = observer(() => {
    const navigate = useNavigate();

    const { id } = useParams();
    const { t } = useTranslation();
    const user = useContext(Context); 

    const [fio, setFIO] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [text, setText] = useState('');

    const [CodeShow, setCodeShow] = useState(false);
    const [code, setCode] = useState("");

    const [appealId, setAppealId] = useState("");
    
    const CodeModelClose = () => setCodeShow(false);
    const CodeModelShow = () => setCodeShow(true);

    const createAppealFromUser = async () => {
        try {
            let data;

            const formData = new FormData();
            formData.append("userId", id);
            formData.append("fio", fio);
            formData.append("address", address);
            formData.append("phone", phone);
            formData.append("text", text);

            data = await addDataAppeal(formData);
            // console.log(data)
            if (data.status === "success") {
                getSmsCode(data.id);
                setAppealId(data.id);
            } else if (data.status === "Create") {
                toast.error("Siz murojaat tasdiqlamadiz", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else if (data.status === "Send") {
                toast.error("Siz murojaat yuborgansiz iltimos ozgini kuting javob keladi", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error("Xatolik yuz berdi", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        } catch (e) {
            toast.error("e.response.data.message", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const getSmsCode = async (id) => {
        try {
            console.log(id)
            const formData = new FormData();
            formData.append("Id", id);
            formData.append("phone", phone);

            const response = await getDataCode(formData);
            if (response.data === "success") {
                CodeModelShow();
                toast.success("SMS code sent successfully", { position: "bottom-right" });
            } else {
                toast.error("Error sending SMS code", { position: "bottom-right" });
            }
        } catch (error) {
            toast.error("SMS service error", { position: "bottom-right" });
        }
    };

    const acceptCode = async () => {
        try {
            if (appealId == "") {
                return
            }
            const formData = new FormData();
            formData.append("Id", appealId);
            formData.append("code", code);

            const response = await verifyDataCode(formData);
            if (response.status === "success") {
                toast.success("Yuborildi", { position: "bottom-right" });
                setFIO("");
                setAddress("");
                setPhone("");
                setText("");
                setCode("");
                setAppealId("");
                CodeModelClose();
            } else {
                toast.error("Failed to verify code", { position: "bottom-right" });
            }
        } catch (error) {
            toast.error("Verification failed", { position: "bottom-right" });
        }
    };

    return (
        <Container>
            <Row>
                <Col>Murojaat yuborish</Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>F.I.O</Form.Label>
                        <Form.Control type="text" placeholder="name@example.com" value={fio} onChange={(e) => setFIO(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Murojatchi manzili</Form.Label>
                        <Form.Control type="text" placeholder="name@example.com" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Murojatchi telefon raqaimi</Form.Label>
                        <Form.Control type="text" placeholder="name@example.com" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Murojat matni</Form.Label>
                        <Form.Control as="textarea" rows={10} value={text} onChange={(e) => setText(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Button onClick={createAppealFromUser}>
                    Yuborish
                </Button>
            </Row>

        <Modal className="py-4" show={CodeShow} onHide={CodeModelClose} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Shartnoma tasdiqlash</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="d-flex flex-column">
                    <span> Tasdiqlash kodi yuborildi </span>
                    <InputGroup className="mb-3">
                        <Form.Control minLength={4} maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kodni kiriting" />
                        <Button variant="success" onClick={acceptCode}>
                            Tasdiqlash
                        </Button>
                    </InputGroup>
                </Form>
            </Modal.Body>
        </Modal>

        <ToastContainer />
        </Container>
    );
});

export default Appeal;
