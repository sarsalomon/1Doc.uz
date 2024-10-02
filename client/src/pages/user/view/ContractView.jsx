import { Table, Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { deleteDataContract, fetchDatasContractById } from "../../../function/http/ContractAPI";
import { Context } from "../../../main";
import { useTranslation } from "react-i18next";
import UserContractViewComponent from "./components/ContractViewComponent";
import { confirmAlert } from "react-confirm-alert";

import { CiSearch } from "react-icons/ci";
import { MdOutlineSms } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { MdOutlineDoneAll } from "react-icons/md";
import { RiFileExcel2Line } from "react-icons/ri";

const UserContractView = observer(() => {
  const { user } = useContext(Context);
  const [key, setKey] = useState(localStorage.getItem("Path"));
  const [contracts, setContracts] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDatasContractById(user._user.id).then((data) => {
      setContracts(data);
    }).catch(error => {
      console.error("Error fetching contracts:", error);
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
      data = await deleteDataContract(id);
      if (data) {
        fetchDatasContractById(user._user.id)
              .then((data) => {
                setContracts(data);
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
      {key == "Contract" ? (
        <>
          <Helmet>
            <title>{t("User:Contract:Title")}</title>
          </Helmet>
          <div>
            <div className="row align-items-center top-bar">
              <div className="col-auto create-btn-wrapper">
                <button className="btn btn-outline-primary" onClick={() => changeStateContract('ContractAdd')}>
                  <svg
                    className="plus-icon"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_348_21)">
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
              <div className="col-auto search-wrapper">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-transparent"
                    placeholder={t("User:Search_text")}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <CiSearch />
                  </button>
                </div>
              </div>
            </div>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th scope="col" rowSpan="2">№</th>
                  <th scope="col" rowSpan="2">{t("User:Contract:Component:Text_1")}</th>
                  <th scope="col" colSpan="3">{t("User:Contract:Component:Text_2")}</th>
                  <th scope="col" colSpan="2">{t("User:Contract:Component:Text_3")}</th>
                  <th scope="col" rowSpan="2">{t("User:Contract:Component:Text_4")}</th>
                  <th scope="col" rowSpan="2">{t("User:Contract:Component:Text_5")}</th>
                </tr>
                <tr>
                  <th scope="col">{t("User:Contract:Component:Text_6")}</th>
                  <th scope="col">{t("User:Contract:Component:Text_7")}</th>
                  <th scope="col">{t("User:Contract:Component:Text_8")}</th>
                  <th scope="col">{t("User:Contract:Component:Text_9")}</th>
                  <th scope="col">{t("User:Contract:Component:Text_10")}</th>
                </tr>
              </thead>
              <tbody>
              {contracts.length === 0 ? (
                  <tr>
                    <td colSpan="8">Ma'lumotlar mavjud emas</td>
                  </tr>
                ) : (
                  contracts.map((contract, index) => {
                    const parsedSubject = formatData(contract.contractSubject);

                    return (
                      <tr key={contract._id}>
                        <td>{index + 1}</td>
                        <td>
                          <a href={`${import.meta.env.VITE_API_URL_BACKEND}/contractview/${contract._id}`} target="_blank">
                            {contract.title}
                          </a>
                        </td>
                        <td>{formatDate(contract.createDate)}</td>
                        <td>{parsedSubject.name}</td>
                        <td>{parsedSubject.title}</td>
                        <td>{parsedSubject.date}</td>
                        <td>{formatDate(contract.updateDate)}</td>
                        <td>
                          {contract.status === "Create" ? (
                            <>Yaratolgan Sms tasdiqlash kutilmoqda <MdOutlineSms /></>
                          ) : contract.status === "WaitSignature" ? (
                            <>Imzolash Kutilmoqda <FaFileSignature /></>
                          ) : contract.status === "End" ? (
                            <>To'liq tasdiqlangan <MdOutlineDoneAll /></>
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

            </Table>
            <button className="excel-button">
              <RiFileExcel2Line />
              Excel faylni yuklab olish
            </button>
          </div>
        </>
      ) : (
        <UserContractViewComponent />
      )}
    </>
  );
});

export default UserContractView;
