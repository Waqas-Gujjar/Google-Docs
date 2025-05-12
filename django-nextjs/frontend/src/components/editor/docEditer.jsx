"use client"

/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NodgNARATAdArDADBSBmALADnegnJgRkVxFLigKhDjgDZdUQHaQopNFM497aDcoKCAFMAdikRhgBMDLlhJBALqQ4w4RVwAzCEqA=
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
	ClassicEditor,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockToolbar,
	Bold,
	Code,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Italic,
	Link,
	Paragraph,
	PlainTableOutput,
	Table,
	TableToolbar,
	Underline
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './docEditor.css';


const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDgzMDM5OTksImp0aSI6IjQ5ZWZlNWRjLWVlODctNGMwMC1iZjdkLTZhZTJjNjQyOTZmYyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6Ijg0NzA5NGU0In0.w8HD2iHZRCEZw1CC8sfLUz9vO-skH1hzNdkcbHYGt7chPunGJqq-bQ93muC4iAC5DL0XQRA56y8uHnvw-1CuTw';

export default function DocEditor({ref , initialData , placeholder}) {
	
	const [isLayoutReady, setIsLayoutReady] = useState(false);

	useEffect(() => {
		setIsLayoutReady(true);

		return () => setIsLayoutReady(false);
	}, []);

	const { editorConfig } = useMemo(() => {
		if (!isLayoutReady) {
			return {};
		}

		return {
			editorConfig: {
				toolbar: {
					items: [
						'fontSize',
						'fontFamily',
						'fontColor',
						'fontBackgroundColor',
						'|',
						'bold',
						'italic',
						'underline',
						'code',
						'|',
						'link',
						'insertTable'
					],
					shouldNotGroupWhenFull: false
				},
				plugins: [
					AutoLink,
					Autosave,
					BalloonToolbar,
					BlockToolbar,
					Bold,
					Code,
					Essentials,
					FontBackgroundColor,
					FontColor,
					FontFamily,
					FontSize,
					Italic,
					Link,
					Paragraph,
					PlainTableOutput,
					Table,
					TableToolbar,
					Underline
				],
				balloonToolbar: ['bold', 'italic', '|', 'link'],
				blockToolbar: ['fontSize', 'fontColor', 'fontBackgroundColor', '|', 'bold', 'italic', '|', 'link', 'insertTable'],
				fontFamily: {
					supportAllValues: true
				},
				fontSize: {
					options: [10, 12, 14, 'default', 18, 20, 22],
					supportAllValues: true
				},
				initialData: initialData ? initialData : '',
					
				licenseKey: LICENSE_KEY,
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
				placeholder: placeholder ? placeholder : 'Type or paste your content here!',
				table: {
					contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
				}
			}
		};
	}, [isLayoutReady]);

	return editorConfig && <CKEditor editor={ClassicEditor} config={editorConfig} ref={ref && ref} />
}
