import React, { Component } from 'react';
import './App.css';
import './semantic/dist/semantic.css';
import Helpers from './helpers';

export default class TimersDashboard extends Component 
{
  state = {
    timers: [
      {
        title: "Learn React",
        project: "Web Domination",
        id: Math.floor((Math.random() * 50) + Math.random()),
        elapsed: 8986300,
        runningSince: Date.now(),
      },
      {
        title: "Learn Extreme Staring",
        project: "World Domination",
        id: Math.floor((Math.random() * 50) + Math.random()),
        elapsed: 1637492,
        runningSince: null
      }
    ]
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = (timer) => {
    this.updateTimer(timer);
  };

  handleDeleteClick = (timerID) => {
    this.deleteTimer(timerID);
  };

  createTimer = (timer) => {
    const _timer = Helpers.newTimer(timer);
    this.setState({timers: this.state.timers.concat(_timer)});
  }; 

  updateTimer = (timer) => {
    const updatedTimers = this.state.timers.map((_timer) => {
      if (timer.id === _timer.id)
      {
        return Object.assign({}, _timer, 
          {title: timer.title, project: timer.project});
      }
      else
      {
        return _timer;
      }
    });

    this.setState({timers: updatedTimers});
  };

  deleteTimer = (timerID) => {
    this.setState({
      timers: this.state.timers.filter((timer) => (
        timer.id !== timerID
      )),
    });
  };

  render() 
  {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList 
            timers = {this.state.timers}
            onFormSubmit = {this.handleEditFormSubmit}
            onDeleteClick = {this.handleDeleteClick}
          />
          <ToggleableTimerForm 
            onFormSubmit = {this.handleCreateFormSubmit} 
          />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends Component
{ 
  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
  };

  handleDeleteClick = (timerID) => {
    this.props.onDeleteClick(timerID);
  };
  
  render()
  {
    const editableTimerComponents = this.props.timers.map((timer) => (
      <EditableTimer 
        key = {timer.id}
        id = {timer.id}
        title = {timer.title}
        project = {timer.project}
        elapsed = {timer.elapsed}
        runningSince = {timer.runningSince}
        onFormSubmit = {this.handleFormSubmit}
        onDeleteClick = {this.handleDeleteClick}
      />
    ));
    
    return(
      <div id="timers">
        {editableTimerComponents}
      </div>
    );
  }
}

class ToggleableTimerForm extends Component
{
  state = {
    isOpen: false
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };
  
  render()
  {
    if (this.state.isOpen)
    {
      return(
        <TimerForm  
          onFormSubmit = {this.handleFormSubmit} 
          onFormClose = {this.handleFormClose} 
        />
      );
    }
    else
    {
      return(
        <div className="ui basic content center aligned segment">
          <button className="ui basic button icon" onClick={this.handleFormOpen}>
            <i className="plus icon" />
          </button>
        </div>
      );
    }
  }
}

class EditableTimer extends Component
{
  state = {
    editFormOpen: false
  };

  handleEditClick = () => {
    this.setState({editFormOpen: true});
  };

  handleFormSubmit = (timer) => {
    this.props.onFormSubmit(timer);
    this.setState({ editFormOpen: false });
  };

  handleFormClose = () => {
    this.setState({ editFormOpen: false });
  };

  handleDeleteClick = (timerID) => {
    this.props.onDeleteClick(timerID);
  };

  render()
  {
    if (this.state.editFormOpen)
    {
      return(
        <TimerForm 
          id = {this.props.id}
          title = {this.props.title}
          project = {this.props.project}
          onFormSubmit = {this.handleFormSubmit}
          onFormClose = {this.handleFormClose}
        />
      );
    }
    else
    {
      return(
        <Timer 
          id = {this.props.id}
          title = {this.props.title}
          project = {this.props.project}
          elapsed = {this.props.elapsed}
          runningSince = {this.props.elapsed} 
          onEditClick = {this.handleEditClick}
          onDeleteClick = {this.handleDeleteClick}
        />
      );
    }
  }
}

class TimerForm extends Component
{
  state = {
    titleValue: this.props.title || '',
    projectValue: this.props.project || ''
  };
  
  handleTitleChange = (event) => {
    this.setState({ titleValue: event.target.value });
  };

  handleProjectChange = (event) => {
    this.setState({ projectValue: event.target.value });
  };

  handleFormSubmit = () => {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.state.titleValue,
      project: this.state.projectValue
    });
  };

  render()
  {
    const submitText = this.props.id ? 'Update' : 'Create'

    return(
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input 
                type = "text" 
                value = {this.state.titleValue}
                onChange = {this.handleTitleChange}
              />
            </div>

            <div className="field">
              <label>Project</label>
              <input 
                type = "text" 
                value = {this.state.projectValue} 
                onChange = {this.handleProjectChange}
              />
            </div>

            <div className="ui two button attached buttons">
              <button className="ui basic blue button" onClick={this.handleFormSubmit}>
                {submitText}
              </button>

              <button className="ui basic red button" onClick={this.props.onFormClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Timer extends Component
{
  handleDeleteClick = () => {
    this.props.onDeleteClick(this.props.id);
  };
  
  render()
  {
    const elapsedString = Helpers.renderElapsedString(this.props.elapsed);
    
    return(
      <div className="ui centered card">
        <div className="content">
          <div className="header">
            {this.props.title}
          </div>

          <div className="meta">
            {this.props.project}
          </div>

          <div className="center aligned description">
            <h2>
              {elapsedString}
            </h2>
          </div>

          <div className="extra content">
            <span 
              className="right floated edit icon" 
              onClick={this.props.onEditClick}
            >
              <i className="edit icon" />
            </span>
            <span 
              className="right floated trash icon"
              onClick={this.handleDeleteClick}
            >
              <i className="trash icon" />
            </span>
          </div>
        </div>

        <div className="ui bottom attached blue basic button">
          Start
        </div>
      </div>
    );
  }
}