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
/* rifare tutto: getParentLevel e getPath non funzionano in modo ricorsivo. 
usare solo recursive search (farla chiamare da getParentLevel e getPath) 
e fare restituire l'intero elemento padre: così abbiamo path e level e si 
può pushare nella posizione giusta tramite switch */
  	let newTask= {
  		name: inputData,
   		parentTask: inputParent,
   		level: getParentLevel(inputParent, this.state.myTasks),
   		sons: [],
   		path: getPath(inputParent, this.state.myTasks),
  	};
  	//se è figlio di qualcuno aggiungerlo ai sons, altrimenti pushalo normalmente
  	if(inputParent==='none'){
			taskClone.push(newTask);
		}
		else {
			//trova posizione dell'array nella quale l'oggetto ha come nome inputParent	
			//cerca ricorsivamente in ogni posizione finchè non ha finito i sons del primo valore,
			//poi passa al successivo
			//let findIndex=recursiveSearch(taskClone, inputParent);
			console.log(newTask.level);
			let path=newTask.path;
			console.log(path);
			if (newTask.level===2){
				console.log("level 2");
				taskClone[path[0]].sons.push(newTask);
			}
			if (newTask.level===3){
				console.log("level 3");
				console.log(taskClone[path[0]].sons[path[1]]);
				taskClone[path[0]].sons[path[1]].push(newTask);
			}


			//let editedTaskClone=recursiveSearch(taskClone,inputParent, newTask);
			//aggiungi l'oggetto insierito tra i sons di quella quella posizione
			//this.setState({myTasks: editedTaskClone});

			//let findIndex=newTask.path;
			//taskClone[findIndex].sons.push(newTask);
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
	parentObj=recursiveSearch(stateObj, parentName);
	//perchè mi da undefined anche se recursiveSearch lo resituisce?
	console.log("get parent level");
	console.log("parent: "+parentObj);
	if(typeof parentObj !== "undefined") {
		return parentObj.level+1;
	} 
	else {
		return 1;
	}
	}

	function getPath(parentName, stateObj){
		let parentObj;
		let resultPath=[];
		let myPosition=stateObj.length;
		parentObj=recursiveSearch(stateObj, parentName); //find parent object and get his path
			console.log("get path");
	console.log("parent: "+parentObj);
		//perchè mi da undefined anche se recursiveSearch lo resituisce?
		if(typeof parentObj !== "undefined") { //if it exists, push to path
			for (var i=0; i<parentObj.path.length; i++){
				resultPath.push(parentObj.path[i]);
			}
			//the last part of the path is the position of this element in the "sons" array
			resultPath.push(parentObj.sons.length); 
		} 
		else { //if element has no parent, the path is the position in the main state array
			resultPath.push(myPosition); 
		}
		return resultPath;
		}

		/* RecursiveSearch
		restituisce un elemento cercando ricorsivamente nei sons dell'obj tasks
		*/
		function recursiveSearch(tasks, toFind) {
			var result=[];
			var found=false;
			for (let i=0;i<tasks.length;i++){
				if (tasks[i].name===toFind){
					console.log("trovato!!");
					found=true;
					result=tasks[i]
					console.log(result);
					break;
				}
				else {
					console.log("else");
					if (tasks[i].sons.length>0){
						console.log("chiamo ricorsivo");
						recursiveSearch(tasks[i].sons, toFind);
					}
				}
			};
			if (found){
				console.log("faccio return di " +result);
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
	