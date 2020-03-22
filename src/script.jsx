import ReactDOM from 'react-dom';
import 'core-js/features/promise';
import fetch from "unfetch"
import Swal, { ReactSwal } from './swal';
import regeneratorRuntime from "regenerator-runtime";


const animalInfo = {
    eagle: "While it's not the largest raptor, the harpy eagle is one of the most powerful. Females are much larger and stronger than males; in fact, they can carry a full-size monkey.",
    bat: 'The vampire bats in the Amazon are the only legitimate vampire bats in the world. They feed on blood. It\'s designed to make as little noise as possible, which allows it to land near/on its prey undetected. It feeds on many different kinds of mammals, including humans.',
    sloth: 'The three-toed sloth is one of the least active animals on planet earth. Almost 80% of its life is spent resting. When it does decide to move, it does so at the lightning-fast speed of a tenth of a mile per hour. With such little movement, it only has half the number of muscles that other animals have.',
    macaw: 'One of the most beautiful parrots in the Amazon is the macaw. The largest macaws have a red-and-green coloration, but there are many different types.',
    monkey: 'The howler monkey is one of the few animals that can compete with the sloth in terms of rest. Its diet consists of mainly leaves, meaning that the monkey spends much of its time digesting them. It\'s name comes from the distinguishing howl that it makes with special bones in its mouth. The howl can be heard for miles.',
    anaconda: 'The anaconda is one of the longest and heaviest snakes in the world. It catches its prey by wrapping itself tightly around the animal. Following that, the animal is swallowed head first and slowly digested.',
    tapir: 'The tapir is the Amazon\'s largest land herbivore. It can be recognized by its unusual proboscis. It uses its proboscis to sweep plants into its mouth, which are then digested by microorganisms in the tapir\'s stomach.',
    jaguar: 'The jaguar is a stealthy cat which can measure between three and six feet in length. Some jaguars weigh up to 350 pounds. It commonly feeds on large mammals. They prefer hunting at night, though they are also known to venture out in the day if necessary.',
    tucuxi: 'The tucuxi is one of the two species of river dolphins which are found in the Amazon river. It is the only member of the dolphin family that lives in freshwater. They are extremely acrobatic animals which often leap out of the water. Their primary source of food is fish.',
    manatee: 'The manatee is the largest marine mammal in the Amazon. It weighs over a thousand pounds and is over five feet long. It can eat up to 110 pounds a day (10% of its body weight). They feed mainly during the wet season, and build up a reserve of food. They then shut down most of their body functions for the dry season and fast for that time period.',
    otter: 'The giant otter is the rarest animal in the Amazon, following a period of intense hunting for the fur. They are over six feet long and weigh three times the weight of other otters, hence their name.',
    electriceel: 'The electric eel is five feet long and is essentially blind. It doesn\'t need its sight, though. It can create an electric field around it which it uses to detect prey. Once it finds them, it discharges a very powerful current which stuns or kills the victim.'
};
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

