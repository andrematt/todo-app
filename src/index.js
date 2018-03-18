import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Tasklist extends React.Component {	
	render(){
		var structuredData=[];
		for (var i=0; i<this.props.data.length; i++){
 			structuredData.push(
 			<li>
 				{this.props.data[i]}
 			</li>
 			);
 		}
		return(
			structuredData
		);
	}
}


class TasklistSelect extends React.Component {	
	render(){ //devi fare un oggetto jsx per poterlo restituire

		let structuredData=this.props.value.map(function (value, index) {
			return(
				<option value={index+1}>{value}</option>
			);
		});

		return( 
			<select>
			<option value={0}>none</option>	
			{structuredData}
			</select>
		);
	}
}


class Container extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
   		pageTitle:"Task Manager",
   		myTasks: [], 
    }
  }

  handleClick(){
  	let inputData = document.getElementById('inputData').value
  	let taskClone = this.state.myTasks.slice();
		taskClone.push(inputData);
  	this.setState({myTasks: taskClone });
  }

 	render(){
		return(
			<div className="app">
				<h1>{this.state.pageTitle}</h1>
				<h3><button onClick= {()=>
					this.handleClick()
				}>add task</button>
				<input id="inputData"></input>
				SubTask of:
		
				<TasklistSelect value={this.state.myTasks}/>
				
				</h3>
				<Tasklist data={this.state.myTasks}/>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
  <Container />,
  document.getElementById('root')
);