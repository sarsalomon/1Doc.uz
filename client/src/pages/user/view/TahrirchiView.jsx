import { observer } from 'mobx-react-lite'
import React, { useContext, useState } from 'react'
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { FaRegCopy } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import { checkTahrirchi } from '../../../function/http/TahrirchiAPI'
import { Context } from '../../../main'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const datasVeta = [
	{
		token: 'example1',
		corrections: ['example1.1', 'example1.2', 'example1.3'],
	},
	{
		token: 'example2',
		corrections: ['example2.1', 'example2.2'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
	{
		token: 'example3',
		corrections: ['example3.1', 'example3.2', 'example3.3', 'example3.4'],
	},
]

const UserTahrirchiView = observer(() => {
	const { user } = useContext(Context)
	const { t } = useTranslation()

	const [text, setText] = useState('')
	const [datas, setDatas] = useState([])
	const [progress, setProgress] = useState(false)

	// Text instruments

	const modules = {
		toolbar: [
			['bold', 'italic', 'underline'],
			[{ header: '1' }, { header: '2' }],
			[{ list: 'ordered' }, { list: 'bullet' }],
			['clean'],
		],
	}

	const formats = [
		'header',
		'bold',
		'italic',
		'underline',
		'strike',
		'blockquote',
		'list',
		'bullet',
		'indent',
		'link',
		'image',
	]

	// Text instruments

	const handleCheck = async () => {
		try {
			if (text === '') {
				toast.error(t('Please enter text to translate'), {
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				})
				return
			}

			setProgress(true)

			const formData = new FormData()
			formData.append('text', text)

			const data = await checkTahrirchi(formData)
			if (data['action'] === 'SUGGESTIONS') {
				setDatas(data['data'])
				console.log(data['data'])
			}
		} catch (e) {
			toast.error(t('An error occurred during translation'), {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
			console.error('Error:', e)
		} finally {
			setProgress(false)
		}
	}

	const handleCopy = () => {
		if (text) {
			navigator.clipboard.writeText(text)
			toast.success(t('Text copied to clipboard'), {
				position: 'bottom-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			})
		}
	}

	const changeWord = (word, replaces) => {
		const regex = new RegExp(word, 'g')
		const escapedWord = text.replace(regex, replaces)
		const updatedDatas = datas.filter(item => item.token !== word)
		setDatas(updatedDatas)
		setText(escapedWord)
	}

	return (
		<>
			<Helmet>
				<title>{t('User:Tahrirchi:Title')}</title>
			</Helmet>
			<Container className='textEditor-container'>
				<Row className='textEditor-row'>
					<Col className='textEditor-col'>
						<Form>
							<Form.Group>
								<div className='edit-buttons'>
									<Button
										className='editBtn'
										onClick={handleCheck}
										disabled={progress}
									>
										{progress
											? t('User:Tahrirchi:Progress')
											: t('User:Tahrirchi:Translate')}
									</Button>
									<Button
										className='copyBtn'
										onClick={handleCopy}
										style={{ display: text === '' ? 'none' : 'block' }}
									>
										<FaRegCopy />
									</Button>
								</div>
								<ReactQuill
									theme='snow'
									modules={modules}
									formats={formats}
									value={text}
									onChange={setText}
									placeholder={t('User:Tahrirchi:Add_Text')}
								/>
							</Form.Group>
						</Form>
					</Col>
					<Col
						className='textEditor-col'
						style={{ overflowY: 'auto', maxHeight: '80vh', boxShadow:'none'}}
					>
						{datasVeta.length > 0 && (
							<Accordion className='custom-accordion'>
								{datasVeta.map((data, index) => (
									<Accordion.Item
										className='custom-accordion-item'
										eventKey={index}
										key={index}
									>
										<Accordion.Header className='custom-accordion-header'>
											{data.token}
										</Accordion.Header>
										<Accordion.Body className='custom-accordion-body'>
											{data.corrections.map((correction, i) => (
												<Button
													className='me-3 mt-2 custom-button'
													onClick={() =>
														changeWord(datas[index].token, correction)
													}
													key={i}
												>
													{correction}
												</Button>
											))}
											<p className='mt-2 custom-text'>
												{t('There is a spelling error in this word.')}
											</p>
										</Accordion.Body>
									</Accordion.Item>
								))}
							</Accordion>
						)}
						{/* {datas.length > 0 && (
                            <Accordion>
                                {datas.map((data, index) => (
                                    <Accordion.Item eventKey={index} key={index}>
                                        <Accordion.Header>{data.token}</Accordion.Header>
                                        <Accordion.Body>
                                            {data.corrections.map((correction, i) => (
                                                <Button className="me-3 mt-2" onClick={() => changeWord(datas[index].token, correction)} key={i}>
                                                    {correction}
                                                </Button>
                                            ))}
                                            <p className="mt-2">{t("There is a spelling error in this word.")}</p>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        )} */}
					</Col>
				</Row>
				{/* <Row >
                    <Col className="d-flex justify-content-center align-items-center">
                        
                        
                    </Col>
                </Row> */}
			</Container>
			<ToastContainer />
		</>
	)
})

export default UserTahrirchiView
