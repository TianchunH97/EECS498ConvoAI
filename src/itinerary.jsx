import React from "react";
import MaterialTable from 'material-table';
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

// https://material-ui.com/zh/components/tables/
// get destinations list from list.jsx
class Itinerary extends React.Component {

    constructor (props) {
      super(props);
      
      this.state = {
          data: [
              { '': 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
            ],
      };

    }

    render (){
        const columns = [
            { title: 'Day', field: 'day' },
            { title: 'Destination', field: 'destination' },
            { title: 'Description', field: 'description'},
        ];
        const data = this.state.data;
        

        return (
            <MaterialTable
              title="itinerary"
              columns={columns}
              data={data}
              editable={{
                // onRowUpdate: (newData, oldData) =>
                //   new Promise(resolve => {
                //     setTimeout(() => {
                //       resolve();
                //       if (oldData) {
                //         this.setState(prevState => {
                //           const data = [...prevState.data];
                //           data[data.indexOf(oldData)] = newData;
                //           return { ...prevState, data };
                //         });
                //       }
                //     }, 600);
                //   }),
                onRowDelete: oldData =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      this.setState(prevState => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
              }}
            />
        );
    }

}


export default Itinerary;