import m from "/vendor/mithril.js";
import b from "/vendor/bss.js"
import {compress} from "/core/utils.js";
import button from "/component/dibutton.js";


// 
const color = {
	gray100 : '#FBFBFB',
	gray200 : '#F8F8F8',
	gray300 : '#D9D9D9',
	gray400 : '#B6B6B6',
	gray800 : '#333333',
	gray900 : '#111111',
	pink 	: '#D742FB',
	rosa 	: '#FF87FF',
	lavendel: '#B196FF',
	violett : '#7C4DFF',
	blue 	: '#84CEFF',
	lightBlue:'#B2FFFF',
	green 	: '#00FF93',
	neoGreen: '#94FF57',
}



b.css('.box',`
	border-left: 7px solid ${color.green};
	border-right: 1px solid ${color.gray400};
	padding: 0;
	margin: 0;
	width: 100%;
	background-color: ${color.gray200};
`)


b.css(".header",`
	display: flex;
	justify-content: space-between;
	padding: 0 1.25rem 0 1.25rem;
	margin: 0;
	border-color: #B6B6B6;
	border-style: solid;
	border-width: 1px 0 1px 0;
`)

b.css(".headerLeft",`
	align-items: center;		
	display: flex;
	width: 33%;
	font-size: 0.875rem;
	justify-content: flex-start;
`)

b.css(".headerCenter",`
	align-items: center;		
	display: flex;
	width: 33%;
	font-size: 0.875rem;
	justify-content: center;
`)

b.css(".headerRight",`
	align-items: center;
	display: flex;
	width: 33%;
	font-size: 0.875rem;
	justify-content: flex-end; 
`)

b.css(".xOfMax",`
	padding: 0.625rem;
	font-size: 0.875rem;
`)

b.css(".contentBox",`
	overflow: visible;
	padding: 0.625rem;
	display: table outside;
	font-size: 0.875rem;
	color: ${color.gray400};
	background: transparent;
`)

b.css(".textArea",`
	resize: none;
	padding: 0.625rem;
	outline: none;
	border: 1px solid ${color.gray300};
	background: white;
	width: 100%;
	color: black;
	font-size: 1.25rem;
	text-align: left;
`)
b.css('.textArea:focus',`border: 1px solid ${color.green};`) 

b.css(".footer",`
	item-align: left;
	padding: 0rem 0rem 0.625rem 0.625rem;
	margin: 0;
	border-bottom: 1px solid ${color.gray400};
`)

const limit = 5000;
const label = "Plain Text";


export const diplain = ({query, store, info}) => {
	
	const value = m.stream.merge([store, query]).map(([s,q])=> {
	  let text = s?.text ?? q?.text ?? ''
		return text.substr(0, q?.limit ?? limit)
	})

//	const enabledReset = () => store()?.text != query()?.text;

	const reset = () => { store(undefined); info(undefined) }

	const standalone = () => {
		window.open('https://gem.omlu.ch/app#0='+compress({
			a: 'diplain', q: JSON.stringify(query()), s: store()
		}, "_"))
	}

	const maximize = () => {
		//not implemented yet
	  }



	const xOfMax = ()=> m('span.xOfMax', (value() && (value().length+'/'+ (query()?.limit ?? limit))) || '0/'+limit);
	
	const spacer = () => m('span', {style : 'width:4px;'})

	return { 
		view: () => 
		m('div.box',  
			m('div.header',
				m('div.headerLeft', query()?.label ?? label),
				m('div.headerCenter'),
				m('div.headerRight',
					xOfMax(), 
				//	m(button, {id: 'maximize', onclick: maximize}),
					spacer(),
					m(button, {id: 'standalone', onclick: standalone})
				)
			),
			m('div.contentBox',
				m('textarea.textArea',
					{
						value: value(),
						oncreate: ({dom}) => {
							var offset = dom.offsetHeight - dom.clientHeight + 3;
							dom.style['box-sizing'] = 'border-box';
							dom.style.height = 'auto';
							dom.style.height = dom.scrollHeight + offset + 'px';
							dom.addEventListener('input', ({target}) => {
							target.style.height = 'auto';
							target.style.height = target.scrollHeight + offset + 'px';
							});
						},
						oninput: ({target: t}) =>  {
							store({text: t.value.substr(0, query()?.limit || limit)});
						}
					}
				)
			),
			m('div.footer', 
				m(button, {id: 'reset', text: "Reset", onclick: reset})
		)
		)
	}
}
diplain.meta = {
	share: false,
	adjust: true,
}
diplain.icon = "📄";
diplain.presets = true;
diplain.persistent = true;
diplain.options = [
	{a: 'label', t: 'string', r: false, d: label, c: 'Label' },
	{a: 'text', t: 'string', r: false, d: "", c: 'Text Preset' },
	{a: 'limit', t: 'number', r: false, d: limit, c: 'Number of chars allowed' },
]

export default diplain;
