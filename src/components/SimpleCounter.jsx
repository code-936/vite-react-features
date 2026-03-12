import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../redux/counterSlice';
import './SimpleCounter.css';

const SimpleCounter = () => {
 let count = useSelector(state => state.counter.value);
 const dispatch = useDispatch();

  return (
    <section className="simple-counter" aria-label="Simple counter controls">
      <h1 className="simple-counter__title">Simple Counter</h1>
      <div id="counter-control" className="counter-control">
        <button type="button" className="counter-control__button" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button
          type="button"
          className="counter-control__button counter-control__button--secondary"
          onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <label className="counter-control__label">Count: {count}</label>
      </div>
    </section>
  );
};

export default SimpleCounter;