window.onload = function() {
    const questionNames = {
        "Which of the following doesn't eat meat?": [ "manatee", "jaguar", "anaconda", "tucuxi" ],
        "The tucuxi is...": [ "a river dolphin", "an alligator", "a type of hippo", "a fish"],
        "Jaguars prefer to hunt...": [ "at night", "during the day", "in groups", "on mountaintops" ],
        "The tapir's most noticeable feature is/are its...": [ "nose", "wings", "tusk", "eyes"],
        "The female harpy eagle is strong enough to carry...": [ "a monkey", "a manatee", "a jaguar", "a tapir" ]
    };
    function SVGController(props) {
        const { src, backTitle = "Go back" } = props;
        const divRef = React.useRef(null);
        React.useEffect(() => { (async() => {
            const r = await fetch(src);
            const text = await r.text();
            /*
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "image/svg+xml");
            */
            divRef.current.innerHTML = text;
            if(typeof props.onSVGMount == 'function') {
                /** @type {SVGSVGElement} */
                const svgElement = divRef.current.querySelector("svg");
                props.onSVGMount(svgElement);
            }
        })() }, [ src ]);
        return <div className="svg-container"><div ref={divRef}></div>{backTitle && <button onClick={props.onBack} className="back-button">{backTitle}</button>}</div>;
    }
    function AmazonEnvironment(props) {
        const onSVGMount = (svgElement) => {
            const svgStyle = `
            .interactable {
                outline-width: 4px;
                outline-style: solid;
                outline-color: transparent;
                transition: outline-color 0.1s linear;
                pointer-events: fill;
                cursor: pointer;
            }
            .interactable:hover {
                outline-color: red;
            }
            `;
            const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
            style.textContent = svgStyle;
            svgElement.insertBefore(style, svgElement.firstChild);
            function bbox(e)
            {       
                if (e && e.getBBox && e.getAttributeNS)
                {   
                    var box = e.getBBox();
                    var transform = e.getAttributeNS(null, 'transform');
                    var animal = e.getAttributeNS(null, "data-animal");
                    if (box.x && box.y && box.width && box.height)
                    {
                        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
                        rect.setAttributeNS(null, 'x', box.x);
                        rect.setAttributeNS(null, 'y', box.y);
                        rect.setAttributeNS(null, 'width', box.width);
                        rect.setAttributeNS(null, 'height', box.height);
                        rect.setAttributeNS(null, 'fill', 'rgba(0,0,0,0)');
                        rect.setAttributeNS(null, 'stroke', 'rgba(0,0,0,0)');
                        if(transform)
                            rect.setAttributeNS(null, 'transform', transform);
                        rect.setAttributeNS(null, "data-animal", animal);
                        rect.setAttributeNS(null, "class", "interactable");
                        e.style.pointerEvents = 'none';
                        e.setAttributeNS(null, "class", e.getAttributeNS(null, "class").replace(/\binteractable\b/g, ""));
                        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        e.parentNode.appendChild(g);
                        e.parentNode.removeChild(e);
                        g.appendChild(e);
                        g.appendChild(rect);
                        g.setAttributeNS(null, "class", "interact-group");
                        return rect;
                    }
                }       

                return null;
            }
            const clickHandler = (e) => {
                const interactable = e.currentTarget;
                const animal = interactable.getAttributeNS(null, "data-animal");
                const animalTitle = (animal == 'electriceel' ? 'Electric eel' : (animal.charAt(0).toUpperCase() + animal.substr(1)));
                Swal.fire({
                    title: animalTitle,
                    text: animalInfo[animal],
                    imageUrl: `sprites/${animal}.svg`
                })
            };
            const interactables = Array.prototype.slice.apply(svgElement.querySelectorAll(".interactable"));
            interactables.forEach(interactable => {
                const rect = bbox(interactable);
                rect.addEventListener("click", clickHandler);
            });
        }
        return <SVGController {...props} onSVGMount={onSVGMount}/>;
    }
    function AmazonChooser(props) {
        const onSVGMount = (svgElement) => {
            const svgStyle = `
            .interactable {
                cursor: pointer;
            }
            `;
            const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
            style.textContent = svgStyle;
            svgElement.insertBefore(style, svgElement.firstChild);
            const clickHandler = (e) => {
                const interactable = e.currentTarget;
                const location = interactable.getAttributeNS(null, "data-location");
                props.setLocation(location);
            };
            const interactables = Array.prototype.slice.apply(svgElement.querySelectorAll(".interactable"));
            interactables.forEach(interactable => {
                interactable.addEventListener("click", clickHandler);
            });
        };
        return <SVGController {...props} src="sprites/splash.svg" onSVGMount={onSVGMount}/>;
    }
    const QuizOption = (props) => {
        const { optionName, isCorrect, name, selectedOption, setSelectedOption } = props;
        const isChecked = selectedOption == optionName;
        const inputRef = React.useRef(null);
        const onInputChange = () => {
            if(inputRef.current.checked)
                setSelectedOption(optionName);
        };
        return <label className={isChecked ? "question-label-checked" : ""}>
            <input ref={inputRef} type="radio" onChange={onInputChange} checked={isChecked} name={name} value={optionName} data-correct={isCorrect}/>
            <span className="swal2-label">{optionName}</span>
        </label>;
    };
    const QuizQuestion = React.forwardRef((props, ref) => {
        const { name, options } = props;
        const correctOption = options[0];
        const [ optionsToUse, setOptionsToUse ] = React.useState(null);
        const [ selectedOption, setSelectedOption ] = React.useState(null);
        React.useLayoutEffect(() => {
            setOptionsToUse(shuffle(options.slice()));
        }, [ options ]);
        return <div ref={ref} className="swal2-content question-content">
            <span className="swal2-label question-label"><b>{name}</b></span>
            <div className="swal2-radio question-radio" style={{display: 'flex'}}>
                {optionsToUse?.map(optionName => <QuizOption key={optionName} name={name} selectedOption={selectedOption} setSelectedOption={setSelectedOption} isCorrect={correctOption == optionName} optionName={optionName}/>)}
            </div>
        </div>;
    });
    function AirplaneScreen() {
        return <>
            <img src="sprites/airplane.svg" className="airplane"/>
            <span className="travelling-label">Travelling...</span>
        </>;
    }
    function App() {
        const [ currentLocation, setCurrentLocation ] = React.useState(null);
        const [ visitedAState, setVisitedAState ] = React.useState(false);
        const [ quizCorrectness, setQuizCorrectness ] = React.useState(false);
        const [ shownQuestions, setShownQuestions ] = React.useState(false);
        const [ isFlying, setFlying ] = React.useState(false);
        React.useEffect(() => {
            if(currentLocation == null && visitedAState) {
                (async() => {
                    await Swal.fire({
                        html: "Now that you've returned, the Institute is eager to hear about what you discovered.<p></p>They've prepared a questionaire for you to answer."
                    });
                    const questionRefs = {};
                    let wasCorrect = false;
                    let numWrong = 0;
                    while(!wasCorrect) {
                        const { value } = await ReactSwal.fire({
                            title: '',
                            html: <>{Object.keys(questionNames).map((name) => <QuizQuestion ref={(ref) => {
                                questionRefs[name] = ref;
                            }} key={name} name={name} options={questionNames[name]}/>)}</>,
                            focusConfirm: false,
                            confirmButtonText: "Submit",
                            allowOutsideClick: false,
                            allowEnterKey: false,
                            allowEscapeKey: false,
                            preConfirm: () => {
                                const questionCorrectness = {};
                                Object.keys(questionRefs).forEach(questionName => {
                                    const inputEl = questionRefs[questionName].querySelector("input:checked");
                                    if(inputEl == null)
                                        questionCorrectness[questionName] = false;
                                    else {
                                        const correct = inputEl.getAttribute("data-correct");
                                        questionCorrectness[questionName] = (correct == "true");
                                    }
                                });
                                numWrong = 0;
                                Object.values(questionCorrectness).forEach(val => {
                                    if(!val)
                                        numWrong++;
                                });
                                return [ numWrong == 0 ];
                            }
                        });
                        wasCorrect = value[0];
                        setQuizCorrectness(wasCorrect);
                        if(!wasCorrect) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            const { value } = await Swal.fire({
                                title: 'Hmm...',
                                text: `${numWrong} of your answers ${numWrong == 1 ? "was" : "were"} incorrect. Do you want to try the quiz again, or go back to the Amazon to do more research?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Go back to the Amazon',
                                cancelButtonText: 'Try the quiz again',
                            });
                            if(value) {
                                setVisitedAState(false);
                                break;
                            } else
                                await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                })();
            }
        }, [ currentLocation, visitedAState ]);
        React.useEffect(() => {
            Swal.fire({
                title: `Welcome to ${document.title}!`,
                text: 'Your job today is to explore the Amazon rainforest and find the answers to pressing questions about its environment. Are you ready to start?',
                confirmButtonText: "I'm ready!",
                backdrop: 'rgba(0,0,0,1)'
            });
        }, []);
        const onAmericaReturn = async() => {
            const { value } = await Swal.fire({
                title: 'Wait!',
                text: "Do you really want to return to America, or do you want to stay in the Amazon and do more research?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Return to America',
                cancelButtonText: 'Stay and keep researching'
            });
            if(value) {
                setFlying(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                setVisitedAState(true);
                setFlying(false);
            }
        };
        const moveToAmazon = async() => {
            setFlying(true);
            setShownQuestions(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setFlying(false);
        };
        if(isFlying)
            return <AirplaneScreen/>;
        else if(quizCorrectness)
            return <div className="questions-list">
                <p>Dear Adventurer,</p>
                <p></p>
                <p>Thank you for all your hard work researching. We're pleased to confirm that all of your answers to our questionaire were correct!</p>
                <p></p>
                <p>As a token of our appreciation, we'd like to present you with our <b>{new Date().getFullYear()} Adventurer of the Year Award</b>.</p>
                <center><img src="sprites/award.svg" className="award"/></center>
                <p>We hope to work with you again soon.</p>
                <p></p>
                <p>Thank you,</p>
                <p>Faculty at the Institute for Amazonian Research</p>
            </div>;
        else if(!shownQuestions)
            return <div className="questions-list">
                <p>Dear Adventurer,</p>
                <p></p>
                <p>Here is a list of questions we hope you will be able to answer for us.</p>
                <p></p>
                <ul>
                    {Object.keys(questionNames).map(keyName => <li key={keyName}>{keyName}</li>)}
                </ul>
                <p></p>
                <p>Sincerely,</p>
                <p>Faculty at the Institute for Amazonian Research</p>
                <center><button type="button" onClick={moveToAmazon} className="swal2-confirm swal2-styled">Continue to the Amazon</button></center>
            </div>
        else if(currentLocation == null) {
            if(!visitedAState)
                return <AmazonChooser onBack={onAmericaReturn} backTitle="Return to America" setLocation={setCurrentLocation}/>;
            else {
                return <SVGController backTitle={null} src="sprites/pressconference.svg"/>;
            }
        } else
            return <AmazonEnvironment backTitle="Go back" src={`sprites/${currentLocation}.svg`} onBack={() => setCurrentLocation(null)}/>;
    }
    ReactDOM.render(<App/>, document.getElementById("game-container"));
}