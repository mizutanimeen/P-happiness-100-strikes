import { Calendar } from './components/calendar/calendar';
import Div100vh from 'react-div-100vh';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { Register, Login } from './components/account/account';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { CreateRecord } from './components/record/record';

const queryClient = new QueryClient()

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Div100vh>
          <Provider store={store}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Calendar />} />
                <Route path="/records/create" element={<CreateRecord />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </Provider>
        </Div100vh>
      </QueryClientProvider>
    </>
  );
}

