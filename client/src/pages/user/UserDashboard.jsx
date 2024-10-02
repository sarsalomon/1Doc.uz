import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { Context } from '../../main'

import { FaChevronDown } from 'react-icons/fa'
import UserAppealView from './view/AppealView'
import UserApplicationView from './view/ApplicationView'
import UserContractView from './view/ContractView'
import UserDocumentView from './view/DocumentView'
import UserLockerView from './view/LockerView'
import UserMailView from './view/MailView'
import UserOcrView from './view/OCR'
import UserSignatureView from './view/SignatureView'
import UserSmsView from './view/SmsView'

import Logo_Light from '../../assets/img/logo_light.webp'

import Wallet_icon from '../../assets/img/wallet.svg'

import Alif_logo from '../../assets/img/payment/AlifPayLogo.jpg'
import Bank_logo from '../../assets/img/payment/BankLogo.jpg'
import Click_logo from '../../assets/img/payment/ClickLogo.jpg'
import Payme_logo from '../../assets/img/payment/PaymeLogo.jpg'

import Alif_QrCode from '../../assets/img/payment/qrcode_Alif.jpg'

import OneNote_icon_light from '../../assets/img/sidebar/1Note-light.svg'
import AI_icon_light from '../../assets/img/sidebar/ai-light.svg'
import Appeal_icon_light from '../../assets/img/sidebar/appeal-light.svg'
import Application_icon_light from '../../assets/img/sidebar/application-light.svg'
import Contract_icon_light from '../../assets/img/sidebar/contract-light.svg'
import Document_icon_light from '../../assets/img/sidebar/document-light.svg'
import Mail_icon_light from '../../assets/img/sidebar/gmail-light.svg'
import Locker_icon_light from '../../assets/img/sidebar/locker-light.svg'
import OCR_icon_light from '../../assets/img/sidebar/ocr-light.svg'
import PdfEditor_icon_light from '../../assets/img/sidebar/pdfEditor-light.svg'
import Signature_icon_light from '../../assets/img/sidebar/signature-light.svg'
import Sms_icon_light from '../../assets/img/sidebar/sms-light.svg'
import Tahrirchi_icon_light from '../../assets/img/sidebar/tahrirchi-light.svg'
import Translater_icon_light from '../../assets/img/sidebar/translater-light.svg'
import Manual_icon_light from "../../assets/img/sidebar/manual-light.svg";
import { HOME_ROUTE } from '../../utils/consts'
import UserAccountView from './view/AccountView'

import { Modal, Table } from 'react-bootstrap'

import DarkMode from '../../assets/components/darkMode/DarkMode'
import '../../assets/css/_sidebar.scss'
import { updateUserPhoto } from '../../function/http/UserApi'
import UserAiView from './view/AiView'
import UserContractViewComponent from './view/components/ContractViewComponent'
import UserConvertView from './view/ConvertView'
import UserTahrirchiView from './view/TahrirchiView'
import UserTranslaterView from './view/TranslaterView'
import { IoIosArrowForward } from "react-icons/io"

