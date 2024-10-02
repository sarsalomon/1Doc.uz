import 'intersection-observer'
import { observer } from 'mobx-react-lite'
import { useContext, useEffect, useRef, useState } from 'react'
import {
	Button,
	Col,
	Collapse,
	Container,
	Form,
	Modal,
	Row,
	Tab,
	Tabs,
} from 'react-bootstrap'
import CountUp from 'react-countup'
import Faq from 'react-faq-component'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { signIn } from '../function/http/UserApi'
import { Context } from '../main'
import {
	ADMIN_DASHBOARD_ROUTE,
	HOME_ROUTE,
	REGISTRATION_ROUTE,
	USER_DASHBOARD_ROUTE,
} from '../utils/consts'

import { FaChevronDown } from 'react-icons/fa'

import Logo_Light from '../assets/img/logo_light.webp'

// Certificate import
import CertificateImage from './../assets/components/certificate/CertificateImage'

// import Carousel_left_icon from "../assets/img/left-arrow.svg";
// import Carousel_right_icon from "../assets/img/right-arrow.svg";

// AiLanding import
// import AiLanding from './../assets/components/aiLanding/AiLanding.jsx';

import { Accordion, FormControl, InputGroup } from 'react-bootstrap'

import { FcIdea } from 'react-icons/fc'
import { SlArrowRight } from 'react-icons/sl'
import aiLandTwo from './../assets/img/aiLanding/ai-landing.jpg'
import openAi from './../assets/img/aiLanding/Open-AI-Logo-3D-Icon-PNG.png'
import aiLandOne from './../assets/img/aiLanding/photo_2024-10-01_02-07-51.jpg'
import telImg from './../assets/img/aiLanding/tel.png'

import { aiJson } from './../assets/locales/translate/aiFaqsJson/uzAiJson.js'

import Instagram_icon from '../assets/img/instagram-icon.svg'
import Youtube_icon from '../assets/img/youtube-icon.svg'

import AI_img from '../assets/img/tabs/ai.jpg'
import Appeal_img from '../assets/img/tabs/arizalar.jpg'
import Signature_img from '../assets/img/tabs/imzo.jpg'
import Corperation_img from '../assets/img/tabs/korparativ-hujjat.jpg'
import Ocr_img from '../assets/img/tabs/ocr.jpg'
import Qr_img from '../assets/img/tabs/qr.jpg'
import Contract_img from '../assets/img/tabs/shartnomalar.jpg'
import Sms_img from '../assets/img/tabs/sms.jpg'

import ESignature_icon_img from '../assets/img/eimzo-icon.svg'
import Face_icon_img from '../assets/img/face-icon.svg'
import Signature_icon_img from '../assets/img/faksimile-icon.svg'
import Phone_icon_img from '../assets/img/phone-icon.svg'
import certificate from '../assets/img/photo_2024-08-30_18-40-58.jpg'
import Telegram_icon_img from '../assets/img/telegram-icon.svg'

import { FaTelegramPlane } from 'react-icons/fa'

