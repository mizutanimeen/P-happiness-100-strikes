import { Calendar } from './components/calendar/calendar';
import Div100vh from 'react-div-100vh';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { Register, Login } from './components/account/account';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { CreateRecord } from './components/record/record';
import { Account } from './components/account/account';

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
                <Route path="/account" element={<Account />} />
                <Route path='*'>404 Not Found</Route>
              </Routes>
            </BrowserRouter>
          </Provider>
        </Div100vh>
      </QueryClientProvider>
    </>
  );
}