const UserDashboard = observer(() => {
	const { user } = useContext(Context)
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()

	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const [isTextVisibleBank, setIsTextVisibleBank] = useState(false)
	const [isTextVisibleAlif, setIsTextVisibleAlif] = useState(false)

	const [activeLink, setActiveLink] = useState()

	const [hoveredLink, setHoveredLink] = useState('Contract')
	const [themeLinkHovered, setThemeLinkHovered] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [theme, setTheme] = useState(
		() => localStorage.getItem('theme') || 'primary'
	)
	const [settingsLinkClicked, setSettingsLinkClicked] = useState(false)

	const [isNavbarOpened, setIsNavbarOpened] = useState(false)

	useEffect(() => {
		if (
			localStorage.getItem('Language') === null ||
			localStorage.getItem('Language') === undefined ||
			localStorage.getItem('Language') === ''
		) {
			localStorage.setItem('Language', 'uz')
		} else {
			i18n.changeLanguage(localStorage.getItem('Language'))
		}

		if (
			localStorage.getItem('Path') === null ||
			localStorage.getItem('Path') === undefined ||
			localStorage.getItem('Path') === ''
		) {
			localStorage.setItem('Path', 'Contract')
			setActiveLink('Contract')
		} else {
			setActiveLink(localStorage.getItem('Path'))
		}
	}, [])

	const changeLanguage = language => {
		i18n.changeLanguage(language)
		localStorage.setItem('Language', language)
	}

	const logOut = () => {
		localStorage.clear()
		user.setUser({})
		user.setIsAuth(false)
		navigate(HOME_ROUTE)
	}

	const handleLinkClick = link => {
		localStorage.setItem('Path', link)
		setActiveLink(link)
	}

	const handleLinkHover = link => {
		setHoveredLink(link)
	}

	const toggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	const toggleMenu = () => {
		setIsNavbarOpened(!isNavbarOpened)
	}

	const handleToggleText = name => {
		if (name === 'Bank') {
			setIsTextVisibleBank(!isTextVisibleBank)
			setIsTextVisibleAlif(false)
		} else if (name === 'Alif') {
			setIsTextVisibleAlif(!isTextVisibleAlif)
			setIsTextVisibleBank(false)
		}
	}

	const languages = [
		{ code: 'uz', label: "O'zbek" },
		{ code: 'ru', label: 'Русский' },
		{ code: 'kr', label: 'Ўзбек' },
		{ code: 'qr', label: 'Qaraqalpaq' },
		{ code: 'qrkr', label: 'Қарақалпақ' },
		{ code: 'en', label: 'English' },
	]

	const fileInputRef = useRef(null)
	const [fileName, setFileName] = useState('')
	const [photo, setPhoto] = useState(null)

	const handleButtonClick = () => {
		fileInputRef.current.click() // Trigger the hidden file input
	}

	const handleFileChange = async event => {
		if (event.target.files.length > 0) {
			setFileName(event.target.files[0].name) // Set the selected file name
			try {
				const file = event.target.files[0]

				if (!file) {
					return
				}

				const allowedTypes = ['image/jpeg', 'image/png']
				if (!allowedTypes.includes(file.type)) {
					alert('Файл должен быть формата PNG или JPG.')
					return
				}

				const img = new Image()
				img.src = URL.createObjectURL(file)

				img.onload = async () => {
					if (img.width === 1024 && img.height === 1024) {
						// Wait until the image is loaded and verified
						setPhoto(file)

						const formData = new FormData()
						formData.append('id', user._user.id)
						formData.append('photo', file)

						console.log(formData)

						let data = await updateUserPhoto(formData)
						console.log(data)

						if (data.status === 'success') {
							user.setUserPhoto(data.file)
							toast.success('Фото успешно обновлено.', {
								position: 'bottom-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
							})
						} else {
							toast.error(data.message || 'Произошла ошибка.', {
								position: 'bottom-right',
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
							})
						}
					} else {
						alert('Изображение должно быть размером 1024x1024 пикселей.')
					}
				}

				img.onerror = () => {
					alert('Не удалось загрузить изображение.')
				}
			} catch (e) {
				toast.error(e.response?.data?.message || 'Произошла ошибка.', {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				})
			}
		}
	}

	return (
		<>
			<div>
				<nav className='sidebar-nav'>
					<a className='logo-expand' href='#'>
						<img src={Logo_Light} alt='1doc.uz Logo' />
						<h1>1doc.uz</h1>
					</a>

					<div
						className='menu-expand'
						onClick={() => {
							toggleMenu()
						}}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							height='24'
							viewBox='0 0 24 24'
							width='24'
							focusable='false'
							aria-hidden='true'
						>
							<path d='M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z'></path>
						</svg>
					</div>

					<div className='right d-flex'>
						<a className='tel'>+998 {user.user.phone}</a>

						<DarkMode />
						
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

						<a
							className='settings'
							onMouseEnter={() => {
								setSettingsLinkClicked(true)
							}}
							onMouseLeave={() => {
								setSettingsLinkClicked(false)
							}}
						>
							<svg
								className='settings-icon'
								width='28'
								height='30'
								viewBox='0 0 28 30'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path d='M25.1285 16.7111C24.6043 16.3189 24.2912 15.6889 24.2912 15.0251C24.2912 14.3613 24.6043 13.7313 25.1277 13.3398L27.5491 11.5285C27.935 11.239 28.0945 10.7297 27.9438 10.2655C27.3205 8.35441 26.3347 6.61136 25.013 5.08357C24.6948 4.71756 24.1817 4.60206 23.7428 4.79856L21.0164 6.02184C20.4224 6.28885 19.7307 6.2506 19.1669 5.91834C18.6038 5.58683 18.226 4.99582 18.1547 4.33655L17.8269 1.28247C17.7747 0.796452 17.4203 0.400441 16.9514 0.302188C15.0423 -0.0960726 13.0363 -0.102823 11.0935 0.294688C10.6215 0.391441 10.2665 0.787452 10.2143 1.27572L9.8894 4.3103C9.8181 4.97032 9.44026 5.56133 8.87572 5.89284C8.31264 6.22435 7.62313 6.2641 7.02698 5.99634L4.28585 4.76631C3.85068 4.56981 3.33612 4.68381 3.01783 5.04907C1.69173 6.57086 0.701572 8.31166 0.0716036 10.2212C-0.0812941 10.6847 0.0774842 11.197 0.464874 11.4872L2.87081 13.2873C3.39566 13.6803 3.70881 14.3103 3.70881 14.9741C3.70881 15.6379 3.39566 16.2679 2.87228 16.6594L0.450907 18.4707C0.0649877 18.7602 -0.0945256 19.2695 0.0561669 19.7337C0.679519 21.6448 1.66527 23.3878 2.98695 24.9156C3.30524 25.2824 3.8198 25.3986 4.25718 25.2006L6.98361 23.9773C7.57756 23.7103 8.26854 23.7486 8.83308 24.0808C9.39616 24.4123 9.77399 25.0034 9.8453 25.6626L10.1731 28.7167C10.2253 29.2027 10.5796 29.5987 11.0486 29.697C12.0145 29.898 13.0069 30 14 30C14.9688 30 15.9465 29.9002 16.9058 29.7037C17.3777 29.607 17.7328 29.211 17.785 28.7227L18.1106 25.6881C18.1819 25.0281 18.5597 24.4371 19.1243 24.1056C19.6874 23.7748 20.3776 23.7358 20.973 24.0021L23.7142 25.2321C24.1508 25.4294 24.6639 25.3154 24.9822 24.9494C26.3083 23.4276 27.2984 21.6868 27.9284 19.7772C28.0813 19.3137 27.9225 18.8014 27.5351 18.5112L25.1285 16.7111ZM14 20.2497C11.1582 20.2497 8.8544 17.8992 8.8544 14.9996C8.8544 12.1 11.1582 9.74945 14 9.74945C16.8418 9.74945 19.1456 12.1 19.1456 14.9996C19.1456 17.8992 16.8418 20.2497 14 20.2497Z' />
							</svg>

							{settingsLinkClicked && (
								<div className='settings-dropdown'>
									<ul>
										<li onClick={() => handleLinkClick('Account')}>
											{t('User:Update_content')}
										</li>
										<li onClick={() => logOut()}>{t('User:Exit')}</li>
									</ul>
								</div>
							)}
						</a>
					</div>
				</nav>

				<div className={`container`} id='sidebar'>
					<div className={`sidebar ${isNavbarOpened ? `closed` : `opened`} `}>
                   
                        <div className="toggle-menu">
                           <span className='toggle-btn' 
                            onClick={toggleMenu}>
                           <IoIosArrowForward  className='btn-text'
                           
                           />
                           </span>
                        </div>
                        
						<div className='account-info'>
							<div
								className='account-img d-flex align-items-center justify-content-center'
								onClick={handleButtonClick}
							>
								<img
									src={`${import.meta.env.VITE_API_URL}img/user/${
										user?.user?.photo || 'default.png'
									}`}
									alt='account'
									width={32}
									style={{ borderRadius: '50px' }}
								/>
							</div>

							<div className='account-name'>
								{user.user?.role === 'User'
									? user.user.name
									: user.user?.companyName === ''
									? "Korxona ma'lumotlari kiritilmagan"
									: user.user?.companyName}
							</div>

							<input
								type='file'
								ref={fileInputRef}
								style={{ display: 'none' }}
								onChange={handleFileChange}
							/>
						</div>
                       
						<div className='balance-wrapper '>
							<div className='balance-info '>
								<span className='balance-title'>{t('User:Balance')}</span>

								<span className='balance-value'>{user.user.money}</span>

								<span className='balance-currency'> uzs</span>
								<div></div>
							</div>

							<button className='btn btn-primary' onClick={handleShow}>
								<p>{t('User:Pay_button')}</p>

								<img src={Wallet_icon} alt='Wallet' />
							</button>
						</div>

						<div className='side-wrapper'>
							<div className='side-title'>MENU</div>
							<div className='side-menu'>
								<a
									className={`sidebar-link pochta ${
										activeLink === 'AI' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('AI')}
									onMouseEnter={() => handleLinkHover('AI')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={AI_icon_light} width={30} height={30} alt='' />
									{t('User:AI:Title')}
								</a>
								<a
									className={`sidebar-link shartnomalar ${
										activeLink === 'Contract' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Contract')}
									onMouseEnter={() => handleLinkHover('Contract')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={Contract_icon_light} alt='' />
									{t('User:Contract:Title')}
								</a>
								<a
									className={`sidebar-link arizalar ${
										activeLink === 'Application' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Application')}
									onMouseEnter={() => handleLinkHover('Application')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={Application_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:Application:Title')}
								</a>
								<a
									className={`sidebar-link murojaatlar ${
										activeLink === 'Appeal' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Appeal')}
									onMouseEnter={() => handleLinkHover('Appeal')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={Appeal_icon_light} width={30} height={30} alt='' />
									{t('User:Appeal:Title')}
								</a>
								<a
									className={`sidebar-link hujjatlar ${
										activeLink === 'Document' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Document')}
									onMouseEnter={() => handleLinkHover('Document')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={Document_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:Document:Title')}
								</a>
								<a
									className={`sidebar-link imzoga ${
										activeLink === 'Signature' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Signature')}
									onMouseEnter={() => handleLinkHover('Signature')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={Signature_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:Signature:Title')}
								</a>
							</div>
						</div>

						<div className='side-wrapper'>
							<div className='side-title'>Tools</div>
							<div className='side-menu'>
								<a
									className={`sidebar-link pochta ${
										activeLink === 'Mail' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Mail')}
									onMouseEnter={() => handleLinkHover('Mail')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={Mail_icon_light} width={30} height={30} alt='' />
									{t('User:Mail:Title')}
								</a>

								<a
									className={`sidebar-link ocr ${
										activeLink === 'Ocr' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Ocr')}
									onMouseEnter={() => handleLinkHover('Ocr')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={OCR_icon_light} width={30} height={30} alt='' />
									{t('User:OCR:Title')}
								</a>

								<a
									className={`sidebar-link locker ${
										activeLink === 'Locker' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Locker')}
									onMouseEnter={() => handleLinkHover('Locker')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={Locker_icon_light} width={30} height={30} alt='' />
									{t('User:Locker:Title')}
								</a>

								<a
									className={`sidebar-link locker ${
										activeLink === 'PdfEditor' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('PdfEditor')}
									onMouseEnter={() => handleLinkHover('PdfEditor')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={PdfEditor_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:PdfEditor:Title')}
								</a>

								<a
									className={`sidebar-link locker ${
										activeLink === 'Tahrirchi' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Tahrirchi')}
									onMouseEnter={() => handleLinkHover('Tahrirchi')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={Tahrirchi_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:Tahrirchi:Title')}
								</a>

								<a
									className={`sidebar-link locker ${
										activeLink === 'Translater' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('Translater')}
									onMouseEnter={() => handleLinkHover('Translater')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img
										src={Translater_icon_light}
										width={30}
										height={30}
										alt=''
									/>
									{t('User:Translater:Title')}
								</a>

								<a
									className={`sidebar-link locker ${
										activeLink === 'OneNote' ? 'is-active' : ''
									}`}
									onClick={() => handleLinkClick('OneNote')}
									onMouseEnter={() => handleLinkHover('OneNote')}
									onMouseLeave={() => handleLinkHover('')}
								>
									<img src={OneNote_icon_light} width={30} height={30} alt='' />
									{t('User:OneNote:Title')}
								</a>
								<a
                                    className={`sidebar-link locker ${activeLink === "Manual" ? "is-active" : ""}`}
                                    // onClick={() => handleLinkClick("Manual")}
                                    // onMouseEnter={() => handleLinkHover("Manual")}
                                    // onMouseLeave={() => handleLinkHover("")}
                                >
                                    <img src={Manual_icon_light } width={30} height={30} alt="" />
                                    {t("User:Manual:Title")}
                                </a>
								
							</div>
						</div>
					</div>

					<div className='wrapper'>
						{activeLink === 'AI' ? (
							<UserAiView />
						) : activeLink === 'Contract' ? (
							<UserContractView />
						) : activeLink === 'ContractAdd' ? (
							<UserContractViewComponent />
						) : activeLink === 'Application' ? (
							<UserApplicationView />
						) : activeLink === 'Appeal' ? (
							<UserAppealView />
						) : activeLink === 'Document' ? (
							<UserDocumentView />
						) : activeLink === 'Signature' ? (
							<UserSignatureView />
						) : activeLink === 'PdfEditor' ? (
							<UserConvertView />
						) : activeLink === 'Sms' ? (
							<UserSmsView />
						) : activeLink === 'Mail' ? (
							<UserMailView />
						) : activeLink === 'Ocr' ? (
							<UserOcrView />
						) : activeLink === 'Locker' ? (
							<UserLockerView />
						) : activeLink === 'Account' ? (
							<UserAccountView />
						) : activeLink === 'Tahrirchi' ? (
							<UserTahrirchiView />
						) : activeLink === 'Translater' ? (
							<UserTranslaterView />
						) : null}
					</div>
				</div>
			</div>

			<Modal
				className='py-4 sigNmodal'
				size='xl'
				show={show}
				onHide={handleClose}
				backdrop='static'
				keyboard={false}
				centered
			>
				<Modal.Header closeButton>
					<div className='closeHeader'>
						<Modal.Title>To'lov</Modal.Title>
						<button className="closeBtn btn " onClick={handleClose}>X</button>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className='PaymentType'>
						<ul>
							<li>
								<a href='https://payme.uz/home/main' target='_blank'>
									<img src={Payme_logo} alt='Payme' width={150} />
								</a>
							</li>
							<li>
								<a href='https://click.uz/ru' target='_blank'>
									<img src={Click_logo} alt='Click' width={150} />
								</a>
							</li>
							<li>
								<span
									onClick={() => handleToggleText('Alif')}
									style={{ cursor: 'pointer' }}
								>
									<img src={Alif_logo} alt='Alif' width={150} />
								</span>
							</li>
							<li>
								<span
									onClick={() => handleToggleText('Bank')}
									style={{ cursor: 'pointer' }}
								>
									<img src={Bank_logo} alt='Bank' width={150} />
								</span>
							</li>
						</ul>
					</div>
					<div
						className={`toggle-text d-block align-items-center justify-content-center ${
							isTextVisibleAlif ? 'visible' : ''
						}`}
					>
						<div>
							<div>
								<div></div>
								<div></div>
								<div></div>
								<div className='d-flex align-items-center justify-content-center'>
									<img src={Alif_QrCode} alt='ALIF APY QR CODE' width={150} />
									<div className='ms-5'>
										<p>Tariff: YaTT</p>
										<p>To'lov miqdori: 149 000 so'm</p>
									</div>
								</div>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</div>
						<p>Faqat Alif Mobi dasturi orqali to'lov qilish imkoni mavjud</p>
					</div>
					<div className={`toggle-text ${isTextVisibleBank ? 'visible' : ''}`}>
						<p>Манзил: Noʻgʻoyqoʻrgʻon MFY, Amir Temur ko'chasi 18-uy </p>
						<p>Телефон: +998 55 900 10 06</p>
						<p>СТИР: 311520114 </p>
						<p>ОКЭД: 58290 </p>
						<p>Х/Р: 20208000007120218001 </p>
						<p>Банк: ОЛМАЛИК Ш., "ИПОТЕКА-БАНК" АТИБ ОЛМАЛИК ФИЛИАЛИ </p>
						<p>МФО: 00459</p>
						<p>
							1.Оплата 100% за подписку сайта
							<br />
							1DOC.UZ
							<br />
							согласно оферты от 19.08.2024
						</p>
					</div>
					<div>
						<Table striped>
							<thead>
								<tr>
									<th>#</th>
									<th>Turi</th>
									<th>Summasi</th>
									<th>Vaqti</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>Payme</td>
									<td>1 000 000</td>
									<td>19.08.2024</td>
								</tr>
								<tr>
									<td>2</td>
									<td>Click</td>
									<td>500 000</td>
									<td>19.07.2024</td>
								</tr>
								<tr>
									<td>3</td>
									<td>Bank</td>
									<td>750 000</td>
									<td>19.06.2024</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</Modal.Body>
			</Modal>
			<ToastContainer />
		</>
	)
})

export default UserDashboard
