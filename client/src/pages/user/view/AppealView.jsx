import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { fetchDatasAppealById } from "../../../function/http/Appeal";

import { Button, Table, Modal, Form } from "react-bootstrap"; // Добавлено Form

import QRCode from "qrcode";

import { MdOutlineSms, MdOutlineDoneAll } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";

import { ToastContainer, toast } from "react-toastify";

const UserAppealView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();
    const [appeals, setAppeals] = useState([]);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false); // Добавлено состояние show
    const [phone, setPhone] = useState(""); // Добавлено состояние для формы
    const [password, setPassword] = useState(""); // Добавлено состояние для формы

    useEffect(() => {
        fetchDatasAppealById(user._user.id)
            .then((data) => {
                setAppeals(data);
            })
            .catch((error) => {
                console.error("Error fetching appeals:", error);
                setError("Murojaatlarni olishda xatolik yuz berdi");
            });
    }, [user._user.id]);

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

    function calculateDays(isoDate) {
        const receivedDate = new Date(isoDate);
        const today = new Date();
        const timeDiff = today.getTime() - receivedDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // Convert milliseconds to days
        return daysDiff;
    }

    const generateQRCode = async (text) => {
        try {
            const canvas = document.createElement("canvas");
            console.log(text)
            await QRCode.toCanvas(canvas, text, {
                width: 300,
                errorCorrectionLevel: "H",
                color: {
                    dark: "#000000",
                    light: "#0000"
                }
            });
            const pngUrl = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "qrcode.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (err) {
            console.error("Failed to generate QR code:", err);
            setError("QR kod yaratishda xatolik yuz berdi");
        }
    };

    const handleClose = () => setShow(false); // Функция для закрытия модального окна
    const handleShow = () => setShow(true);  // Функция для открытия модального окна

    const handleSubmit = (event) => {
        event.preventDefault();
        // Ваш код для обработки формы
    };

    return (
        <>
            <Helmet>
                <title>{t("User:Appeal:Title")}</title>
            </Helmet>
            <div className="murojaatlar-page">
                <div className="top-bar">
                    <div
                        className="qrcode"
                        onClick={() =>
                            generateQRCode(`http://localhost:5173/appeal/${user.user.id}`)
                        }
                    >
                        <svg
                            className="qrcode-icon"
                            width="53"
                            height="53"
                            viewBox="0 0 621 621"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_350_23)">
                                <path d="M77.625 232.875H232.875V77.625H77.625V232.875ZM103.5 103.5H207V207H103.5V103.5ZM129.375 129.375H181.125V181.125H129.375V129.375ZM388.125 232.875H543.375V77.625H388.125V232.875ZM414 103.5H517.5V207H414V103.5ZM439.875 129.375H491.625V181.125H439.875V129.375ZM77.625 543.375H232.875V388.125H77.625V543.375ZM103.5 414H207V517.5H103.5V414ZM129.375 439.875H181.125V491.625H129.375V439.875ZM517.5 491.625H543.375V543.375H491.625V465.75H517.5V491.625ZM517.5 414H543.375V439.875H517.5V414ZM517.5 388.125V414H491.625V388.125H517.5ZM258.75 439.875H284.625V543.375H258.75V439.875ZM155.25 258.75V310.5H103.5V284.625H77.625V258.75H155.25ZM258.75 181.125H284.625V207H258.75V181.125ZM336.375 103.5V155.25H310.5V77.625H362.25V103.5H336.375ZM258.75 103.5H284.625V129.375H258.75V103.5ZM517.5 310.5H543.375V362.25H491.625V336.375H517.5V310.5ZM491.625 258.75V284.625H439.875V336.375H388.125V310.5H414V258.75H491.625ZM310.5 362.25H284.625V336.375H258.75V310.5H310.5V362.25ZM465.75 414H491.625V439.875H465.75V414ZM517.5 284.625V310.5H491.625V284.625H517.5ZM284.625 362.25V388.125H258.75V362.25H284.625ZM439.875 439.875H414V414H439.875V439.875ZM465.75 388.125H414V362.25H465.75V388.125ZM207 258.75H232.875V284.625H207V310.5H232.875V362.25H207V336.375H181.125V362.25H155.25V310.5H181.125V258.75H207ZM284.625 258.75V207H362.25V284.625H310.5V258.75H336.375V232.875H310.5V258.75H284.625ZM284.625 155.25H310.5V181.125H284.625V155.25ZM258.75 258.75H284.625V284.625H258.75V258.75ZM336.375 181.125V155.25H362.25V181.125H336.375Z" />
                            </g>
                            <defs>
                                <clipPath id="clip0_350_23">
                                    <rect width="621" height="621" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span>QR-CODE yaratish</span>
                    </div>
                </div>
                {error && <p className="text-danger">{error}</p>}
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th scope="col" rowSpan="2">
                                №
                            </th>
                            <th scope="col" colSpan="7">
                                Murojaatlar
                            </th>
                        </tr>
                        <tr>
                            <th scope="col">Kimdan</th>
                            <th scope="col">Mazmuni</th>
                            <th scope="col">Kelgan vaqti</th>
                            <th scope="col">Qoldiq kunlar</th>
                            <th scope="col">Holati</th>
                            <th scope="col">Imzo</th>
                            <th scope="col">SMS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appeals.map((appeal, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{appeal.sender}</td>
                                <td>{appeal.content}</td>
                                <td>{formatDate(appeal.date_received)}</td>
                                <td>{calculateDays(appeal.date_received)}</td>
                                <td>{appeal.status}</td>
                                <td>
                                    <Button variant="primary" onClick={handleShow}>
                                        {t("Imzo")}
                                    </Button>
                                </td>
                                <td>
                                    <MdOutlineSms />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Модальное окно для подписи */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Подпись")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formPhone">
                            <Form.Label>{t("Телефон")}</Form.Label>
                            <Form.Control
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>{t("Пароль")}</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {t("Подписать")}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t("Закрыть")}
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </>
    );
});

export default UserAppealView;
