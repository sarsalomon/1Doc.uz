import { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Context } from "../../../../main";
import { fetchDataTemplate, getDataTemplate } from "../../../../function/http/TemplateAPI";

import ContractOne from "../../components/contracts/ContractOne";
import ContractTwo from "../../components/contracts/ContractTwo";
import ContractThree from "../../components/contracts/ContractThree";
import ContractFour from "../../components/contracts/ContractFour";
import ContractFive from "../../components/contracts/ContractFive";

import { IoArrowBack } from "react-icons/io5";

import '../../../../index.css';
import { USER_DASHBOARD_ROUTE } from './../../../../utils/consts';


const UserContractViewComponent = observer(() => {
  const { user } = useContext(Context);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    fetchDataTemplate()
      .then(data => {
        const parsedTemplates = data.map(template => ({
          ...template,
          title: JSON.parse(template.title)
        }));
        setTemplates(parsedTemplates);
      })
      .catch(error => {
        console.error("Error fetching contract template:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      getDataTemplate(selectedTemplate)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error("Error fetching contract template:", error);
        });
    }
  }, [selectedTemplate]);

  const handleNavigation = () => {
    localStorage.setItem("Path", "Contract");
    window.location.href = USER_DASHBOARD_ROUTE;
  };

  return (
    <>
      <Helmet>
        <title>{t("User:Contract:Component:PageTitle")}</title>
      </Helmet>
      <Container fluid>
        <Row className="mt-2">
          <Col xxl={2} xl={2} lg={2} md={2} sm={2} className="d-flex justify-content-center align-items-center BackButton"
            onClick={handleNavigation}
          >
            <IoArrowBack style={{ fontSize: "24px" }} />
            {t("Orqaga qaytish")}
          </Col>
          <Col xxl={2} xl={2} lg={2} md={2} sm={2}>
            <Form.Select value={selectedTemplate} onChange={(event) => setSelectedTemplate(event.target.value)}>
              <option value="">
                {t("Contract tanglang")}
              </option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template?.title[localStorage?.getItem('Language')]}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col xxl={6} xl={6} lg={6} md={6} sm={6}></Col>
        </Row>
        <Row>
          {selectedTemplate === "1" && <ContractOne />}
          {selectedTemplate === "2" && <ContractTwo />}
          {selectedTemplate === "3" && <ContractThree />}
          {selectedTemplate === "4" && <ContractFour />}
          {selectedTemplate === "5" && <ContractFive />}
          {!selectedTemplate && <div></div>}
        </Row>
      </Container>
    </>
  );
});

export default UserContractViewComponent;
