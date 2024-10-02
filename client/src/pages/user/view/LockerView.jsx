import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { addDataLocker } from "../../../function/http/LockerAPI";

import { MdOutlineUploadFile } from "react-icons/md";
import { Button } from "react-bootstrap";

const UserLockerView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [progress, setProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const showToast = (message, type = "error") => {
        toast[type](message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const LockFile = useCallback(async () => {
        if (file && password && rePassword && password === rePassword && !progress) {
            setProgress(true);
            setProgressValue(0);

            const allowedTypes = ["application/pdf"];
            if (!allowedTypes.includes(file.type)) {
                toast.error("Файл должен быть формата pdf", {
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
            formData.append("password", password);

            const simulateProgress = () => {
                let value = 0;
                const interval = setInterval(() => {
                    value += 10;
                    setProgressValue(value);
                    if (value >= 100) {
                        clearInterval(interval);
                    }
                }, 300);
            };

            try {
                simulateProgress();

                await new Promise((resolve) => setTimeout(resolve, 3000));

                const data = await addDataLocker(formData);

                setFile(null);
                setPassword("");
                setRePassword("");
                setProgress(false);
                setProgressValue(0);
                window.open(data, "_blank");
            } catch (e) {
                showToast(e.response?.data?.message || t("An error occurred"));
            } finally {
                setProgress(false);
            }
        } else {
            showToast(t("Please select a file"), "error");
        }
    }, [file, password, rePassword, progress]);

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
            <div className="locker-container">
                <div className="locker-drop">
                    <h3 className="locker-title">{t("User:Locker:PageTitle")}</h3>

                    <Button variant="none" className="upload-btn btn btn-outline-primary">
                        <MdOutlineUploadFile className="docImg" />
                        {file ? <span>{file.name}</span> : <span>{t("User:FileUploads") + " (.pdf)"}</span>}
                        <input className="upload-input" type="file" onChange={selectFile} accept=".pdf" />
                    </Button>
                </div>
                <div className="locker-form-container">
                    <h5 className="locker-form-label" style={{ color: "black" }}>
                        {t("User:Locker:Text_two")}
                    </h5>

                    <input className="locker-input" type="password" placeholder={t("User:Locker:Password_number_input")} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <input className="locker-input" type="password" placeholder={t("User:Locker:RePassword_number_input")} value={rePassword} onChange={(e) => setRePassword(e.target.value)} />

                    <Button
                        className={`locker-btn btn btn-primary ${progress ? "in-progress" : ""}`}
                        onClick={LockFile}
                        disabled={!file || progress}
                        style={{
                            width: "80%",
                            height: "50px",
                        }}
                    >
                        <span className="content">{progress ? t("User:Locker:Progress") : t("User:Locker:Block_button")}</span>
                        <span className="value"></span>
                        <span
                            className="progress"
                            style={{
                                width: `${progressValue}%`,
                                display: progressValue > 0 && progressValue < 100 ? "block" : "none",
                            }}
                        ></span>
                    </Button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
});

export default UserLockerView;
