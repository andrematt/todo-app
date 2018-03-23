import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Tasklist extends React.Component {	
	//qua ok: anche se è un oggetto viene gestito da tasks[i].name
	render(){
		var structuredData=[];
		for (var i=0; i<this.props.tasks.length; i++){
 			structuredData.push(
 			<li>
 				{this.props.tasks[i].name}
 				"son of: "
 				{this.props.tasks[i].parentTask}
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
		console.log(this.props.tasks);
		let structuredData=this.props.tasks.map(function (value, index) {
			return(
				<option value={index+1}>{[value.name]}</option>
			);
		});

		return( 
			<select id="select-parent">
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
  	let inputData = document.getElementById('inputData').value;
  	let inputParent = document.getElementById('select-parent').value;
  	let taskClone = this.state.myTasks.slice();
  	let newTask={
  		name: inputData,
   		parentTask: inputParent,
   		level: getParentLevel(inputParent, this),
  	};
		taskClone.push(newTask);
  	this.setState({myTasks: taskClone});
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
		
				<TasklistSelect tasks={this.state.myTasks}/>
				
				</h3>
				<Tasklist tasks={this.state.myTasks}/>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(
  <Container />,
  document.getElementById('root')
);

 function getParentLevel(parentName, stateObj){
	let parentObj;
	//incapsulalo in una funct sennò si lamenta che non fa return
	stateObj.state.myTasks.find(function (element){
		parentObj = element.name==='parentName';
	});
	if(typeof parentObj !== "undefined") {
		return parentObj.level;
	} 
	else {
		return 0;
	}
	}