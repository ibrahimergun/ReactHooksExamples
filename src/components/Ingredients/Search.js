import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import useHTTP from '../../hooks/useHttp';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo((props) => {
  const [filteredData, setFiltereddata] = useState('');
  const inputref = useRef();

  //dectruction
  const { onFilteredData } = props;
  const { isLoading, data, error, sendRequest, clear } = useHTTP();

  console.log(data);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filteredData === inputref.current.value) {
        const query =
          filteredData.length !== 0
            ? `?orderBy="title"&equalTo="${filteredData}"`
            : '';

        sendRequest(
          'https://react-http-dc30f-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' +
            query,
          'GET',
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filteredData, inputref, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedDatas = [];
      for (const objectName in data) {
        loadedDatas.push({
          id: objectName,
          title: data[objectName].title,
          amount: data[objectName].amount,
        });
      }
      onFilteredData(loadedDatas);
    }
  }, [data, isLoading, error, onFilteredData]);

  return (
    <section className='search'>
      <Card>
        {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
            type='text'
            value={filteredData}
            onChange={(event) => setFiltereddata(event.target.value)}
            ref={inputref}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
