import { jsx as $eSIqy$jsx, jsxs as $eSIqy$jsxs } from "react/jsx-runtime";
import { useState as $eSIqy$useState, useRef as $eSIqy$useRef, useMemo as $eSIqy$useMemo, useEffect as $eSIqy$useEffect } from "react";
import $eSIqy$textareacaret from "textarea-caret";



function $19eb910254214610$export$e27e3030245d4c9b() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}


function $2f5cf912a7dc4b84$export$8a4ff65f970d59a5(el) {
    const start = 0;
    const end = 0;
    if (!el) return {
        start: start,
        end: end
    };
    if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") return {
        start: el.selectionStart,
        end: el.selectionEnd
    };
    return {
        start: start,
        end: end
    };
}
function $2f5cf912a7dc4b84$export$97ab23b40042f8af(elem, caretPos) {
    if (elem) {
        if (elem.selectionStart) {
            elem.focus();
            elem.setSelectionRange(caretPos, caretPos);
        } else elem.focus();
    }
}





const $5ac81081e5c28bfa$export$24b0ea3375909d37 = {
    KEY_RETURN: "Enter",
    KEY_ENTER: "Enter",
    KEY_TAB: "Tab",
    KEY_SPACE: " "
};


const $69c8f257da8dc8b1$export$27f30d10c00bcc6c = async (word, customApiURL, apiKey, config) => {
    const { showCurrentWordAsLastSuggestion: // numOptions = 5,
        showCurrentWordAsLastSuggestion = true, lang: lang = "hi" } = config || {};
    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": apiKey
        }
    };
    try {
        const res = await fetch(customApiURL + `${lang}/${word === "." || word === ".." ? " " + word.replace(".", "%2E") : encodeURIComponent(word).replace(".", "%2E")}`, requestOptions);
        let data = await res.json();
        if (!customApiURL.includes("xlit-api")) data.result = data.output[0].target;
        if (data && data.result.length > 0) {
            const found = showCurrentWordAsLastSuggestion ? [
                ...data.result,
                word
            ] : data.result;
            return found;
        } else {
            if (showCurrentWordAsLastSuggestion) return [
                word
            ];
            return [];
        }
    } catch (e) {
        // catch error
        console.error("There was an error with transliteration", e);
        return [];
    }
};


const $b9b628447857a10a$export$ca6dda5263526f75 = "https://xlit-api.ai4bharat.org/";
const $b9b628447857a10a$export$a238c5e20ae27fe7 = "https://xlit-api.ai4bharat.org/tl/";


const $d8161b358c525845$export$58f2e270169de9d3 = async () => {
    if (sessionStorage.getItem("indic_transliterate__supported_languages")) return JSON.parse(sessionStorage.getItem("indic_transliterate__supported_languages") || "");
    else {
        const apiURL = `${(0, $b9b628447857a10a$export$ca6dda5263526f75)}languages`;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: "GET"
        };
        try {
            const res = await fetch(apiURL, requestOptions);
            const data = await res.json();
            sessionStorage.setItem("indic_transliterate__supported_languages", JSON.stringify(data));
            return data;
        } catch (e) {
            console.error("There was an error with transliteration", e);
            return [];
        }
    }
};



