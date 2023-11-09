import React, { useState } from 'react';
import axios from 'axios';

enum Language {
    Russian = 'ru',
    English = 'en'
}

const ruToEnHistory: string[] = []
const enToRuHistory: string[] = []

const App = () => {
    const [rusToTranslate, setRusToTranslate] = useState('');
    const [rusTranslated, setRusTranslated] = useState('');
    const [enToTranslate, setEnToTranslate] = useState('');
    const [enTranslated, setEnTranslated] = useState('');
    const [isHistoryShowed, setIsHistoryShowed] = useState(false);

    const translateAsync = async (text: string, source: Language, target: Language): Promise<string | undefined> => {
        const encodedParams = new URLSearchParams();
            encodedParams.set('q', text);
            encodedParams.set('target', target);
            encodedParams.set('source', source);

        const options = {
            method: 'POST',
            url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': 'b0bb27182emsh3cc359663dd8574p1bdc5fjsn714b61bed29a',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
            data: encodedParams,
        };

        try {
            const response = await axios.request(options);
            const translated = response.data.data.translations[0]?.translatedText;
            return new Promise(function (resolve) { resolve(translated) })
        } catch (error) {
            console.error(error);
        }
    }

    const translateToEnglish = async () => {
        const translated = await translateAsync(rusToTranslate, Language.Russian, Language.English)
        setRusTranslated(translated || '')
        ruToEnHistory.push(`${rusToTranslate} -> ${translated}`)
    }

    const translateToRussian = async () => {
        const translated = await translateAsync(enToTranslate, Language.English, Language.Russian)
        setEnTranslated(translated || '')
        enToRuHistory.push(`${enToTranslate} -> ${translated}`)
    }

    return (
        <div className="App">
            <div>
                <input
                    value={rusToTranslate}
                    onChange={e => setRusToTranslate(e.target.value)}
                    placeholder='слово'
                />
                <button
                    onClick={translateToEnglish}
                >
                    English
                </button>
                <input
                    readOnly
                    value={rusTranslated}
                    placeholder='translated'
                />
            </div>
            <div>
                <input
                    value={enToTranslate}
                    onChange={e => setEnToTranslate(e.target.value)}
                    placeholder='word'
                />
                <button
                    onClick={translateToRussian}
                >
                    Русский
                </button>
                <input
                    readOnly
                    value={enTranslated}
                    placeholder='перевод'
                />
            </div>
            <div>
                <button
                    onClick={() => setIsHistoryShowed(prev => !prev)}
                >
                    История
                </button>
                { isHistoryShowed &&
                    <div>
                        <text>{'Русский -> English'}</text>
                        {ruToEnHistory.map((elem) =>
                            <div>{elem}</div>
                        )}
                        <text>{'English -> Русский'}</text>
                        {enToRuHistory.map((elem) =>
                            <div>{elem}</div>
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
