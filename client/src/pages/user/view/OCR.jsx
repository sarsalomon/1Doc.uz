import Tesseract from "tesseract.js";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { Form } from "react-bootstrap";
import { IoMdImages } from "react-icons/io";
const UserOcrView = observer(() => {
    const [imageSrc, setImageSrc] = useState("");
    const [ocrLanguage, setOcrLanguage] = useState("");
    const [ocrText, setOcrText] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handleFileChange = (e) => {
        setError("");
        setOcrText("");

        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(selectedFile.type)) {
            setLoading(false);
            setError(t("User:InvalidFileType"));
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(reader.result);
            setFile(selectedFile);
        };
        reader.readAsDataURL(selectedFile);
    };

    const handleConvertClick = async () => {
        if (!file) {
            setError(t("User:NoFileSelected"));
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (ocrLanguage === "") {
                toast.error(t("User:SelectLanguageError"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const {
                data: { text },
            } = await Tesseract.recognize(file, ocrLanguage);
            setOcrText(text);
        } catch (err) {
            setError(t("User:OcrError"));
        } finally {
            setLoading(false);
        }
    };

    const handleExtractText = () => {
        if (!ocrText) {
            toast.error(t("User:NoTextError"), {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        navigator.clipboard
            .writeText(ocrText)
            .then(() => {
                toast.success(t("User:CopySuccess"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            .catch(() => {
                toast.error(t("User:CopyError"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
    };

    const handleDownloadText = async () => {
        if (!ocrText) {
            alert(t("User:NoTextToDownload"));
            return;
        }

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [new TextRun(ocrText)],
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "ocr-text.docx";
        a.click();
        URL.revokeObjectURL(url);
    };

    const language_ocr = [
        { id: "uzb", Title: "O'zbek" },
        { id: "uzb_cyrl", Title: "Ўзбек" },
        { id: "rus", Title: "Русский" },
        { id: "eng", Title: "English" },
        { id: "kaz", Title: "Qazaq" },
        { id: "kir", Title: "Kirgiz" },
        { id: "tgk", Title: "Tajik" },
    ];

    return (
        <>
            <Helmet>
                <title>{t("User:OCR:Title")}</title>
            </Helmet>
            <div className="ocr-page">
                
                <button className="upload-btn btn           
                    btn-outline-primary">
                    <IoMdImages className='drop-images'/>
                    {t("User:FileUpload")} (.jpg, .png)
                    <input className='upload-input' type="file" onChange={handleFileChange} disabled={loading} accept=".jpg, .png"/>
                </button>

                <div className="ocr-translate">
                    
                        <Form.Select
                        className="custom-select"
                            onChange={(e) => {
                                setOcrLanguage(e.target.value);
                            }}>
                            <option key="empty" value="">
                                Tilni tanglang
                            </option>
                            {language_ocr.map((language) => (
                                <option key={language.id} value={language.id}>
                                    {language.Title}
                                </option>
                            ))}
                        </Form.Select>
                    
                    <button className="convert-btn btn btn-primary" onClick={handleConvertClick} disabled={loading || !file}>
                        {t("User:OCR:Convert_button")}
                    </button>
                </div>

                {loading && <div>{t("User:Loading")}</div>}

                {error && <div className="error">{error}</div>}

                <div className="ocr-result">{ocrText}</div>

                <div className="btn-group mt-3">
                    <button className="extract-btn btn btn-primary" onClick={handleExtractText} disabled={!ocrText}>
                        {t("User:OCR:Copy_text")}
                    </button>
                    <button className="download-btn btn btn-primary" onClick={handleDownloadText} disabled={!ocrText}>
                        {t("User:OCR:Save_as_file")}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
});

export default UserOcrView;
