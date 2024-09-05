import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { addDataLocker } from "../../../function/http/LockerAPI";

const UserLockerView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [progress, setProgress] = useState(false);

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const LockFile = async () => {
        if (file && password && rePassword && password === rePassword && !progress) {
            setProgress(true);

            // Проверка MIME-типа файла
            const allowedTypes = ['application/pdf'];
            if (!allowedTypes.includes(file.type)) {
                alert('Файл должен быть формата pdf');
                setProgress(false);
                return;
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("password", password);

            try {
                const data = await addDataLocker(formData);
                setFile(null);
                setPassword("");
                setRePassword("");
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
                LockFile();
            }
        };

        document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [LockFile]);

    return (
        <>
            <Helmet>
                <title>{t("User:Locker:Title")}</title>
            </Helmet>
            <div className="locker-container locker-page">
                <h3 className="locker-title">{t("User:Locker:PageTitle")}</h3>

                <button className="upload-btn btn btn-outline-primary">
                    {t("User:FileUploads")} (.pdf)
                    <input type="file" onChange={selectFile} />
                </button>

                <div className="locker-form-container">
                    <h5 className="locker-form-label">{t("User:Locker:Text_two")}</h5>

                    <input className="locker-input" type="password" placeholder={t("User:Locker:Password_number_input")} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="locker-input" type="password" placeholder={t("User:Locker:RePassword_number_input")} value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
                    {progress ? (
                        <button className="locker-btn btn btn-primary" disabled>
                            Jarayonda
                        </button>
                    ) : (
                        <button className="locker-btn btn btn-primary" onClick={LockFile}>
                            {t("User:Locker:Block_button")}
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    );
});

export default UserLockerView;
