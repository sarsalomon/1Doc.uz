import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { CiSearch } from "react-icons/ci";
import { MdOutlineSms } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";
import docEdit from './../../../assets/img/sidebar/writing-icon.svg';
import { ReactSVG } from "react-svg";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fetchDataSignatureById } from "../../../function/http/SignatureAPI";
import { deleteDataDocument } from "../../../function/http/DocumentAPI";
import { Button, Tabs, Tab } from "react-bootstrap";

const UserDocumentView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [documents, setDocuments] = useState([]);
    const [show, setShow] = useState(false);
    const [file, setFile] = useState(null);
    const [objects, setObjects] = useState([]);
    const [pdfFile, setPdfFile] = useState("");
    const [fileId, setFileId] = useState("");
    const [key, setKey] = useState('first');

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
            <div className='document-top'>
                <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        
                        <Tab eventKey="first" title="Mening hujjatlarim">
                        
                        <div className="row align-items-center top-bar">
                    <div className="col-auto create-btn-wrapper">

                        <button className="btn btn-outline-primary" onClick={() => changeStateContract('ContractAdd')}>
                           
                           <ReactSVG className='docEdit' src={docEdit} alt="" />
                            <span>{t("User:Create_button")}</span>
                        </button>
                    </div>

                    <div className="col folders">
                        <div className="folder-group" role="group">
                            <button type="button" className="folder bg-transparent">
                            <ReactSVG className='docEdit' src={docEdit} alt="" />
                                <span>Tibbiy xizmatlarni ko’rsatish</span>
                            </button>

                            <button type="button " className="folder bg-transparent">
                            <ReactSVG className='docEdit' src={docEdit} alt="" />
                                <span>Pulli ta’lim xizmatlar</span>
                            </button>

                            <button type="button" className="folder bg-transparent">
                            <ReactSVG className='docEdit' src={docEdit} alt="" />
                                <span>Mahsulotlarni yetkazib berish</span>
                            </button>

                            <button type="button" className="folder bg-transparent">
                            <ReactSVG className='docEdit' src={docEdit} alt="" />
                                <span>Xorijga ishga yuborish</span>
                            </button>

                            <button type="button" className="folder bg-transparent">
                            <ReactSVG className='docEdit' src={docEdit} alt="" />
                                <span>Xorijga ishga yuborish</span>
                            </button>
                        </div>
                    </div>

                </div>

                <table className="doc-table table table-bordered table-striped mt-4">
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
                        </Tab>

        {/* Second Tab */}
        <Tab eventKey="second" title="Hujjat shablonlari">
            <div className="row align-items-center top-bar">
                <div className="col-auto search-wrapper">
                        <div className="input-group">
                            <input type="text" className="form-control bg-transparent" placeholder={t("User:Search_text")} />
                            <button className="btn btn-secondary" type="button">
                                <FaSearch />
                            </button>
                        </div>
                        <button className='btn ' >
                        Jo'natish
                        </button>
                    </div>
            </div>
            <div className="row align-items-center top-bar">
                ddwdwd
            </div>
                  </Tab>
                </Tabs>

                <button className="excel-button">
                    <RiFileExcel2Line />
                    Excel faylni yuklab olish
                </button>
            </div>
        </>
    );
});

export default UserDocumentView;
