import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { addDataLocker } from "../../../function/http/LockerAPI";
import { fileConvert } from "../../../function/http/ConvertAPI";

const UserConvertView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(false);

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const ConvertFile = async () => {
        if (file && !progress) {
            setProgress(true);
            const allowedTypes = ["application/docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if (!allowedTypes.includes(file.type)) {
                toast.error(("Файл должен быть формата docx"), {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setProgress(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const data = await fileConvert(formData);
                setFile(null);
                window.open(data, "_blank");
            } catch (e) {
                toast.error(e.response?.data?.message || "An error occurred", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } finally {
                setProgress(false);
            }
        } else {
            toast.error(t("User:Locker:Error_Message"), {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setProgress(false);
        }
    };

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === "Enter") {
                ConvertFile();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [ConvertFile]);

    return (
        <>
            <Helmet>
                <title>{t("User:Translater:Title")}</title>
            </Helmet>
            <div className="locker-container locker-page">
                <h3 className="locker-title">{t("User:Translater:PageTitle")}</h3>

                <button className="upload-btn btn btn-outline-primary">
                    {t("User:FileUploads")} (.docx)
                    <input type="file" onChange={selectFile} accept=".docx" />
                </button>

                <div className="locker-form-container">
                    {progress ? (
                        <button className="locker-btn btn btn-primary" disabled>
                            {t("User:Locker:InProgress")}
                        </button>
                    ) : (
                        <button
                            className="locker-btn btn btn-primary"
                            onClick={ConvertFile}
                            disabled={!file}
                        >
                            {t("User:Translater:Convert_button")}
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
});

export default UserConvertView;
