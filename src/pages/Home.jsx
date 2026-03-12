import { useParams } from 'react-router-dom';
import { useApiFetch } from '../hooks/useApiFetch';
import SimpleCounter from '../components/SimpleCounter';

const Home = () => {
  const usersURL = 'https://jsonplaceholder.typicode.com/users';
  const { isPending, isSuccess, isError, data, error, fetchData } = useApiFetch(usersURL, 'GET');
  const { userName } = useParams();

  let content = null;
  if (isPending) {
    content = 'Loading..';
  } else if (isError) {
    content = error instanceof Error ? error.message : error || 'Something went wrong..';
  } else if (isSuccess && data?.length > 0) {
    content = data.map((user) => <div key={user.id}>{user.name}</div>);
  }

  return (
    <>
      <div>This is Home. {userName && `Welcome ${userName}`}</div>
      <SimpleCounter />
      <input type="button" onClick={() => fetchData()} value="Get Users Data" />
      {/* event will be passed to fetchData by default if code is like - onClick={fetchData}. fetchData function will not work as first param is event instead of url */}
      {/* solution: pass no args to fetchData like onClick={() => fetchData()}*/}
      {content}
    </>
  );
};

export default Home;
