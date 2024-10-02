import { useState, useEffect } from 'react'
import { Accordion, FormControl, InputGroup } from  'react-bootstrap'
import { observer } from "mobx-react-lite";
import { SlArrowRight } from 'react-icons/sl';
import { FcIdea } from "react-icons/fc";
import { aiJson } from './../../../assets/locales/translate/aiFaqsJson/uzAiJson.js'
import openAi from './../../../assets/img/aiLanding/Open-AI-Logo-3D-Icon-PNG.png';

import lamp from './../../../assets/img/aiLanding/3d-render-lamp-with-lightning-inside-think-icon.jpg'

import './../../../assets/css/_sidebar.scss';

const UserAiView = observer(() => {

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


    return (
			<div className='user-aiLanding '>

			{aiJson.map((aiDate, index) => (
				<div key={index} className='aiLanding-card'>
					<div className='header-content'>
						<p className='mb-1'>
							<b>{aiDate.title}</b>
						</p>

						<p>
							<b className='b'>{aiDate.text}</b>
						</p>
						
						<b className='memberText'>{aiDate.memberText}</b>
					</div>

					<Accordion
						key={index}
						onChange={() => handleChange(index)}
						alwaysOpen
					>
							<Accordion.Header eventKey={index}>
								{/* <img src={lamp} alt='icon' /> */}
																				<FcIdea className='icon-lamp'/>
								<span className='accordion-text'>
									{aiDate.question}
								</span>
								<SlArrowRight className='slArrowRight' />
							</Accordion.Header>

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
						// variant='outline-secondary'
						id='button-addon2'
					>
						<img src={openAi} alt='' />
					</button>
				</InputGroup>
			</div>
</div>
    );
});

export default UserAiView;
