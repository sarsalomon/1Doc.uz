import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { addDataLocker } from "../../../function/http/LockerAPI";

import { MdOutlineUploadFile } from "react-icons/md";

const UserLockerView = observer(() => {
    const { user } = useContext(Context);
    const { t } = useTranslation();

    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [progress, setProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0); // State for progress value

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const LockFile = useCallback(async () => {
        if (file && password && rePassword && password === rePassword && !progress) {
            setProgress(true);
            setProgressValue(0); // Reset progress value

            // Проверка MIME-типа файла
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

            // Simulating progress
            const simulateProgress = () => {
                let value = 0;
                const interval = setInterval(() => {
                    value += 10; // Increment progress by 10%
                    setProgressValue(value);
                    if (value >= 100) {
                        clearInterval(interval); // Stop when 100% is reached
                    }
                }, 300); // Increment every 300 ms
            };

            try {
                simulateProgress(); // Start simulating progress

                // Simulate file processing time
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulating 3 seconds delay

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
    }, [file, password, rePassword, progress, t]);

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
                <div className='locker-drop'>
                    <h3 className="locker-title">{t("User:Locker:PageTitle")}</h3>

                    <button className="upload-btn btn btn-outline-primary">
                        <MdOutlineUploadFile className='docImg'/>
                        {t("User:FileUploads")} (.pdf)
                        <input className='upload-input' type="file" onChange={selectFile} accept=".pdf" />
                    </button>
                </div>
                    <div className="locker-form-container">
                        <h5 className="locker-form-label">{t("User:Locker:Text_two")}</h5>

                        <input 
                            className="locker-input" 
                            type="password" 
                            placeholder={t("User:Locker:Password_number_input")} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <input 
                            className="locker-input" 
                            type="password" 
                            placeholder={t("User:Locker:RePassword_number_input")} 
                            value={rePassword} 
                            onChange={(e) => setRePassword(e.target.value)} 
                        />

                        <button
                            className={`locker-btn btn btn-primary ${progress ? 'in-progress' : ''}`}
                            onClick={LockFile}
                            disabled={!file || progress}
                            style={{
                                width:'80%',
                                height:'50px'
                            }}
                        >
                            <span className="content">
                                {progress ? t("User:Locker:InProgress") : t("User:Locker:Block_button")}
                            </span>
                            <span className="value"></span>
                            <span 
                            className="progress" 
                            style={{ 
                                width: `${progressValue}%`, 
                                display: progressValue > 0 && progressValue < 100 ? 'block' : 'none' 
                            }}></span>
                        </button>
                    </div>
                </div>
            <ToastContainer />
        </>
    );
});

export default UserLockerView;
