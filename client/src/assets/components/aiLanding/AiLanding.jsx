import { useState, useEffect } from 'react'
import { Accordion, FormControl, InputGroup } from 'react-bootstrap'
import './style.css'

import lamp from './../../img/aiLanding/3d-render-lamp-with-lightning-inside-think-icon.jpg';
import openAi from './../../img/aiLanding/Open-AI-Logo-3D-Icon-PNG.png';

import { aiJson } from './../../locales/translate/aiFaqsJson/uzAiJson.js'

function AiLanding() {
	const [aiIndex, setAiIndex] = useState(false);
	const [inputText, setInputText] = useState('');
	
	useEffect(() => {
		if(aiJson.length > 0) {
			setInputText(aiJson[0].inputText || 'Matnni shu yerga kiriting')
			
		}
	}, [])

	const handleChange = index => {
		setAiIndex(aiIndex === index ? false : index)
	}

	return (
		<div className='aiLanding'>
			<div className='container'>
				{aiJson.map((aiDate, index) => (
					<div key={index} className='aiLanding-card'>
						<div className='header-content'>
							<p className='mb-1'>
								<b>{aiDate.title}</b>
							</p>
							<p>
								<b className='b'>{aiDate.text}</b>
							</p>
							<b>{aiDate.memberText}</b>
						</div>

						<Accordion
							key={index}
							onChange={() => handleChange(index)}
							alwaysOpen
						>
							<Accordion.Item eventKey={index}>
								<Accordion.Header>
									<img src={lamp} alt='icon' />
									<span className=' px-2'>{aiDate.question}</span>
								</Accordion.Header>
								<Accordion.Body>{aiDate.answer}</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</div>
				))}
				<div className='input-container'>
					<InputGroup className='aiLanding-input'>
						<FormControl
							placeholder={inputText}
							aria-label='Input text'
						/>
						<button
							className='btn btn-secondary'
							variant='outline-secondary'
							id='button-addon2'
						>
							<img src={openAi} alt='' />
						</button>
					</InputGroup>
				</div>
			</div>
		</div>
	)
}

export default AiLanding
