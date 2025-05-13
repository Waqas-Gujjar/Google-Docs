'use client'


/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/#installation/NodgNARATAdArDADBSA2VAWVBGAzATnxAA58oN84Qo5tjdVFFcQREMQrrjlIBTAHYpEYYNjDjJYEdgC6kDgBMAxj2URZQA==
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	BlockToolbar,
	Bold,
	Code,
	Essentials,
	GeneralHtmlSupport,
	Italic,
	Link,
	Paragraph,
	Underline
} from 'ckeditor5';

import { AIAssistant, AITextAdapter } from 'ckeditor5-premium-features';

import 'ckeditor5/ckeditor5.css';

import './docEditor.css';
import useSWR from 'swr';
import fetcher from '@/lib/fetcher';

class CustomerAITextAdapter  extends AITextAdapter{
    async sendRequest ( requestData ) {
		const {query, context} = requestData
		const endpoint = '/api/ai/'
		const options = {
			method: "POST",
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify({
				query: query,
				context: context
			})
		}
		const apiR = await fetch(endpoint, options)
		if (!apiR.ok) {
			throw AIRequestError("The request failed for unknown reason")
		}
		const data = await apiR.json()
		requestData.onData(data.message)
	}
}



export default function DocEditor({ref , initialData , placeholder , onSave}) {
	const [isLayoutReady, setIsLayoutReady] = useState(false);
    const {data,isLoading} = useSWR('/api/ckeditor',fetcher)
    const license = data?.license ? data?.license : 'GPL'
    console.log(data,license)

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}
        if (isLoading){
            return {}
        }

		return {
			editorConfig: {
				toolbar: {
					items: ['aiCommands', 'aiAssistant', '|','bold', 'italic', 'underline', 'code', '|', 'link', 'blockQuote'],
					shouldNotGroupWhenFull: false
				},
				plugins: [
                    AIAssistant,
					AutoLink,
					Autosave,
					BalloonToolbar,
					BlockQuote,
					BlockToolbar,
					Bold,
					Code,
					Essentials,
					GeneralHtmlSupport,
					Italic,
					Link,
					Paragraph,
                    CustomerAITextAdapter,
					Underline
				],
                autosave: onSave ? {
                    waitingTime: 500,
                   save: onSave,
                } : null,
				balloonToolbar: ['aiAssistant', '|','bold', 'italic', '|', 'link'],
				blockToolbar: ['aiCommands', 'aiAssistant', '|','bold', 'italic', '|', 'link'],
				htmlSupport: {
					allow: [
						{
							name: /^.*$/,
							styles: true,
							attributes: true,
							classes: true
						}
					]
				},
				initialData: initialData ? initialData : '',
				licenseKey: license,
				link: {
					addTargetToExternalLinks: true,
					defaultProtocol: 'https://',
					decorators: {
						toggleDownloadable: {
							mode: 'manual',
							label: 'Downloadable',
							attributes: {
								download: 'file'
							}
						}
					}
				},
				placeholder: placeholder ? placeholder : 'Type or paste your content here!'
			}
		};
	}, [isLayoutReady,isLoading]);

	  return <div className='prose'>
         { editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} ref={ref && ref} />}
      </div>
}
