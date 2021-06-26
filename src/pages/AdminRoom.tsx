import { useParams, useHistory } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { database } from '../services/firebase'


import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';


import '../styles/room.scss';


import Troca from '../components/Troca'
import GlobalStyle from '../styles/global'
import { ThemeProvider, DefaultTheme } from 'styled-components'
import light from '../styles/themes/light'
import dark from '../styles/themes/dark'
import usePersistedState from '../hooks/usePersistedState';




type RoomParams = {
    id: string;
}


export function AdminRoom() {
    const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light)
    const toggleTheme = () => {
        setTheme(theme.title === 'light' ? dark : light)
    }




    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { title, questions } = useRoom(roomId)


    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }


    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Você tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })

    }


    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })

    }


    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />

            <div id="page-room">
                <header>
                    <div className="content">
                        <img src={logoImg} alt="Letmeask" />
                        <div>
                            <RoomCode code={roomId} />
                            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                        </div>
                        <Troca toggleTheme={toggleTheme} />
                    </div>
                </header>


                <main className="content">
                    <div className="room-title">
                        <h1>Sala {title}</h1>
                        {questions.length > 0 && <span>{questions.length}pergunta(s)</span>}
                    </div>

                    <div className="question-list">
                        {questions.map(question => {
                            return (
                                <Question
                                    key={question.id}
                                    content={question.content}
                                    author={question.author}
                                    isAnswered={question.isAnswered}
                                    isHighlighted={question.isHighlighted}
                                >
                                    {!question.isAnswered && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                                <img src={checkImg} alt="Marcar pergunta como respondida " />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleHighlightQuestion(question.id)}>
                                                <img src={answerImg} alt="Destaque à pergunta" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(question.id)}>
                                        <img src={deleteImg} alt="Remover pergunta" />
                                    </button>
                                </Question>
                            );
                        })}
                    </div>
                </main>

            </div>
        </ThemeProvider>
    );
}