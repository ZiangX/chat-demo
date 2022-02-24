import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Row, Col } from 'react-bootstrap';

import './App.css';
const ws = new WebSocket('ws://localhost:6767');

function App() {
  const [queries, setQueries] = useState([]);
  const [selectedType, setSeletedType] = useState('');
  const [reqContent, setReqContent] = useState('');

  const [redisHMDS, setRedisHMDS] = useState([]);
  const [redisUsers, setRedisUsers] = useState([]);
  const [redisSession, setRedisSession] = useState([]);

  ws.onopen = () => {
    console.log('Connected to WS Server');
    ws.send(
      JSON.stringify({
        type: 'init',
        content: {
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMzNywiZmlyc3RuYW1lIjoiWnVjayIsImxhc3RuYW1lIjoiWHUiLCJlbWFpbCI6Inp1Y2sueHVAaGF1c3ZhbGV0LmNhIiwicm9sZSI6Mywibm90aWZpY2F0aW9uc19lbmFibGVkIjp0cnVlLCJmaXJzdF9sb2dpbiI6ZmFsc2UsImhkcl9zdHlsZSI6bnVsbCwicGhvbmVfbnVtYmVyIjoiMTIzIiwibm90aWZpY2F0aW9uX2VtYWlsIjpbInp1Y2sueHVAaGF1c3ZhbGV0LmNhIiwiemlhbmd4dXVAZ21haWwuY29tIl0sIm5vdGlmaWNhdGlvbl9waG9uZV9udW1iZXIiOlsiMTIzIl0sImJyb2tlcl9pZCI6bnVsbCwiYmFja3VwX2Jyb2tlcl9pZCI6bnVsbCwic3VzcGVuZGVkIjpmYWxzZSwib3B0ZWRfaW5fY2VudHJpc19kYXRhIjpmYWxzZSwiZ2ZfY2xhdXNlIjpmYWxzZSwibGFuZ3VhZ2UiOm51bGwsImlhdCI6MTYyMzMzMTM1NywiZXhwIjoyNjYwMTMxMzU3fQ.FaVO4Bu21oN07FJC02kmk4mAQuG2YS7aLEKvyhWKVEk',
        },
      })
    );
  };

  ws.onmessage = function (event) {
    const response = JSON.parse(event.data);
    console.log('response', response);
    if (response.displaySubscription) {
      if (response.channel === 'users') {
        console.log(12344);
        setRedisUsers([...redisUsers, response.message]);
      } else if (response.channel === 'hmds') {
        console.log(12344);
        setRedisHMDS([...redisHMDS, response.message]);
      } else {
        console.log(12344);
        setRedisSession([...redisSession, response.message]);
      }
    }
    setQueries([...queries, response]);
  };

  const onFormSubmit = () => {
    console.log('req payload', selectedType);
    ws.send(JSON.stringify(selectedType));
    setSeletedType(null);
    // JSON.stringify({
    //   type: selectedType,
    //   content: reqContent,
    // })
  };

  const on_req_type_selected = (e) => {
    switch (e.target.value) {
      case 'invite-user':
        setSeletedType({ type: 'invite-user', content: { sessionId: 5000, sessionInfo: 'lala', invitedUserId: 1340} });
        break;

      case 'send-users-to-listing':
        setSeletedType({
          type: 'send-users-to-listing',
          content: { marker_id: 4567, listing_id: 1500 },
        });
        break;

      case 'rotation':
        setSeletedType({
          type: 'rotation',
          content: { x: 1, y: 1, z: 1, w: 1 },
        });
        break;

      case 'change-marker':
        setSeletedType({
          type: 'change-marker',
          content: { marker_id: 7890, listing_id: 1500 },
        });
        break;

      case 'watch-user':
        setSeletedType({
          type: 'watch-user',
          content: 'hmd_test_id',
        });
        break;

      case 'stop-watch-user':
        setSeletedType({
          type: 'stop-watch-user',
        });
        break;
    }
  };

  const QueryTable = () => (
    <Table striped bordered hover size="lg">
      <thead>
        <tr>
          <th style={{ width: '600px' }}>Type</th>
          <th style={{ width: '600px' }}>Value</th>
          <th style={{ width: '600px' }}>Response</th>
        </tr>
      </thead>
      <tbody>
        {queries.map((query, index) => (
          <tr key={index}>
            <td>{query.type}</td>
            {/* <td>{typeof query.content === 'object' ? JSON.stringify(query.content) : query.content}</td> */}
            {/* <td>{query}</td> */}
          </tr>
        ))}
        <tr>
          <td>
            <Form.Select
              aria-label="Default select example"
              onChange={on_req_type_selected}
              value={selectedType?.type}
            >
              <option>Open this select menu</option>
              <option value="request-status-update">request-status-update</option>
              <option value="invite-user">invite-user</option>
              <option value="send-users-to-listing">send-users-to-listing</option>
              <option value="rotation">rotation</option>
              <option value="change-marker">change-marker</option>
              <option value="watch-user">watch-user</option>
              <option value="stop-watch-user">stop-watch-user</option>
            </Form.Select>
          </td>
          <td>
            <InputGroup size="lg">
              <FormControl
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                onChange={(e) => setReqContent(e.target.value)}
                value={reqContent}
              />
            </InputGroup>
          </td>
          <td>
            <Button
              variant="primary"
              onClick={() => {
                onFormSubmit();
                // setReqContent(null);
                // setSeletedType(null);
              }}
            >
              Submit
            </Button>{' '}
          </td>
        </tr>
      </tbody>
    </Table>
  );

  const RedisSubscriptionMessage = () => (
    <Row style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
      <Col>
        <ListGroup>
          <ListGroup.Item>HMDS({redisHMDS.length})</ListGroup.Item>
          {redisHMDS.map((item, index) => (
            <ListGroup.Item variant={index % 2 === 0 ? "light": "dark"}>{item}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col>
        <ListGroup>
          <ListGroup.Item>Users({redisUsers.length})</ListGroup.Item>
          {redisUsers.map((item, index) => (
            <ListGroup.Item variant={index % 2 === 0 ? "light": "dark"}>{item}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      <Col>
        <ListGroup>
          <ListGroup.Item>Session({redisSession.length})</ListGroup.Item>
          {redisSession.map((item, index) => (
            <ListGroup.Item variant={index % 2 === 0 ? "light": "dark"}>{item}</ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  );

  return (
    <div className="App">
      <header className="App-header">
        <QueryTable />
        <br style={{ margin: '10px 0', color: 'white' }} />
        <RedisSubscriptionMessage />
      </header>
      {/* <Chat /> */}
    </div>
  );
}

export default App;
