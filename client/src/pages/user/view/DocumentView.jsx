import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { CiSearch } from "react-icons/ci";
import { MdOutlineSms } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fetchDataSignatureById } from "../../../function/http/SignatureAPI";
import { deleteDataDocument } from "../../../function/http/DocumentAPI";

const UserDocumentView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [documents, setDocuments] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [objects, setObjects] = useState([]);
    const [pdfFile, setPdfFile] = useState("");
    const [fileId, setFileId] = useState("");

    const [fileProgress, setFileProgress] = useState("");

    useEffect(() => {
        fetchDataSignatureById(user._user.id)
            .then((data) => {
                setDocuments(data);
            })
            .catch((error) => {
                console.error("Error fetching signatures:", error);
            });
    }, [user._user.id]);

    const changeStateContract = (key) => {
        localStorage.setItem("Path", key)
        setKey(key);
      };
    
      function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
      
        return `${day}.${month}.${year}`;
      }

      
  function formatData(contractSubject) {
    if (!contractSubject) {
      return {}; 
    }
  
    try {
      const parsedSubject = JSON.parse(contractSubject);
      return {
        name: parsedSubject.name || "",
        title: parsedSubject.title || "",
        hour: parsedSubject.hour || "",
        date: parsedSubject.date || "",
        count: parsedSubject.count || "",
        weekly: parsedSubject.weekly || "",
        pay: parsedSubject.pay || "",
        address: parsedSubject.address || "",
        number: parsedSubject.number || "",
        type: parsedSubject.type || "",
      };
    } catch (error) {
      console.error("Error parsing contractSubject:", error);
      return {};
    }
  }
    const ConfirmDelete = (id) => {
        confirmAlert({
            title: "O'chirishni tasdiqlang",
            message: "Ishonchingiz komilmi o`chirishga?",
            buttons: [
                {
                    label: "Ha",
                    onClick: () => DeleteDocument(id),
                },
                {
                    label: "Yo`q",
                },
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    };

    const DeleteDocument = async (id) => {
        try {
            let data;
            data = await deleteDataDocument(id);
            if (data) {
                fetchDataSignatureById(user._user.id)
                    .then((data) => {
                        setDocuments(data);
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

    function formatData(contractSubject) {
        if (!contractSubject) {
            return {};
        }

        try {
            const parsedSubject = JSON.parse(contractSubject);
            return {
                name: parsedSubject.name || "",
                title: parsedSubject.title || "",
                hour: parsedSubject.hour || "",
                date: parsedSubject.date || "",
                count: parsedSubject.count || "",
                weekly: parsedSubject.weekly || "",
                pay: parsedSubject.pay || "",
                address: parsedSubject.address || "",
                number: parsedSubject.number || "",
                type: parsedSubject.type || "",
            };
        } catch (error) {
            console.error("Error parsing contractSubject:", error);
            return {};
        }
    }

    return (
        <>
            <Helmet>
                <title>{t("User:Document:Title")}</title>
            </Helmet>
            <div>
                <div className="row align-items-center top-bar">
                    <div className="col-auto create-btn-wrapper">
                        <button className="btn btn-outline-primary" onClick={() => changeStateContract('ContractAdd')}>
                            <svg className="plus-icon" width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_348_21)">
                                    <path d="M2.7737 18.2683C1.69055 18.2683 0.812487 19.1463 0.8125 20.2295C0.812487 21.3127 1.69055 22.1907 2.7737 22.1907L18.2683 22.1906L18.2684 37.6853C18.2682 38.7684 19.1464 39.6464 20.2295 39.6465C21.3127 39.6465 22.1907 38.7685 22.1907 37.6853V22.1907L37.6853 22.1906C38.7684 22.1907 39.6465 21.3127 39.6465 20.2295C39.6465 19.1463 38.7684 18.2682 37.6853 18.2684L22.1907 18.2682V2.7737C22.1907 1.69054 21.3127 0.812472 20.2295 0.8125C19.1464 0.812514 18.2682 1.69058 18.2684 2.77361L18.2683 18.2684L2.7737 18.2683Z" />
                                </g>

                                <defs>
                                    <clipPath id="clip0_348_21">
                                        <rect width="40" height="40" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>

                            <span>{t("User:Create_button")}</span>
                        </button>
                    </div>

                    <div className="col folders">
                        <div className="folder-group" role="group">
                            <button type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>Tibbiy xizmatlarni ko’rsatish</span>
                            </button>

                            <button type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>Pulli ta’lim xizmatlar</span>
                            </button>

                            <button type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>Mahsulotlarni yetkazib berish</span>
                            </button>

                            <button type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>Xorijga ishga yuborish</span>
                            </button>

                            <button type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>Xorijga ishga yuborish</span>
                            </button>
                        </div>
                    </div>

                    <div className="col-auto search-wrapper">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder={t("User:Search_text")} />
                            <button className="btn btn-outline-secondary" type="button">
                                {/* <FaSearch /> */}
                            </button>
                        </div>
                    </div>
                </div>

                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            <th scope="col" rowSpan="2">
                                №
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
                            <th scope="col" rowSpan="2">Harakat</th>

                        </tr>
                        <tr>
                            <th scope="col">sanasi</th>
                            <th scope="col">muddati</th>
                            <th scope="col">muddati</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan="8">Ma'lumotlar mavjud emas</td>
                            </tr>
                        ) : (
                            documents.map((document, index) => {
                                const parsedSubject = formatData(document.contractSubject);

                                return (
                                    <tr key={document._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <a href={`${import.meta.env.VITE_API_URL_BACKEND}/documentview/${document._id}`} target="_blank">
                                                {document.title}
                                            </a>
                                        </td>
                                        <td>{formatDate(document.createDate)}</td>
                                        <td>{parsedSubject.name}</td>
                                        <td>{parsedSubject.title}</td>
                                        <td>{parsedSubject.date}</td>
                                        <td>{formatDate(document.updateDate)}</td>
                                        <td>
                                            {document.status === "Create" ? (
                                                <>
                                                    Yaratolgan Sms tasdiqlash kutilmoqda <MdOutlineSms />
                                                </>
                                            ) : document.status === "WaitSignature" ? (
                                                <>
                                                    Imzolash Kutilmoqda <FaFileSignature />
                                                </>
                                            ) : document.status === "End" ? (
                                                <>
                                                    To'liq tasdiqlangan <MdOutlineDoneAll />
                                                </>
                                            ) : (
                                                "Err"
                                            )}
                                        </td>
                                        <td>
                                            <Button variant="danger" className="ms-2" onClick={() => ConfirmDelete(contract._id)}>
                                                O'chirish
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                <button className="excel-button">
                    <RiFileExcel2Line />
                    Excel faylni yuklab olish
                </button>
            </div>
        </>
    );
});

export default UserDocumentView;
