import { Calendar } from './components/calendar/calendar';
import Div100vh from 'react-div-100vh';
import { store } from './components/redux/store';
import { Provider } from 'react-redux';

export default function App() {
  return (
    <>
      <Div100vh>
        <Provider store={store}>
          <Calendar />
        </Provider>
      </Div100vh>
    </>
  );
}

