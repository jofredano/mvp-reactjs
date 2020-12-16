import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

async function getNotifications() {
    const authorizationToken = localStorage.getItem( 'token' );
    const config = { headers: { Authorization: `Bearer ${authorizationToken}` } };
    const baseUrl = 'http://localhost:8081/dynamic/dashboard/activities';
    const response = await axios.get( baseUrl, config );
    return response.data;
}

function useEffectNotifications() {
  const [ notifications, setNotifications ] = useState( [] );
  useEffect(() => {
      getNotifications().then( response => {
          setNotifications( response );
      } ).catch( error => {
          console.log( error );
      } );
  }, [] );
  return notifications;
}

class SocketComponent extends React.Component {

   constructor( props ) {
      super( props );
      this.state = { notifications: [] };
   }

   componentDidMount() {
      const component = this;
      getNotifications().then( response => {
          component.setState( { notifications: response });
      } ).catch( error => {
          console.log( error );
      } );
      this.websocketClient();
   }

   renderTableData() {
      if (!this.state.notifications || this.state.notifications.length === 0) {
          return (<tr><th colSpan="5">No data found</th></tr>);
      } else {
          return this.state.notifications.map((notification, index) => {
            const { date, id, request, lastUpdate } = notification;
            return (
              <tr key={id}>
                <th scope="row">{date}</th>
                <td>{request.LD}</td>
                <td>{request.order.origin.address}</td>
                <td>{request.order.destination.address}</td>
                <td>{lastUpdate.status.description}</td>
              </tr>
            );
        });
      }
  }

  websocketClient() {
      const component = this;
      const token = localStorage.getItem('token');
      const options = {
          transportOptions: {
            polling: { extraHeaders: { 'x-clientid': `Bearer ${token}` } }
          }
      };
      const socket = io( 'http://localhost:8081', options );
      socket.on('event.activity', (data) => {
          console.log(`data: ${JSON.stringify(data)}`);
          const items    = component.state.notifications;
          const elements = items.splice( 0, 0, data );
          component.state.notifications = elements;
      } );
      socket.on('connect', () => {
          console.log( 'connected ' + socket.id );
          socket.on('disconnect', () => {
             console.log( 'dis-connect ' + socket.id );
          });
      });
  }

  render() {
      return (<table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">LD</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                 {this.renderTableData()}
              </tbody>
            </table>);
   }
}

export default SocketComponent;