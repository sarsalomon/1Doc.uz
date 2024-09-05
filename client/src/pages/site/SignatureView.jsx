import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form, InputGroup } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";

import { getDataSignature, getDataCode, verifyDataCode, verifyDataSignature } from "../../function/http/SignatureAPI";

import { isMobile, isTablet, isDesktop, osName, osVersion, browserName, browserVersion, mobileVendor, mobileModel, getUA, isWindows, isMacOs, isLinux, isAndroid, isWinPhone, isIOS } from "react-device-detect";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { publicIp } from "public-ip";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { saveAs } from 'file-saver';

import SignatureCanvas from "react-signature-canvas";
import QRCode from 'qrcode';

const SignatureView = observer(() => {
    const { id } = useParams();

    const [signatureData, setSignatureData] = useState(null);
    const [code, setCode] = useState("");
    const [phone, setPhone] = useState("");

    const [codeSend, setCodeSend] = useState(false);
    const [signatureSend, setSignatureSend] = useState(false);
    const [downloadButton, setDownloadButton] = useState(true);

    const [signature, setSignature] = useState(null);
    const [CodeShow, setCodeShow] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const responseData = await getDataSignature(id);
                setSignatureData(responseData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, [id]);

    const showToast = (type, message) => {
        toast[type](message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    };

    const checkPhone = async () => {
        try {
            if (signatureData?.objects) {
                const result = JSON.parse(signatureData.objects).find((item) => item.phone === phone);

                if (result) {
                    if (result.status === "WaitSignature") {
                        setSignatureSend(true);
                    } else if (result.status === "Create") {
                        await getSmsCode();
                    } else if (result.status === "End") {
                        const hasCreateOrWaitSignature = JSON.parse(signatureData.objects).some((item) => item.status === "Create" || item.status === "WaitSignature");
                        setDownloadButton(hasCreateOrWaitSignature);
                    }
                }
            } else {
                showToast("error", "Ошибка данных подписи.");
            }
        } catch (error) {
            showToast("error", "Не удалось проверить контракт. Попробуйте еще раз.");
        }
    };

    const getSmsCode = async () => {
        try {
            const formData = new FormData();
            formData.append("signatureId", signatureData._id);
            formData.append("phone", phone);

            const response = await getDataCode(formData);

            if (response.data === "success") {
                showToast("success", `SMS код отправлен на номер ${phone}`);
                setCodeSend(true);
            } else {
                showToast("error", "Ошибка при отправке SMS кода.");
            }
        } catch (error) {
            showToast("error", "Ошибка SMS сервиса.");
        }
    };

    const acceptCode = async () => {
        try {
            const formData = new FormData();
            const deviceInfo = await checkDevice();

            formData.append("signatureId", signatureData._id);
            formData.append("phone", phone);
            formData.append("code", code);
            formData.append("device", JSON.stringify(deviceInfo));

            const response = await verifyDataCode(formData);

            if (response.status === "WaitSignature") {
                console.log(response)
                showToast("success", "Контракт подтвержден по SMS.");
                setCodeSend(false);
                setSignatureData(response.data);
                setSignatureSend(true);
            } else {
                showToast("error", "Не удалось подтвердить контракт. Проверьте код и попробуйте снова.");
            }
        } catch (error) {
            showToast("error", "Не удалось проверить контракт. Попробуйте позже.");
        }
    };

    const SignatureClear = () => {
        if (signature) {
            signature.clear();
        }
    };

    const acceptSignature = async () => {
        try {
            const formData = new FormData();
            const deviceInfo = await checkDevice();

            formData.append("signatureId", signatureData?._id);
            formData.append("phone", phone);
            formData.append("files", signatureData?.file);
            formData.append("image", signature.getTrimmedCanvas().toDataURL("image/png"));
            formData.append("device", JSON.stringify(deviceInfo));

            const response = await verifyDataSignature(formData);

            if (response.status === "End") {
                showToast("success", "Контракт успешно подписан.");
                setSignatureData(response.data);
                setCode("");
                setPhone("");
                setCodeSend(false);
                setSignatureSend(false);
                setCodeShow(false);
            } else {
                showToast("error", "Не удалось подтвердить контракт. Попробуйте снова.");
            }
        } catch (error) {
            showToast("error", "Не удалось проверить контракт. Попробуйте позже.");
        }
    };

    const checkDevice = async () => {
        try {
            const ip = await publicIp();
            return {
                Device: isMobile ? "Мобильное" : isTablet ? "Планшет" : isDesktop ? "Настольное ПК" : "Другое",
                Platform: isWindows ? "Windows" : isMacOs ? "MacOS" : isLinux ? "Linux" : isAndroid ? "Linux" : isWinPhone ? "Linux" : isIOS ? "Linux" : "Другое",
                OS: `${osName} ${osVersion}`,
                Browser: `${browserName} ${browserVersion}`,
                BrowserType: "Другое",
                MobileInfo: `${mobileVendor} ${mobileModel}`,
                Agent: getUA,
                IP: ip,
            };
        } catch (error) {
            console.error("Error fetching device info:", error);
            throw error;
        }
    };

    async function downloadPDF() {
        try {
            const existingPdfUrl = `${import.meta.env.VITE_API_URL}pdf/signature/end/${signatureData?.file}`;
    
            const existingPdfBytes = await fetch(existingPdfUrl).then(res => res.arrayBuffer());
    
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
            const pages = pdfDoc.getPages();
            const lastPage = pages[pages.length - 1];
    
            const qrCodeDataUrl = await QRCode.toDataURL(`https://1doc.uz/signatureview/${signatureData?._id}`, { width: 200 });
    
            const qrCodeImageBytes = await fetch(qrCodeDataUrl).then(res => res.arrayBuffer());
    
            const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);
    
            lastPage.drawImage(qrCodeImage, {
                x: 10,
                y: 0,
                width: 70,
                height: 70,
            });
    
            const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    
            lastPage.drawText("Asliga to'gri", {
                x: 80,
                y: 50,
                size: 12,
                color: rgb(0, 0, 0),
                font: timesRomanFont,
            });
    
            lastPage.drawText("Qr Code scaner qiling hujjatni asliga", {
                x: 80,
                y: 35,
                size: 12,
                color: rgb(0, 0, 0),
                font: timesRomanFont,
            });
    
            lastPage.drawText("1Doc.uz", {
                x: 80,
                y: 20,
                size: 12,
                color: rgb(0, 0.53, 0.71),
                font: timesRomanFont,
            });
    
            lastPage.drawText("Bir yechim, cheksiz imkoniyatlar!", {
                x: 125,
                y: 20,
                size: 12,
                color: rgb(0, 0, 0),
                font: timesRomanFont,
            });
    
            const pdfBytes = await pdfDoc.save();
    
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(pdfBlob);
            window.open(url);
            saveAs(pdfBlob, 'modified.pdf');
        } catch (error) {
            showToast("error", "Не удалось загрузить PDF. Попробуйте позже.");
        }
    }
    
    return (
        <>
            <Helmet>
                <title>Shartnoma</title>
                <meta name="description" content="This is my page description." />
            </Helmet>
            <Container fluid className="mt-4">
                <Row>
                    <Col>
                        {signatureData?.file && (
                            <div style={{ height: "750px" }}>
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={`${import.meta.env.VITE_API_URL}pdf/signature/end/${signatureData?.file}`} />
                                </Worker>
                            </div>
                        )}
                    </Col>
                    <Col>
                        <Button onClick={() => setCodeShow(true)}>SMS orqali Tasdiqlash</Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={CodeShow} onHide={() => setCodeShow(false)} backdrop="static" keyboard={false} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Shartnoma tasdiqlash</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {codeSend === false && signatureSend === false ? (
                            <>
                                <span>Shartnomadagi belgilangan raqamni yozing</span>
                                <InputGroup className="mb-3">
                                    <Form.Control minLength={9} maxLength={9} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Kodni kiriting" />
                                    <Button variant="success" onClick={checkPhone}>
                                        Tasdiqlash
                                    </Button>
                                </InputGroup>
                            </>
                        ) : (
                            <>
                                <span>Tasdiqlash uchun kod olish</span>
                                <InputGroup className="mb-3">
                                    <Form.Control minLength={4} maxLength={4} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kodni kiriting" />
                                    <Button variant="success" onClick={acceptCode}>
                                        Tasdiqlash
                                    </Button>
                                </InputGroup>
                            </>
                        )}

                        {signatureSend == true ? (
                            <div>
                                <div style={{ border: "2px solid red" }}>
                                    <SignatureCanvas penColor="black" canvasProps={{ width: 470, height: 200 }} ref={setSignature} />
                                </div>
                                <div className="d-flex justify-content-between mt-2">
                                    <Button onClick={SignatureClear}>O'chirish</Button>
                                    <Button onClick={acceptSignature}>Tasdiqlash</Button>
                                </div>
                            </div>
                        )
                        :
                            <></>
                        }

                        {downloadButton === false ? (
                            <div>
                                <Button onClick={downloadPDF}>Ko'chirib olish</Button>
                            </div>
                        ) : (
                            <></>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </>
    );
});

export default SignatureView;
