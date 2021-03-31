import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import {compress} from "/core/utils.js";
import button from "/component/dibutton.js";


const limit = 500;
let offset =0;



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
	padding: 0;
	margin: 0;
	width: 100%;
	background-color: ${color.gray200};
`)



b.css(".header",`
	display: flex;
	justify-content: space-between;
	padding: 0.625rem;
	margin: 0;
`)

b.css(".headerLeft",`
	display: flex;
	justify-content: flex-start;
	align-items: center;		
	width: 33%;
	font-size: 0.875rem;
`)

b.css(".headerCenter",`
	display: flex;
	justify-content: center;
	align-items: center;		
	width: 33%;
	font-size: 0.875rem;
`)

b.css(".headerRight",`
	display: flex;
	justify-content: flex-end;
	align-items: center; 
	width: 33%;
	font-size: 0.875rem;
`)



b.css(".footer",`
	display: flex;
	justify-content: space-between;
	padding: 0.625rem;
	margin: 0;
`)

b.css(".footerLeft",`
	display: flex;
	justify-content: flex-start;
	align-items: center;		
	width: 40%;
	font-size: 0.875rem;
`)

b.css(".footerCenter",`
	justify-content: center;
	display: flex;
	align-items: center;		
	width: 40%;
	font-size: 0.875rem;

`)

b.css(".footerRight",`
	display: flex;
	justify-content: flex-end;
	align-items: center;		
	width: 40%;
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

b.css(".contentLabel",`
	position: absolute;
	padding: 0.2rem 0 0 0.2rem;
`)

b.css(".textArea",`
	width: 100%;
	resize: none;
	padding: 0.625rem;
	padding-top: 1.25rem;
	outline: none;
	border: 1px solid #F8F8F8;
	background: #FFFFFF;
	color: black;
	font-size: 1.25rem;
	text-align: center;
`)
b.css(".textArea:focus",`border: 1px solid #00FF93;`)

b.css(".textDiv",`
	width: 100%;
	resize: none;
	padding: 0.625rem;
	padding-top: 1.25rem;
	outline: none;
	border: 1px solid #F8F8F8;
	background: #FFFFFF;
	color: black;
	font-size: 1.25rem;
	text-align: center;
`)

/*
b.css("",`

*/


function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}


