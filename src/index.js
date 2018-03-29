import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Tasklist extends React.Component {
	
	renderSons(element) {
		if (element.sons.length>0){
			var sons=[];
			for (var i=0; i<element.sons.length; i++){
 			sons.push(
 			<li level={element.sons[i].level}>
 				{element.sons[i].name}
 				"son of: "
 				{element.sons[i].parentTask}
 				{this.renderSons(element.sons[i])}
 			</li>
 			);
 		}
 		return sons;
	}
}
	//qua ok: anche se è un oggetto viene gestito da tasks[i].name
	render(){
		var structuredData=[];
		for (var i=0; i<this.props.tasks.length; i++){
 			structuredData.push(
 			<li level={this.props.tasks[i].level}>
 				{this.props.tasks[i].name}
 				"son of: "
 				{this.props.tasks[i].parentTask}
 				{this.renderSons(this.props.tasks[i])}
 			</li>
 			);
 		}
		return(
			structuredData
		);
	}
}


class TasklistSelect extends React.Component {	
addSons(element, elementArr){
		for (let i=0; i<element.sons.length; i++){
			elementArr.push(element.sons[i].name);
		}
		return elementArr;
	}

	render(){ //devi fare un oggetto jsx per poterlo restituire
		let elements=this.props.tasks;
		let rawData=[];
		for (let i=0; i<elements.length; i++){
			rawData.push(elements[i].name);
			if (elements[i].sons.length>0){
				rawData=this.addSons(elements[i], rawData);
			}
		}
		let structuredData=rawData.map(function (value){
			return(
					<option value={[value]}>{[value]}</option>
				);
		});
		/*
		let structuredData=this.props.tasks.map(function (value, index) {
			return(
				//<option value={index+1}>{[value.name]}</option>
				<test>
				<option value={[value.name]}>{[value.name]}</option>
				<option value={this.testSons(elements)}></option>
				</test>
			);
		});
		*/

		return( 
			<select id="select-parent">
			<option value={"none"}>none</option>	
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
   		level: getParentLevel(inputParent, this.state.myTasks),
   		sons: [],
   		path: getPath(inputParent, this.state.myTasks, this.state.myTasks.length),
  	};
  	//se è figlio di qualcuno aggiungerlo ai sons, altrimenti pushalo normalmente
  	if(inputParent==='none'){
			taskClone.push(newTask);
		}
		else {
			//trova posizione dell'array nella quale l'oggetto ha come nome inputParent	
			//cerca ricorsivamente in ogni posizione finchè non ha finito i sons del primo valore,
			//poi passa al successivo
			console.log(taskClone);
			let findIndex=recursiveSearch(taskClone, inputParent);
			//aggiungi l'oggetto insierito tra i sons di quella quella posizione
			taskClone[findIndex].sons.push(newTask);
		}
  	this.setState({myTasks: taskClone});
  }


 	render(){
 		let sortedTasks = this.state.myTasks;
 		sortedTasks.sort(function (a, b) {
  		return a.level - b.level;
		});
		return(
			<div className="app">
				<h1>{this.state.pageTitle}</h1>
				<h3><button onClick= {()=>
					this.handleClick()
				}>add task</button>
				<input id="inputData"></input>
				SubTask of:
		
				<TasklistSelect tasks={sortedTasks}/>
				
				</h3>
				<Tasklist tasks={sortedTasks}/>
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
	parentObj=stateObj.find(function (element){
		return element.name===parentName;
	});
	if(typeof parentObj !== "undefined") {
		return parentObj.level+1;
	} 
	else {
		return 1;
	}
	}

	function getPath(parentName, stateObj, myPosition){
		let parentObj;
		let resultPath=[];
		parentObj=stateObj.find(function (element){ //find parent object and get his path
			return element.name===parentName;
		});
		if(typeof parentObj !== "undefined") { //if it exists, push to path
			resultPath.push(parentObj.path);
			//the last part of the path is the position of this element in the "sons" array
			//find...
		} 
		else { //if element has no parent, the path is the position in the main state array
		resultPath.push(myPosition); 
		}
		return resultPath;
		}

		/* RecursiveSearch
		restituisce un array contenente la posizione nello state
		dell'elemento padre di quello passato con parent. 
		La posizione è indicata tramite gli indici degli elementi:
		ogni nuovo indice rappresenta un livello di profondità in
		più nella struttura gerarchica.
		*/

		function recursiveSearch(element, parent) {
			var found=false;
			let result;
			for (let i=0;i<element.length;i++){
				if (element[i].name===parent){
					found=true;
					result=i;
					break;
				}
				else {
					console.log("else");
					if (element[i].sons.length>0){
						console.log("chiamo ricorsivo");
						recursiveSearch(element[i].sons, parent);
					}
				}
			};
			if (found){
				return result;
			}
		}
			/*
			let result=element.findIndex(function (data){
				console.log(data.name);
				console.log(parent);
				return data.name===parent;  //condizione di terminazione
			});
			console.log(result);
			if (result !== -1) {
				found=true;
				return result;
			}
			else {
				recursiveSearch(data.sons, parent);
			}
			*/
	