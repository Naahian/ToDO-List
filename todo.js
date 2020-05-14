let clck = 0; function toggleClock() {

   if (!clck) { document.querySelector(".clock").className = "clockToggle"; clck = 1; }
   else { document.querySelector(".clockToggle").className = "clock"; clck = 0; }

}

var list = document.querySelector(".list")
var hour = document.querySelector(".hour");
var min = document.querySelector(".min");
var ampm = document.querySelector(".ampm");
var inputTask = document.querySelector(".task");


function setStorage() { localStorage.setItem("tasks", JSON.stringify(taskList)); }


let taskList = [];

if (localStorage.tasks != undefined) {
   if (localStorage.tasks != "") {
      taskList = JSON.parse(localStorage.getItem("tasks"));
      printTask();
   }
}


document.querySelector(".addTask").onclick = function () {
   let task = {
      id: new Date().getTime(),
      text: inputTask.value,
      time: (hour.value / 12 <= 1 ? hour.value : 12) + ':' + (min.value < 60 ? min.value : 59),
      tformat:ampm.value,
      stared: 0,
      done: 0,
   }
   taskList.push(task);
   setStorage();
   list.innerHTML = "";
   printTask();
}




function printTask() {
   
   for (i in taskList) {
      let tr = document.createElement('tr');

      var isStared = taskList[i].stared? "<img src='star.svg' width='15px'>":"<img src='rate.svg' width='15px'>";
      var isDone = taskList[i].done? taskList[i].text.strike():taskList[i].text;

      tr.innerHTML = `
               <td class="star" id="${taskList[i].id}">${isStared}</td>
               <td class="task">${isDone}</td>
               <td class="time text-muted">${taskList[i].time}${taskList[i].tformat}</td>
               <td class="done" id="${taskList[i].id}"><img src="tick.svg" width="15px"></td>
               <td class="del" id="${taskList[i].id}"><img src="can.svg" width="15px"></td>`;
      list.appendChild(tr);

   }

   //------------------- delete task -----------------------
   document.querySelectorAll('.del').forEach(function (delTask) {
      
      delTask.onclick = ()=>{
         let temp= [];
         for(obj of taskList){
            if(obj.id!=delTask.id) temp.push(obj);
         }
         taskList = temp;
         setStorage();
         list.innerHTML = "";
         printTask();
      }
   })

   document.querySelectorAll(".done").forEach(function(dne){
      dne.onclick = ()=>{
         for(obj of taskList){
            if(obj.id==dne.id) obj.text = obj.text.strike();
         }
         setStorage();
         list.innerHTML = "";
         printTask();
      }
   })

   document.querySelectorAll(".star").forEach(function(str){
      str.onclick = ()=>{
         for(obj of taskList){
            if(obj.id==str.id) obj.stared = 1;
         }
         setStorage();
         list.innerHTML = "";
         printTask();
      }
   })


}


function checkTime(){
   let currentTime = [new Date().getHours()/12<=1? new Date().getHours():new Date().getHours()%12, new Date().getMinutes(),new Date().getHours()/12<=1? "AM":"PM"];
   for(t of taskList){
      let tempT = t.time.split(':');
      if(tempT[0]==currentTime[0]  &&  tempT[1]==currentTime[1]  &&  t.tformat == currentTime[2]){
         Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
              var notification = new Notification(`Due Task: ${t.text}`);
            }
          });
      }
   }

}
setInterval(checkTime,30000);


