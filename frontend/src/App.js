// import Component from the react module
import React, { Component } from "react";
import Modal from "./Components/Modal";
import axios from 'axios';  

// create a class that extends the component
class App extends Component {

  // add a constructor to take props
  constructor(props) {
    super(props);
    
    // add the props here
    this.state = {
    
      // the viewCompleted prop represents the status
      // of the task. Set it to false by default
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false
      },
      
      // this list stores all the completed tasks
      taskList: []
    };
  }

  // Add componentDidMount()
  componentDidMount() {
    this.refreshList();
  }

 
  refreshList = () => {
    axios   //Axios to send and receive HTTP requests
      .get("http://localhost:8000/api/tasks/")
      .then(res => this.setState({ taskList: res.data }))
      .catch(err => console.log(err));
  };

  // this arrow function takes status as a parameter
  // and changes the status of viewCompleted to true
  // if the status is true, else changes it to false
  displayCompleted = status => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  // this array function renders two spans that help control
  // the set of items to be displayed(ie, completed or incomplete)
  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
        >
          completed
            </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" : "active"}
        >
          Incompleted
            </span>
      </div>
    );
  };
  // Main variable to render items on the screen
  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.description}
        >
          {item.title}
        </span>
        <span>
          <button
            onClick={() => this.editItem(item)}
            className="btn btn-secondary mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => this.handleDelete(item)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  toggle = () => {
    //add this after modal creation
    this.setState({ modal: !this.state.modal });
  };


  // Submit an item
  handleSubmit = (item) => {
    this.toggle();
     alert("save" + JSON.stringify(item));
    if (item.id) {
      // if old post to edit and submit
      axios
        .put(`http://localhost:8000/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    // if new post to submit
    axios
      .post("http://localhost:8000/api/tasks/", item)
      .then((res) => this.refreshList());
  };

  // Delete item
  handleDelete = (item) => {
      alert("delete" + JSON.stringify(item));
    axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };
 
  // Create item
  createItem = () => {
    const item = { title: "", description: "", completed: false };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //Edit item
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  // Start by visual effects to viewer
  // ...existing code...

render() {
  return (
    <main className="content" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow mb-4">
        <div className="container">
          <span className="navbar-brand mx-auto h1 mb-0">Task Manager</span>
        </div>
      </nav>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0 text-primary">Your Tasks</h4>
                  <button onClick={this.createItem} className="btn btn-success shadow-sm">
                    <i className="bi bi-plus-lg"></i> Add Task
                  </button>
                </div>
                {this.renderTabList()}
                <ul className="list-group list-group-flush modern-task-list">
                  {this.renderItems()}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </div>
    </main>
  );
}
}
export default App;