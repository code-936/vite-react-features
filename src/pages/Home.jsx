import { useParams } from 'react-router-dom';
import { useApiFetch } from '../hooks/useApiFetch';

const Home = () => {
  const usersURL = 'https://jsonplaceholder.typicode.com/users';
  const { isPending, isSuccess, isError, data, error } = useApiFetch(usersURL, 'GET');
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
      {content}
    </>
  );
};

export default Home;
