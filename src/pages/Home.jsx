import { useParams } from 'react-router-dom';

const Home = () => {
  const { userName } = useParams();
  console.log(`userName: ${userName}`);
  return <div>This is Home. {userName && `Welcome ${userName}`}</div>;
};

export default Home;
