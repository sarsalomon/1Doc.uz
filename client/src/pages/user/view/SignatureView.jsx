import React, { useContext, useState, useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Modal, Form, Button } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

import { Viewer, Worker } from "@react-pdf-viewer/core";

import { MdOutlineOpenInNew } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
// import { MdDeleteOutline } from "react-icons/md";
import { MdOutlineSms } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { LiaFileSignatureSolid } from "react-icons/lia";
import { MdOutlineUploadFile } from "react-icons/md";
import { addDataSignature, addDataSignatureDraft, deleteDataSignature, deleteDataSignatureDraft, fetchDataSignatureById } from "../../../function/http/SignatureAPI";

const UserSignatureView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [signatures, setSignatures] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [objects, setObjects] = useState([]);
    const [pdfFile, setPdfFile] = useState("");
    const [fileId, setFileId] = useState("");

    const [fileProgress, setFileProgress] = useState("");

    useEffect(() => {
        fetchDataSignatureById(user._user.id)
            .then((data) => {
                setSignatures(data);
            })
            .catch((error) => {
                console.error("Error fetching signatures:", error);
            });
    }, [user._user.id]);

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const allowedTypes = ["application/docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    
            const acceptedFile = acceptedFiles[0];
            if (!allowedTypes.includes(acceptedFile.type)) {
                showToast(t("File must be in DOCX format"));
                setFileProgress(false);
                return;
            }
    
            const formData = new FormData();
            formData.append("file", acceptedFile);
    
            const data = await addDataSignatureDraft(formData);
            setFileId(data);
            setFile(acceptedFile);
            setPdfFile(`${import.meta.env.VITE_API_URL}draft/signature/pdf/${data}`);
        } catch (error) {
            console.error("Error uploading document:", error);
        }
    }, []);
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ".docx",
    });

    const handleClose = async () => {
        setShow(false);
        if (pdfFile) {
            try {
                await deleteDataSignatureDraft(selectedDocs[0]?.uri);
            } catch (error) {
                console.error("Error deleting document:", error);
            }
        }
    };

    const ConfirmSubmit = (id) => {
        confirmAlert({
            title: "Yaratishni tasdiqlang",
            message: "Ishonchingiz komilmi yaratishga?",
            buttons: [
                {
                    label: "Ha",
                    onClick: () => handleSubmit(),
                },
                {
                    label: "Yo`q",
                },
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("fileId", fileId);
            formData.append("userId", user._user.id);
            formData.append("objects", JSON.stringify(objects));

            await addDataSignature(formData).then((data) => {
                if (data == "success") {
                    fetchDataSignatureById(user._user.id)
                        .then((data) => {
                            setSignatures(data);
                        })
                        .catch((error) => {
                            console.error("Error fetching signatures:", error);
                        });
                    setFile(null);
                    setObjects([]);
                    setPdfFile("");
                    setFileId("");
                    setShow(!show);
                    toast.success("Yuklandi", {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
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
                    });
                }
            });
        } catch (e) {
            console.error("Error:", e);
        }
    };

    const addInfo = () => {
        setObjects([...objects, { title: "", phone: "", name: "", number: Date.now() }]);
    };

    const removeInfo = (number) => {
        setObjects(objects.filter((i) => i.number !== number));
    };

    const changeInfo = (key, value, number) => {
        setObjects(objects.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
    };

    const ConfirmDelete = (id) => {
        confirmAlert({
            title: "O'chirishni tasdiqlang",
            message: "Ishonchingiz komilmi o`chirishga?",
            buttons: [
                {
                    label: "Ha",
                    onClick: () => DeleteSignature(id),
                },
                {
                    label: "Yo`q",
                },
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    };

    const DeleteSignature = async (id) => {
        try {
            let data;
            data = await deleteDataSignature(id);
            if (data) {
                fetchDataSignatureById(user._user.id)
                    .then((data) => {
                        setSignatures(data);
                    })
                    .catch((error) => {
                        console.error("Error fetching signatures:", error);
                    });
                toast.success(`O'chirildi`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (e) {
            toast.error(e.response.data.message, {
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

    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    return (
        <>
            <Helmet>
                <title>{t("User:Signature:Title")}</title>
            </Helmet>
            <div className="imzo-page">
                <button className="upload-btn btn btn-outline-primary" aria-label="Upload Button" onClick={() => setShow(true)}>
                    <LiaFileSignatureSolid className="drop-images" />

                    <span>Yuklash</span>
                </button>

                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th scope="col" rowSpan="2">
                                No
                            </th>
                            <th scope="col" rowSpan="2">
                                Arizalar
                            </th>
                            <th scope="col" colSpan="3">
                                Arizalar
                            </th>
                            <th scope="col" colSpan="2" rowSpan={2}>
                                Yuborilgan tashkilot nomi korxona mijoz
                            </th>
                            <th scope="col" rowSpan="2">
                                Holati
                            </th>
                            <th scope="col" rowSpan="2">
                                Harakat
                            </th>
                        </tr>
                        <tr>
                            <th scope="col">sanasi</th>
                            <th scope="col">muddati</th>
                            <th scope="col">muddati</th>
                        </tr>
                    </thead>
                    <tbody>
                        {signatures.map((signature, index) => (
                            <tr key={signature.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {signature.title}
                                    <a href={`https://1doc.uz/signatureview/${signature?._id}`} target="_blank">
                                        <MdOutlineOpenInNew />
                                    </a>
                                </td>
                                <td>{formatDate(signature.createDate)}</td>
                                <td>1</td>
                                <td>29.06.2024</td>
                                <td>{formatDate(signature.createDate)}</td>
                                <td>{formatDate(signature.createDate)}</td>
                                <td>
                                    {signature.status === "Create" ? (
                                        <span>
                                            Yaratolgan Sms tasdiqlash kutilmoqda <MdOutlineSms />
                                        </span>
                                    ) : signature.status === "WaitSignature" ? (
                                        <span>
                                            Imzolash Kutilmoqda <FaFileSignature />
                                        </span>
                                    ) : signature.status === "End" ? (
                                        <span>
                                            To'liq tasdiqlangan <MdOutlineDoneAll />
                                        </span>
                                    ) : (
                                        "Err"
                                    )}
                                </td>
                                <td>
                                    <Button variant="danger" className=" btn-info ms-2" onClick={() => ConfirmDelete(signature._id)}>
                                        O'chirish
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="excel-button" aria-label="Download Excel File">
                    <RiFileExcel2Line />
                    {t("Download Excel File")}
                </button>
            </div>

            <Modal className="sigNmodal" show={show} onHide={handleClose} dialogClassName="Signature-modal-90w">
                <Modal.Header closeButton className=" closeHeader">
                    <Modal.Title id="example-custom-modal-styling-title">Imzolash oynasi</Modal.Title>
                    <button className="closeBtn btn " onClick={handleClose}>
                        X
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <h1>Hujjatni yuklang (.docx)</h1>
                        {pdfFile == "" ? (
                            <button {...getRootProps()} className="upload-btn btn btn-outline-primary" aria-label="Upload Button">
                                <input {...getInputProps()} className="upload-input" type="file" accept=".docx" />
                                <LiaFileSignatureSolid className="drop-images" />
                                {isDragActive ? <p>{t("Fayllarni bu erga tashlang...")}</p> : <p>{t("Fayllarni bu erga tashlang yoki fayllarni tanlash uchun bosing")}</p>}
                            </button>
                        ) : (
                            <button></button>
                        )}
                    </div>
                    <Container fluid>
                        <Row>
                            <Col>
                                <div>
                                    {pdfFile === "" ? null : (
                                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                            <Viewer fileUrl={pdfFile} />
                                        </Worker>
                                    )}
                                </div>
                            </Col>
                            <Col xxl={5} xl={5} lg={5} md={5} xs={12}>
                                {pdfFile == "" ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <Form>
                                            {objects.map((i) => (
                                                <Row className="mt-4" key={i.number}>
                                                    <Col md={3}>
                                                        <Form.Control value={i.title} onChange={(e) => changeInfo("title", e.target.value, i.number)} placeholder="OOO 1doc uz" />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control value={i.description} onChange={(e) => changeInfo("phone", e.target.value, i.number)} placeholder="339785474" />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Form.Control value={i.description} onChange={(e) => changeInfo("name", e.target.value, i.number)} placeholder="Fio" />
                                                    </Col>
                                                    <Col md={3}>
                                                        <Button onClick={() => removeInfo(i.number)} variant={"outline-danger"}>
                                                            O'chirish
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </Form>

                                        {objects.length < 5 ? (
                                            <Button variant={"outline-dark"} onClick={addInfo} className="mt-2">
                                                Imzochi qo'shish
                                            </Button>
                                        ) : (
                                            <Button variant={"outline-dark"} className="mt-2" disabled>
                                                Limitga yetdi
                                            </Button>
                                        )}

                                        {objects.length == 0 ? (
                                            <div className="d-flex justify-content-center align-items-center mt-3">
                                                <Button variant="primary" disabled style={{ width: "100%" }}>
                                                    {t("Yaratish")}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center mt-3">
                                                <Button variant="primary" style={{ width: "100%" }} onClick={handleSubmit}>
                                                    {t("Yaratish")}
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
});

export default UserSignatureView;
