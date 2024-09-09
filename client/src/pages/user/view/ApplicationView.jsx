import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CiSearch } from "react-icons/ci";
import { MdOutlineSms, MdOutlineDoneAll } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { RiFileExcel2Line } from "react-icons/ri";
import { Context } from "../../../main";
import { deleteDataApplication, fetchDatasApplicationById } from "../../../function/http/ApplicationAPI";

const UserApplicationView = observer(() => {
    const { user } = useContext(Context); // Accessing user from Mobx store
    const [applications, setApplications] = useState([]);
    const { t } = useTranslation(); // For handling translations
    const [key, setKey] = useState(localStorage.getItem("Path") || "defaultPath");

    useEffect(() => {
        // Fetch applications based on user id and handle errors
        fetchDatasApplicationById(user._user.id)
            .then((data) => setApplications(data))
            .catch((error) => {
                console.error("Error fetching applications:", error);
            });
    }, [user._user.id]);

    const changeStateContract = (key) => {
        localStorage.setItem("Path", key);
        setKey(key);
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const ConfirmDelete = (id) => {
        confirmAlert({
            title: "O'chirishni tasdiqlang",
            message: "Ishonchingiz komilmi o`chirishga?",
            buttons: [
                {
                    label: "Ha",
                    onClick: () => DeleteContract(id),
                },
                {
                    label: "Yo`q",
                },
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
        });
    };

    const DeleteContract = async (id) => {
        try {
            let data;
            data = await deleteDataApplication(id);
            if (data) {
                fetchDatasApplicationById(user._user.id)
                    .then((data) => {
                        setApplications(data);
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
    return (
        <>
            <Helmet>
                <title>{t("User:Application:Title")}</title>
            </Helmet>

            <div className="row align-items-center top-bar">
                <div className="col-auto create-btn-wrapper">
                    <button className="btn btn-outline-primary" onClick={() => changeStateContract("ApplicationAdd")}>
                        <svg className="plus-icon" width="40" height="40" viewBox="0 0 40 40">
                            <g clipPath="url(#clip0_348_21)">
                                <path d="M2.7737 18.2683C1.69055 18.2683 0.812487 19.1463 0.8125 20.2295C0.812487 21.3127 1.69055 22.1907 2.7737 22.1906L18.2683 22.1906L18.2684 37.6853C18.2682 38.7684 19.1464 39.6464 20.2295 39.6465C21.3127 39.6465 22.1907 38.7685 22.1907 37.6853V22.1907L37.6853 22.1906C38.7684 22.1907 39.6465 21.3127 39.6465 20.2295C39.6465 19.1463 38.7684 18.2682 37.6853 18.2684L22.1907 18.2682V2.7737C22.1907 1.69054 21.3127 0.812472 20.2295 0.8125C19.1464 0.812514 18.2682 1.69058 18.2684 2.77361L18.2683 18.2684L2.7737 18.2683Z" />
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
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button key={num} type="button" className="folder">
                                <svg className="folder-icon" width="53" height="43" viewBox="0 0 53 43">
                                    <path d="M47.7 5.375H26.5L22.7529 1.57487C21.7592 0.567062 20.4103 0 19.0058 0H5.3C2.385 0 0 2.41875 0 5.375V37.625C0 40.5812 2.385 43 5.3 43H47.7C50.615 43 53 40.5812 53 37.625V10.75C53 7.79375 50.615 5.375 47.7 5.375Z" />
                                </svg>
                                <span>{`Ariza ${num}`}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-auto search-wrapper">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder={t("User:Search_text")} />
                        <button className="btn btn-outline-secondary" type="button">
                            <CiSearch />
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
                            {t("arizalar-table-title-1")}
                        </th>
                        <th scope="col" colSpan="3">
                            {t("arizalar-table-title-1")}
                        </th>
                        <th scope="col" colSpan="2" rowSpan="2">
                            {t("arizalar-table-title-2")}
                        </th>
                        <th scope="col" rowSpan="2">
                            {t("arizalar-table-title-3")}
                        </th>
                    </tr>
                    <tr>
                        <th scope="col">{t("arizalar-table-title-4")}</th>
                        <th scope="col">{t("arizalar-table-title-5")}</th>
                        <th scope="col">{t("arizalar-table-title-6")}</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length === 0 ? (
                        <tr>
                            <td colSpan="8">Ma'lumotlar mavjud emas</td>
                        </tr>
                    ) : (
                        applications.map((application, index) => (
                            <tr key={application._id}>
                                <td>{index + 1}</td>
                                <td>
                                    <a href={`${import.meta.env.VITE_API_URL_BACKEND}/applicationview/${application._id}`} target="_blank">
                                        {application.title}
                                    </a>
                                </td>
                                <td>{formatDate(application.createDate)}</td>
                                <td>{application.name}</td>
                                <td>{application.title}</td>
                                <td>{application.date}</td>
                                <td>{formatDate(application.updateDate)}</td>
                                <td>
                                    {application.status === "Create" ? (
                                        <>
                                            Yaratolgan Sms tasdiqlash kutilmoqda <MdOutlineSms />
                                        </>
                                    ) : application.status === "WaitSignature" ? (
                                        <>
                                            Imzolash Kutilmoqda <FaFileSignature />
                                        </>
                                    ) : application.status === "End" ? (
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
                        ))
                    )}
                </tbody>
            </table>

            <button className="excel-button">
                <RiFileExcel2Line />
                Excel faylni yuklab olish
            </button>
        </>
    );
});

export default UserApplicationView;