const Home = observer(() => {
	const navigate = useNavigate()
	const { user } = useContext(Context)
	const { t, i18n } = useTranslation()

	const [show, setShow] = useState(false)
	const [team, setTeam] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const teamClose = () => setTeam(false)
	const teamShow = () => setTeam(true)

	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')

	const [isOpen, setIsOpen] = useState(false)

	const statisticsRef = useRef(null)
	const [isInView, setIsInView] = useState(false)
	const [aiIndex, setAiIndex] = useState(false)
	const [inputText, setInputText] = useState('')

	useEffect(() => {
		if (aiJson.length > 0) {
			setInputText(aiJson[0].inputText || 'Matnni shu yerga kiriting')
		}
	}, [])

	const handleChange = index => {
		setAiIndex(aiIndex === index ? false : index)
	}

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.5 }
		)

		if (statisticsRef.current) {
			observer.observe(statisticsRef.current)
		}

		return () => {
			if (statisticsRef.current) {
				observer.unobserve(statisticsRef.current)
			}
		}
	}, [])

	useEffect(() => {
		if (user.user.role == 'User') {
			navigate(USER_DASHBOARD_ROUTE)
		} else if (user.user.role == 'Admin') {
			navigate(ADMIN_DASHBOARD_ROUTE)
		}

		if (
			localStorage.getItem('Language') === null ||
			localStorage.getItem('Language') === undefined ||
			localStorage.getItem('Language') === ''
		) {
			localStorage.setItem('Language', 'uz')
		} else {
			i18n.changeLanguage(localStorage.getItem('Language'))
		}
	}, [])

	const changeLanguage = language => {
		i18n.changeLanguage(language)
		localStorage.setItem('Language', language)
	}

	const click = async () => {
		try {
			let data
			data = await signIn(phone, password)

			if (phone.length != 9) {
				toast.error('login  isze'),
					{
						position: 'bottom-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						theme: 'light',
					}
			}

			if (data) {
				user.setUser(data)
				user.setIsAuth(true)

				if (data.role === 'Admin') {
					navigate(ADMIN_DASHBOARD_ROUTE)
				} else if (data.role === 'User' || data.role === 'Lawyer') {
					navigate(USER_DASHBOARD_ROUTE)
				}
			}
		} catch (e) {
			toast.error(t(`${e.response.data.message}`), {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'light',
			})
		}
	}

	useEffect(() => {
		const keyDownHandler = event => {
			if (event.key === 'Enter') {
				click()
			}
		}

		document.addEventListener('keydown', keyDownHandler)

		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [phone, password])

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	function scrollToElement() {
		const target = document.getElementById('target-element')
		const headerOffset = 380
		const elementPosition =
			target.getBoundingClientRect().top + window.pageYOffset
		const offsetPosition = elementPosition - headerOffset

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		})
	}

	const data = {
		title: 'F.A.Q',
		rows: Array.from({ length: 6 }, (_, index) => ({
			title: t(`General:Home:Faq:question_${index + 1}`),
			content: t(`General:Home:Faq:answer_${index + 1}`),
		})),
	}

	const config = {
		animate: true,
		arrowIcon: 'V',
		openOnload: 1,
		expandIcon: '+',
		collapseIcon: '-',
	}

	const languages = [
		{ code: 'uz', label: "O'zbek" },
		{ code: 'ru', label: 'Русский' },
		{ code: 'kr', label: 'Ўзбек' },
		{ code: 'qr', label: 'Qaraqalpaq' },
		{ code: 'qrkr', label: 'Қарақалпақ' },
		{ code: 'en', label: 'English' },
	]

	const prices = [
		{
			title: 'General:Home:Price:Price_one:Price_one_title',
			price: '149.000',
			contentOne: 'General:Home:Price:Price_one:Price_one_content_one',
			contentTwo: 'General:Home:Price:Price_one:Price_one_content_two',
			month: 'General:Home:Price:Price_month',
			select: 'General:Home:Price:Price_select',
			groupName: 'group1',
			months: [1, 6, 12],
		},
		{
			title: 'General:Home:Price:Price_two:Price_two_title',
			price: '399.000',
			contentOne: 'General:Home:Price:Price_two:Price_two_content_one',
			contentTwo: 'General:Home:Price:Price_two:Price_two_content_two',
			month: 'General:Home:Price:Price_month',
			select: 'General:Home:Price:Price_select',
			groupName: 'group2',
			months: [1, 6, 12],
		},
		{
			title: 'General:Home:Price:Price_three:Price_three_title',
			price: '500.000',
			contentOne: 'General:Home:Price:Price_three:Price_three_content_one',
			contentTwo: 'General:Home:Price:Price_three:Price_three_content_two',
			month: 'General:Home:Price:Price_month',
			select: 'General:Home:Price:Price_select',
			groupName: 'group3',
			months: [1, 6, 12],
		},
		{
			title: 'General:Home:Price:Price_four:Price_four_title',
			price: '750.000',
			contentOne: 'General:Home:Price:Price_four:Price_four_content_one',
			contentTwo: 'General:Home:Price:Price_four:Price_four_content_two',
			month: 'General:Home:Price:Price_month',
			select: 'General:Home:Price:Price_select',
			groupName: 'group4',
			months: [1, 6, 12],
		},
	]

	const tabsData = [
		{
			eventKey: 'shartnomalar',
			title: 'General:Home:Tabs:Contract',
			imgSrc: Contract_img,
			imgAlt: 'General:Home:Tabs:Contract',
			listItems: [
				'General:Home:Tabs:Contract_text_one',
				'General:Home:Tabs:Contract_text_two',
				'General:Home:Tabs:Contract_text_three',
				'General:Home:Tabs:Contract_text_four',
			],
		},
		{
			eventKey: 'arizalar',
			title: 'General:Home:Tabs:Application',
			imgSrc: Appeal_img,
			imgAlt: 'General:Home:Tabs:Application',
			listItems: [
				'General:Home:Tabs:Application_text_one',
				'General:Home:Tabs:Application_text_two',
				'General:Home:Tabs:Application_text_three',
				'General:Home:Tabs:Application_text_four',
			],
		},
		{
			eventKey: 'korporativ-hujjatlar',
			title: 'General:Home:Tabs:Document',
			imgSrc: Corperation_img,
			imgAlt: 'General:Home:Tabs:Document',
			listItems: [
				'General:Home:Tabs:Document_text_one',
				'General:Home:Tabs:Document_text_two',
				'General:Home:Tabs:Document_text_three',
				'General:Home:Tabs:Document_text_four',
			],
		},
		{
			eventKey: 'murojaatlar',
			title: 'General:Home:Tabs:Appeal',
			imgSrc: Qr_img,
			imgAlt: 'General:Home:Tabs:Appeal',
			listItems: [
				'General:Home:Tabs:Appeal_text_one',
				'General:Home:Tabs:Appeal_text_two',
				'General:Home:Tabs:Appeal_text_three',
			],
		},
		{
			eventKey: 'imzo',
			title: 'General:Home:Tabs:Signature',
			imgSrc: Signature_img,
			imgAlt: 'General:Home:Tabs:Signature',
			listItems: [
				'General:Home:Tabs:Signature_text_one',
				'General:Home:Tabs:Signature_text_two',
				'General:Home:Tabs:Signature_text_three',
			],
		},
		{
			eventKey: 'sms',
			title: 'General:Home:Tabs:Sms',
			imgSrc: Sms_img,
			imgAlt: 'General:Home:Tabs:Sms',
			listItems: [
				'General:Home:Tabs:Sms_text_one',
				'General:Home:Tabs:Sms_text_two',
			],
		},
		{
			eventKey: 'ocr',
			title: 'General:Home:Tabs:OCR',
			imgSrc: Ocr_img,
			imgAlt: 'General:Home:Tabs:OCR',
			listItems: [
				'General:Home:Tabs:OCR_text_one',
				'General:Home:Tabs:OCR_text_two',
			],
		}
	]

	// const carouselItemsData = [
	//     {
	//         title: "General:Home:Carousel:Carousel_one",
	//         imgSrc: Hotel_img,
	//         imgAlt: "Hotel",
	//         text: "General:Home:Carousel:Carousel_one_text",
	//     },
	//     {
	//         title: "General:Home:Carousel:Carousel_two",
	//         imgSrc: Edu_img,
	//         imgAlt: "Education",
	//         text: "General:Home:Carousel:Carousel_two_text",
	//     },
	//     {
	//         title: "General:Home:Carousel:Carousel_three",
	//         imgSrc: Building_img,
	//         imgAlt: "Building",
	//         text: "General:Home:Carousel:Carousel_three_text",
	//     },
	//     {
	//         title: "General:Home:Carousel:Carousel_four",
	//         imgSrc: Bank_img,
	//         imgAlt: "Bank",
	//         text: "General:Home:Carousel:Carousel_four_text",
	//     },
	// ];

	return (
		<>
			<div>
				<div className='header-page'>
					<header>
						<nav>
							<Link to={HOME_ROUTE} className='logo'>
								<img src={Logo_Light} alt='1doc.uz Logo' />
								<h1>1doc.uz</h1>
							</Link>

							<div
								className='dropdown'
								onMouseLeave={toggleDropdown}
								onMouseEnter={toggleDropdown}
							>
								<button className='dropbtn'>
									<span>
										{localStorage.getItem('Language') === 'uz'
											? "O'zbek"
											: localStorage.getItem('Language') === 'ru'
											? 'Русский'
											: localStorage.getItem('Language') === 'kr'
											? 'Ўзбек'
											: localStorage.getItem('Language') === 'qr'
											? 'Qaraqalpaq'
											: localStorage.getItem('Language') === 'qrkr'
											? 'Қарақалпақ'
											: localStorage.getItem('Language') === 'en'
											? 'English'
											: "O'zbek"}
									</span>
									<FaChevronDown className={`icon ${isOpen ? 'open' : ''}`} />
								</button>
								{isOpen && (
									<div className='dropdown-content'>
										{languages.map(lang =>
											lang.code !== localStorage.getItem('Language') ? (
												<a
													key={lang.code}
													onClick={() => changeLanguage(lang.code)}
												>
													{lang.label}
												</a>
											) : null
										)}
									</div>
								)}
							</div>

							<div className='btns d-flex'>
								<Link to={REGISTRATION_ROUTE}>
									<button className='btn btn-primary start-btn'>
										{t('General:Home:Navbar:Demo_button')}
									</button>
								</Link>
								<button
									className='btn btn-outline-primary login-btn'
									onClick={handleShow}
								>
									{t('General:Home:Navbar:Login')}
								</button>
							</div>
						</nav>

						<div className='header-content'>
							<div className='header-title'>
								{[t('General:Home:Header:text_two')]}
							</div>
							<p>{t('General:Home:Header:Header_description')}</p>

							<div className='btns d-flex'>
								<a
									className='btn btn-primary prices-btn'
									onClick={() => scrollToElement()}
								>
									{t('General:Home:Navbar:Tariffs')}
								</a>
							</div>
						</div>
					</header>
				</div>

				<section className='tabs'>
					<Tabs
						defaultActiveKey='shartnomalar'
						className='d-flex justify-content-center items-content-center'
					>
						{tabsData.map((tab, index) => (
							<Tab eventKey={tab.eventKey} key={index} title={t(tab.title)}>
								<div className='tab-content'>
									<Row>
										<Col md={5}>
											<img
												src={tab.imgSrc}
												className='img-fluid'
												alt={tab.imgAlt}
											/>
										</Col>
										<Col md={6}>
											<ul className='feature-list list-unstyled'>
												{tab.listItems.map((item, index) => (
													<li key={index}>{t(item)}</li>
												))}
											</ul>
										</Col>
									</Row>
								</div>
							</Tab>
						))}
					</Tabs>
				</section>

				<section className='info-content container'>
					<div className='row'>
						<div className='imgInfo col'>
							<img src={aiLandOne} alt='' />
							<img src={aiLandTwo} alt='' />
						</div>
						<div className='textInfo col                                    '>
							<h3 style={{ textDecoration: 'uppercase' }}>
								{t('General:Home:Tabs:AI')}
							</h3>
							<p>{t('General:Home:Tabs:AI_text_one')}</p>
							<p>{t('General:Home:Tabs:AI_text_two')}</p>
							
						</div>
					</div>
				</section>

				<section className='user-aiLanding '>
					{aiJson.map((aiDate, index) => (
						<div key={index} className='aiLanding-card'>
							<div className='header-content'>
								<p className='mb-1'>
									<b>{aiDate.title}</b>
								</p>
								<p>
									<b className='b'>{aiDate.text}</b>
								</p>
								<b className='inText'>{aiDate.memberText}</b>
							</div>

							<Accordion
								key={index}
								onChange={() => handleChange(index)}
								alwaysOpen
							>
								<Accordion.Item eventKey={index}>
									<Accordion.Header>
										{/* <img src={lamp} alt='icon' /> */}
										<FcIdea className='icon-lamp' />
										<span className='accordion-text'>{aiDate.question}</span>
										<SlArrowRight className='slArrowRight' />
									</Accordion.Header>
									{/* <Accordion.Body>{aiDate.answer}</Accordion.Body> */}
								</Accordion.Item>
							</Accordion>
						</div>
					))}
					<div className='input-container'>
						<InputGroup className='aiLanding-input'>
							<FormControl placeholder={inputText} aria-label='Input text' />
							<button
								className='btn btn-secondary'
								// variant='outline-secondary'
								id='button-addon2'
							>
								<img src={openAi} alt='' />
							</button>
						</InputGroup>
					</div>
					{/* <AiLanding/> */}
				</section>

				<section className='statistics' ref={statisticsRef}>
					<Row className='d-flex justify-content-center align-items-end'>
						<Col
							md={4}
							className='d-flex justify-content-center align-items-center statistics-banner'
						>
							<p>{t('General:Home:Statistics:Statistics_title')}</p>
						</Col>
						<Col md={8} className='d-flex justify-content-center'>
							<Row className='stat-wrapper'>
								<Col
									md={4}
									className='stat-col d-flex justify-content-end align-items-end flex-column'
								>
									<h1>
										+{' '}
										<CountUp
											end={1000}
											duration={5}
											delay={1}
											start={isInView ? 0 : null}
										/>
									</h1>
									<h4>{t('General:Home:Statistics:Statistics_title_one')}</h4>
								</Col>
								<Col
									md={4}
									className='stat-col d-flex justify-content-center align-items-end flex-column'
								>
									<h1>
										+{' '}
										<CountUp
											end={100}
											duration={5}
											delay={1}
											start={isInView ? 0 : null}
										/>
									</h1>
									<h4>{t('General:Home:Statistics:Statistics_title_two')}</h4>
								</Col>
								<Col
									md={4}
									className='stat-col d-flex justify-content-center align-items-end flex-column'
								>
									<h1>
										+{' '}
										<CountUp
											end={50}
											duration={5}
											delay={1}
											start={isInView ? 0 : null}
										/>
									</h1>
									<h4>{t('General:Home:Statistics:Statistics_title_three')}</h4>
								</Col>
							</Row>
						</Col>
					</Row>
				</section>

				<section className='signing-types'>
					<h2>{t('General:Home:Signing:Signing_title')}</h2>
					<div className="container">
					<Row className='signing-types-content'>
						<Col
							md={2}
							sm={6}
							xs={6}
							className='signing-types-col d-flex justify-content-center align-items-center flex-column'
						>
							<div className='signing-types-col-header d-flex justify-content-center align-items-center'>
								<img src={Signature_icon_img} alt='Glass Icon' />
							</div>
							<div className='signing-types-col-body d-flex justify-content-center align-items-center flex-column'>
								<h4 className='text-center'>
									{t('General:Home:Signing:Signing_title_one')}
								</h4>
							</div>
						</Col>

						<Col
							md={2}
							sm={6}
							xs={6}
							className='signing-types-col d-flex justify-content-center align-items-center flex-column'
						>
							<div className='signing-types-col-header d-flex justify-content-center align-items-center'>
								<img src={Phone_icon_img} alt='Law Icon' />
							</div>
							<div className='signing-types-col-body d-flex justify-content-center align-items-center flex-column'>
								<h4 className='text-center'>
									{t('General:Home:Signing:Signing_title_two')}
								</h4>
							</div>
						</Col>

						<Col
							md={2}
							sm={6}
							xs={6}
							className='signing-types-col d-flex justify-content-center align-items-center flex-column'
						>
							<div className='signing-types-col-header d-flex justify-content-center align-items-center'>
								<img src={Telegram_icon_img} alt='Signature Icon' />
							</div>
							<div className='signing-types-col-body d-flex justify-content-center align-items-center flex-column'>
								<h4 className='text-center'>
									{t('General:Home:Signing:Signing_title_three')}
								</h4>
							</div>
						</Col>

						<Col
							md={2}
							sm={6}
							xs={6}
							className='signing-types-col d-flex justify-content-center align-items-center flex-column'
						>
							<div className='signing-types-col-header d-flex justify-content-center align-items-center'>
								<img src={Face_icon_img} alt='Signature Icon' />
							</div>
							<div className='signing-types-col-body d-flex justify-content-center align-items-center flex-column'>
								<h4 className='text-center'>
									{t('General:Home:Signing:Signing_title_four')}
								</h4>
							</div>
						</Col>

						<Col
							md={2}
							sm={6}
							xs={6}
							className='signing-types-col d-flex justify-content-center align-items-center flex-column'
						>
							<div className='signing-types-col-header d-flex justify-content-center align-items-center'>
								<img src={ESignature_icon_img} alt='Signature Icon' />
							</div>
							<div className='signing-types-col-body d-flex justify-content-center align-items-center flex-column'>
								<h4 className='text-center'>
									{t('General:Home:Signing:Signing_title_five')}
								</h4>
							</div>
						</Col>
					</Row>
					</div>
				</section>

				<section className='companies'>
					<h2 className='text-center'>
						{t('General:Home:Corparations:Corparations_title')}
					</h2>

					<div className='companies-content d-flex'>
						<div className='company'></div>
						<div className='company'></div>
						<div className='company'></div>
						<div className='company'></div>
						<div className='company'></div>
						<div className='company'></div>
					</div>
				</section>

				<section className='pricing' id='target-element'>
					<h2 className='text-center'>{t('General:Home:Price:Price_title')}</h2>

					<div className='pricing-content d-flex justify-content-center align-items-center'>
						{prices.map((priceInfo, index) => (
							<div className='price-box' key={index}>
								<h4>{t(priceInfo.title)}</h4>
								<h3>
									{priceInfo.price} <span>uzs</span>
								</h3>
								<p>{t(priceInfo.contentOne)}</p>
								<p>{t(priceInfo.contentTwo)}</p>
								<p>{t(priceInfo.contentThree)}</p>
								<p>{t(priceInfo.contentFour)}</p>
								<p>{t(priceInfo.contentFive)}</p>
								<p>{t(priceInfo.contentSix)}</p>
								<Form className='price-types'>
									{priceInfo.months.map((month, index) => (
										<div className={`type-${index + 1}`} key={index}>
											<Form.Check
												inline
												label={`${month} ${t(priceInfo.month)}`}
												name={priceInfo.groupName}
												type='radio'
												id={`inline-radio-${priceInfo.groupName}-${index}`}
												defaultChecked={index === 0}
											/>
										</div>
									))}
								</Form>
								<button className='btn btn-primary'>
									{t(priceInfo.select)}
								</button>
							</div>
						))}
					</div>
				</section>
				<section className='faq'>
					<div className='faq-container container'>
						<Faq data={data} config={config} />
					</div>
				</section>

				<section className='banner'>
					<div className='container'>
						<div className='row'>
							<div className='bannerInfo'>
								<a href='#' className='logo'>
									<img src={Logo_Light} />
								</a>

								<div className='content'>
									<h2>1doc.uz</h2>
									<h4>{t('General:Home:Banner:Banner_title')}</h4>
								</div>
							</div>
							<div className='bannerImage'>
								{/* <img src={telImg} alt='banner-image' /> */}
							</div>
						</div>
					</div>
				</section>

				<footer>
					<Row className='row-footer'>
						<Col className='col-footer' md={3}>
							<h4>{t('General:Home:Footer:Column_one:Column_one_title')}</h4>
							<ul>
								<li>
									<a
										href='https://api.1doc.uz/muhim/MA’LUMOTLARNING MAXFIYLIK SIYOSATI 1DOC MCHJ.pdf'
										target='_blank'
									>
										{t('General:Home:Footer:Column_one:Column_one_text_one')}
									</a>
								</li>
								<li>
									<a
										href='https://api.1doc.uz/muhim/OMMAVIY OFERTA 1doc.uz.pdf'
										target='_blank'
									>
										{t('General:Home:Footer:Column_one:Column_one_text_two')}
									</a>
								</li>
								<li>
									<a onClick={teamShow} style={{ cursor: 'pointer' }}>
										{t('General:Home:Footer:Column_one:Column_one_text_three')}
									</a>
								</li>
							</ul>
						</Col>

						<Col className='col-footer' md={6}>
							<h4>{t('General:Home:Footer:Column_two:Column_two_title')}</h4>

							<ul>
								<li>
									<a href='http://lex.uz//docs/6213382' target='_blank'>
										{t('General:Home:Footer:Column_two:Column_two_text_one')}
									</a>
								</li>
								<li>
									<a href='http://lex.uz//docs/6234904' target='_blank'>
										{t('General:Home:Footer:Column_two:Column_two_text_two')}
									</a>
								</li>
								<li>
									<a href='http://lex.uz//docs/6840502' target='_blank'>
										{t('General:Home:Footer:Column_two:Column_two_text_three')}
									</a>
								</li>
								<li>
									<a href='http://lex.uz//ru/docs/-3336169' target='_blank'>
										{t('General:Home:Footer:Column_two:Column_two_text_four')}
									</a>
								</li>
							</ul>
						</Col>

						<Col className='col-footer' md={3}>
							<h4>
								{t('General:Home:Footer:Column_three:Column_three_title')}
							</h4>

							<ul>
								<li>
									<a href='tel:+998559001006'>+998 55 900 10 06</a>
								</li>
								<li>
									<CertificateImage certificateImage={certificate} />
								</li>
							</ul>
						</Col>
					</Row>
					<hr className='bg-white' />

					<Row className='row footer-bottom'>
						<Col md={6} className='title'>
							<p>OOO "1DOC" 2024</p>
						</Col>

						<Col
							md={6}
							className='socials d-flex'
							style={{ justifyContent: 'flex-end', columnGap: 20 }}
						>
							<img src={Youtube_icon} alt='' />
							<img src={Instagram_icon} alt='' />
						</Col>
					</Row>
				</footer>
			</div>

			<a
				href='https://t.me/duran_tv'
				target='_blank'
				className='telegramShareBtn'
			>
				<FaTelegramPlane />
			</a>

			<Modal
				className='py-4 sigNmodal'
				show={show}
				onHide={handleClose}
				backdrop='static'
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<div className='closeHeader'>
						<Modal.Title>{t('General:Auth:pageTitle')}</Modal.Title>
						<span>
							{t('General:Auth:notRegister')}{' '}
							<Link to='/registration'>{t('General:Auth:register')}</Link>
						</span>
						<button className="closeBtn btn " onClick={handleClose}>X</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<Form className='d-flex flex-column'>
						<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
							<Form.Label>{t('General:Auth:phone')}</Form.Label>
							<Form.Control
								placeholder={t('General:Auth:phonePlaceholder')}
								value={phone}
								onChange={e => setPhone(e.target.value)}
								autoFocus
							/>
						</Form.Group>
						<Form.Group className='mb-3' controlId='exampleForm.ControlInput1'>
							<Form.Label>{t('General:Auth:password')}</Form.Label>
							<Form.Control
								placeholder={t('General:Auth:passwordPlaceholder')}
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
							/>
						</Form.Group>
						<div className='d-flex justify-content-between'>
							<Form.Check
								type={'checkbox'}
								label={t('General:Auth:remember')}
							/>
							<span>{t('General:Auth:forget')}</span>
						</div>
						<div className='d-grid gap-1'>
							<Button
								variant='primary'
								size='lg'
								className='mt-3 align-self-end'
								onClick={click}
							>
								{t('General:Auth:button')}
							</Button>
						</div>
					</Form>
				</Modal.Body>
			</Modal>
			<Modal
				className='py-4'
				show={team}
				onHide={teamClose}
				dialogClassName='Signature-modal-90w'
				backdrop='static'
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<div className='d-inline align-items-center justify-content-center'>
						<Modal.Title>Rahbariyat</Modal.Title>
					</div>
				</Modal.Header>
				<Modal.Body>
					<Container fluid>
						<Row>
							<Col xxl={3} xl={3} lg={3} md={3} xs={6}>
								<div className='management'>
									<div className='card-container'>
										<div className='card-box'>
											<div className='card-tabs'>
												<Tabs activeKey={'tab1'} className='custom-tabs mb-3'>
													<Tab eventKey='tab1' title='123'></Tab>
													<Tab eventKey='tab2' title='253'></Tab>
												</Tabs>
											</div>
											<Collapse
												in={'tab1' === 'tab1'}
												className='custom-collapse'
											>
												<div className='row'>
													<div className='col-3'>
														<img
															// src={img}
															alt='Profile'
															className='img-fluid rounded'
															style={{ width: '185px', height: '185px' }}
														/>
													</div>
													<div className='col-9 text-center'>
														<p>
															<strong>
																<h5>
																	<b>124</b>
																</h5>
																<h4>
																	<b>124</b>
																</h4>
															</strong>
														</p>
														<div className='text-start'>
															<p>
																<strong>124</strong>
																<a href='#'>124</a>
															</p>
															<p>
																<strong>124</strong>
																124
															</p>
															<p>
																<strong>123</strong>
																1212
															</p>
															<div className='mt-4 '>
																<p>
																	<span>
																		<img
																			// src={telegramIcon}
																			alt='Telegram'
																			className='iconsGram'
																		/>
																		<a href='#'>124</a>
																	</span>
																</p>
																<p>
																	<img
																		// src={instagramIcon}
																		alt='Instagram'
																		className='iconsGram'
																	/>
																	<a href='#'>124</a>
																</p>
															</div>
														</div>
													</div>
												</div>
											</Collapse>

											<Collapse
												in={'tab2' === 'tab2'}
												className='custom-collapse'
											>
												<div>
													<p>
														<strong>1</strong>
													</p>
													<p>2</p>
												</div>
											</Collapse>
										</div>
									</div>
								</div>
							</Col>
							<Col xxl={3} xl={3} lg={3} md={3} xs={6}>
								1
							</Col>
							<Col xxl={3} xl={3} lg={3} md={3} xs={6}>
								1
							</Col>
							<Col xxl={3} xl={3} lg={3} md={3} xs={6}>
								1
							</Col>
						</Row>
					</Container>
				</Modal.Body>
			</Modal>
			<ToastContainer />
		</>
	)
})

export default Home
