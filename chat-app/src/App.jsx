import {BrowserRouter , Routes , Route} from 'react-router-dom';

// IMPORTS
import LoginPage from "./components/login/loginPage"
import VerifyPage from './components/login/verifyPage';
import ChatPage from './components/chat/chatPage';
import Profile from './components/profile/Profile';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LoginPage></LoginPage>}></Route>
      <Route path='/verify' element={<VerifyPage></VerifyPage>}></Route>
      <Route path='/chat' element={<ChatPage></ChatPage>}></Route>
      <Route path='/profile' element={<Profile></Profile>}></Route>
    </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
