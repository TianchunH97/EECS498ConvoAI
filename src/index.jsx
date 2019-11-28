import React from "react";
import ReactDOM from 'react-dom';
import Container from 'react-bootstrap/Container'
import List from "./list.jsx";
import UserInfo from "./userInfo.jsx";
import DestInfo from "./destInfo.jsx";
import { Button, Row, Col, Modal } from "react-bootstrap";
import Itinerary from "./itinerary.jsx";
import Dialog from "./dialog.jsx";
import Destinations from "./destinations.jsx";

// https://material-ui.com/zh/
class App extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
          userId: uuidv4(),
          generate: false,
          city: '',
          visitor: '',
          length: '',
          destinations : [],
          schedule: [],
          showMap: false,
          showDrawer: false,
      }
    }

    componentDidMount(){
        // const proxyurl = "https://cors-anywhere.herokuapp.com/"
        // const url = 'http://convo-ai.herokuapp.com/set_user_id/'
        // this.postData(proxyurl + url, {userId: this.state.userId}) 
        // .then(data => {
        //     console.log("get reponse: ", data.response);
        // })
        // .catch(error => console.error(error));
    }

    postData = (url = '', data = {}) => {
        // Default options are marked with *
            return fetch(url, {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrer: 'no-referrer', // no-referrer, *client
                body: JSON.stringify(data), // body data type must match "Content-Type" header
            })
            .then(response => response.json()); // parses JSON response into native JavaScript objects 
    }

    handleUpdate = (type, new_list) => {
        if (type == 'destinations'){
            console.log("Updating the destination list...");
            this.setState({
                destinations: new_list,
            });
        }
        if (type == 'schedule'){
            console.log("Updating the schedule list...");
            this.setState({
                schedule: new_list,
            });
        }
    }

    destinationRequests = (q) => {
        // silly, but whatever
        this.postData('/query_clinc/', {query: q, userId: this.state.userId}) 
        .then(data => {
            console.log(data);
            this.handleUpdate('destinations', data.destinations);
            this.setState({
                loading: false,
                destinations: [...data.destinations],
            });
            if (q == "Recommend")  { // don't do this in real work
                let dest = document.getElementById("destination-img");
                dest.setAttribute("src", data.img);
                document.getElementById("destination-name").innerHTML = data.dest;
                document.getElementById("destination-intro").innerHTML = data.intro;
            }
        })
        .catch(error => console.error(error));
    }

    handleRemove = (idx) => { 
        this.destinationRequests("Remove " + this.state.destinations[idx]) 
    }

    handleAddDestination = () => { this.destinationRequests("Add this") }
    
    handleSkipDestination = () => { this.destinationRequests("Recommend") }

    handleGenerate = () => {
        this.setState({
            generate: true,
            showMap: true
        });
    }

    setShowMap = (status) => this.setState({ showMap: status });
    
    setShowDestinations = (status) => this.setState({ showDrawer: status });

    reorderDestinations = (arr) => {
        console.log(arr);
        this.setState({ destinations: arr });
    }

    handleUserInfo = (c, v, l) => {
        if (c != ''){
            this.setState({
                city: c,
            });
        }
        if (v != ''){
            this.setState({
                visitor: v,
            });
        }
        if (l != ''){
            this.setState({
                length: l,
            });
        }
    }

    renderItinerary = () => {
        if (this.state.generate){
            return (
                <div>

                <Itinerary
                schedule={this.state.schedule} />
                <br></br>
                {/* <Button type="button" className="btn btn-primary" onClick={()=>this.handleGenerate()}>Regenerate my travel itinerary!</Button> */}
                </div>
            );
        }
    }

    render () {
        return (
            <div>
            <Container>
                <div className="top-menu">
                    <h1>Trippy</h1>
                    <div className="trip-data">
                        <UserInfo 
                            city={this.state.city}
                            visitor={this.state.visitor}
                            length={this.state.length}
                        /> 
                        <Button type="button" className="btn btn-primary destinations-menu" 
                            disabled = {this.state.showMap}
                            onClick={() => this.setShowDestinations(!this.state.showDrawer)}>
                            Selected Destinations: ({this.state.destinations.length})
                        </Button>
                        <Button disabled={ !this.state.showMap }
                            type="button" className="btn btn-primary map-button" 
                            onClick={() => this.setShowMap(false)}>
                            Close Itinerary
                        </Button>
                        <Button disabled={this.state.showDrawer}
                            type="button" className="btn btn-primary" 
                            onClick={this.handleGenerate}>
                                Generate Itinerary
                        </Button>
                    </div>
                </div>           

            <Row className="page-content"> {/*image and description of the destination recommended*/}
                <Col md={8}>
                <DestInfo 
                    addDestination={this.handleAddDestination}
                    skipDestination={this.handleSkipDestination}
                    userId={this.state.userId}
                    handleUpdate={this.handleUpdate}/>
                </Col>

                <Col md={4}>
                <Dialog 
                post={this.postData}
                userId={this.state.userId}
                handleUpdate={this.handleUpdate}
                handleUserInfo = {this.handleUserInfo}/>
                </Col>
            </Row>
            <br></br>
            <Row className={this.state.showMap ? "map-container" : "map-container-hidden"}>
                <Col md={4}>
                    <Destinations
                            reorderDestinations={this.reorderDestinations}
                            post={this.postData}
                            removeDestination={this.handleRemove}
                            destinations={this.state.destinations}>
                    </Destinations>
                    {this.renderItinerary()} 
                </Col>
                <Col md={8}>
                    <div>
                    <div id='map'></div>
                    <div className="info-box">
                    <div id="info">
                    </div>
                    <div id="directions"></div>
                    </div>
                    </div>
                </Col>
            </Row>
            <div className={this.state.showDrawer ? "destination-list" : "destination-list-hidden"}>
                <h1>Selected Destinations</h1>
                <Destinations
                            reorderDestinations={this.reorderDestinations}
                            post={this.postData}
                            removeDestination={this.handleRemove}
                            destinations={this.state.destinations}>
                </Destinations>
            </div>
            </Container>
            </div>
        );
    }

    
}


function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export default App;

ReactDOM.render(<App />, document.getElementById('app'));