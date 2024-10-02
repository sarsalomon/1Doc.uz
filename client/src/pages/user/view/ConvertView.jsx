import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

import { Context } from "../../../main";
import { fileConvert } from "../../../function/http/ConvertAPI";
import { MdOutlineUploadFile } from "react-icons/md";

const UserConvertView = observer(() => {
    const { t } = useTranslation();
    const { user } = useContext(Context); // Assuming user context might be used later

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);

    

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const showToast = (message, type = 'error') => {
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

    const ConvertFile = useCallback(async () => {
        if (file && !progress) {
          setProgress(true);
          setProgressValue(0); // Сбрасываем прогресс в 0
    
          const allowedTypes = ["application/docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
         
          if (!allowedTypes.includes(file.type)) {
            showToast(t("File must be in DOCX format"));
            setProgress(false);
            return;
          }

            const formData = new FormData();
            formData.append("file", file);
            const simulateProgress = () => {
                let value = 0;
                const interval = setInterval(() => {
                  value += 10;
                  setProgressValue(value);
                  if (value >= 100) {
                    clearInterval(interval);
                  }
                }, 300); // Каждые 300 мс добавляем 10% к прогрессу
              };

            try {
                simulateProgress();

                const data = await fileConvert(formData);
                setFile(null); // Reset file input
                window.open(data, "_blank");
            } catch (e) {
                showToast(e.response?.data?.message || t("An error occurred"));
            } finally {
                setProgress(false);
            }
        } else {
            showToast(t("Please select a file"), 'error');
        }
    }, [file, progress, t]);

    useEffect(() => {
        const keyDownHandler = (event) => {
            if (event.key === "Enter") {
                ConvertFile();
            }
        };

        document.addEventListener("keydown", keyDownHandler);
        return () => document.removeEventListener("keydown", keyDownHandler);
    }, [ConvertFile]);

    return (
        <>
            <Helmet>
                <title>{t("User:Translater:Title")}</title>
            </Helmet>
            <div className="locker-container locker-page">
                <h3 className="locker-title">{t("User:Translater:PageTitle")}</h3>

                <button className="upload-btn btn btn-outline-primary">
                    <MdOutlineUploadFile className='docImg'/>
                    {t("User:FileUploads")} (.docx)
                    <input
                     className='upload-input'
                     type="file"
                     onChange={selectFile} 
                     accept=".docx" />
                </button>

                <div className="locker-form-container">
                    <button
                        className={`locker-btn btn btn-primary ${progress ? 'in-progress' : ''}`}
                        onClick={ConvertFile}
                        disabled={!file || progress}
                    >
                        <span className="content">
                        {progress ? t("User:Locker:InProgress") : t("User:Translater:Convert_button")}
                        </span>
                        <span className="value"></span>
                        <span className="progress"   
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

export default UserConvertView;