export const flashcard = ({query, store, info}) => {

	// default values
	query = query.map(q => Object.assign({
		label: q.label || 'My'
	}, q))
	let label = query().label;
/*
	const cards = m.stream.merge([store, query]).map(([s,q])=> {
	  let c = s?.cards ?? q?.cards ?? ''
		return c
	})
*/
	let overLearning = 2;  // n mal richtig beantworten
	let fails = 0;
	let successes = 0;
	let mode = 'hidden';  // 3 Modi: "edit",  "hidden" (play), "show" (play)
	let type = 'q';       // 2 Typen: q (question), a (answer)
	let i = 0;
	let cards = store()?.cards || query()?.cards || [{"q":"Your First Question","a":"Your First Answer"}];
	console.log(cards)

//	const enabledReset = () => store()?.text != query()?.text;
	const onClickedChangeMode = () => { 
		console.log("changeMode")
		if (mode==='edit'){
			mode='hidden';
		} else {
			mode='edit';
		}	
	 }

	const onClickedStandalone = () => {
		window.open('https://gem.omlu.ch/app#0='+compress({
			a: 'diflashcard', q: JSON.stringify(query()), s: store()
		}, "_"))
	}

	const onClickedFullScreen = () => {}
	
	const onClickedPrevious = () => {
		i--;
		if (i<0) {i= cards.length-1};
	}

	const onClickedNext = () => {
		i++;
		if (i>=cards.length) {i= 0};
	}

	const onClickedShowMe = () => {
		mode='show';
	}

	const onClickedFail = () => {
		fails++;
		let tries = cards.length*cards.length*10;
		do {
			i = getRandomInt(cards.length);
			tries--;
		} while (cards[i].n<=overLearning && tries>0)
		mode='hidden';
	}

	const onClickedSuccess = () => {
		successes++;
		if (cards[i].n) {cards[i].n++} else {cards[i].n = 1};
		let tries = cards.length*cards.length*10;
		do {
			i = getRandomInt(cards.length);
			tries--;
			console.log(cards[i].n)
		} while (cards[i].n>=overLearning && tries>0)
		if (tries==0) label = "YEEESSS .. YOU DID IT"
		mode='hidden';
	}
	
	
	const onClickedDelete = () => {
		cards.splice(i, 1); 
		i--;
		if (i<0) {i= cards.length-1}
	}

	const onClickedAdd = () => {
		cards.push({"q":"Type your Question", "a":"Type your Answer"}); 
		i=cards.length-1;
	}



	// ============================================
	//
	// Textfield 
	//
	const textfield = (mode, type, content) => 
		m('div.contentBox',
		m('div.contentLabel', (type === 'q') ? 'Front': 'Back'),            
		m(((mode === 'edit') ? 'textarea.textArea' : 'div.textDiv'), 
			(mode === 'show') ? { innerText: (type === 'q') ? content.q : content.a,} :
			(mode === 'hidden') ? { innerText: "  ??? " }:
			{
				value: (type === 'q') ? content.q : content.a,
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
				oninput: (({target: t}) =>  {
					if (type === 'q'){
    					content.q = t.value.substr(0, limit);
					} else {
						content.a = t.value.substr(0, limit);
					}				
				})
			} 
		)
	);
	


	const nOfAll = ()=> m('span'+b`
		padding: 0.625rem;
		font-size: 0.875rem;`, ((i+1) + '/'+ cards.length) 
	);
	
	const spacer = () => m('span'+b`width:4px;`)


	//==================================================
	//  play Mode View 
    //==================================================                                          
	const playView = () => m('div.box', 
		m('div.header',
			m('div.headerLeft', 
				m(button, {id: 'play' , text: 'Edit Deck', func: onClickedChangeMode})
			),
			m('div.headerCenter', label + ' Deck'),
			m('div.headerRight',  
				nOfAll(), 
				m(button, {id: 'fullscreen' , func: onClickedFullScreen}),
				spacer(),
				m(button, {id: 'standalone' , func: onClickedStandalone})
			)
		),
		
		textfield('show', 'q', cards[i]),
		textfield(mode, 'a', cards[i]),

		m('div.footer',
			m('div.footerLeft'),
			m('div.footerCenter'),
			m('div.footerRight', 	
				(mode==='hidden') ? m(button,{id: 'forward', text: 'Show me', func: onClickedShowMe}) : '',
				(mode==='show') ? m(button,{id: 'success', text: 'Yes, I got it right', func: onClickedSuccess}):'', 
				(mode==='show') ? spacer():'', 
				(mode==='show') ? m(button,{id: 'fail', text: 'No, next', func: onClickedFail}):'' 
			)
		)
	)
		
	//==================================================
	//  Edit Mode View 
    //==================================================  
	const editView = () => m('div.box', 
		m('div.header',
			m('div.headerLeft', m(button,{id: 'play', text: 'Play Deck', func: onClickedChangeMode})),
			m('div.headerCenter', query().label + ' Deck'),
			m('div.headerRight', 
				nOfAll(), 
				m(button,{id:'fullscreen' , func: onClickedFullScreen}), 
				spacer(),
				m(button,{id:'standalone' ,func: onClickedStandalone})
			)
		),
		
		textfield(mode, 'q', cards[i]),
		textfield(mode, 'a', cards[i]),
		
		m('div.footer',
			m('div.footerLeft',
				m(button,{id:'delete', text: 'Delete Card', func: onClickedDelete}),
				spacer(),
				m(button,{id:'add', text: 'Add Card', func: onClickedAdd}) 
			),
			m('div.footerCenter'),
			m('div.footerRight', 
				m(button,{id:'back' , func: onClickedPrevious}),
				spacer(),
				m(button,{id:'forward', func: onClickedNext})
			)
		)
	)
		
	return { 
		view: () => (mode==='hidden' || mode==='show') ? playView() : editView()
	}
}

flashcard.meta = {
	share: false,
	adjust: true,
}
flashcard.icon = "📄";
flashcard.presets = true;
flashcard.persistent = true;
flashcard.options = [
	{a: 'label', t: 'string', r: false, d: "", c: 'Card Deck Name' },
	{a: 'theme', t: 'string', r: true, d: "di", c: 'di, exorciser' },
	{a: 'cards', t: 'array', r: false, d: [], c: 'Array of Card-Objects with (q)uestions and (a)nswers example [{"q": "1st question","a":"1st answer"},{"q": "2nd question","a":"2nd answer"}]'},
]

export default flashcard;
