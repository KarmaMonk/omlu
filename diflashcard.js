import m from "/vendor/mithril.js";
import b from "/vendor/bss.js";
import {compress} from "/core/utils.js";
import button from "/component/dibutton.js";


const limit = 500;
let offset =0;

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
	border-left: 8px solid ${color.green};
	border-right: 1px solid ${color.gray400};
	padding: 0;
	margin: 0;
	width: 99%;
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
	display: flex;
	justify-content: flex-start;
	align-items: center;		
	width: 33%;
	font-size: 1rem;
`)

b.css(".headerCenter",`
	display: flex;
	justify-content: center;
	align-items: center;		
	width: 33%;
	font-size: 1rem;
`)

b.css(".headerRight",`
	display: flex;
	justify-content: flex-end;
	align-items: center; 
	width: 33%;
	font-size: 1rem;
`)



b.css(".footer",`
	display: flex;
	justify-content: space-between;
	padding: 0.625rem 1.25rem 0.625rem 1.25rem;
	margin: 0;
	border-bottom: 1px solid ${color.gray400};
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
	width: 20%;
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
	padding: 1.25rem 1.25rem 0.625rem 1.25rem;
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
	width: 99.5%;
	resize: none;
	padding: 0.625rem;
	padding-top: 1.25rem;
	outline: none;
	border: 1px solid ${color.gray300};
	background: #FFFFFF;
	color: black;
	font-size: 1.25rem;
	text-align: center;
`)
b.css(".textArea:focus",`border: 1px solid #00FF93;`)

b.css(".textDiv",`
	width: 98%;
	height: 8rem;
	resize: none;
	padding: 0.625rem;
	padding-top: 1.25rem;
	outline: none;
	border: 1px solid ${color.gray300};
	background: #FFFFFF;
	color: black;
	font-size: 1.25rem;
	text-align: center;
`)

b.css(".turnAnim",`
	transition: all 1s ease-in;
	transform: rotateY(90deg);
`)

b.css(".turnAnim2",
	b.$animate('1s ease-out', {
		from: b.transform('rotateY(-90deg)').style,
		to: b.transform('rotateY(0deg)').style
  })
)

function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}


export const flashcard = ({query, store, info}) => {
	let turnAnim = false;
	let turnAnim2 = false;

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
	let mode = 'playQuestion';  // 3 Modi: "edit",  "playQuestion", "playAnswer"
	let type = 'q';       // 2 Typen: q (question), a (answer)
	let i = 0;
	let cards = store()?.cards || query()?.cards || [{"q":"Your First Question","a":"Your First Answer"}];
	console.log(cards)

//	const enabledReset = () => store()?.text != query()?.text;
	const changeMode = () => { 
		if (mode==='edit'){
			mode='playQuestion';
		} else {
			mode='edit';
		}	
	 }

	const maximize = () => {
		// FIXME
	}

	const standalone = () => {
		window.open('https://gem.omlu.ch/app#0='+compress({
			a: 'diflashcard', q: JSON.stringify(query()), s: store()
		}, "_"))
	}

	
	const nextCard = () => {
		i++;
		if (i>=cards.length) {i= 0};
	}

	const previousCard = () => {
		i--;
		if (i<0) {i= cards.length-1};
	}

	const turnCard = () => {
		turnAnim = true; 
	}

	const turnCardEnd = () => {
		console.log("turnCardEnd")

		if (turnAnim) { 
			turnAnim = false; 
			turnAnim2 = true;
		} else {
			console.log("Anim2")
			turnAnim2 = false;
		}

		mode='playAnswer';
	}


	const successed = () => {
		successes++;
		if (cards[i].n) {cards[i].n++} else {cards[i].n = 1};
		let tries = cards.length*cards.length*10;
		do {
			i = getRandomInt(cards.length);
			tries--;
			console.log(cards[i].n)
		} while (cards[i].n>=overLearning && tries>0)
		if (tries==0) label = "YEEESSS .. YOU DID IT"
		mode='playQuestion';
	}
	
	const failed = () => {
		fails++;
		let tries = cards.length*cards.length*10;
		do {
			i = getRandomInt(cards.length);
			tries--;
		} while (cards[i].n<=overLearning && tries>0)
		mode='playQuestion';
	}

	const addCard = () => {
		cards.push({"q":"Type your Question", "a":"Type your Answer"}); 
		i=cards.length-1;
	}
	
	const deleteCard = () => {
		cards.splice(i, 1); 
		i--;
		if (i<0) {i= cards.length-1}
	}

	// ============================================
	//
	// Textfield 
	//
	const textfield = (mode, type, content) => 
		m('div.contentBox',
		m('div.contentLabel', (type === 'q') ? 'Front': 'Back'),            
		m(((mode === 'edit') ? 'textarea.textArea' : 'div.textDiv') 
			+ (turnAnim ? ".turnAnim" : "")
			+ (turnAnim2 ? ".turnAnim2": ""), 
			(mode === 'playAnswer') 
			? { 
				innerText: (type === 'q') ? content.q : content.a,
				ontransitionend: turnCardEnd,
				onanimationend: turnCardEnd
			} 
			: {
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
	


	const nOfAll = ()=> m('span', ((i+1) + '/'+ cards.length));
	
	const spacer = () => m('span'+b`width:4px;`)


	//==================================================
	//  play Mode View 
    //==================================================                                          
	const playView = () => m('div.box', 
		m('div.header',
			m('div.headerLeft', query().label + ' Deck'),
			m('div.headerCenter', nOfAll()),
			m('div.headerRight',  
				m(button, {id: 'maximize' , onclick: maximize}),
				spacer(),
				m(button, {id: 'standalone' , onclick: standalone})
			)
		),
		
		(mode==='playQuestion') ? textfield('playAnswer', 'q', cards[i]) : textfield('playAnswer', 'a', cards[i]),

		m('div.footer',
			m('div.footerLeft', m(button, {id: 'play' , text: 'Edit Deck', onclick: changeMode}) ),
			m('div.footerCenter'),
			m('div.footerRight', 	
				(mode==='playQuestion') ? m(button,{id: 'turn', text: 'Turn', onclick: turnCard}) : '',
				(mode==='playAnswer') ? m(button,{id: 'fail', text: 'Wrong', onclick: failed}):'', 
				(mode==='playAnswer') ? spacer():'', 
				(mode==='playAnswer') ? m(button,{id: 'success', text: 'Correct', onclick: successed}):''
			)
		)
	)
		
	//==================================================
	//  Edit Mode View 
    //==================================================  
	const editView = () => m('div.box', 
		m('div.header',
			m('div.headerLeft', query().label + ' Deck'),
			m('div.headerCenter', nOfAll()),
			m('div.headerRight', 
				m(button,{id:'maximize' , onclick: maximize}), 
				spacer(),
				m(button,{id:'standalone' ,onclick: standalone})
			)
		),
		
		textfield(mode, 'q', cards[i]),
		textfield(mode, 'a', cards[i]),
		
		m('div.footer',
			m('div.footerLeft',
				m(button,{id: 'play', text: 'Play Deck', onclick: changeMode}),
				spacer(),
				m(button,{id:'delete', text: 'Delete Card', onclick: deleteCard}),
				spacer(),
				m(button,{id:'add', text: 'Add Card', onclick: addCard}) 
			),
			m('div.footerCenter'),
			m('div.footerRight', 
				m(button,{id:'back' , onclick: previousCard}),
				spacer(),
				m(button,{id:'forward', onclick: nextCard})
			)
		)
	)
		
	return { 
		view: () => (mode==='playQuestion' || mode==='playAnswer') ? playView() : editView()
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