const $41d49c8a6078fe3c$var$KEY_UP = "ArrowUp";
const $41d49c8a6078fe3c$var$KEY_DOWN = "ArrowDown";
const $41d49c8a6078fe3c$var$KEY_LEFT = "ArrowLeft";
const $41d49c8a6078fe3c$var$KEY_RIGHT = "ArrowRight";
const $41d49c8a6078fe3c$var$KEY_ESCAPE = "Escape";
const $41d49c8a6078fe3c$var$OPTION_LIST_Y_OFFSET = 10;
const $41d49c8a6078fe3c$var$OPTION_LIST_MIN_WIDTH = 100;
const $41d49c8a6078fe3c$export$a62758b764e9e41d = ({ renderComponent: renderComponent = (props) =>/*#__PURE__*/(0, $eSIqy$jsx)("input", {
    ...props
}), lang: lang = "hi", offsetX: offsetX = 0, offsetY: offsetY = 10, onChange: onChange, onChangeText: onChangeText, onBlur: onBlur, value: value, onKeyDown: onKeyDown, containerClassName: containerClassName = "", containerStyles: containerStyles = {}, activeItemStyles: activeItemStyles = {}, maxOptions: maxOptions = 5, hideSuggestionBoxOnMobileDevices: hideSuggestionBoxOnMobileDevices = false, hideSuggestionBoxBreakpoint: hideSuggestionBoxBreakpoint = 450, triggerKeys: triggerKeys = [
    (0, $5ac81081e5c28bfa$export$24b0ea3375909d37).KEY_SPACE,
    (0, $5ac81081e5c28bfa$export$24b0ea3375909d37).KEY_ENTER,
    (0, $5ac81081e5c28bfa$export$24b0ea3375909d37).KEY_RETURN,
    (0, $5ac81081e5c28bfa$export$24b0ea3375909d37).KEY_TAB
], insertCurrentSelectionOnBlur: insertCurrentSelectionOnBlur = true, showCurrentWordAsLastSuggestion: showCurrentWordAsLastSuggestion = true, enabled: enabled = true, horizontalView: horizontalView = false, customApiURL: customApiURL = (0, $b9b628447857a10a$export$a238c5e20ae27fe7), apiKey: apiKey = "", ...rest }) => {
    const [left, setLeft] = (0, $eSIqy$useState)(0);
    const [top, setTop] = (0, $eSIqy$useState)(0);
    const [selection, setSelection] = (0, $eSIqy$useState)(0);
    const [matchStart, setMatchStart] = (0, $eSIqy$useState)(-1);
    const [matchEnd, setMatchEnd] = (0, $eSIqy$useState)(-1);
    const inputRef = (0, $eSIqy$useRef)(null);
    const [windowSize, setWindowSize] = (0, $eSIqy$useState)({
        width: 0,
        height: 0
    });
    const [direction, setDirection] = (0, $eSIqy$useState)("ltr");
    const [googleFont, setGoogleFont] = (0, $eSIqy$useState)(null);
    const [options, setOptions] = (0, $eSIqy$useState)([]);
    const [logJsonArray, setLogJsonArray] = (0, $eSIqy$useState)([]);
    const [numSpaces, setNumSpaces] = (0, $eSIqy$useState)(0);
    const [parentUuid, setParentUuid] = (0, $eSIqy$useState)("0");
    const [uuid, setUuid] = (0, $eSIqy$useState)(Math.random().toString(36).substr(2, 9));
    const [subStrLength, setSubStrLength] = (0, $eSIqy$useState)(0);
    const [restart, setRestart] = (0, $eSIqy$useState)(true);
    const shouldRenderSuggestions = (0, $eSIqy$useMemo)(() => hideSuggestionBoxOnMobileDevices ? windowSize.width > hideSuggestionBoxBreakpoint : true, [
        windowSize,
        hideSuggestionBoxBreakpoint,
        hideSuggestionBoxOnMobileDevices
    ]);
    const reset = () => {
        // reset the component
        setSelection(0);
        setOptions([]);
    };
    const handleSelection = (index) => {
        var _inputRef_current;
        const currentString = value;
        // create a new string with the currently typed word
        // replaced with the word in transliterated language
        const newValue = currentString.substring(0, matchStart) + options[index] + " " + currentString.substring(matchEnd + 1, currentString.length);
        if (logJsonArray.length) {
            let lastLogJson = logJsonArray[logJsonArray.length - 1];
            let logJson = {
                keystrokes: lastLogJson.keystrokes,
                results: lastLogJson.results,
                opted: options[index],
                created_at: new Date().toISOString(),
                language: lang
            };
            setLogJsonArray([
                ...logJsonArray,
                logJson
            ]);
            setNumSpaces(numSpaces + 1);
        }
        // set the position of the caret (cursor) one character after the
        // the position of the new word
        setTimeout(() => {
            (0, $2f5cf912a7dc4b84$export$97ab23b40042f8af)(// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                inputRef.current, matchStart + options[index].length + 1);
        }, 1);
        // bubble up event to the parent component
        const e = {
            target: {
                value: newValue
            }
        };
        onChangeText(newValue);
        onChange && onChange(e);
        reset();
        return (_inputRef_current = inputRef.current) === null || _inputRef_current === void 0 ? void 0 : _inputRef_current.focus();
    };
    const renderSuggestions = async (lastWord, wholeText) => {
        if (!shouldRenderSuggestions) return;
        // fetch suggestion from api
        // const url = `https://www.google.com/inputtools/request?ime=transliteration_en_${lang}&num=5&cp=0&cs=0&ie=utf-8&oe=utf-8&app=jsapi&text=${lastWord}`;
        // const numOptions = showCurrentWordAsLastSuggestion
        //   ? maxOptions - 1
        //   : maxOptions;
        const data = await (0, $69c8f257da8dc8b1$export$27f30d10c00bcc6c)(lastWord, customApiURL, apiKey, {
            showCurrentWordAsLastSuggestion: // numOptions,
                showCurrentWordAsLastSuggestion,
            lang: lang
        });
        setOptions(data !== null && data !== void 0 ? data : []);
        let logJson = {
            keystrokes: wholeText,
            results: data,
            opted: "",
            created_at: new Date().toISOString(),
            language: lang
        };
        if (restart) {
            setRestart(false);
            setLogJsonArray([
                logJson
            ]);
        } else setLogJsonArray([
            ...logJsonArray,
            logJson
        ]);
    };
    const getDirectionAndFont = async (lang) => {
        const langList = await (0, $d8161b358c525845$export$58f2e270169de9d3)();
        const langObj = langList === null || langList === void 0 ? void 0 : langList.find((l) => l.LangCode === lang);
        var _langObj_Direction;
        return [
            (_langObj_Direction = langObj === null || langObj === void 0 ? void 0 : langObj.Direction) !== null && _langObj_Direction !== void 0 ? _langObj_Direction : "ltr",
            langObj === null || langObj === void 0 ? void 0 : langObj.GoogleFont,
            langObj === null || langObj === void 0 ? void 0 : langObj.FallbackFont
        ];
    };
    const handleChange = (e) => {
        const value = e.currentTarget.value;
        if (numSpaces == 0 || restart) {
            if (value.length >= 4) setSubStrLength(value.length - 4);
            else setSubStrLength(0);
        }
        if (numSpaces >= 5) {
            const finalJson = {
                "uuid": uuid,
                "parent_uuid": parentUuid,
                "word": value,
                "source": "node-module",
                "language": lang,
                "steps": logJsonArray
            };
            setLogJsonArray([]);
            setParentUuid(uuid);
            setUuid(Math.random().toString(36).substr(2, 9));
            setSubStrLength(value.length - 2);
            setNumSpaces(0);
            setRestart(true);
            fetch("https://backend.shoonya.ai4bharat.org/logs/transliteration_selection/", {
                method: "POST",
                body: JSON.stringify(finalJson),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (res) => {
                if (!res.ok) throw await res.json();
            }).catch((err) => {
                console.log("error", err);
            });
        }
        // bubble up event to the parent component
        onChange && onChange(e);
        onChangeText(value);
        if (!shouldRenderSuggestions) return;
        // get the current index of the cursor
        const caret = (0, $2f5cf912a7dc4b84$export$8a4ff65f970d59a5)(e.target).end;
        const input = inputRef.current;
        if (!input) return;
        const caretPos = (0, $eSIqy$textareacaret)(input, caret);
        // search for the last occurence of the space character from
        // the cursor
        const indexOfLastSpace = value.lastIndexOf(" ", caret - 1) < value.lastIndexOf("\n", caret - 1) ? value.lastIndexOf("\n", caret - 1) : value.lastIndexOf(" ", caret - 1);
        // first character of the currently being typed word is
        // one character after the space character
        // index of last character is one before the current position
        // of the caret
        setMatchStart(indexOfLastSpace + 1);
        setMatchEnd(caret - 1);
        // currentWord is the word that is being typed
        const currentWord = value.slice(indexOfLastSpace + 1, caret);
        if (currentWord && enabled) {
            // make an api call to fetch suggestions
            if (numSpaces == 0 || restart) {
                if (value.length >= 4) renderSuggestions(currentWord, value.substr(value.length - 4, value.length));
                else renderSuggestions(currentWord, value.substr(0, value.length));
            } else renderSuggestions(currentWord, value.substr(subStrLength, value.length));
            const rect = input.getBoundingClientRect();
            // calculate new left and top of the suggestion list
            // minimum of the caret position in the text input and the
            // width of the text input
            const left = Math.min(caretPos.left, rect.width - $41d49c8a6078fe3c$var$OPTION_LIST_MIN_WIDTH / 2);
            // minimum of the caret position from the top of the input
            // and the height of the input
            const top = Math.min(caretPos.top + $41d49c8a6078fe3c$var$OPTION_LIST_Y_OFFSET, rect.height);
            setTop(top);
            setLeft(left);
        } else reset();
    };
    const handleKeyDown = (event) => {
        const helperVisible = options.length > 0;
        if (helperVisible) {
            if (triggerKeys.includes(event.key)) {
                event.preventDefault();
                handleSelection(selection);
            } else switch (event.key) {
                case $41d49c8a6078fe3c$var$KEY_ESCAPE:
                    event.preventDefault();
                    reset();
                    break;
                case $41d49c8a6078fe3c$var$KEY_UP:
                    event.preventDefault();
                    setSelection((options.length + selection - 1) % options.length);
                    break;
                case $41d49c8a6078fe3c$var$KEY_DOWN:
                    event.preventDefault();
                    setSelection((selection + 1) % options.length);
                    break;
                case $41d49c8a6078fe3c$var$KEY_LEFT:
                    event.preventDefault();
                    setSelection((options.length + selection - 1) % options.length);
                    break;
                case $41d49c8a6078fe3c$var$KEY_RIGHT:
                    event.preventDefault();
                    setSelection((selection + 1) % options.length);
                    break;
                default:
                    onKeyDown && onKeyDown(event);
                    break;
            }
        } else onKeyDown && onKeyDown(event);
    };
    const handleBlur = (event) => {
        if (!(0, $19eb910254214610$export$e27e3030245d4c9b)()) {
            if (insertCurrentSelectionOnBlur && options[selection]) handleSelection(selection);
            else reset();
        }
        onBlur && onBlur(event);
    };
    const handleResize = () => {
        // TODO implement the resize function to resize
        // the helper on screen size change
        const width = window.innerWidth;
        const height = window.innerHeight;
        setWindowSize({
            width: width,
            height: height
        });
    };
    (0, $eSIqy$useEffect)(() => {
        window.addEventListener("resize", handleResize);
        const width = window.innerWidth;
        const height = window.innerHeight;
        setWindowSize({
            width: width,
            height: height
        });
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    (0, $eSIqy$useEffect)(() => {
        getDirectionAndFont(lang).then(([direction, googleFont, fallbackFont]) => {
            setDirection(direction);
            // import google font if not already imported
            if (googleFont) {
                if (!document.getElementById(`font-${googleFont}`)) {
                    const link = document.createElement("link");
                    link.id = `font-${googleFont}`;
                    link.href = `https://fonts.googleapis.com/css?family=${googleFont}`;
                    link.rel = "stylesheet";
                    document.head.appendChild(link);
                }
                setGoogleFont(`${googleFont}, ${fallbackFont !== null && fallbackFont !== void 0 ? fallbackFont : "sans-serif"}`);
            } else setGoogleFont(null);
        });
    }, [
        lang
    ]);
    return /*#__PURE__*/ (0, $eSIqy$jsxs)("div", {
        // position relative is required to show the component
        // in the correct position
        style: {
            ...containerStyles,
            position: "relative"
        },
        className: containerClassName,
        children: [
            renderComponent({
                onChange: handleChange,
                onKeyDown: handleKeyDown,
                onBlur: handleBlur,
                ref: inputRef,
                value: value,
                "data-testid": "rt-input-component",
                lang: lang,
                style: {
                    direction: direction,
                    ...googleFont && {
                        fontFamily: googleFont
                    }
                },
                ...rest
            }),
            shouldRenderSuggestions && options.length > 0 && /*#__PURE__*/ (0, $eSIqy$jsx)("ul", {
                style: {
                    backgroundClip: "padding-box",
                    backgroundColor: "#fff",
                    border: "1px solid rgba(0, 0, 0, 0.15)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.175)",
                    display: horizontalView ? "flex" : "block",
                    fontSize: "14px",
                    listStyle: "none",
                    padding: "1px",
                    textAlign: "center",
                    zIndex: 20000,
                    left: `${left + offsetX}px`,
                    top: `${top + offsetY}px`,
                    position: "absolute",
                    width: "auto",
                    ...googleFont && {
                        fontFamily: googleFont
                    }
                },
                "data-testid": "rt-suggestions-list",
                lang: lang,
                children: Array.from(new Set(options)).map((item, index) =>/*#__PURE__*/(0, $eSIqy$jsx)("li", {
                    style: index === selection ? {
                        cursor: "pointer",
                        padding: "10px",
                        minWidth: "100px",
                        backgroundColor: "#65c3d7",
                        color: "#fff"
                    } : {
                        cursor: "pointer",
                        padding: "10px",
                        minWidth: "100px",
                        backgroundColor: "#fff"
                    },
                    onMouseEnter: () => {
                        setSelection(index);
                    },
                    onClick: () => handleSelection(index),
                    children: item
                }, item))
            })
        ]
    });
};


export { $41d49c8a6078fe3c$export$a62758b764e9e41d as IndicTransliterate, $5ac81081e5c28bfa$export$24b0ea3375909d37 as TriggerKeys, $69c8f257da8dc8b1$export$27f30d10c00bcc6c as getTransliterateSuggestions, $d8161b358c525845$export$58f2e270169de9d3 as getTransliterationLanguages };
//# sourceMappingURL=index.js.map
